import { defineComponent, computed, PropType, CSSProperties } from "vue";
import { getPadding } from "seemly";
import {
  ExtractPublicPropTypes,
  createKey,
  resolveWrappedSlot,
} from "naive-ui/es/_utils";
import { useVdConfig, useVdTheme } from "@/components/_mixins";
import type { VdThemeProps } from "@/components/_mixins";
import { cardLight } from "../styles";
import type { CardTheme } from "../styles";
import style from "./styles/index.cssr";

export const cardBaseProps = {
  title: String,
  contentStyle: [Object, String] as PropType<CSSProperties | string>,
  headerStyle: [Object, String] as PropType<CSSProperties | string>,
  headerExtraStyle: [Object, String] as PropType<CSSProperties | string>,
  footerStyle: [Object, String] as PropType<CSSProperties | string>,
  size: {
    type: String as PropType<"small" | "medium" | "large" | "huge">,
    default: "medium",
  },
  bordered: {
    type: Boolean,
    default: true as boolean,
  },
  hoverable: Boolean,
  role: String,
  tag: {
    type: String as PropType<keyof HTMLElementTagNameMap>,
    default: "div",
  },
} as const;

export const cardProps = {
  ...(useVdTheme.props as VdThemeProps<CardTheme>),
  ...cardBaseProps,
};

export type CardProps = ExtractPublicPropTypes<typeof cardProps>;

export default defineComponent({
  name: "Card",
  props: cardProps,
  setup(props) {
    const { mergedClsPrefixRef } = useVdConfig(props);
    const themeRef = useVdTheme(
      "Card",
      "-card",
      style,
      cardLight,
      props,
      mergedClsPrefixRef
    );
    const cssVarsRef = computed(() => {
      const { size } = props;
      const {
        self: {
          color,
          colorTarget,
          textColor,
          titleTextColor,
          titleFontWeight,
          borderColor,
          actionColor,
          borderRadius,
          lineHeight,
          closeBorderRadius,
          boxShadow,
          [createKey("padding", size)]: padding,
          [createKey("fontSize", size)]: fontSize,
          [createKey("titleFontSize", size)]: titleFontSize,
        },
        common: { cubicBezierEaseInOut },
      } = themeRef.value;
      const {
        top: paddingTop,
        left: paddingLeft,
        bottom: paddingBottom,
      } = getPadding(padding);
      return {
        "--vd-bezier": cubicBezierEaseInOut,
        "--vd-border-radius": borderRadius,
        "--vd-color": color,
        "--vd-color-target": colorTarget,
        "--vd-text-color": textColor,
        "--vd-line-height": lineHeight,
        "--vd-action-color": actionColor,
        "--vd-title-text-color": titleTextColor,
        "--vd-title-font-weight": titleFontWeight,
        "--vd-border-color": borderColor,
        "--vd-box-shadow": boxShadow,
        // size
        "--vd-padding-top": paddingTop,
        "--vd-padding-bottom": paddingBottom,
        "--vd-padding-left": paddingLeft,
        "--vd-font-size": fontSize,
        "--vd-title-font-size": titleFontSize,
        "--vd-close-border-radius": closeBorderRadius,
      };
    });
    return {
      mergedClsPrefix: mergedClsPrefixRef,
      mergedTheme: themeRef,
      cssVars: cssVarsRef,
    };
  },
  render() {
    const {
      bordered,
      hoverable,
      mergedClsPrefix,
      tag: Component,
      $slots,
    } = this;
    return (
      <Component
        class={[
          `${mergedClsPrefix}-card`,
          {
            [`${mergedClsPrefix}-card--bordered`]: bordered,
            [`${mergedClsPrefix}-card--hoverable`]: hoverable,
          },
        ]}
        style={this.cssVars as CSSProperties}
        role={this.role}
      >
        {resolveWrappedSlot($slots.header, (children) => {
          return children || this.title ? (
            <div
              class={`${mergedClsPrefix}-card-header`}
              style={this.headerStyle}
            >
              <div
                class={`${mergedClsPrefix}-card-header__main`}
                role="heading"
              >
                {children || this.title}
              </div>
              {resolveWrappedSlot(
                $slots["header-extra"],
                (children) =>
                  children && (
                    <div
                      class={`${mergedClsPrefix}-card-header__extra`}
                      style={this.headerExtraStyle}
                    >
                      {children}
                    </div>
                  )
              )}
            </div>
          ) : null;
        })}
        {resolveWrappedSlot(
          $slots.default,
          (children) =>
            children && (
              <div
                class={`${mergedClsPrefix}-card__content`}
                style={this.contentStyle}
                role="none"
              >
                {children}
              </div>
            )
        )}
        {resolveWrappedSlot(
          $slots.footer,
          (children) =>
            children && [
              <div
                class={`${mergedClsPrefix}-card__footer`}
                style={this.footerStyle}
                role="none"
              >
                {children}
              </div>,
            ]
        )}
        {resolveWrappedSlot(
          $slots.action,
          (children) =>
            children && (
              <div class={`${mergedClsPrefix}-card__action`} role="none">
                {children}
              </div>
            )
        )}
      </Component>
    );
  },
});
