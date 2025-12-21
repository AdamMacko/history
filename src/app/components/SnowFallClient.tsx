"use client";

import Snowfall from "react-snowfall";

export default function SnowfallClient() {
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999 }}>
      <Snowfall color="#82C3D9" />
    </div>
  );
}
