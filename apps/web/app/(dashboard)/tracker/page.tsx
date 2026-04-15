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
        <article className="border border-alt-border bg-alt-background p-4">
          <h3>Today</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Placeholder for today&apos;s progress component.
          </p>
        </article>
        <article className="border border-alt-border bg-alt-background p-4">
          <h3>Upcoming</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Placeholder for upcoming tasks or habits.
          </p>
        </article>
      </div>
    </section>
  )
}
