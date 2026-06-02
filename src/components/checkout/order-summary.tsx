import { Clock, BookOpen, Award, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Course } from "@/types/types";
import { formatMinutes } from "@/lib/utils";

interface OrderSummaryProps {
  course: Course;
}

export function OrderSummary({ course }: OrderSummaryProps) {
  const tax = +(course.price! * 0.0).toFixed(2); // 0% for digital goods in many regions
  const total = course.price! + tax;

  return (
    <div className="flex flex-col gap-4">
      {/* Course card */}
      <Card className="overflow-hidden">
        <div className="h-24 bg-gradient-to-br from-surface-active to-background-secondary relative flex items-center justify-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-muted border border-primary/20">
            <span className="text-lg font-bold text-primary">
              {course.title[0]}
            </span>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold text-text-primary mb-2">
            {course.title}
          </h3>
          <div className="flex flex-wrap gap-2 text-xs text-text-muted">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatMinutes(course.estimatedHours * 60)}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              {course.moduleIds.length} modules
            </span>
            <span className="flex items-center gap-1">
              <Award className="h-3 w-3" />
              Certificate included
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Price breakdown */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <p className="text-sm font-semibold text-text-primary">
            Order Summary
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-text-secondary">
              <span>{course.title}</span>
              <span>${course.price}</span>
            </div>
            {tax > 0 && (
              <div className="flex justify-between text-text-secondary">
                <span>Tax</span>
                <span>${tax}</span>
              </div>
            )}
            <div className="border-t border-border pt-2 flex justify-between font-semibold text-text-primary">
              <span>Total</span>
              <span className="text-primary">${total}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trust badges */}
      <div className="flex flex-col gap-2">
        {[
          { icon: ShieldCheck, text: "Secure payment — 256-bit SSL" },
          { icon: Award, text: "30-day money-back guarantee" },
          { icon: BookOpen, text: "Lifetime access after purchase" },
        ].map(({ icon: Icon, text }) => (
          <div
            key={text}
            className="flex items-center gap-2 text-xs text-text-muted"
          >
            <Icon className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            {text}
          </div>
        ))}
      </div>
    </div>
  );
}
