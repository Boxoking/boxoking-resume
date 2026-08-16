import { useEffect, useRef } from "react";
import { MeshGradient } from "@paper-design/shaders-react";

const fluidBluePalette = [
  "#a7bfd6",
  "#84a4c2",
  "#6388ad",
  "#3f6c99",
  "#204c7d",
  "#0b2b60",
];

const deeperFluidBluePalette = [
  "#91acc5",
  "#7192b0",
  "#52799e",
  "#365f89",
  "#194371",
  "#072252",
];

const lighterFluidBluePalette = [
  "#eef4f8",
  "#dce8f0",
  "#c8dae7",
  "#abc3d5",
  "#8eacc2",
  "#7092ad",
];

let sharedGrainTexture = "";

function createFineGrainTexture() {
  if (sharedGrainTexture) return sharedGrainTexture;

  const size = 256;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = size;
  canvas.height = size;

  const image = context.createImageData(size, size);
  let seed = 0x6d2b79f5;

  for (let index = 0; index < image.data.length; index += 4) {
    seed ^= seed << 13;
    seed ^= seed >>> 17;
    seed ^= seed << 5;
    const value = 105 + (seed >>> 0) % 47;
    image.data[index] = value;
    image.data[index + 1] = value;
    image.data[index + 2] = value;
    image.data[index + 3] = 255;
  }

  context.putImageData(image, 0, 0);
  sharedGrainTexture = canvas.toDataURL("image/png");
  return sharedGrainTexture;
}

function MovingGrain() {
  const grainRef = useRef(null);

  useEffect(() => {
    if (!grainRef.current) return;
    grainRef.current.style.backgroundImage = `url(${createFineGrainTexture()})`;
  }, []);

  return <span ref={grainRef} className="fog-moving-grain" />;
}

export default function FogBackdrop({ deeper = false, lighter = false }) {
  const palette = lighter
    ? lighterFluidBluePalette
    : deeper
      ? deeperFluidBluePalette
      : fluidBluePalette;

  return (
    <div
      className={`fog-backdrop${deeper ? " fog-backdrop--deeper" : ""}${lighter ? " fog-backdrop--lighter" : ""}`}
      aria-hidden="true"
    >
      <MeshGradient
        className="fog-fluid-gradient"
        colors={palette}
        distortion={0.82}
        swirl={0.48}
        grainMixer={0}
        grainOverlay={0}
        speed={0.28}
        frame={860}
        fit="cover"
        scale={1.18}
        rotation={12}
        maxPixelCount={2200000}
        minPixelRatio={1.5}
        webGlContextAttributes={{
          alpha: false,
          antialias: false,
          powerPreference: "low-power",
        }}
      />
      <span className="fog-fluid-veil" />
      <MovingGrain />
    </div>
  );
}
