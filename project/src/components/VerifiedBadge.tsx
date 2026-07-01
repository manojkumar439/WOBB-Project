import { memo } from "react";

interface VerifiedBadgeProps {
  verified: boolean;
  className?: string;
}

export const VerifiedBadge = memo(function VerifiedBadge({
  verified,
  className = "",
}: VerifiedBadgeProps) {
  if (!verified) return null;

  return (
    <svg
      className={`w-4 h-4 text-blue-500 ${className}`}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
});
