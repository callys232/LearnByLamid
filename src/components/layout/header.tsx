import { HeaderActions } from "./header-actions";
import { MobileMenuButton } from "./mobile-drawer";
import type { User } from "@/types/types";

interface HeaderProps {
  title: string;
  subtitle?: string;
  user: Pick<User, "name" | "streak"> & { avatar?: User["avatar"] };
}

export function Header({ title, subtitle, user }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 sm:px-6 backdrop-blur-md">
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile hamburger — only visible below lg */}
        <MobileMenuButton />
        <div className="animate-fade-in min-w-0">
          <h1 className="text-sm font-semibold text-text-primary leading-none">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-0.5 text-xs text-text-secondary">{subtitle}</p>
          )}
        </div>
      </div>
      <HeaderActions user={user} />
    </header>
  );
}
