import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: "linear-gradient(135deg, #D4684A 0%, #944030 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            color: "white",
            fontSize: 22,
            fontWeight: 700,
            fontFamily: "Georgia, serif",
            lineHeight: 1,
          }}
        >
          R
        </span>
      </div>
    ),
    { width: 32, height: 32 }
  );
}
