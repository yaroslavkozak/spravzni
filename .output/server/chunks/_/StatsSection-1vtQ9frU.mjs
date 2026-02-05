import { j as jsxRuntimeExports } from './ssr.mjs';
import 'node:async_hooks';
import 'node:stream';
import 'node:stream/web';

const cards = [
  {
    id: 1,
    body: "\u0426\u0435 \u2014 \u0442\u0440\u0435\u043D\u0443\u0432\u0430\u043D\u043D\u044F \u0437 \u0430\u0434\u0430\u043F\u0442\u0438\u0432\u043D\u043E\u0433\u043E \u043F\u043B\u0430\u0432\u0430\u043D\u043D\u044F \u0442\u0430 \u043F\u0440\u043E\u0433\u0440\u0430\u043C\u0430 \u0432\u0456\u0434\u043D\u043E\u0432\u043B\u0435\u043D\u043D\u044F \xAB\u0428\u043B\u044F\u0445 \u0441\u0438\u043B\u0438\xBB, \u044F\u043A\u0430 \u0432\u0456\u0434\u0431\u0443\u0432\u0430\u0442\u0438\u043C\u0435\u0442\u044C\u0441\u044F \u0443 \u043D\u0430\u0448\u043E\u043C\u0443 \u0446\u0435\u043D\u0442\u0440\u0456."
  },
  {
    id: 2,
    body: "80% \u043F\u0440\u0438\u0431\u0443\u0442\u043A\u0443 \u0446\u0435\u043D\u0442\u0440\u0443 \u0442\u0430\u043A\u043E\u0436 \u0439\u0442\u0438\u043C\u0435 \u043D\u0430 \u043F\u0440\u043E\u0435\u043A\u0442\u0438 \u0432\u0456\u0434\u043D\u043E\u0432\u043B\u0435\u043D\u043D\u044F \u0432\u0435\u0442\u0435\u0440\u0430\u043D\u0456\u0432 \u0442\u0430 \u0447\u043B\u0435\u043D\u0456\u0432 \u0457\u0445\u043D\u0456\u0445 \u0440\u043E\u0434\u0438\u043D."
  },
  {
    id: 3,
    body: "\u041C\u0438 \u043F\u0443\u0431\u043B\u0456\u043A\u0443\u0454\u043C\u043E \u043E\u043D\u043E\u0432\u043B\u0435\u043D\u0443 \u0441\u0443\u043C\u0443 \u0437\u0456\u0431\u0440\u0430\u043D\u0438\u0445 \u0442\u0430 \u0432\u0438\u0442\u0440\u0430\u0447\u0435\u043D\u0438\u0445 \u043A\u043E\u0448\u0442\u0456\u0432 \u043D\u0430\u043F\u0440\u0438\u043A\u0456\u043D\u0446\u0456 \u043A\u043E\u0436\u043D\u043E\u0433\u043E \u043C\u0456\u0441\u044F\u0446\u044F, \u043F\u0456\u0441\u043B\u044F \u0432\u0441\u0456\u0445 \u043F\u0456\u0434\u0440\u0430\u0445\u0443\u043D\u043A\u0456\u0432.",
    link: "\u0417\u0432\u0456\u0442"
  }
];
function StatsSection() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "social", className: "bg-[#FBFBF9] py-16 md:py-20 lg:py-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[#111111] text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] font-light tracking-[0.2em] sm:tracking-[0.3em] md:tracking-[0.35em] mb-4 sm:mb-5", children: "\xAB\u0421\u043F\u0440\u0430\u0432\u0436\u043D\u0456\xBB \u0432\u0436\u0435 \u0437\u0430\u043A\u0443\u043C\u0443\u043B\u044E\u0432\u0430\u043B\u0438" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[#111111] text-[60px] sm:text-[75px] md:text-[90px] lg:text-[110px] xl:text-[120px] font-light leading-[1] flex items-center justify-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex tracking-[0.02em]", children: "229 850" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 sm:ml-3 text-[60px] sm:text-[75px] md:text-[90px] lg:text-[110px] xl:text-[120px]", children: "\u20B4" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[#111111] text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] font-light tracking-[0.2em] sm:tracking-[0.3em] md:tracking-[0.35em] mt-3 sm:mt-4", children: "\u043D\u0430 \u0432\u0456\u0434\u043D\u043E\u0432\u043B\u0435\u043D\u043D\u044F \u0442\u0430 \u0440\u0435\u0456\u043D\u0442\u0435\u0433\u0440\u0430\u0446\u0456\u044E \u0432\u0435\u0442\u0435\u0440\u0430\u043D\u0456\u0432" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 sm:mt-10 md:mt-12 grid gap-4 sm:gap-5 md:gap-6 md:grid-cols-3", children: cards.map((card) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "bg-[#F5F6F3] border border-[#E9E9E6] p-6 sm:p-7 md:p-8 min-h-[180px] sm:min-h-[200px] md:min-h-[220px] lg:min-h-[240px] flex items-center",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[#111111] text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] xl:text-[18px] leading-[1.6] tracking-[0.45%] text-center max-w-[85%] mx-auto", children: [
          card.body,
          card.link && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "underline font-medium cursor-pointer", children: card.link })
          ] })
        ] })
      },
      card.id
    )) })
  ] }) });
}

export { StatsSection as default };
//# sourceMappingURL=StatsSection-1vtQ9frU.mjs.map
