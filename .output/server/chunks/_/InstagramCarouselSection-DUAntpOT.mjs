import { r as reactExports, j as jsxRuntimeExports, M as MediaImage } from './ssr.mjs';
import 'node:async_hooks';
import 'node:stream';
import 'node:stream/web';

const posts = [
  { id: 1, title: "\u0426\u0435 \u043C\u0438", meta: "\u0420\u0443\u0441\u043B\u0430\u043D \u0442\u0430 \u041D\u0430\u0442\u0430\u043B\u044F", image: "instagram.post1" },
  { id: 2, title: "\u041C\u0456\u0441\u0446\u0435 \u0441\u0438\u043B\u0438", meta: "\u0421\u0442\u0456\u043B\u044C\u0441\u044C\u043A\u0435 \u043C\u0456\u0441\u0442\u043E", image: "instagram.post2" },
  { id: 3, title: "\u041D\u0430\u0448\u0456 \u0434\u0456\u0442\u0438", meta: "\u043F\u0440\u043E \u0421\u043F\u0440\u0430\u0432\u0436\u043D\u0456", image: "instagram.post3" },
  { id: 4, title: "\u041F\u0440\u043E\u0433\u0443\u043B\u044F\u043D\u043A\u0430", meta: "\u043D\u0430 \u0431\u0435\u0440\u0435\u0437\u0456", image: "instagram.post4" },
  { id: 5, title: "\u0420\u043E\u0437\u043F\u043E\u0432\u0456\u0434\u044C", meta: "\u043F\u0440\u043E \u0448\u043B\u044F\u0445", image: "instagram.post5" }
];
function InstagramCarouselSection() {
  const scrollRef = reactExports.useRef(null);
  const handleScroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;
    const offset = direction === "left" ? -320 : 320;
    container.scrollBy({ left: offset, behavior: "smooth" });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "bg-[#FBFBF9] py-16 md:py-20 lg:py-24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-16 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[#165731] text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] font-normal font-montserrat mb-2 sm:mb-3 tracking-[-0.01em]", children: "\u0421\u043F\u0440\u0430\u0432\u0436\u043D\u0456 \u0432 \u0456\u043D\u0441\u0442\u0430\u0433\u0440\u0430\u043C" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[#111111] text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] font-normal font-montserrat leading-[1.7] tracking-[0.1em] mb-6 sm:mb-8", children: "\u041F\u043E\u043A\u0430\u0437\u0443\u0454\u043C\u043E \u0442\u0430 \u0440\u043E\u0437\u043F\u043E\u0432\u0456\u0434\u0430\u0454\u043C\u043E \u043F\u0440\u043E \u0441\u0432\u0456\u0439 \u0448\u043B\u044F\u0445 \u0449\u0438\u0440\u043E" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[#404040] text-[14px] sm:text-[15px] md:text-[17px] mb-8 sm:mb-10 flex items-center justify-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex w-6 h-6 sm:w-7 sm:h-7 relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MediaImage, { src: "/images/instagram/instb.svg", alt: "Instagram icon", fill: true, className: "object-contain" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold font-montserrat", children: "spravzhni.lviv" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => handleScroll("left"),
          className: "hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/80 border border-[#D1D1D1] rounded-full shadow-sm items-center justify-center text-xl text-[#111111]",
          "aria-label": "Scroll left",
          children: "\u2039"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          ref: scrollRef,
          className: "max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-16 flex gap-4 sm:gap-5 md:gap-6 overflow-x-auto scroll-smooth pb-4 scrollbar-hide",
          children: posts.map((post) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex-shrink-0 w-[240px] sm:w-[260px] md:w-[280px] lg:w-[300px] h-[320px] sm:h-[340px] md:h-[360px] overflow-hidden relative group",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  MediaImage,
                  {
                    src: `/images/instagram/inst${post.id}.jpg`,
                    alt: post.title,
                    fill: true,
                    className: "object-cover"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-[#165731] opacity-30 group-hover:opacity-0 transition-opacity duration-300" })
              ]
            },
            post.id
          ))
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => handleScroll("right"),
          className: "hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/80 border border-[#D1D1D1] rounded-full shadow-sm items-center justify-center text-xl text-[#111111]",
          "aria-label": "Scroll right",
          children: "\u203A"
        }
      )
    ] })
  ] });
}

export { InstagramCarouselSection as default };
//# sourceMappingURL=InstagramCarouselSection-DUAntpOT.mjs.map
