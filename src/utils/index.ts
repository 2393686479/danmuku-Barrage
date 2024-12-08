import DanMu from "../views/components/DanMu.vue";
function getTextWidth(content: string, fontSize: string): number {
  const _span = document.createElement("span");
  _span.innerText = content;
  _span.style.fontSize = fontSize;
  _span.style.fontWeight = "bold";
  _span.style.position = "absolute";
  document.body.appendChild(_span);
  let width = _span.offsetWidth;
  document.body.removeChild(_span);
  console.log("zzz", width);
  return width;
}

function getTranslateXValue(targetElement: Element): number | undefined {
  const computedStyle = window.getComputedStyle(targetElement);
  const transformValue = computedStyle.transform;
  // 使用正则表达式匹配translateX的值部分（包含单位px）
  const parts = transformValue.match(/matrix\(([\d.,\s-]+)\)/); // 提取括号内的数值部分
  if (parts && parts.length > 1) {
    const values = parts[1].split(",").map(parseFloat); // 将数值部分分割并转换为数字数组
    const translateXValue = values[4]; // 按照matrix的规范，第5个值（索引为4）就是translateX的值
    console.log("translateX的值为:", translateXValue);
    return translateXValue;
  }
}

export { getTextWidth, getTranslateXValue };
