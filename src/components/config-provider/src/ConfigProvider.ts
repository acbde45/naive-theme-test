import {
  h,
  inject,
  computed,
  defineComponent,
  PropType,
  provide,
  ExtractPropTypes,
} from "vue";
import { useMemo } from "vooks";
import { merge } from "lodash-es";
import { hash } from "css-render";
import { defaultVdClsPrefix } from "@/components/_mixins";
import { VdLocale } from "@/components/locales";
import type {
  VdGlobalTheme,
  VdGlobalThemeOverrides,
  VdGlobalComponentConfig,
  VdGlobalIconConfig,
} from "./interface";
import { VdConfigProviderInjectionKey } from "./context";

export const configProviderProps = {
  abstract: Boolean,
  bordered: {
    type: Boolean as PropType<boolean | undefined>,
    default: undefined,
  },
  clsPrefix: String,
  locale: Object as PropType<VdLocale | null>,
  namespace: String,
  tag: {
    type: String,
    default: "div",
  },
  theme: Object as PropType<VdGlobalTheme | null>,
  themeOverrides: Object as PropType<VdGlobalThemeOverrides | null>,
  componentOptions: Object as PropType<VdGlobalComponentConfig>,
  icons: Object as PropType<VdGlobalIconConfig>,
} as const;

export type ConfigProviderProps = Partial<
  ExtractPropTypes<typeof configProviderProps>
>;

export default defineComponent({
  name: "ConfigProvider",
  alias: ["App"],
  props: configProviderProps,
  setup(props) {
    const VdConfigProvider = inject(VdConfigProviderInjectionKey, null);
    const mergedThemeRef = computed(() => {
      const { theme } = props;
      if (theme === null) return undefined;
      const inheritedTheme = VdConfigProvider?.mergedThemeRef.value;
      return theme === undefined
        ? inheritedTheme
        : inheritedTheme === undefined
        ? theme
        : Object.assign({}, inheritedTheme, theme);
    });
    const mergedThemeOverridesRef = computed(() => {
      const { themeOverrides } = props;
      // stop inheriting themeOverrides
      if (themeOverrides === null) return undefined;
      // use inherited themeOverrides
      if (themeOverrides === undefined) {
        return VdConfigProvider?.mergedThemeOverridesRef.value;
      } else {
        const inheritedThemeOverrides =
          VdConfigProvider?.mergedThemeOverridesRef.value;
        if (inheritedThemeOverrides === undefined) {
          // no inherited, use self overrides
          return themeOverrides;
        } else {
          // merge overrides
          return merge({}, inheritedThemeOverrides, themeOverrides);
        }
      }
    });
    const mergedNamespaceRef = useMemo(() => {
      const { namespace } = props;
      return namespace === undefined
        ? VdConfigProvider?.mergedNamespaceRef.value
        : namespace;
    });
    const mergedBorderedRef = useMemo(() => {
      const { bordered } = props;
      return bordered === undefined
        ? VdConfigProvider?.mergedBorderedRef.value
        : bordered;
    });
    const mergedIconsRef = computed(() => {
      const { icons } = props;
      return icons === undefined
        ? VdConfigProvider?.mergedIconsRef.value
        : icons;
    });
    const mergedComponentPropsRef = computed(() => {
      const { componentOptions } = props;
      if (componentOptions !== undefined) return componentOptions;
      return VdConfigProvider?.mergedComponentPropsRef.value;
    });
    const mergedClsPrefixRef = computed(() => {
      const { clsPrefix } = props;
      if (clsPrefix !== undefined) return clsPrefix;
      return VdConfigProvider?.mergedClsPrefixRef.value;
    });
    const mergedThemeHashRef = computed(() => {
      const { value: theme } = mergedThemeRef;
      const { value: mergedThemeOverrides } = mergedThemeOverridesRef;
      const hasThemeOverrides =
        mergedThemeOverrides && Object.keys(mergedThemeOverrides).length !== 0;
      const themeName = theme?.name;
      if (themeName) {
        if (hasThemeOverrides) {
          return `${themeName}-${hash(
            JSON.stringify(mergedThemeOverridesRef.value)
          )}`;
        }
        return themeName;
      } else {
        if (hasThemeOverrides) {
          return hash(JSON.stringify(mergedThemeOverridesRef.value));
        }
        return "";
      }
    });
    provide(VdConfigProviderInjectionKey, {
      mergedThemeHashRef,
      mergedIconsRef,
      mergedComponentPropsRef,
      mergedBorderedRef,
      mergedNamespaceRef,
      mergedClsPrefixRef,
      mergedLocaleRef: computed(() => {
        const { locale } = props;
        if (locale === null) return undefined;
        return locale === undefined
          ? VdConfigProvider?.mergedLocaleRef.value
          : locale;
      }),
      mergedThemeRef,
      mergedThemeOverridesRef,
    });
    return {
      mergedClsPrefix: mergedClsPrefixRef,
      mergedBordered: mergedBorderedRef,
      mergedNamespace: mergedNamespaceRef,
      mergedTheme: mergedThemeRef,
      mergedThemeOverrides: mergedThemeOverridesRef,
    };
  },
  render() {
    return !this.abstract
      ? h(
          this.tag,
          {
            class: `${
              this.mergedClsPrefix || defaultVdClsPrefix
            }-config-provider`,
          },
          this.$slots.default?.()
        )
      : this.$slots.default?.();
  },
});
