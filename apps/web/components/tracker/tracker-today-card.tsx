import { CalendarFold, Trophy } from "lucide-react"

import { TrackerDateLabel } from "@/components/tracker/tracker-date-label"
import type { TrackerStreakItem } from "@/server/services/tracker.service"

type TrackerTodayCardProps = {
  dateLabel: string
  items: TrackerStreakItem[]
}

export function TrackerTodayCard({ dateLabel, items }: TrackerTodayCardProps) {
  return (
    <article className="h-full rounded-xs border border-alt-border bg-background px-4 pt-4 pb-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-foreground">
          <CalendarFold className="h-4 w-4" />
          <h3 className="uppercase tracking-wide">Today</h3>
        </div>
        <TrackerDateLabel dateLabel={dateLabel} />
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="mt-4 uppercase text-sm tracking-wide text-alt-foreground">
          Current Streaks
        </h3>
        <ul>
          {items.map((item) => (
            <li
              key={item.habitId}
              className="flex items-center justify-between border-t border-alt-border py-2"
            >
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                <span>{item.habitName}</span>
              </div>
              <span>{item.currentStreak} days</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}
