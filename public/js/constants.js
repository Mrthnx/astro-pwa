const URL_BACKEND = "https://backend.pdmmonitor.com";

const OPTIONS_DRAW = {
  title: {
    text: "",
  },
  tooltip: {
    enabled: true,
  },
  axes: [
    {
      type: "number",
      position: "left",
    },
    {
      type: "number",
      position: "bottom",
      nice: false,
      label: {
        autoRotate: true,
      },
    },
  ],
  container: "",
  data: [],
  series: [
    {
      type: "line",
      xKey: "x",
      yKey: "y",
      marker: { shape: "circle", size: 0.5, strokeWidth: 1 },
    },
  ],
};

const DRAW_TITLES = {
  NEXT_X_W: "X-axis (Waveform)",
  NEXT_X_S: "X-axis (Spectrum)",
  NEXT_Y_W: "Y-axis (Waveform)",
  NEXT_Y_S: "Y-axis (Spectrum)",
  NEXT_Z_W: "Z-axis (Waveform)",
  NEXT_Z_S: "Z-axis (Spectrum)",
};

let UNIT_W = 1; // 1: Acc, 2: Vel, 3: Disp
let UNIT_S = 1; // 1: Acc, 2: Vel, 3: Disp
