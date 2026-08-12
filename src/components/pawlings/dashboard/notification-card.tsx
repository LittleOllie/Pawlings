import type { PawlingNotification } from "@/types/pawling";
import { cn } from "@/lib/utils";

interface NotificationCardProps {
  notification: PawlingNotification;
  className?: string;
}

export function NotificationCard({ notification, className }: NotificationCardProps) {
  return (
    <div
      className={cn(
        "dashboard-glass rounded-[var(--radius-control)] p-4 border-l-4",
        notification.read ? "border-white/20 opacity-80" : "border-pawlings-lime",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display font-bold text-pawlings-white text-sm">{notification.title}</p>
          <p className="text-sm text-pawlings-muted mt-1 leading-relaxed">{notification.body}</p>
        </div>
        <time className="text-xs text-pawlings-muted shrink-0">{notification.timestamp}</time>
      </div>
    </div>
  );
}
