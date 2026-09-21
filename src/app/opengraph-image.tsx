import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Hey Mursal, a soft blue and pink pocket";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(165deg, #e7f3ff 0%, #eef5ff 48%, #ffe4ee 100%)",
          padding: "64px 72px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div
            style={{
              width: 220,
              height: 140,
              borderRadius: 80,
              background: "#c8e4ff",
              opacity: 0.9,
            }}
          />
          <div
            style={{
              width: 180,
              height: 180,
              borderRadius: 90,
              background: "#ffd0e0",
              opacity: 0.85,
              marginTop: -30,
            }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", marginTop: -80 }}>
          <div
            style={{
              width: 168,
              height: 168,
              borderRadius: 84,
              background: "linear-gradient(180deg, #d7ebff 0%, #ffd6e3 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 40,
            }}
          >
            <svg width="92" height="92" viewBox="0 0 120 120">
              <path
                fill="#4d8fd6"
                d="M60 98C60 98 18 72 18 44.5C18 30 28.5 22 40 22C48.5 22 55.5 26.5 60 33C64.5 26.5 71.5 22 80 22C91.5 22 102 30 102 44.5C102 72 60 98 60 98Z"
              />
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 22,
                letterSpacing: 6,
                color: "#4d8fd6",
                fontFamily: "sans-serif",
              }}
            >
              JUST FOR YOU
            </div>
            <div
              style={{
                fontSize: 84,
                color: "#1f2d44",
                marginTop: 8,
                lineHeight: 1,
              }}
            >
              Hey Mursal
            </div>
            <div
              style={{
                fontSize: 32,
                color: "#ff9eb8",
                marginTop: 18,
              }}
            >
              Love, Sarmad xx
            </div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div
            style={{
              width: 260,
              height: 90,
              borderRadius: 50,
              background: "#a8d0f5",
              opacity: 0.55,
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
