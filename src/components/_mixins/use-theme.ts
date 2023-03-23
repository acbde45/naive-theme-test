import {
  inject,
  computed,
  onBeforeMount,
  ComputedRef,
  Ref,
  PropType,
} from "vue";
import { CNode } from "css-render";
import { useSsrAdapter } from "@css-render/vue3-ssr";
import { merge } from "lodash-es";
import type { ThemeCommonVars } from "naive-ui/es/_styles/common";
import { configProviderInjectionKey } from "naive-ui/es/config-provider/src/context";
import { VdConfigProviderInjectionKey } from "@/components/config-provider/src/context";
import type { VdGlobalTheme } from "@/components/config-provider";
import { cssrAnchorMetaName } from "./common";

export interface VdTheme<N, T = {}, R = any> {
  name: N;
  common?: ThemeCommonVars;
  peers?: R;
  self?: (vars: ThemeCommonVars) => T;
}

export interface VdThemeProps<T> {
  theme: PropType<T>;
  themeOverrides: PropType<VdExtractThemeOverrides<T>>;
  builtinThemeOverrides: PropType<VdExtractThemeOverrides<T>>;
}

export interface VdThemePropsReactive<T> {
  theme?: T;
  themeOverrides?: VdExtractThemeOverrides<T>;
  builtinThemeOverrides?: VdExtractThemeOverrides<T>;
}

export type VdExtractThemeVars<T> = T extends VdTheme<unknown, infer U, unknown>
  ? unknown extends U // self is undefined, ThemeVars is unknown
    ? {}
    : U
  : {};

export type VdExtractPeerOverrides<T> = T extends VdTheme<
  unknown,
  unknown,
  infer V
>
  ? {
      peers?: {
        [k in keyof V]?: VdExtractThemeOverrides<V[k]>;
      };
    }
  : T;

// V is peers theme
export type VdExtractMergedPeerOverrides<T> = T extends VdTheme<
  unknown,
  unknown,
  infer V
>
  ? {
      [k in keyof V]?: VdExtractPeerOverrides<V[k]>;
    }
  : T;

export type VdExtractThemeOverrides<T> = Partial<VdExtractThemeVars<T>> &
  VdExtractPeerOverrides<T> & { common?: ThemeCommonVars };

export function createVdTheme<N extends string, T, R>(
  theme: VdTheme<N, T, R>
): VdTheme<N, T, R> {
  return theme;
}

type UseVdThemeProps<T> = Readonly<{
  theme?: T | undefined;
  themeOverrides?: VdExtractThemeOverrides<T>;
  builtinThemeOverrides?: VdExtractThemeOverrides<T>;
}>;

export type VdMergedTheme<T> = T extends VdTheme<unknown, infer V, infer W>
  ? {
      common: ThemeCommonVars;
      self: V;
      peers: W;
      peerOverrides: VdExtractMergedPeerOverrides<T>;
    }
  : T;

/**
 * vdmin-front的主题色会覆盖naive-ui的主题色
 * @param resolveId 用来取组件特殊主题色的
 * @param mountId 
 * @param style 
 * @param defaultTheme 
 * @param props 
 * @param clsPrefixRef 
 * @returns 
 */
function useVdTheme<N, T, R>(
  resolveId: Exclude<keyof VdGlobalTheme, "common" | "name">,
  mountId: string,
  style: CNode | undefined,
  defaultTheme: VdTheme<N, T, R>,
  props: UseVdThemeProps<VdTheme<N, T, R>>,
  clsPrefixRef?: Ref<string | undefined>
): ComputedRef<VdMergedTheme<VdTheme<N, T, R>>> {
  const ssrAdapter = useSsrAdapter();
  const NConfigProvider = inject(configProviderInjectionKey, null);
  const VdConfigProvider = inject(VdConfigProviderInjectionKey, null);
  if (style) {
    const mountStyle = (): void => {
      const clsPrefix = clsPrefixRef?.value;
      style.mount({
        id: clsPrefix === undefined ? mountId : clsPrefix + mountId,
        head: true,
        props: {
          bPrefix: clsPrefix ? `.${clsPrefix}-` : undefined,
        },
        anchorMetaName: cssrAnchorMetaName,
        ssr: ssrAdapter,
      });
    };
    if (ssrAdapter) {
      mountStyle();
    } else {
      onBeforeMount(mountStyle);
    }
  }
  const mergedThemeRef = computed(() => {
    // keep props to make theme overrideable
    const {
      theme: { common: selfCommon, self, peers = {} } = {},
      themeOverrides: selfOverrides = {} as VdExtractThemeOverrides<
        VdTheme<N, T, R>
      >,
      builtinThemeOverrides: builtinOverrides = {} as VdExtractThemeOverrides<
        VdTheme<N, T, R>
      >,
    } = props;
    const { common: selfCommonOverrides, peers: peersOverrides } =
      selfOverrides;
    const {
      common: globalCommon = undefined,
      [resolveId]: {
        common: globalSelfCommon = undefined,
        self: globalSelf = undefined,
        peers: globalPeers = {},
      } = {},
    } = NConfigProvider?.mergedThemeRef.value || {};
    const {
      common: globalCommonOverrides = undefined,
      [resolveId]: globalSelfOverrides = {},
    } = NConfigProvider?.mergedThemeOverridesRef.value || {};
    const {
      common: globalSelfCommonOverrides,
      peers: globalPeersOverrides = {},
    } = globalSelfOverrides;
    const {
      common: vdGlobalCommon = undefined,
      [resolveId]: {
        common: vdGlobalSelfCommon = undefined,
        self: vdGlobalSelf = undefined,
        peers: vdGlobalPeers = {},
      } = {},
    } = VdConfigProvider?.mergedThemeRef.value || {};
    const {
      common: vdGlobalCommonOverrides = undefined,
      [resolveId]: vdGlobalSelfOverrides = {},
    } = VdConfigProvider?.mergedThemeOverridesRef.value || {};
    const {
      common: vdGlobalSelfCommonOverrides,
      peers: vdGlobalPeersOverrides = {},
    } = vdGlobalSelfOverrides;
    const mergedCommon = merge(
      {},
      globalSelfCommon || globalCommon || defaultTheme.common,
      selfCommon || vdGlobalSelfCommon || vdGlobalCommon,
      globalCommonOverrides,
      vdGlobalCommonOverrides,
      globalSelfCommonOverrides,
      vdGlobalSelfCommonOverrides,
      selfCommonOverrides
    );
    const mergedSelf = merge(
      // {}, executed every time, no need for empty obj
      (self || vdGlobalSelf || globalSelf || defaultTheme.self)?.(mergedCommon) as T,
      builtinOverrides,
      globalSelfOverrides,
      vdGlobalSelfOverrides,
      selfOverrides,
    );
    return {
      common: mergedCommon,
      self: mergedSelf,
      peers: merge({}, defaultTheme.peers, vdGlobalPeers, globalPeers, peers),
      peerOverrides: merge(
        {},
        builtinOverrides.peers,
        globalPeersOverrides,
        vdGlobalPeersOverrides,
        peersOverrides
      ),
    };
  });
  return mergedThemeRef;
}

useVdTheme.props = {
  theme: Object,
  themeOverrides: Object,
  builtinThemeOverrides: Object,
} as const;

/**
 * props.theme (Theme):
 * {
 *   common: CommonThemeVars,
 *   self(): ThemeVars,
 *   peers: { Component: Theme }
 * }
 * provider.theme:
 * {
 *   common: CommonThemeVars,
 *   Button: Theme
 *   ...
 * }
 * defaultTheme:
 * {
 *   common: CommonThemeVars,
 *   self(): ThemeVars,
 *   peers: { Component: Theme }
 * }
 *
 * props.themeOverrides (ThemeOverrides):
 * {
 *   common: CommonThemeVars,
 *   peers: { Component: ThemeOverrides },
 *   ...ThemeVars
 * }
 * provider.themeOverrides:
 * {
 *   common: CommonThemeVars,
 *   Component: ThemeOverrides
 *   ...
 * }
 *
 * mergedTheme:
 * {
 *   common: CommonThemeVars,
 *   self: ThemeVars,
 *   peers: { Component: Theme },
 *   overrides: { Component: ThemeOverrides }
 * }
 */
export default useVdTheme;
