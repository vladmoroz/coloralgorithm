import { createCeaser } from "./ceaser";
import bezier from "bezier-easing";
import * as curves from "./curves";
import generate from "./generate";

const red = {
  steps: 7,
  hue_start: 354,
  hue_end: 356,
  hue_curve: curves.linear,
  sat_start: 2,
  sat_end: 44,
  sat_curve: "0.700, 0.415, 0.745, 0.465",
  sat_rate: 100,
  lum_start: 100,
  lum_end: 96,
  lum_curve: curves.linear,
  modifier: 10,
};

const crimson = {
  steps: 7,
  hue_start: 336,
  hue_end: 342,
  hue_curve: curves.linear,
  sat_start: 2,
  sat_end: 60,
  sat_curve: "0.700, 0.415, 0.745, 0.465",
  sat_rate: 100,
  lum_start: 100,
  lum_end: 97,
  lum_curve: curves.linear,
  modifier: 10,
};

const pink = {
  steps: 7,
  hue_start: 316,
  hue_end: 325,
  hue_curve: curves.linear,
  sat_start: 3,
  sat_end: 60,
  sat_curve: "0.700, 0.415, 0.745, 0.465",
  sat_rate: 100,
  lum_start: 100,
  lum_end: 94,
  lum_curve: curves.linear,
  modifier: 10,
};

const purple = {
  steps: 7,
  hue_start: 285,
  hue_end: 272,
  hue_curve: curves.linear,
  sat_start: 2,
  sat_end: 45,
  sat_curve: "0.700, 0.415, 0.745, 0.465",
  sat_rate: 100,
  lum_start: 100,
  lum_end: 91,
  lum_curve: curves.linear,
  modifier: 10,
};

const violet = {
  steps: 7,
  hue_start: 252,
  hue_end: 252,
  hue_curve: curves.linear,
  sat_start: 2,
  sat_end: 50,
  sat_curve: "0.700, 0.415, 0.745, 0.465",
  sat_rate: 100,
  lum_start: 100,
  lum_end: 95,
  lum_curve: curves.linear,
  modifier: 10,
};

const indigo = {
  steps: 7,
  hue_start: 228,
  hue_end: 228,
  hue_curve: curves.linear,
  sat_start: 2,
  sat_end: 50,
  sat_curve: "0.700, 0.415, 0.745, 0.465",
  sat_rate: 100,
  lum_start: 100,
  lum_end: 93,
  lum_curve: curves.linear,
  modifier: 10,
};

const blue = {
  steps: 7,
  hue_start: 202,
  hue_end: 206,
  hue_curve: curves.linear,
  sat_start: 3,
  sat_end: 57,
  sat_curve: "0.700, 0.415, 0.745, 0.465",
  sat_rate: 100,
  lum_start: 100,
  lum_end: 98,
  lum_curve: curves.easeOutCubic,
  modifier: 10,
};

const turquoise = {
  steps: 7,
  hue_start: 185,
  hue_end: 190,
  hue_curve: curves.linear,
  sat_start: 3,
  sat_end: 54,
  sat_curve: "0.700, 0.415, 0.745, 0.465",
  sat_rate: 100,
  lum_start: 100,
  lum_end: 92,
  lum_curve: curves.easeOutCubic,
  modifier: 10,
};

const teal = {
  steps: 7,
  hue_start: 167,
  hue_end: 174,
  hue_curve: curves.linear,
  sat_start: 4,
  sat_end: 66,
  sat_curve: "0.700, 0.415, 0.745, 0.465",
  sat_rate: 100,
  lum_start: 100,
  lum_end: 82,
  lum_curve: curves.easeOutCubic,
  modifier: 10,
};

const green = {
  steps: 7,
  hue_start: 153,
  hue_end: 148,
  hue_curve: curves.linear,
  sat_start: 4,
  sat_end: 57,
  sat_curve: "0.700, 0.415, 0.745, 0.465",
  sat_rate: 100,
  lum_start: 100,
  lum_end: 84,
  lum_curve: curves.easeOutCubic,
  modifier: 10,
};

const lime = {
  steps: 7,
  hue_start: 153,
  hue_end: 148,
  hue_curve: curves.linear,
  sat_start: 4,
  sat_end: 57,
  sat_curve: "0.700, 0.415, 0.745, 0.465",
  sat_rate: 100,
  lum_start: 100,
  lum_end: 84,
  lum_curve: curves.easeOutCubic,
  modifier: 10,
};

const scales = [
  red,
  crimson,
  pink,
  purple,
  violet,
  indigo,
  blue,
  turquoise,
  teal,
  green,
];

scales.forEach((scale) => {
  const colorsContainer = document.createElement("div");
  colorsContainer.style.display = "flex";

  const container = document.createElement("div");
  container.style.display = "flex";
  container.style.alignItems = "center";
  container.style.margin = "0 50px";
  container.appendChild(colorsContainer);

  const onCurveChange = (sat_curve) => {
    colorsContainer.innerHTML = "";
    const generatedColors = generate({
      specs: {
        ...scale,
        hue_curve: bezier(...scale.hue_curve.split(",")),
        sat_curve: bezier(...sat_curve.split(",")),
        lum_curve: bezier(...scale.lum_curve.split(",")),
      },
    });

    generatedColors.forEach((color) => {
      const div = document.createElement("div");
      div.style.backgroundColor = color.hex;
      div.style.height = "250px";
      div.style.width = "100px";
      div.style.textAlign = "center";

      const hex = document.createElement("div");
      hex.style.margin = "210px auto 0";
      hex.textContent = color.hex.toUpperCase();

      const [h, s, l] = color.hsl;
      const hsl = document.createElement("div");
      hsl.style.margin = "5px auto 0";
      hsl.textContent = `
        ${h.toFixed()},
        ${(s * 100).toFixed()}%,
        ${(l * 100).toFixed()}%`;

      div.appendChild(hex);
      div.appendChild(hsl);
      colorsContainer.appendChild(div);
    });
  };

  onCurveChange(scale.sat_curve);
  createCeaser(scale.sat_curve, container, onCurveChange);
  document.body.appendChild(container);
});
