import {
  ImageResponse,
} from "next/og";

export const alt =
  "Lunar Konstruksi - Jasa Konstruksi dan Kontraktor Solo";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType =
  "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background:
            "#f5f1e8",
          color: "#14243f",
          padding: "78px",
          fontFamily:
            "Arial, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "28px",
            height: "100%",
            background:
              "#dcb458",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection:
              "column",
            justifyContent:
              "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems:
                "center",
              gap: "18px",
              fontSize: "22px",
              letterSpacing:
                "0.16em",
              textTransform:
                "uppercase",
            }}
          >
            <span
              style={{
                display:
                  "block",
                width: "68px",
                height: "4px",
                background:
                  "#dcb458",
              }}
            />

            Lunar Konstruksi
          </div>

          <div
            style={{
              display: "flex",
              flexDirection:
                "column",
              maxWidth: "930px",
            }}
          >
            <div
              style={{
                fontSize:
                  "76px",
                lineHeight:
                  0.92,
                fontWeight:
                  900,
                letterSpacing:
                  "-0.045em",
                textTransform:
                  "uppercase",
              }}
            >
              Jasa Konstruksi
              & Kontraktor Solo
            </div>

            <div
              style={{
                marginTop:
                  "28px",
                fontSize:
                  "25px",
                lineHeight:
                  1.45,
                color:
                  "#657184",
              }}
            >
              Perencanaan,
              renovasi,
              interior, dan
              pekerjaan
              konstruksi di
              Solo Raya.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems:
                "center",
              fontSize: "18px",
              letterSpacing:
                "0.12em",
              textTransform:
                "uppercase",
            }}
          >
            <span>
              Planning /
              Coordination /
              Construction
            </span>

            <span
              style={{
                color:
                  "#b58c2f",
                fontWeight:
                  700,
              }}
            >
              Solo Raya
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
