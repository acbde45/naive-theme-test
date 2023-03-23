import { commonLight } from "naive-ui/es/_styles/common";
import type { ThemeCommonVars } from "naive-ui/es/_styles/common";
import type { VdTheme } from "@/components/_mixins";
import commonVariables from "./_common";

export const self = (vars: ThemeCommonVars) => {
  const {
    primaryColor,
    borderRadius,
    lineHeight,
    fontSize,
    cardColor,
    textColor2,
    textColor1,
    dividerColor,
    fontWeightStrong,
    closeColorHover,
    closeColorPressed,
    modalColor,
    boxShadow1,
    popoverColor,
    actionColor,
  } = vars;
  return {
    ...commonVariables,
    lineHeight,
    color: cardColor,
    colorModal: modalColor,
    colorPopover: popoverColor,
    colorTarget: primaryColor,
    textColor: textColor2,
    titleTextColor: textColor1,
    borderColor: dividerColor,
    actionColor,
    titleFontWeight: fontWeightStrong,
    closeColorHover,
    closeColorPressed,
    closeBorderRadius: borderRadius,
    fontSizeSmall: fontSize,
    fontSizeMedium: fontSize,
    fontSizeLarge: fontSize,
    fontSizeHuge: fontSize,
    boxShadow: boxShadow1,
    borderRadius,
  };
};

export type CardThemeVars = ReturnType<typeof self>;

const cardLight: VdTheme<"Card", CardThemeVars> = {
  name: "Card",
  common: commonLight,
  self,
};

export default cardLight;
export type CardTheme = typeof cardLight;
