import { notFound } from "next/navigation";
import Link from "next/link";
import { GraduationCap, ArrowLeft } from "lucide-react";
import { PaystackCheckout } from "@/components/checkout/paystack-checkout";
import { OrderSummary } from "@/components/checkout/order-summary";
import { mockCourses } from "@/mock/courses";
import { currentUser } from "@/mock/users";

interface PageProps { params: Promise<{ courseId: string }> }

export default async function CheckoutPage({ params }: PageProps) {
  const { courseId } = await params;
  const course = mockCourses.find((c) => c.id === courseId);

  if (!course || course.accessType === "free") notFound();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-primary-sm">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-bold text-text-primary">
              LAMID <span className="text-primary">Learn</span>
            </span>
          </div>
          <Link href={`/courses/${courseId}`} className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to course
          </Link>
        </div>
      </header>

      {/* Checkout grid */}
      <main className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="mb-8 text-2xl font-bold text-text-primary">Complete your purchase</h1>
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Left: Paystack */}
          <div className="rounded-xl border border-border bg-surface p-6">
            <h2 className="mb-1 text-sm font-semibold text-text-primary">Secure Payment</h2>
            <p className="mb-5 text-xs text-text-muted">
              Clicking the button below opens a secure Paystack popup. Card details are handled exclusively by Paystack.
            </p>
            <PaystackCheckout
              courseId={course.id}
              courseTitle={course.title}
              amount={course.price!}
              userEmail={currentUser.email}
              userId={currentUser.id}
            />
          </div>

          {/* Right: order summary */}
          <OrderSummary course={course} />
        </div>
      </main>
    </div>
  );
}
