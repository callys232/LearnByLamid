import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { mockUsers, setCurrentUserByEmail } from "@/mock/users";
import { UserRole } from "@/types/types";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },

  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize(credentials) {
        if (!credentials?.email) return null;
        // Swap with real DB lookup + bcrypt.compare when backend is ready
        const user = mockUsers.find(
          (u) => u.email === (credentials.email as string),
        );
        if (!user) return null;

        if (user.password && user.password !== (credentials.password as string)) {
          return null;
        }

        if (user.verificationStatus === "rejected") {
          throw new Error("Your account request has been rejected.");
        }

        setCurrentUserByEmail(user.email);

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          verificationStatus: user.verificationStatus,
        };
      },
    }),
  ],

  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role: UserRole }).role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },
});
