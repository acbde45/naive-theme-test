import type { Ref } from "vue";
import type { VdLocale } from "@/components/locales";
import { CardTheme } from "@/components/Card/styles";
import { VdGlobalTheme, VdGlobalThemeOverrides } from "./interface";

export interface VdGlobalThemeWithoutCommon {
  Card?: CardTheme;
}

export interface VdGlobalComponentConfig {}

export interface VdGlobalIconConfig {
}

export interface VdConfigProviderInjection {
  mergedClsPrefixRef: Ref<string | undefined>;
  mergedBorderedRef: Ref<boolean | undefined>;
  mergedNamespaceRef: Ref<string | undefined>;
  mergedLocaleRef: Ref<VdLocale | undefined>;
  mergedComponentPropsRef: Ref<VdGlobalComponentConfig | undefined>;
  mergedIconsRef: Ref<VdGlobalIconConfig | undefined>;
  mergedThemeRef: Ref<VdGlobalTheme | undefined>;
  mergedThemeOverridesRef: Ref<VdGlobalThemeOverrides | undefined>;
  mergedThemeHashRef: Ref<string>;
}
