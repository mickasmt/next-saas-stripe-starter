import { ImageResponse } from "@vercel/og"

import { ogImageSchema } from "@/lib/validations/og"

export const runtime = "edge"

export async function GET(req: Request) {
  try {
    const font = await fetch(
      new URL("../../../assets/fonts/GeistVariableVF.ttf", import.meta.url)
    ).then(res => res.arrayBuffer());

    const url = new URL(req.url)
    const values = ogImageSchema.parse(Object.fromEntries(url.searchParams))
    const heading =
      values.heading.length > 80
        ? `${values.heading.substring(0, 100)}...`
        : values.heading

    const { mode } = values
    const paint = mode === "dark" ? "#fff" : "#000"

    const fontSize = heading.length > 80 ? "60px" : "80px"

    const labName = "ratlaboratories";

    return new ImageResponse(
      (
        <div
          tw="flex relative flex-col p-12 w-full h-full items-start"
          style={{
            color: paint,
            background:
              mode === "dark"
                ? "linear-gradient(90deg, #000 0%, #111 100%)"
                : "white",
          }}
        >
          <div
            tw="text-5xl"
            style={{
              fontFamily: "Geist",
              fontWeight: "normal",
              position: "relative",
              background: "linear-gradient(90deg, #6366f1, #a855f7 80%)",
              backgroundClip: 'text',
              color: 'transparent'
            }}
          >
            Snack
          </div>

          <div tw="flex flex-col flex-1 py-16">
            {/* Type : Blog or Doc */}
            <div
              tw="flex text-xl uppercase font-bold tracking-tight"
              style={{ fontFamily: "Geist", fontWeight: "normal" }}
            >
              {values.type}
            </div>
            {/* Title */}
            <div
              tw="flex leading-[1.15] text-[80px] font-bold"
              style={{
                fontFamily: "Geist",
                fontWeight: "bold",
                marginLeft: "-3px",
                fontSize,
              }}
            >
              {heading}
            </div>
          </div>

          <div tw="flex items-center w-full justify-between">
            <div
              tw="flex items-center text-xl"
              style={{ fontFamily: "Geist", fontWeight: "normal" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="avatar"
                width="65"
                src={`https://github.com/${labName}.png`}
                style={{
                  borderRadius: 128,
                }}
              />

              <div tw="flex flex-col" style={{ marginLeft: "15px" }}>
                <div
                  tw="text-[22px]"
                  style={{ fontFamily: "Geist" }}
                >
                  {labName}
                </div>
                <div>Rat Labs</div>
              </div>
            </div>

            <div
              tw="flex items-center text-xl"
              style={{ fontFamily: "Geist", fontWeight: "normal" }}
            >
              <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
                <path
                  d="M30 44v-8a9.6 9.6 0 0 0-2-7c6 0 12-4 12-11 .16-2.5-.54-4.96-2-7 .56-2.3.56-4.7 0-7 0 0-2 0-6 3-5.28-1-10.72-1-16 0-4-3-6-3-6-3-.6 2.3-.6 4.7 0 7a10.806 10.806 0 0 0-2 7c0 7 6 11 12 11a9.43 9.43 0 0 0-1.7 3.3c-.34 1.2-.44 2.46-.3 3.7v8"
                  stroke={paint}
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M18 36c-9.02 4-10-4-14-4"
                  stroke={paint}
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <div tw="flex ml-2">github.com/ratlabs</div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "Geist",
            data: font,
            weight: 400,
            style: "normal",
          },
        ],
      }
    )
  } catch (error) {
    return new Response(`Failed to generate image`, {
      status: 500,
    })
  }
}
