"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"
import {
  BookOpen,
  ChartColumn,
  LayoutPanelTop,
  Palette,
  Headset,
  House,
  PanelLeftClose,
  PanelLeftOpen,
  SquarePen,
  Target,
  Type,
} from "lucide-react"
import { useTheme } from "next-themes"

import { cn } from "@workspace/ui/lib/utils"
import { APP_THEMES, type FontOption, useThemeFont } from "@/components/theme-provider"

type SidebarItem = {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const sidebarItems: SidebarItem[] = [
  { href: "/home", label: "Home", icon: House },
  { href: "/tracker", label: "Tracker", icon: Target },
  { href: "/statistics", label: "Statistics", icon: ChartColumn },
  { href: "/notebook", label: "Notebook", icon: SquarePen },
  { href: "/support", label: "Support", icon: Headset },
  { href: "/wiki", label: "Wiki", icon: BookOpen },
]

function getCurrentPageLabel(pathname: string) {
  const currentItem = sidebarItems.find((item) => pathname === item.href)
  return currentItem?.label ?? "Tracker"
}

const fontOptions: { key: FontOption; label: string }[] = [
  { key: "mono", label: "Mono" },
  { key: "sans", label: "Sans" },
  { key: "serif", label: "Serif" },
]

type FooterPanel = "theme" | "font" | "layout"

export function AppSidebar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { selectedFont, setFontForCurrentTheme, currentTheme } = useThemeFont()
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const [activeFooterPanel, setActiveFooterPanel] = React.useState<FooterPanel | null>(null)
  const normalizedTheme = APP_THEMES.includes(theme as (typeof APP_THEMES)[number])
    ? (theme as (typeof APP_THEMES)[number])
    : currentTheme

  function handleFooterPanelClick(panel: FooterPanel) {
    setActiveFooterPanel((prev) => (prev === panel ? null : panel))
  }

  function renderFooterPanel() {
    if (activeFooterPanel === "theme") {
      return (
        <div className="flex flex-col gap-1">
          {APP_THEMES.map((themeOption) => (
            <button
              key={themeOption}
              type="button"
              onClick={() => setTheme(themeOption)}
              className={cn(
                "w-full border border-alt-border px-2 py-1 text-left text-[11px] uppercase tracking-wide transition-colors hover:bg-accent",
                normalizedTheme === themeOption && "bg-accent text-primary"
              )}
            >
              {themeOption}
            </button>
          ))}
        </div>
      )
    }

    if (activeFooterPanel === "font") {
      return (
        <div className="flex flex-col gap-1">
          {fontOptions.map((fontOption) => (
            <button
              key={fontOption.key}
              type="button"
              onClick={() => setFontForCurrentTheme(fontOption.key)}
              className={cn(
                "w-full border border-alt-border px-2 py-1 text-left text-[11px] uppercase tracking-wide transition-colors hover:bg-accent",
                selectedFont === fontOption.key && "bg-accent text-primary"
              )}
            >
              {fontOption.label}
            </button>
          ))}
        </div>
      )
    }

    return (
      <div className="border border-alt-border px-2 py-2 text-[11px] text-muted-foreground">
        Work in progress -- {getCurrentPageLabel(pathname)}
      </div>
    )
  }

  return (
    <aside
      className={cn(
        "flex h-screen shrink-0 flex-col justify-between border-r border-alt-border bg-alt-background transition-[width] duration-200",
        isCollapsed ? "w-[56px]" : "w-[180px]"
      )}
    >
      <div className="flex flex-col">
        <div className="flex h-14 items-center justify-between border-b border-alt-border px-3">
          {isCollapsed ? (
            <span className="text-sm font-bold tracking-wide">G</span>
          ) : (
            <span className="text-sm font-bold tracking-wide">GLINTZ</span>
          )}
          <button
            type="button"
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="inline-flex size-7 items-center justify-center border border-alt-border text-foreground transition-colors hover:bg-accent"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="size-4" />
            ) : (
              <PanelLeftClose className="size-4" />
            )}
          </button>
        </div>

        <nav className="flex flex-col">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex h-10 border-b border-alt-border text-xs uppercase tracking-wide transition-colors",
                  isCollapsed
                    ? "items-center justify-center"
                    : "items-center px-3 justify-start",
                  isActive ? "bg-accent text-primary" : "text-foreground hover:bg-accent"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {isCollapsed ? <Icon className="size-4" /> : item.label}
              </Link>
            )
          })}
        </nav>
      </div>

      <footer
        onMouseLeave={() => setActiveFooterPanel(null)}
        className="relative border-t border-alt-border p-2"
      >
        {activeFooterPanel ? (
          <div
            className={cn(
              "mb-2",
              isCollapsed
                ? "absolute bottom-11 left-[calc(100%+8px)] w-44 border border-alt-border bg-alt-background p-2 shadow-sm"
                : "border border-alt-border p-2"
            )}
          >
            {renderFooterPanel()}
          </div>
        ) : null}
        <div
          className={cn(
            "gap-1",
            isCollapsed
              ? "flex flex-col items-center justify-center"
              : "flex items-center justify-between"
          )}
        >
          <button
            type="button"
            onClick={() => handleFooterPanelClick("theme")}
            className={cn(
              "inline-flex size-8 items-center justify-center border border-alt-border transition-colors hover:bg-accent",
              activeFooterPanel === "theme" && "bg-accent text-primary"
            )}
            aria-label="Theme options"
          >
            <Palette className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => handleFooterPanelClick("font")}
            className={cn(
              "inline-flex size-8 items-center justify-center border border-alt-border transition-colors hover:bg-accent",
              activeFooterPanel === "font" && "bg-accent text-primary"
            )}
            aria-label="Font options"
          >
            <Type className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => handleFooterPanelClick("layout")}
            className={cn(
              "inline-flex size-8 items-center justify-center border border-alt-border transition-colors hover:bg-accent",
              activeFooterPanel === "layout" && "bg-accent text-primary"
            )}
            aria-label="Layout options"
          >
            <LayoutPanelTop className="size-4" />
          </button>
        </div>
      </footer>
    </aside>
  )
}
