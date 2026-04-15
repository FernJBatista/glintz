import { CalendarFold, Image  } from "lucide-react"

export default function TrackerPage() {
  return (
    <section className="flex min-h-full flex-col gap-6">
      <header className="space-y-1">
        <h1>Tracker</h1>
        <p className="text-sm text-muted-foreground">
          This is the default page. Start adding your tracker widgets here.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Today Summary section*/}
        <article className="border border-alt-border bg-background p-4">
          {/* Section header */}
          <div className="flex items-center gap-2 text-foreground">
            <CalendarFold className="h-4 w-4" />
            <h3 className="uppercase tracking-wide">Today</h3>
          </div>
          {/* Top three habit streaks / stats */}
          <ul className="mt-4">
            <li className="flex items-center justify-between border-t border-alt-border py-2">
              <div className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                <span>Habit 1</span>
              </div>
              <span>XX streak</span>
            </li>
          </ul>
        </article>
        {/* Quick Stats section */}
        <article className="border border-alt-border bg-background p-4">
          <h3>Quick Stats</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Placeholder for upcoming tasks or habits.
          </p>
        </article>
      </div>
    </section>
  )
}
