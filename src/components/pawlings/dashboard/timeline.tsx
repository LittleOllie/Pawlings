import type { TimelineEvent } from "@/types/pawling";
import { cn } from "@/lib/utils";

interface TimelineProps {
  events: TimelineEvent[];
  className?: string;
}

export function Timeline({ events, className }: TimelineProps) {
  return (
    <ol className={cn("relative space-y-0", className)}>
      {events.map((event, index) => (
        <li key={event.id} className="dashboard-timeline-item relative pl-8 pb-8 last:pb-0">
          {index < events.length - 1 && (
            <span className="dashboard-timeline-line absolute left-[11px] top-6 bottom-0 w-0.5 bg-gradient-to-b from-pawlings-lime/50 to-transparent" aria-hidden />
          )}
          <span
            className={cn(
              "absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 text-[10px] font-bold",
              event.status === "complete" && "border-pawlings-lime bg-pawlings-lime text-pawlings-navy-900",
              event.status === "current" && "border-pawlings-yellow bg-pawlings-yellow/20 text-pawlings-yellow",
              event.status === "upcoming" && "border-white/20 bg-white/5 text-pawlings-muted"
            )}
            aria-hidden
          >
            {event.status === "complete" ? "✓" : index + 1}
          </span>
          <div>
            <p className="font-display font-bold text-pawlings-white">{event.title}</p>
            <p className="text-sm text-pawlings-muted mt-1">{event.description}</p>
            <p className="text-xs text-pawlings-muted/80 mt-2">{event.date}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
