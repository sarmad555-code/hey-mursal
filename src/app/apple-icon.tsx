import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(165deg, #d7ebff 0%, #eef5ff 42%, #ffd6e3 100%)",
        }}
      >
        <div
          style={{
            width: 132,
            height: 132,
            borderRadius: 66,
            background: "linear-gradient(180deg, #c8e4ff 0%, #a8d0f5 55%, #ffd0e0 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="78" height="78" viewBox="0 0 120 120">
            <path
              fill="#4d8fd6"
              d="M60 98C60 98 18 72 18 44.5C18 30 28.5 22 40 22C48.5 22 55.5 26.5 60 33C64.5 26.5 71.5 22 80 22C91.5 22 102 30 102 44.5C102 72 60 98 60 98Z"
            />
          </svg>
        </div>
      </div>
    ),
    { ...size }
  );
}
