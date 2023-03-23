import { VdExtractThemeOverrides } from "@/components/_mixins/use-theme";
import type { ThemeCommonVars } from "naive-ui/es/_styles/common";
import type { VdGlobalThemeWithoutCommon } from "./internal-interface";

export interface VdCustomThemeCommonVars {}

export interface VdGlobalTheme extends VdGlobalThemeWithoutCommon {
  name: string;
  common?: ThemeCommonVars;
}

export type VdGlobalThemeOverrides = {
  common?: Partial<ThemeCommonVars & VdCustomThemeCommonVars>;
} & {
  [key in keyof VdGlobalThemeWithoutCommon]?: VdExtractThemeOverrides<
    VdGlobalThemeWithoutCommon[key]
  >;
};

export type {
  VdGlobalIconConfig,
  VdGlobalComponentConfig,
} from "./internal-interface";
