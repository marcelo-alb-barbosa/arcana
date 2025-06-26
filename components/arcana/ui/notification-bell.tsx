"use client"

import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NotificationBellProps {
  notificationCount?: number
  onClick?: () => void
}

export function NotificationBell({ notificationCount, onClick }: NotificationBellProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative text-aged-bone hover:bg-aged-bone/10 hover:text-aged-bone p-2" // Added padding for larger icon hit area
      onClick={onClick}
      aria-label="Notificações"
    >
      <Bell className="h-8 w-8 md:h-9 md:w-9" strokeWidth={1.75} /> {/* Increased size and strokeWidth */}
      {notificationCount && notificationCount > 0 && (
        <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-blood-red text-xs font-bold text-white">
          {" "}
          {/* Adjusted position for larger icon */}
          {notificationCount}
        </span>
      )}
    </Button>
  )
}
