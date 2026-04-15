"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"

const APP_THEMES = ["dark", "forest", "lollypop"] as const
const THEME_FONT_STORAGE_KEY = "glintz-theme-font-map"

type AppTheme = (typeof APP_THEMES)[number]
type FontOption = "mono" | "sans" | "serif"
type ThemeFontMap = Record<AppTheme, FontOption>

const DEFAULT_THEME_FONTS: ThemeFontMap = {
  dark: "mono",
  forest: "serif",
  lollypop: "sans",
}

type ThemeFontContextValue = {
  selectedFont: FontOption
  setFontForCurrentTheme: (font: FontOption) => void
  currentTheme: AppTheme
}

const ThemeFontContext = React.createContext<ThemeFontContextValue | null>(null)

function isAppTheme(theme: string | undefined): theme is AppTheme {
  if (!theme) {
    return false
  }

  return APP_THEMES.includes(theme as AppTheme)
}

function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      themes={[...APP_THEMES]}
      disableTransitionOnChange
      {...props}
    >
      <ThemeFontController>{children}</ThemeFontController>
    </NextThemesProvider>
  )
}

function ThemeFontController({ children }: { children: React.ReactNode }) {
  const [themeFonts, setThemeFonts] = React.useState<ThemeFontMap>(DEFAULT_THEME_FONTS)
  const [isMounted, setIsMounted] = React.useState(false)
  const { theme, resolvedTheme } = useTheme()

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  React.useEffect(() => {
    if (!isMounted) {
      return
    }

    const storedMap = window.localStorage.getItem(THEME_FONT_STORAGE_KEY)
    if (!storedMap) {
      return
    }

    try {
      const parsed = JSON.parse(storedMap) as Partial<ThemeFontMap>
      setThemeFonts({
        dark: parsed.dark ?? DEFAULT_THEME_FONTS.dark,
        forest: parsed.forest ?? DEFAULT_THEME_FONTS.forest,
        lollypop: parsed.lollypop ?? DEFAULT_THEME_FONTS.lollypop,
      })
    } catch {
      setThemeFonts(DEFAULT_THEME_FONTS)
    }
  }, [isMounted])

  React.useEffect(() => {
    if (!isMounted) {
      return
    }

    const activeTheme = isAppTheme(theme)
      ? theme
      : isAppTheme(resolvedTheme)
        ? resolvedTheme
        : "dark"
    const activeFont = themeFonts[activeTheme]
    document.documentElement.setAttribute("data-font", activeFont)
  }, [isMounted, resolvedTheme, theme, themeFonts])

  const setFontForCurrentTheme = React.useCallback(
    (font: FontOption) => {
      const activeTheme = isAppTheme(theme)
        ? theme
        : isAppTheme(resolvedTheme)
          ? resolvedTheme
          : "dark"

      setThemeFonts((prev) => {
        const next = {
          ...prev,
          [activeTheme]: font,
        }
        window.localStorage.setItem(THEME_FONT_STORAGE_KEY, JSON.stringify(next))
        return next
      })
    },
    [resolvedTheme, theme]
  )

  const currentTheme = isAppTheme(theme)
    ? theme
    : isAppTheme(resolvedTheme)
      ? resolvedTheme
      : "dark"
  const selectedFont = themeFonts[currentTheme]

  const themeFontValue = React.useMemo<ThemeFontContextValue>(
    () => ({
      selectedFont,
      setFontForCurrentTheme,
      currentTheme,
    }),
    [currentTheme, selectedFont, setFontForCurrentTheme]
  )

  return (
    <>
      <ThemeHotkey />
      <ThemeFontContext.Provider value={themeFontValue}>
        {children}
      </ThemeFontContext.Provider>
    </>
  )
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  )
}

function ThemeHotkey() {
  const { resolvedTheme, setTheme } = useTheme()

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat) {
        return
      }

      if (event.metaKey || event.ctrlKey || event.altKey) {
        return
      }

      if (event.key.toLowerCase() !== "d") {
        return
      }

      if (isTypingTarget(event.target)) {
        return
      }

      const currentTheme = isAppTheme(resolvedTheme) ? resolvedTheme : "dark"
      const currentThemeIndex = APP_THEMES.indexOf(currentTheme)
      const nextTheme =
        APP_THEMES[(currentThemeIndex + 1) % APP_THEMES.length] ?? "dark"
      setTheme(nextTheme)
    }

    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [resolvedTheme, setTheme])

  return null
}

function useThemeFont() {
  const context = React.useContext(ThemeFontContext)
  if (!context) {
    throw new Error("useThemeFont must be used within ThemeProvider")
  }

  return context
}

export { ThemeProvider, useThemeFont, APP_THEMES, type FontOption }
