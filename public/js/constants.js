const URL_BACKEND = "https://backend.pdmmonitor.com/api";
// const URL_BACKEND = "http://localhost:3000";
const ESP32_IP = "http://IP";
const GET_VARIABLES = "command?cmd=GET_VARIABLES";
const GET_VOLTAJE = "command?cmd=GET_VOLTAGE";
const SET_VARIABLES = "command?cmd=SET_VARIABLES";
const GET_WAVE = "data?eje=EJE&modo=waveform";
const GET_SPECTRA = "data?eje=EJE&modo=spectrum";
const GET_VOLTAGE = "command?cmd=GET_VOLTAGE";

const OPTIONS_DRAW = {
  title: {
    text: "",
    fontSize: 14,
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

const PARAMS_SPEC = {
  THRESHOLD: 0.055,
  MULTIPLIER: 0.3,
  A: 0.16,
  B: 2.333,
  C: 0.7,
  D: 0.006,
  FIXED: 0.000012,
};
