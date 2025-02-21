import { Color } from "deck.gl";

export const COLOR: { [key: string]: Color } = {
  BLACK: [0, 0, 0, 255], // #000000
  WHITE: [255, 255, 255, 255], // #FFFFFF
  GREY: [170, 170, 170, 255], // #AAAAAA
  TRANSPARENT: [0, 0, 0, 0], // #00000000

  BLUE: [100, 108, 255, 255], // #646CFF

  LIGHT_YELLOW: [249, 223, 137, 255], // #F9DF89
  YELLOW: [255, 199, 0, 255], // #FFC700

  RED: [177, 0, 38, 255], // #B10026
  RED_01: [255, 148, 130, 255], // #FF9482
  RED_02: [245, 105, 82, 255], // #F56952
  RED_03: [166, 49, 36, 255], // #A63124
};
