import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
          background: "linear-gradient(145deg, #D4684A 0%, #944030 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <span
          style={{
            color: "white",
            fontSize: 96,
            fontWeight: 700,
            fontFamily: "Georgia, serif",
            lineHeight: 1,
          }}
        >
          R
        </span>
        <span
          style={{
            color: "rgba(255,255,255,0.75)",
            fontSize: 20,
            fontFamily: "Georgia, serif",
            letterSpacing: 6,
          }}
        >
          RIAD
        </span>
      </div>
    ),
    { width: 180, height: 180 }
  );
}
