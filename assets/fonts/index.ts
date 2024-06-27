import localFont from "next/font/local";
import { Inter as FontSans, Urbanist } from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const fontUrban = Urbanist({
  subsets: ["latin"],
  variable: "--font-urban",
})

export const fontHeading = localFont({
  src: "./CalSans-SemiBold.woff2",
  variable: "--font-heading",
})

export const fontGeist = localFont({
  src: "./GeistVF.woff2",
  variable: "--font-geist",
})
