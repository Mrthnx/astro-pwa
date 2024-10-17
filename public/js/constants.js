// const URL_BACKEND = "https://backend.pdmmonitor.com";
const URL_BACKEND = "http://localhost:3000";

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
  NEXT_X_W: "X Acc (Waveform)",
  NEXT_X_S: "X Acc (Spectrum)",
  NEXT_Y_W: "Y Acc (Waveform)",
  NEXT_Y_S: "Y Acc (Spectrum)",
  NEXT_Z_W: "Z Acc (Waveform)",
  NEXT_Z_S: "Z Acc (Spectrum)",
};

let UNIT_W = 1; // 1: Acc, 2: Vel, 3: Disp
let UNIT_S = 1; // 1: Acc, 2: Vel, 3: Disp
