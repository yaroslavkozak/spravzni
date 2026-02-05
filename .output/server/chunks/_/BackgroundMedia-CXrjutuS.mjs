import { j as jsxRuntimeExports } from './ssr.mjs';

function BackgroundMedia({
  src,
  className = "",
  children
}) {
  const cleanSrc = src.startsWith("url(") ? src.replace(/^url\(['"]?/, "").replace(/['"]?\)$/, "") : src;
  const backgroundImage = `url(${cleanSrc})`;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className,
      style: { backgroundImage },
      children
    }
  );
}

export { BackgroundMedia as B };
//# sourceMappingURL=BackgroundMedia-CXrjutuS.mjs.map
