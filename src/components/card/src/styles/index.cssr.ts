import {
  c,
  cB,
  cE,
  cM,
} from "@/components/_utils/cssr";

// vars:
// --vd-bezier
// --vd-border-radius
// --vd-color
// --vd-color-popover
// --vd-text-color
// --vd-line-height
// --vd-padding-top
// --vd-padding-bottom
// --vd-padding-left
// --vd-font-size
// --vd-action-color
// --vd-title-font-weight
// --vd-title-font-size
// --vd-title-text-color
// --vd-border-color
// --vd-box-shadow
export default c([
  cB(
    "card",
    `
    font-size: var(--vd-font-size);
    line-height: var(--vd-line-height);
    display: flex;
    flex-direction: column;
    width: 100%;
    box-sizing: border-box;
    position: relative;
    border-radius: var(--vd-border-radius);
    background-color: var(--vd-color);
    color: var(--vd-text-color);
    word-break: break-word;
    transition: 
      color .3s var(--vd-bezier),
      background-color .3s var(--vd-bezier),
      box-shadow .3s var(--vd-bezier),
      border-color .3s var(--vd-bezier);
  `,
    [
      cM("hoverable", [c("&:hover", "box-shadow: var(--vd-box-shadow);")]),
      c(">", [
        cB(
          "card-header",
          `
        box-sizing: border-box;
        display: flex;
        align-items: center;
        font-size: var(--vd-title-font-size);
        padding:
          var(--vd-padding-top)
          var(--vd-padding-left)
          var(--vd-padding-bottom)
          var(--vd-padding-left);
      `,
          [
            cE(
              "main",
              `
          font-weight: var(--vd-title-font-weight);
          transition: color .3s var(--vd-bezier);
          flex: 1;
          min-width: 0;
          color: var(--vd-title-text-color);
        `
            ),
            cE(
              "extra",
              `
          display: flex;
          align-items: center;
          font-size: var(--vd-font-size);
          font-weight: 400;
          transition: color .3s var(--vd-bezier);
          color: var(--vd-text-color);
        `
            ),
          ]
        ),
        cE(
          "action",
          `
        box-sizing: border-box;
        transition:
          background-color .3s var(--vd-bezier),
          border-color .3s var(--vd-bezier);
        background-clip: padding-box;
        background-color: var(--vd-action-color);
      `
        ),
        cE("content", "flex: 1; min-width: 0;"),
        cE(
          "content, footer",
          `
        box-sizing: border-box;
        padding: 0 var(--vd-padding-left) var(--vd-padding-bottom) var(--vd-padding-left);
        font-size: var(--vd-font-size);
      `,
          [
            c("&:first-child", {
              paddingTop: "var(--vd-padding-bottom)",
            }),
          ]
        ),
        cE(
          "action",
          `
        background-color: var(--vd-action-color);
        padding: var(--vd-padding-bottom) var(--vd-padding-left);
        border-bottom-left-radius: var(--vd-border-radius);
        border-bottom-right-radius: var(--vd-border-radius);
      `
        ),
      ]),
      cM(
        "bordered",
        `
      border: 1px solid var(--vd-border-color);
    `,
        [c("&:target", "border-color: var(--vd-color-target);")]
      ),
    ]
  ),
]);
