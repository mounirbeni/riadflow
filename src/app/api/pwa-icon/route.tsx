import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const raw = parseInt(searchParams.get("size") || "192");
  const sz = raw >= 400 ? 512 : 192;

  const fontSize = sz === 512 ? 290 : 115;
  const labelSize = sz === 512 ? 58 : 23;
  const letterSpacing = sz === 512 ? 14 : 6;
  const radius = sz === 512 ? 112 : 44;

  return new ImageResponse(
    (
      <div
        style={{
          width: sz,
          height: sz,
          borderRadius: radius,
          background: "linear-gradient(145deg, #D4684A 0%, #944030 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: sz === 512 ? 10 : 4,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: radius,
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%)",
          }}
        />
        <span
          style={{
            color: "white",
            fontSize,
            fontWeight: 700,
            fontFamily: "Georgia, serif",
            lineHeight: 1,
          }}
        >
          R
        </span>
        <span
          style={{
            color: "rgba(255,255,255,0.78)",
            fontSize: labelSize,
            fontFamily: "Georgia, serif",
            letterSpacing,
          }}
        >
          RIAD
        </span>
      </div>
    ),
    { width: sz, height: sz }
  );
}
