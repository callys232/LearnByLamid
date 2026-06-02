import Image from "next/image";
import { cn } from "@/lib/utils";

interface AvatarProps {
  src?: string;
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: { wrapper: "h-7 w-7 text-xs", px: 28 },
  md: { wrapper: "h-9 w-9 text-sm", px: 36 },
  lg: { wrapper: "h-12 w-12 text-base", px: 48 },
};

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export function Avatar({ src, name, size = "md", className }: AvatarProps) {
  const { wrapper, px } = sizes[size];

  return (
    <div
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-full overflow-hidden",
        "border border-primary/20 bg-primary-muted font-semibold text-primary select-none",
        "ring-0 transition-all duration-150 hover:ring-2 hover:ring-primary/30",
        wrapper,
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={name}
          width={px}
          height={px}
          className="h-full w-full object-cover"
        />
      ) : (
        getInitials(name)
      )}
    </div>
  );
}
