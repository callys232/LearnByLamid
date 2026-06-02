import { Sidebar } from "@/components/layout/sidebar";
import { GuestBanner } from "@/components/layout/guest-banner";
import { BgPattern } from "@/components/ui/bg-pattern";
import { ToastProvider } from "@/components/ui/toast";
import { AiChatWidget } from "@/components/ai";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <BgPattern variant="dots" glow>
        <div className="flex h-screen overflow-hidden bg-background">
          <Sidebar />
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* GuestBanner renders only when no authenticated session exists */}
            <GuestBanner />
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </div>
        </div>

        {/* Global floating AI chat — available on every dashboard page */}
        <AiChatWidget />
      </BgPattern>
    </ToastProvider>
  );
}
