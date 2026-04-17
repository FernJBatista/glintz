import { TrackerFloatingAddHabitButton } from "@/components/tracker/tracker-floating-add-habit-button"
import { TrackerHeader } from "@/components/tracker/tracker-header"
import { TrackerQuickStatsCard } from "@/components/tracker/tracker-quick-stats-card"
import { TrackerTodayCard } from "@/components/tracker/tracker-today-card"
import { getTrackerSnapshot } from "@/server/services/tracker.service"

export default function TrackerPage() {
  const trackerSnapshot = getTrackerSnapshot()

  return (
    <section className="relative flex min-h-full flex-col gap-6 pb-20">
      <TrackerHeader />

      <div className="grid items-stretch gap-2 md:grid-cols-2">
        <TrackerTodayCard
          dateLabel={trackerSnapshot.dateLabel}
          items={trackerSnapshot.topStreakItems}
        />
        <TrackerQuickStatsCard
          daysTracked={trackerSnapshot.daysTracked}
          items={trackerSnapshot.topCompletionItems}
        />
      </div>

      <TrackerFloatingAddHabitButton />
    </section>
  )
}
