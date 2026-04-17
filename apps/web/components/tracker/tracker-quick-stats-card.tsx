import { ChartNoAxesColumn } from "lucide-react"

import type { TrackerCompletionItem } from "@/server/services/tracker.service"

type TrackerQuickStatsCardProps = {
  daysTracked: number
  items: TrackerCompletionItem[]
}

export function TrackerQuickStatsCard({ daysTracked, items }: TrackerQuickStatsCardProps) {
  return (
    <article className="h-full rounded-xs border border-alt-border bg-background px-4 pt-4 pb-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-foreground">
          <ChartNoAxesColumn className="h-4 w-4" />
          <h3 className="uppercase tracking-wide">Quick Stats</h3>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="mt-4 flex items-center justify-between text-alt-foreground">
          <h3 className="uppercase text-sm tracking-wide">Days Tracked</h3>
          <span className="text-sm">{daysTracked} Days</span>
        </div>
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <li
              key={item.habitId}
              className="flex items-center justify-between border-t border-alt-border py-1"
            >
              <span>{item.habitName} completion rate</span>
              <span>{item.completionRate}%</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}
