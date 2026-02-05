import { j as jsxRuntimeExports, M as MediaImage, L as Link } from './ssr.mjs';
import { B as BackgroundMedia } from './BackgroundMedia-CXrjutuS.mjs';
import 'node:async_hooks';
import 'node:stream';
import 'node:stream/web';

const services = [
  { label: "\u0410\u043A\u0442\u0438\u0432\u043D\u0438\u0439 \u0432\u0456\u0434\u043F\u043E\u0447\u0438\u043D\u043E\u043A \u0434\u043B\u044F \u0441\u0435\u0431\u0435.", href: "#service-1" },
  { label: "\u0422\u0456\u043C\u0431\u0456\u043B\u0434\u0438\u043D\u0433 \u0434\u043B\u044F \u0431\u0456\u0437\u043D\u0435\u0441\u0443", href: "#service-1" },
  { label: "\u0425\u0430\u0442\u0438\u043D\u043A\u0430 \u043F\u0456\u0434 \u0441\u043E\u0441\u043D\u0430\u043C\u0438", href: "#service-2" },
  { label: "\u0411\u0435\u0437\u0431\u0430\u0440'\u0454\u0440\u043D\u0438\u0439 \u0421\u041F\u0410", href: "#service-3" },
  { label: "\u041F\u043E\u0434\u0456\u0457 \u043F\u0456\u0434 \u043A\u043B\u044E\u0447", href: "#service-4" },
  { label: "\u0413\u0440\u0443\u043F\u043E\u0432\u0430 \u043F\u0440\u043E\u0433\u0440\u0430\u043C\u0430 \xAB\u0428\u043B\u044F\u0445 \u0441\u0438\u043B\u0438\xBB", href: "#service-5" }
];
const navigation = [
  { label: "\u041C\u0438", href: "#about" },
  { label: "\u041F\u043E\u0441\u043B\u0443\u0433\u0438", href: "#services" },
  { label: "\u0421\u043E\u0446\u0456\u0430\u043B\u044C\u043D\u0430 \u0440\u043E\u043B\u044C", href: "#social" },
  { label: "\u0417\u0440\u043E\u0431\u0438 \u0432\u043D\u0435\u0441\u043E\u043A", href: "#contribute" },
  { label: "\u042F\u043A \u0434\u043E\u0457\u0445\u0430\u0442\u0438", href: "#location" }
];
function FooterSection() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative bg-[#0b0b0b] text-white", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      BackgroundMedia,
      {
        src: "/images/hero/hero.png",
        className: "absolute inset-0 bg-cover bg-center bg-no-repeat"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-16 pt-12 sm:pt-14 md:pt-16 lg:pt-20 pb-6 sm:pb-7 md:pb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MediaImage, { src: "/images/header/logo.svg", alt: "Logo", width: 200, height: 60, className: "object-contain w-[150px] sm:w-[175px] md:w-[200px]" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 flex items-center gap-2 text-[#c7d0c8]" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-montserrat text-[14px] sm:text-[15px] md:text-[16px] font-semibold tracking-[0.15em] sm:tracking-[0.2em] uppercase mb-3 sm:mb-4", children: "\u041A\u043E\u043D\u0442\u0430\u043A\u0442\u0438" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 sm:space-y-3 text-[14px] sm:text-[15px] md:text-[16px] leading-[1.3] tracking-[0.03em] text-[#f5f5f5]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "tel:+380673708336", className: "hover-bold-no-shift font-montserrat text-[#f5f5f5] transition-colors block break-all", "data-text": "+38 (067) 370 83 36", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "+38 (067) 370 83 36" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "tel:+380979551192", className: "hover-bold-no-shift font-montserrat text-[#f5f5f5] transition-colors block break-all", "data-text": "+38 (097) 955 11 92", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "+38 (097) 955 11 92" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "mailto:spravzhni@gmail.com", className: "hover-bold-no-shift font-montserrat text-[#f5f5f5] transition-colors block break-all", "data-text": "spravzhni@gmail.com", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "spravzhni@gmail.com" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-montserrat text-[#f5f5f5]", children: "\u0429\u043E\u0434\u0435\u043D\u043D\u043E \u0437 10:00 \u0434\u043E 19:00" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[#c7d0c8] transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-4 h-4 sm:w-5 sm:h-5 relative flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MediaImage, { src: "/images/footer/location.svg", alt: "Location", fill: true, className: "object-contain" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hover-bold-no-shift font-montserrat font-semibold underline underline-offset-2 text-[12px] sm:text-[13px] whitespace-nowrap text-[#c7d0c8] transition-colors", "data-text": "\u041B\u044C\u0432\u0456\u0432\u0441\u044C\u043A\u0430 \u043E\u0431\u043B\u0430\u0441\u0442\u044C, \u0441. \u0414\u0443\u0431\u0440\u043E\u0432\u0430", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "\u041B\u044C\u0432\u0456\u0432\u0441\u044C\u043A\u0430 \u043E\u0431\u043B\u0430\u0441\u0442\u044C, \u0441. \u0414\u0443\u0431\u0440\u043E\u0432\u0430" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[#cbd1ca]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-4 h-4 sm:w-5 sm:h-5 relative flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MediaImage, { src: "/images/footer/chatf.svg", alt: "Chat", fill: true, className: "object-contain" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hover-bold-no-shift font-montserrat text-sm sm:text-base underline text-[#cbd1ca] transition-colors", "data-text": "\u041D\u0430\u043F\u0438\u0441\u0430\u0442\u0438 \u0432 \u0447\u0430\u0442", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "\u041D\u0430\u043F\u0438\u0441\u0430\u0442\u0438 \u0432 \u0447\u0430\u0442" }) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-montserrat text-[14px] sm:text-[15px] md:text-[16px] font-semibold tracking-[0.15em] sm:tracking-[0.2em] uppercase mb-3 sm:mb-4", children: "\u041F\u043E\u0441\u043B\u0443\u0433\u0438" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1.5 sm:space-y-2 text-[14px] sm:text-[15px] md:text-[16px] leading-[1.3] tracking-[0.03em] text-[#f5f5f5]", children: services.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: item.href, className: "hover-bold-no-shift font-montserrat text-[#f5f5f5] transition-colors", "data-text": item.label, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: item.label }) }) }, item.href)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-montserrat text-[14px] sm:text-[15px] md:text-[16px] font-semibold tracking-[0.15em] sm:tracking-[0.2em] uppercase mb-3 sm:mb-4 whitespace-nowrap", children: "\u041F\u0435\u0440\u0435\u0439\u0442\u0438 \u043D\u0430 \u0441\u0442\u043E\u0440\u0456\u043D\u043A\u0443" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1.5 sm:space-y-2 text-[14px] sm:text-[15px] md:text-[16px] leading-[1.3] tracking-[0.05em] text-[#f5f5f5]", children: navigation.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: item.href, className: "hover-bold-no-shift font-montserrat text-[#f5f5f5] transition-colors", "data-text": item.label, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: item.label }) }) }, item.href)) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative w-full pt-4 sm:pt-5 pb-3 sm:pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-montserrat text-left text-[13px] sm:text-[14px] text-[#cbd1ca] underline mb-2 sm:mb-3 leading-[1.3] font-medium", children: "\u041F\u0456\u0434\u0442\u0440\u0438\u043C\u0430\u0442\u0438 \u043F\u0440\u043E\u0433\u0440\u0430\u043C\u0443 \u0432\u0456\u0434\u043D\u043E\u0432\u043B\u0435\u043D\u043D\u044F," }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 sm:gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-4 h-4 sm:w-5 sm:h-5 relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MediaImage, { src: "/images/footer/instw.svg", alt: "Instagram", fill: true, className: "object-contain" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-4 h-4 sm:w-5 sm:h-5 relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MediaImage, { src: "/images/footer/fbw.svg", alt: "Facebook", fill: true, className: "object-contain" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-montserrat text-[13px] sm:text-[14px] text-[#cbd1ca] leading-[1.3] font-medium", children: "\u041F\u0456\u0434\u043F\u0438\u0441\u0430\u0442\u0438\u0441\u044C." })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative w-full pt-4 sm:pt-5 pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-montserrat text-center text-[12px] sm:text-[13px] md:text-[14px] text-[#cbd1ca] leading-[1.3]", children: "\xA9 2025 \u0421\u043F\u0440\u0430\u0432\u0436\u043D\u0456. \u0423\u0441\u0456 \u043F\u0440\u0430\u0432\u0430 \u0437\u0430\u0445\u0438\u0449\u0435\u043D\u0456." }) }) })
  ] });
}

export { FooterSection as default };
//# sourceMappingURL=FooterSection-CAQQG1b5.mjs.map
