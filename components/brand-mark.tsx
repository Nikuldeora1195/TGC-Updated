import Image from "next/image"
import { cn } from "@/lib/utils"

interface BrandMarkProps {
  iconClassName?: string
  textClassName?: string
  className?: string
  showText?: boolean
}

export function BrandMark({
  iconClassName,
  textClassName,
  className,
  showText = true,
}: BrandMarkProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Image
        src="/apple-icon.png"
        alt="TechGenz logo"
        width={40}
        height={40}
        className={cn(
          "h-10 w-10 rounded-xl object-cover ring-1 ring-white/10",
          iconClassName
        )}
      />
      {showText && (
        <Image
          src="/greentgc.png"
          alt="TechGenz wordmark"
          width={290}
          height={72}
          className={cn(
            "h-11 w-auto object-contain sm:h-12",
            textClassName
          )}
        />
      )}
    </div>
  )
}
