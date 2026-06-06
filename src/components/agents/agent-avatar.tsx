import { cn } from "@/lib/utils";

interface AgentAvatarProps {
  initials: string;
  colorClass: string;
  size?: "sm" | "md" | "lg";
  verified?: boolean;
}

const sizeMap = {
  sm: "size-14 text-base",
  md: "size-20 text-xl",
  lg: "size-24 text-2xl",
};

export function AgentAvatar({
  initials,
  colorClass,
  size = "md",
  verified,
}: AgentAvatarProps) {
  return (
    <div className="relative shrink-0">
      <div
        className={cn(
          "flex items-center justify-center rounded-xl bg-gradient-to-br font-heading font-bold text-white shadow-inner",
          colorClass,
          sizeMap[size],
        )}
      >
        {initials}
      </div>
      {verified ? (
        <span
          className="absolute -right-1 -bottom-1 flex size-5 items-center justify-center rounded-full bg-rw-green text-[10px] font-bold text-white ring-2 ring-white"
          title="Phone verified"
        >
          ✓
        </span>
      ) : null}
    </div>
  );
}
