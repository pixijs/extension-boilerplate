import { main } from "@pixi-build-tools/rollup-configurator/main";

const config = main({
  globals: {
    "@pixi/layers": "PIXI.display",
  },
});

export default config;
