"use client"

import * as React from "react"
import { Plus, X } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@workspace/ui/components/button"
import type { ApiResponse } from "@/lib/api-response"
import type { Habit } from "@/types/habit"

type FormState = {
  name: string
  icon: string
}

const DEFAULT_FORM_STATE: FormState = {
  name: "",
  icon: "",
}

export function TrackerFloatingAddHabitButton() {
  const router = useRouter()
  const [isOpen, setIsOpen] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [formState, setFormState] = React.useState<FormState>(DEFAULT_FORM_STATE)

  function closeDialog() {
    setIsOpen(false)
    setError(null)
    setFormState(DEFAULT_FORM_STATE)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const name = formState.name.trim()
    const icon = formState.icon.trim()

    if (!name) {
      setError("Name is required.")
      return
    }

    setIsSaving(true)

    try {
      const response = await fetch("/api/habits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          icon: icon || undefined,
        }),
      })

      const json = (await response.json()) as ApiResponse<Habit>

      if (!response.ok || !json.success) {
        setError(json.success ? "Failed to create habit." : json.error)
        return
      }

      closeDialog()
      router.refresh()
    } catch {
      setError("Unable to create habit right now.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      {isOpen ? (
        <div className="fixed inset-0 z-40 bg-background/60">
          <div className="absolute right-6 bottom-20 w-[min(100%-3rem,20rem)] border border-alt-border bg-background p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-sm uppercase tracking-wide">Add Habit</h2>
              <button
                type="button"
                onClick={closeDialog}
                className="inline-flex size-8 items-center justify-center border border-alt-border transition-colors hover:bg-accent"
                aria-label="Close add habit dialog"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-xs uppercase tracking-wide text-alt-foreground">Name</span>
                <input
                  value={formState.name}
                  onChange={(event) =>
                    setFormState((current) => ({ ...current, name: event.target.value }))
                  }
                  className="border border-alt-border bg-background px-3 py-2 outline-none transition-colors focus:border-foreground"
                />
              </label>

              <label className="flex flex-col gap-1 text-sm">
                <span className="text-xs uppercase tracking-wide text-alt-foreground">
                  Icon (optional)
                </span>
                <input
                  value={formState.icon}
                  onChange={(event) =>
                    setFormState((current) => ({ ...current, icon: event.target.value }))
                  }
                  className="border border-alt-border bg-background px-3 py-2 outline-none transition-colors focus:border-foreground"
                  placeholder="book-open"
                />
              </label>

              {error ? <p className="text-sm text-destructive">{error}</p> : null}

              <div className="flex items-center justify-end gap-2 pt-1">
                <Button type="button" variant="outline" onClick={closeDialog} disabled={isSaving}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Creating..." : "Create Habit"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      <div className="fixed inset-0 pointer-events-none z-50">
        <div className="absolute right-6 bottom-6 pointer-events-auto">
          <Button type="button" size="lg" onClick={() => setIsOpen(true)} className="shadow-lg">
            <Plus className="size-4" />
            Add Habit
          </Button>
        </div>
      </div>
    </>
  )
}
