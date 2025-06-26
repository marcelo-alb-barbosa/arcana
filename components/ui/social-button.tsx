import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SocialButtonProps {
  icon: LucideIcon;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
  label: string;
  hint?: string;
  disabledHint?: string;
}

export function SocialButton({
  icon: Icon,
  onClick,
  className,
  disabled,
  label,
  hint,
  disabledHint,
}: SocialButtonProps) {
  const button = (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex items-center justify-center gap-2 w-full bg-aged-bone/10 border-bone-dust-gray text-aged-bone hover:bg-aged-bone/20 hover:text-aged-bone font-serifRegular h-12",
        className
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Button>
  );

  // If no hints are provided or if disabled and no disabledHint, return just the button
  if ((!hint && !disabledHint) || (disabled && !disabledHint)) {
    return button;
  }

  // Determine which hint to show
  const tooltipContent = disabled && disabledHint ? disabledHint : hint;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent className="bg-deep-black border-blood-red/50 text-aged-bone">
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
