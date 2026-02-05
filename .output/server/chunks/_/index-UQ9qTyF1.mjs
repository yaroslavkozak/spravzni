import { j as jsxRuntimeExports, r as reactExports, u as useContactPopup, I as Image, L as Link, M as MediaImage, a as useI18n } from './ssr.mjs';
import 'node:async_hooks';
import 'node:stream';
import 'node:stream/web';

function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center font-montserrat text-white text-[16px] font-medium leading-[1.5em] tracking-[0.5%]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => setLanguage("uk"),
        className: `transition-opacity duration-200 hover:opacity-80 ${language === "uk" ? "opacity-100" : "opacity-70"}`,
        "aria-label": "Switch to Ukrainian",
        children: "\u0423\u041A\u0420"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mx-1 opacity-70", children: "/" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => setLanguage("en"),
        className: `transition-opacity duration-200 hover:opacity-80 ${language === "en" ? "opacity-100" : "opacity-70"}`,
        "aria-label": "Switch to English",
        children: "EN"
      }
    )
  ] });
}
function Header() {
  const [isMenuOpen, setIsMenuOpen] = reactExports.useState(false);
  const [isScrolled, setIsScrolled] = reactExports.useState(false);
  const { openPopup } = useContactPopup();
  reactExports.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "absolute top-0 left-0 right-0 z-50", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white/90 backdrop-blur-md py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-[1440px] mx-auto px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-[16px] font-extrabold leading-[1.5em] tracking-[0.5%] text-[#28694D]", children: "\u0412\u0456\u0434\u043A\u0440\u0438\u0432\u0430\u0454\u043C\u043E\u0441\u044C \u0443 2026" }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `backdrop-blur-[2px] transition-all duration-300 ${isScrolled ? "h-[80px]" : "h-[104px]"}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1440px] mx-auto px-10 flex items-center justify-between h-full relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex flex-col items-center justify-center transition-all duration-300 ${isScrolled ? "w-[140px] h-[60px]" : "w-[172px] h-[76px]"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-full flex items-center justify-center transition-all duration-300 ${isScrolled ? "h-[40px]" : "h-[51px]"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Image,
          {
            src: "/images/header/logo.svg",
            alt: "Logo",
            width: isScrolled ? 140 : 172,
            height: isScrolled ? 40 : 51,
            className: "object-contain transition-all duration-300",
            unoptimized: true,
            priority: true
          }
        ) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "hidden lg:flex items-center gap-10 pl-[74px] flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 flex-shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "tel:", className: "cursor-pointer transition-all", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "svg",
              {
                className: "w-6 h-6 text-white icon-stroke-hover",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" })
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#location", className: "cursor-pointer transition-all", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "svg",
              {
                className: "w-6 h-6 text-white icon-stroke-hover",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15 11a3 3 0 11-6 0 3 3 0 016 0z" })
                ]
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3 flex-1 min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "#about", className: "hover-bold-no-shift font-montserrat text-white text-[16px] font-medium leading-[1.5em] tracking-[0.5%] whitespace-nowrap", "data-text": "\u041C\u0438", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "\u041C\u0438" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "#services", className: "hover-bold-no-shift font-montserrat text-white text-[16px] font-medium leading-[1.5em] tracking-[0.5%] whitespace-nowrap", "data-text": "\u041F\u043E\u0441\u043B\u0443\u0433\u0438", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "\u041F\u043E\u0441\u043B\u0443\u0433\u0438" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "#social", className: "hover-bold-no-shift font-montserrat text-white text-[16px] font-medium leading-[1.5em] tracking-[0.5%] whitespace-nowrap", "data-text": "\u0421\u043E\u0446\u0456\u0430\u043B\u044C\u043D\u0430 \u0440\u043E\u043B\u044C", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "\u0421\u043E\u0446\u0456\u0430\u043B\u044C\u043D\u0430 \u0440\u043E\u043B\u044C" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "#contribute", className: "hover-bold-no-shift font-montserrat text-white text-[16px] font-medium leading-[1.5em] tracking-[0.5%] whitespace-nowrap", "data-text": "\u0417\u0440\u043E\u0431\u0438 \u0432\u043D\u0435\u0441\u043E\u043A", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "\u0417\u0440\u043E\u0431\u0438 \u0432\u043D\u0435\u0441\u043E\u043A" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "#location", className: "hover-bold-no-shift font-montserrat text-white text-[16px] font-medium leading-[1.5em] tracking-[0.5%] whitespace-nowrap", "data-text": "\u042F\u043A \u0434\u043E\u0457\u0445\u0430\u0442\u0438", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "\u042F\u043A \u0434\u043E\u0457\u0445\u0430\u0442\u0438" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden lg:flex items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LanguageSwitcher, {}) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: openPopup,
            className: `hidden lg:flex bg-[#28694D] rounded-[32px] px-16 items-center justify-center transition-all duration-300 whitespace-nowrap ${isScrolled ? "h-10" : "h-12"}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `hover-bold-no-shift font-montserrat text-white font-normal leading-[1.5em] tracking-[0.5%] transition-all duration-300 ${isScrolled ? "text-[18px]" : "text-[20px]"}`, "data-text": "\u041A\u043E\u043B\u0438 \u0441\u0442\u0430\u0440\u0442?", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "\u041A\u043E\u043B\u0438 \u0441\u0442\u0430\u0440\u0442?" }) })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "lg:hidden text-white ml-4",
            onClick: () => setIsMenuOpen(!isMenuOpen),
            "aria-label": "Toggle menu",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 6h16M4 12h16M4 18h16" }) })
          }
        )
      ] }),
      isMenuOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:hidden absolute top-full left-0 right-0 bg-black/90 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "flex flex-col gap-4 p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "#about", className: "hover-bold-no-shift font-montserrat text-white text-[16px] font-medium", "data-text": "\u041C\u0438", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "\u041C\u0438" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "#services", className: "hover-bold-no-shift font-montserrat text-white text-[16px] font-medium", "data-text": "\u041F\u043E\u0441\u043B\u0443\u0433\u0438", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "\u041F\u043E\u0441\u043B\u0443\u0433\u0438" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "#social", className: "hover-bold-no-shift font-montserrat text-white text-[16px] font-medium", "data-text": "\u0421\u043E\u0446\u0456\u0430\u043B\u044C\u043D\u0430 \u0440\u043E\u043B\u044C", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "\u0421\u043E\u0446\u0456\u0430\u043B\u044C\u043D\u0430 \u0440\u043E\u043B\u044C" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "#contribute", className: "hover-bold-no-shift font-montserrat text-white text-[16px] font-medium", "data-text": "\u0417\u0440\u043E\u0431\u0438 \u0432\u043D\u0435\u0441\u043E\u043A", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "\u0417\u0440\u043E\u0431\u0438 \u0432\u043D\u0435\u0441\u043E\u043A" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "#location", className: "hover-bold-no-shift font-montserrat text-white text-[16px] font-medium", "data-text": "\u042F\u043A \u0434\u043E\u0457\u0445\u0430\u0442\u0438", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "\u042F\u043A \u0434\u043E\u0457\u0445\u0430\u0442\u0438" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-start pt-2 pb-2 border-t border-white/20 mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LanguageSwitcher, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: openPopup,
            className: "hover-bold-no-shift font-montserrat bg-[#28694D] rounded-[32px] px-8 py-3 text-white text-[16px] font-normal mt-2",
            "data-text": "\u041A\u043E\u043B\u0438 \u0441\u0442\u0430\u0440\u0442?",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "\u041A\u043E\u043B\u0438 \u0441\u0442\u0430\u0440\u0442?" })
          }
        )
      ] }) })
    ] })
  ] });
}
function Hero() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative min-h-screen flex flex-col items-center justify-center overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "absolute inset-0 bg-cover bg-center bg-no-repeat",
        style: {
          backgroundImage: "url(/images/hero/hero.png)"
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 w-full max-w-[1440px] mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2 pt-[120px] sm:pt-[140px] md:pt-[156px] mb-[60px] sm:mb-[80px] md:mb-[100px] lg:mb-[120px] max-w-[660px] mx-auto px-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-alternates text-white text-[32px] xs:text-[40px] sm:text-[48px] md:text-[64px] lg:text-[82px] font-bold leading-[1.1em] tracking-[-2%] text-center drop-shadow-[0_0_25px_rgba(0,0,0,0.25)] md:whitespace-nowrap", children: "\u0412\u0434\u0438\u0445\u043D\u0438 \u0442\u0438\u0448\u0443" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-alternates text-white text-[32px] xs:text-[40px] sm:text-[48px] md:text-[64px] lg:text-[82px] font-light leading-[1.1em] tracking-[-2%] text-center drop-shadow-[0_0_16px_rgba(0,0,0,0.4)] md:whitespace-nowrap", children: "\u0412\u0438\u0434\u0438\u0445\u043D\u0438 \u0432\u0456\u0439\u043D\u0443" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-[60px] sm:gap-[80px] md:gap-[100px] lg:gap-[120px] max-w-[735px] mx-auto px-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3 sm:gap-4 w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] font-semibold leading-[1.3em] tracking-[1.5%] text-center drop-shadow-[0_0_20px_rgba(0,0,0,1)]", children: "\u0426\u0435\u043D\u0442\u0440 \u0434\u043B\u044F \u043F\u043E\u0434\u0456\u0439 \u0456 \u0432\u0456\u0434\u043F\u043E\u0447\u0438\u043D\u043A\u0443 \u0437\u0430 35 \u043A\u043C \u0432\u0456\u0434 \u041B\u044C\u0432\u043E\u0432\u0430" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 whitespace-nowrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-normal leading-[1.5em] tracking-[0.5%] text-center", children: "80% \u043F\u0440\u0438\u0431\u0443\u0442\u043A\u0443 \u2014 \u043D\u0430 \u0432\u0456\u0434\u043D\u043E\u0432\u043B\u0435\u043D\u043D\u044F \u0442\u0430 \u0440\u0435\u0456\u043D\u0442\u0435\u0433\u0440\u0430\u0446\u0456\u044E \u0432\u0435\u0442\u0435\u0440\u0430\u043D\u0456\u0432." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "text-white text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-normal leading-[1.5em] tracking-[0.5%] underline hover:opacity-80 transition-opacity", children: "\u0417\u0432\u0456\u0442" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => {
              if (typeof document !== "undefined") {
                const servicesSection = document.getElementById("services");
                if (servicesSection) {
                  servicesSection.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }
            },
            className: "bg-[#28694D] rounded-[32px] px-6 sm:px-8 md:px-12 lg:px-16 py-2 h-11 sm:h-12 flex items-center justify-center transition-all duration-300",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `hover-bold-no-shift font-montserrat text-white text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] font-normal leading-[1.3em] tracking-[1.5%] transition-all duration-300`, "data-text": "\u041F\u043E\u0441\u043B\u0443\u0433\u0438", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "\u041F\u043E\u0441\u043B\u0443\u0433\u0438" }) })
          }
        )
      ] })
    ] })
  ] });
}
function ImagineSection() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-[#FBFBF9] py-12 sm:py-16 md:py-20 min-h-[60vh] sm:min-h-[70vh] flex flex-col justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1440px] mx-auto w-full px-4 sm:px-6 md:px-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pl-0 md:pl-[200px] lg:pl-[390px] pr-4 md:pr-8 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-alternates text-[#111111] text-[28px] sm:text-[36px] md:text-[48px] lg:text-[64px] font-bold leading-[1.1em] tracking-[-2%]", children: "\u0423\u044F\u0432\u0438." }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pl-0 md:pl-[200px] lg:pl-[390px] pr-4 md:pr-[107px] py-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-alternates text-black text-[28px] sm:text-[36px] md:text-[48px] lg:text-[64px] font-normal leading-[1.1em] tracking-[-2%]", children: "\u0422\u0438 \u0432 \u043C\u0456\u0441\u0446\u0456, \u043A\u043E\u0442\u0440\u0435" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pl-0 md:pl-[200px] lg:pl-[390px] pr-4 md:pr-[107px] py-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-alternates text-black text-[28px] sm:text-[36px] md:text-[48px] lg:text-[64px] font-normal leading-[1.1em] tracking-[-2%]", children: "\u0441\u043F\u043E\u0432\u0456\u043B\u044C\u043D\u044E\u0454 \u0434\u0438\u0445\u0430\u043D\u043D\u044F" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 sm:gap-5 md:gap-6 pr-0 md:pr-[280px] lg:pr-[400px] pl-0 md:pl-auto ml-0 md:ml-auto items-start md:items-end mt-6 md:mt-0 py-8 sm:py-10 md:py-12 lg:py-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col justify-end gap-8 sm:gap-12 md:gap-16 w-full md:w-[350px] lg:w-[392px]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-sans text-[#404040] text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] font-light leading-[1.3em] tracking-[1.5%] text-left", children: [
        "\u041F\u0440\u0438\u0440\u043E\u0434\u0430 \u0442\u0430\u043C \u0447\u0438\u0441\u0442\u0430 \u0456 \u0442\u0438\u0445\u0430.",
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        "\u041B\u0438\u0448\u0435\u043D\u044C \u043B\u0438\u0441\u0442\u044F \u043C\u2019\u044F\u043A\u043E \u043F\u043E\u0448\u0456\u043F\u0442\u0443\u0454:"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col justify-end gap-8 sm:gap-12 md:gap-16 w-full md:w-[350px] lg:w-[392px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-sans text-[#404040] text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] font-light leading-[1.3em] tracking-[1.5%] text-left", children: "\u0417\u0443\u043F\u0438\u043D\u0438\u0441\u044C... \u0427\u0443\u0454\u0448?" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col justify-end gap-8 sm:gap-12 md:gap-16 w-full md:w-[350px] lg:w-[392px]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-sans text-[#404040] text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] font-light leading-[1.3em] tracking-[1.5%] text-left", children: [
        "\u0426\u0435 \u0436 \u0442\u0438. \u0421\u043F\u0440\u0430\u0432\u0436\u043D\u044F.",
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        "\u0426\u0435 \u0436 \u0442\u0438. \u0421\u043F\u0440\u0430\u0432\u0436\u043D\u0456\u0439."
      ] }) })
    ] })
  ] }) });
}
const R2_PUBLIC_DOMAIN = "https://pub-76140dda4e8944f0a04e7b8026066f34.r2.dev";
function getR2Url(r2Key) {
  return `${R2_PUBLIC_DOMAIN}/${r2Key}`;
}
async function getMediaMetadata(mediaKey) {
  try {
    const response = await fetch(`/api/media/${encodeURIComponent(mediaKey)}`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data.media || null;
  } catch (error) {
    console.error(`Failed to fetch media metadata ${mediaKey}:`, error);
    return null;
  }
}
const MediaVideo = reactExports.forwardRef(({
  mediaKey,
  fallback,
  autoLoad = true,
  ...videoProps
}, ref) => {
  const [videoUrl, setVideoUrl] = reactExports.useState(null);
  const [error, setError] = reactExports.useState(false);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    if (!autoLoad) {
      setLoading(false);
      return;
    }
    let isMounted = true;
    async function loadMedia() {
      try {
        console.log(`[MediaVideo] Fetching media: ${mediaKey}`);
        const mediaData = await getMediaMetadata(mediaKey);
        if (!isMounted) return;
        if (!mediaData) {
          throw new Error(`Media not found: ${mediaKey}`);
        }
        console.log(`[MediaVideo] Media found:`, { key: mediaData.key, type: mediaData.type, r2_key: mediaData.r2_key });
        if (mediaData.type === "video") {
          if (mediaData.r2_key) {
            const r2Url = getR2Url(mediaData.r2_key);
            console.log(`[MediaVideo] Setting R2 URL: ${r2Url}`);
            if (isMounted) {
              setVideoUrl(r2Url);
            }
          } else {
            throw new Error(`No r2_key found for ${mediaKey}`);
          }
        } else {
          throw new Error(`Media ${mediaKey} is not a video (type: ${mediaData.type})`);
        }
      } catch (err) {
        console.error(`[MediaVideo] Failed to load video media ${mediaKey}:`, err);
        if (isMounted) {
          setError(true);
          setVideoUrl(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    loadMedia();
    return () => {
      isMounted = false;
    };
  }, [mediaKey, autoLoad]);
  reactExports.useEffect(() => {
    if (!videoUrl) return;
    const setupObserver = () => {
      if (!ref) return null;
      if (typeof ref === "function") return null;
      const videoElement = ref.current;
      if (!videoElement) return null;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              videoElement.muted = true;
              videoElement.play().catch((err) => {
                console.warn("[MediaVideo] Autoplay blocked:", err);
              });
            } else {
              videoElement.pause();
            }
          });
        },
        {
          threshold: 0.3
          // Play when 30% of video is visible
        }
      );
      observer.observe(videoElement);
      return () => {
        observer.disconnect();
      };
    };
    let cleanup = setupObserver();
    if (!cleanup) {
      const timeoutId = setTimeout(() => {
        cleanup = setupObserver();
      }, 100);
      return () => {
        clearTimeout(timeoutId);
        if (cleanup) cleanup();
      };
    }
    return cleanup;
  }, [videoUrl, ref]);
  if (loading || !videoUrl) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full bg-gray-900 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-white", children: loading ? "Loading video..." : "Video unavailable" }) });
  }
  if (!videoUrl.startsWith("https://")) {
    console.error(`[MediaVideo] Invalid video URL format: ${videoUrl}. Must be HTTPS R2 URL.`);
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full bg-gray-900 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-white text-sm", children: "Video unavailable" }) });
  }
  console.log(`[MediaVideo] Rendering video with R2 URL: ${videoUrl}`);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "video",
    {
      ref,
      src: videoUrl,
      ...videoProps
    }
  );
});
MediaVideo.displayName = "MediaVideo";
const partners = [
  { id: 1, src: "/images/brands/fond.svg", alt: "Fond", width: 200, height: 56 },
  { id: 2, src: "/images/brands/Group.svg", alt: "Group", width: 200, height: 56 },
  { id: 3, src: "/images/brands/habilitationcenter.svg", alt: "Habilitation Center", width: 200, height: 56 },
  { id: 4, src: "/images/brands/lvivskamiskarada.svg", alt: "Lvivska Miska Rada", width: 200, height: 56 },
  { id: 5, src: "/images/brands/manivci.svg", alt: "Manivci", width: 200, height: 56 },
  { id: 6, src: "/images/brands/par.svg", alt: "Partner", width: 200, height: 56 },
  { id: 7, src: "/images/brands/parr.svg", alt: "Partner", width: 200, height: 56 },
  { id: 8, src: "/images/brands/parrr.svg", alt: "Partner", width: 200, height: 56 },
  { id: 9, src: "/images/brands/parrrrr.svg", alt: "Partner", width: 200, height: 56 },
  { id: 10, src: "/images/brands/parrrrrrr.svg", alt: "Partner", width: 200, height: 56 }
];
function VideoPartnersSection() {
  const videoRef = reactExports.useRef(null);
  const [isPlaying, setIsPlaying] = reactExports.useState(false);
  const [isCenterHovered, setIsCenterHovered] = reactExports.useState(false);
  const [volume, setVolume] = reactExports.useState(1);
  const [showVolumeControl, setShowVolumeControl] = reactExports.useState(false);
  const duplicatedPartners = [...partners, ...partners];
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().catch(() => {
        });
      } else {
        videoRef.current.pause();
      }
    }
  };
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = newVolume === 0;
    }
  };
  const toggleMute = () => {
    if (videoRef.current) {
      if (volume > 0) {
        setVolume(0);
        videoRef.current.volume = 0;
        videoRef.current.muted = true;
      } else {
        setVolume(1);
        videoRef.current.volume = 1;
        videoRef.current.muted = false;
      }
    }
  };
  reactExports.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.loop = true;
    video.playsInline = true;
    video.volume = volume;
    video.muted = volume === 0;
  }, [volume]);
  reactExports.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    setIsPlaying(!video.paused);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    const handleLoadedMetadata = () => {
      setIsPlaying(!video.paused);
    };
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.play().catch(() => {
      setIsPlaying(false);
    });
    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "bg-[#FBFBF9] pb-12 sm:pb-16 md:pb-20 lg:pb-[120px] min-h-[50vh] sm:min-h-[70vh] md:min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "relative w-full h-[300px] sm:h-[400px] md:h-[550px] lg:h-[650px] xl:h-[784px] bg-gray-900 overflow-hidden",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            MediaVideo,
            {
              ref: videoRef,
              mediaKey: "videos.hero",
              className: "absolute inset-0 w-full h-full object-cover",
              playsInline: true,
              loop: true
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 z-10 pointer-events-auto",
              onMouseEnter: () => setIsCenterHovered(true),
              onMouseLeave: () => setIsCenterHovered(false)
            }
          ),
          isCenterHovered && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: togglePlayPause,
              className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-20 h-20 flex items-center justify-center transition-all pointer-events-auto",
              onMouseEnter: () => setIsCenterHovered(true),
              "aria-label": isPlaying ? "Pause video" : "Play video",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                MediaImage,
                {
                  src: isPlaying ? "/images/video/pause.svg" : "/images/video/play.svg",
                  alt: isPlaying ? "Pause" : "Play",
                  width: 56,
                  height: 56,
                  className: "object-contain"
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "absolute bottom-4 right-4 z-20 flex items-center gap-2",
              onMouseEnter: () => setShowVolumeControl(true),
              onMouseLeave: () => setShowVolumeControl(false),
              children: [
                showVolumeControl && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "range",
                      min: "0",
                      max: "1",
                      step: "0.01",
                      value: volume,
                      onChange: handleVolumeChange,
                      className: "w-20 md:w-24 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-white",
                      style: {
                        background: `linear-gradient(to right, white 0%, white ${volume * 100}%, rgba(255,255,255,0.3) ${volume * 100}%, rgba(255,255,255,0.3) 100%)`
                      }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white text-xs md:text-sm min-w-[2rem] text-center", children: [
                    Math.round(volume * 100),
                    "%"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: toggleMute,
                    className: "w-16 h-16 flex items-center justify-center transition-all",
                    "aria-label": volume > 0 ? "Mute" : "Unmute",
                    children: volume > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-8 h-8 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-8 h-8 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15zM17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" }) })
                  }
                )
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative overflow-hidden border-t border-[rgba(17,17,17,0.11)] w-full mt-8 sm:mt-12 md:mt-16 lg:mt-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end pr-4 sm:pr-8 md:pr-12 lg:pr-16 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-montserrat text-[#28694D] text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] font-bold leading-[1.3em] tracking-[1.5%] text-right", children: "\u0414\u044F\u043A\u0443\u0454\u043C\u043E, \u0449\u043E \u0437 \u043D\u0430\u043C\u0438!" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative overflow-hidden w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center py-3 sm:py-4 animate-scroll-left", children: duplicatedPartners.map((partner, index2) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "flex-shrink-0 flex items-center justify-center mr-8 sm:mr-12 md:mr-16 lg:mr-20",
          style: {
            width: `clamp(180px, ${partner.width * 0.9}px, ${partner.width}px)`,
            height: `clamp(50px, ${partner.height * 0.9}px, ${partner.height}px)`
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Image,
            {
              src: partner.src,
              alt: partner.alt,
              width: partner.width,
              height: partner.height,
              className: "object-contain w-full h-full",
              unoptimized: true
            }
          )
        },
        `${partner.id}-${index2}`
      )) }) })
    ] }) })
  ] });
}
const SliderSection = reactExports.lazy(() => import('./SliderSection-CONsQm4i.mjs'));
const AboutSection = reactExports.lazy(() => import('./AboutSection-AWS_Q2Rv.mjs'));
const SpaceSection = reactExports.lazy(() => import('./SpaceSection-BO7k6SLx.mjs'));
const TextOverImageSection = reactExports.lazy(() => import('./TextOverImageSection-B-VATJ6n.mjs'));
const ServicesSection = reactExports.lazy(() => import('./ServicesSection-jtsLoJmt.mjs'));
const PricingCTASection = reactExports.lazy(() => import('./PricingCTASection-m6zTHAII.mjs'));
const VideoSection = reactExports.lazy(() => import('./VideoSection-x0jHOyH9.mjs'));
const SupportCaptionSection = reactExports.lazy(() => import('./SupportCaptionSection-DB90XVs_.mjs'));
const StatsSection = reactExports.lazy(() => import('./StatsSection-1vtQ9frU.mjs'));
const ContributionSection = reactExports.lazy(() => import('./ContributionSection-Bjv8J_-I.mjs'));
const DirectionsSection = reactExports.lazy(() => import('./DirectionsSection-CS2OkjT7.mjs'));
const InstagramCarouselSection = reactExports.lazy(() => import('./InstagramCarouselSection-DUAntpOT.mjs'));
const FooterSection = reactExports.lazy(() => import('./FooterSection-CAQQG1b5.mjs'));
const LoadingFallback = () => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-pulse text-gray-400", children: "Loading..." }) });
function Home() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Hero, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ImagineSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(VideoPartnersSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingFallback, {}), children: /* @__PURE__ */ jsxRuntimeExports.jsx(SliderSection, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingFallback, {}), children: /* @__PURE__ */ jsxRuntimeExports.jsx(AboutSection, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingFallback, {}), children: /* @__PURE__ */ jsxRuntimeExports.jsx(SpaceSection, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingFallback, {}), children: /* @__PURE__ */ jsxRuntimeExports.jsx(TextOverImageSection, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingFallback, {}), children: /* @__PURE__ */ jsxRuntimeExports.jsx(ServicesSection, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingFallback, {}), children: /* @__PURE__ */ jsxRuntimeExports.jsx(PricingCTASection, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingFallback, {}), children: /* @__PURE__ */ jsxRuntimeExports.jsx(VideoSection, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingFallback, {}), children: /* @__PURE__ */ jsxRuntimeExports.jsx(SupportCaptionSection, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingFallback, {}), children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatsSection, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingFallback, {}), children: /* @__PURE__ */ jsxRuntimeExports.jsx(ContributionSection, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingFallback, {}), children: /* @__PURE__ */ jsxRuntimeExports.jsx(DirectionsSection, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingFallback, {}), children: /* @__PURE__ */ jsxRuntimeExports.jsx(InstagramCarouselSection, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingFallback, {}), children: /* @__PURE__ */ jsxRuntimeExports.jsx(FooterSection, {}) })
  ] });
}
const index = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  component: Home
}, Symbol.toStringTag, { value: "Module" }));

export { MediaVideo as M, index as i };
//# sourceMappingURL=index-UQ9qTyF1.mjs.map
