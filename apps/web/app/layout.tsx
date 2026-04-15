import { Geist, JetBrains_Mono, Lora, Quicksand } from "next/font/google"

import "@workspace/ui/styles/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@workspace/ui/lib/utils";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const jetbrainsMono = JetBrains_Mono({subsets:['latin'],variable:'--font-mono'})
const quicksand = Quicksand({ subsets: ["latin"], variable: "--font-sans" })
const lora = Lora({ subsets: ["latin"], variable: "--font-serif" })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontSans.variable,
        jetbrainsMono.variable,
        quicksand.variable,
        lora.variable
      )}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
