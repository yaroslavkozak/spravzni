import { r as reactExports, j as jsxRuntimeExports, I as Image } from './ssr.mjs';
import 'node:async_hooks';
import 'node:stream';
import 'node:stream/web';

const slides = [
  {
    id: 1,
    imageOnly: true,
    image: "gallery.image2"
  },
  {
    id: 2,
    imageOnly: false,
    image: "gallery.image3",
    text: {
      quote: "icons.lapki",
      heading: "\u041C\u0438 \u0432\u0456\u0440\u0438\u043C\u043E: \u0432\u0441\u0435 \u043F\u043E\u0447\u0438\u043D\u0430\u0454\u0442\u044C\u0441\u044F \u0437 \u0434\u043E\u0432\u0456\u0440\u0438.",
      body: "\u0414\u043E \u0441\u0435\u0431\u0435, \u0434\u043E \u0441\u0432\u0456\u0442\u0443, \u0434\u043E \u0442\u0438\u0445, \u043A\u043E\u0433\u043E \u0437\u0443\u0441\u0442\u0440\u0456\u0447\u0430\u0454\u0448 \u043D\u0430 \u0441\u0432\u043E\u0454\u043C\u0443 \u0448\u043B\u044F\u0445\u0443. \u0423 \u0446\u044C\u043E\u043C\u0443 \u0441\u0432\u0456\u0442\u0456 \u043B\u0435\u0433\u043A\u043E \u0437\u0430\u0433\u0443\u0431\u0438\u0442\u0438 \u0441\u0435\u0431\u0435 \u0441\u043F\u0440\u0430\u0432\u0436\u043D\u044C\u043E\u0433\u043E \u0456 \u0442\u0430\u043A \u043D\u0435\u043F\u0440\u043E\u0441\u0442\u043E \u0437\u043D\u043E\u0432\u0443 \u0432\u0456\u0434\u043D\u0430\u0439\u0442\u0438"
    }
  },
  {
    id: 3,
    imageOnly: false,
    image: "gallery.image4",
    text: {
      quote: "icons.lapki",
      heading: "\u0422\u043E\u043C\u0443 \u043C\u0438 \u0439\u0434\u0435\u043C\u043E \u0448\u043B\u044F\u0445\u043E\u043C, \u0434\u0435 \u0448\u0443\u043A\u0430\u0454\u043C\u043E \u0441\u0435\u0431\u0435 \u0441\u043F\u0440\u0430\u0432\u0436\u043D\u0456\u0445.",
      body: "\u0406 \u0446\u044F \u0434\u043E\u0440\u043E\u0433\u0430 \u043F\u0440\u0438\u0432\u0435\u043B\u0430 \u043D\u0430\u0441 \u0443 \u0421\u0442\u0456\u043B\u044C\u0441\u044C\u043A\u043E."
    }
  },
  {
    id: 4,
    imageOnly: false,
    image: "gallery.image5",
    text: {
      quote: "icons.lapki",
      heading: "\u041C\u0438 \u043F\u0440\u0430\u0433\u043D\u0435\u043C\u043E, \u0430\u0431\u0438 \u0442\u0443\u0442, \u043D\u0430 \u043F\u0435\u0440\u0435\u0442\u0438\u043D\u0456 \u0434\u043E\u0441\u0432\u0456\u0434\u0456\u0432 \u0432\u0435\u0442\u0435\u0440\u0430\u043D\u0456\u0432 \u0456 \u0446\u0438\u0432\u0456\u043B\u044C\u043D\u0438\u0445, \u043D\u0430\u0440\u043E\u0434\u0436\u0443\u0432\u0430\u043B\u0430\u0441\u044F \u043D\u043E\u0432\u0430 \u0434\u043E\u0432\u0456\u0440\u0430.",
      body: "\u0406 \u0449\u043E\u0431 \u0441\u043F\u0456\u043B\u044C\u043D\u0456 \u0440\u043E\u0437\u043C\u043E\u0432\u0438, \u043F\u043E\u0434\u043E\u0440\u043E\u0436\u0456, \u043F\u0440\u043E\u0454\u043A\u0442\u0438, \u0456\u043D\u043A\u043E\u043B\u0438 \u0441\u043B\u044C\u043E\u0437\u0438 \u0439 \u0441\u043C\u0456\u0445 \u2014 \u043F\u043E\u0432\u0435\u0440\u0442\u0430\u043B\u0438 \u043A\u043E\u0436\u043D\u043E\u0433\u043E \u0437 \u043D\u0430\u0441 \u0434\u043E \u0436\u0438\u0442\u0442\u044F."
    }
  },
  {
    id: 5,
    imageOnly: false,
    image: "gallery.image6",
    text: {
      quote: "icons.lapki",
      heading: "\u041C\u0438 \u0432\u0456\u0440\u0438\u043C\u043E, \u0448\u043E \u0432 \u0446\u044C\u043E\u043C\u0443 \u043F\u0440\u043E\u0441\u0442\u043E\u0440\u0456 \u0431\u0443\u0434\u0443\u0442\u044C \u043D\u0430\u0440\u043E\u0434\u0436\u0443\u0432\u0430\u0442\u0438\u0441\u044F \u043D\u043E\u0432\u0456 \u0437\u0432'\u044F\u0437\u043A\u0438, \u0441\u043F\u0456\u043B\u044C\u043D\u0456 \u0456\u0434\u0435\u0457 \u0442\u0430 \u0441\u043F\u0440\u0430\u0432\u0438.",
      body: "\u0406 \u0449\u043E \u043C\u0438 \u0440\u0430\u0437\u043E\u043C \u0442\u0432\u043E\u0440\u0438\u0442\u0438\u043C\u0435\u043C\u043E \u043D\u043E\u0432\u0443 \u0423\u043A\u0440\u0430\u0457\u043D\u0443, \u043F\u0440\u043E \u044F\u043A\u0443 \u043C\u0440\u0456\u0454\u043C\u043E \u2014 \u0456 \u0432 \u044F\u043A\u0456\u0439 \u0445\u043E\u0442\u0456\u0442\u0438\u043C\u0443\u0442\u044C \u0436\u0438\u0442\u0438 \u043D\u0430\u0448\u0456 \u0434\u0456\u0442\u0438."
    }
  },
  {
    id: 6,
    imageOnly: false,
    image: "gallery.image7",
    text: {
      quote: "icons.lapki",
      heading: "\u0426\u0435 \u043F\u043E\u043A\u043E\u043B\u0456\u043D\u043D\u044F, \u0443 \u0447\u0438\u0457 \u0440\u0443\u043A\u0438 \u043C\u0438 \u043F\u0435\u0440\u0435\u0434\u0430\u043C\u043E \u0423\u043A\u0440\u0430\u0457\u043D\u0443.",
      body: "\u0406 \u0446\u0435 \u0432\u0435\u043B\u0438\u043A\u0430 \u0432\u0456\u0434\u043F\u043E\u0432\u0456\u0434\u0430\u043B\u044C\u043D\u0456\u0441\u0442\u044C, \u044F\u043A\u0443 \u043C\u0438 \u043F\u0440\u0438\u0439\u043C\u0430\u0454\u043C\u043E \u0441\u0432\u0456\u0434\u043E\u043C\u043E."
    }
  },
  {
    id: 7,
    imageOnly: false,
    image: "gallery.image8",
    text: {
      quote: "icons.lapki",
      heading: "\u0421\u044C\u043E\u0433\u043E\u0434\u043D\u0456 \u0432\u0438 \u0431\u0430\u0447\u0438\u0442\u0435 \u043F\u0435\u0440\u0448\u0456 \u043A\u0440\u043E\u043A\u0438 \u0446\u0435\u043D\u0442\u0440\u0443.",
      body: "\u041C\u0438 \u043F\u0440\u043E\u0434\u043E\u0432\u0436\u0443\u0454\u043C\u043E \u0440\u043E\u0437\u0432\u0438\u0432\u0430\u0442\u0438 \u0442\u0435\u0440\u0438\u0442\u043E\u0440\u0456\u044E, \u0448\u0443\u043A\u0430\u0454\u043C\u043E \u043F\u0430\u0440\u0442\u043D\u0435\u0440\u0456\u0432, \u043F\u043E\u0434\u0430\u0454\u043C\u043E\u0441\u044F \u043D\u0430 \u0433\u0440\u0430\u043D\u0442\u0438 \u2014 \u0456 \u0432\u0436\u0435 \u0432\u0456\u0434\u043A\u0440\u0438\u0442\u0456 \u0434\u043E \u043F\u0435\u0440\u0448\u0438\u0445 \u0433\u043E\u0441\u0442\u0435\u0439."
    }
  },
  {
    id: 8,
    imageOnly: false,
    image: "gallery.image9",
    text: {
      quote: "icons.lapki",
      heading: "\u041D\u0430\u0448\u0456 \u043F\u043B\u0430\u043D\u0438 \u043C\u0430\u0441\u0448\u0442\u0430\u0431\u043D\u0456 \u0442\u0430 \u043F\u0435\u0440\u0435\u0434\u0431\u0430\u0447\u0430\u044E\u0442\u044C \u043F\u043E\u0435\u0442\u0430\u043F\u043D\u0435 \u0437\u0440\u043E\u0441\u0442\u0430\u043D\u043D\u044F.",
      body: "\u041D\u0430\u0448 \u043F\u0440\u043E\u0454\u043A\u0442 \u043D\u0435 \u043C\u0430\u0454 \u0456\u043D\u0432\u0435\u0441\u0442\u043E\u0440\u0456\u0432 \u0442\u0430 \u0432\u0435\u043B\u0438\u043A\u0438\u0445 \u0431\u044E\u0434\u0436\u0435\u0442\u0456\u0432. \u0422\u043E\u0436 \u043C\u0438 \u0431\u0443\u0434\u0443\u0454\u043C\u043E \u0446\u0435\u043D\u0442\u0440 \u043F\u043E\u0441\u0442\u0443\u043F\u043E\u0432\u043E, \u0430\u043B\u0435 \u0437 \u0434\u0443\u0448\u0435\u044E \u0442\u0430 \u0449\u0438\u0440\u0438\u043C\u0438 \u043D\u0430\u043C\u0456\u0440\u0430\u043C\u0438."
    }
  },
  {
    id: 10,
    imageOnly: false,
    image: "gallery.image10",
    text: {
      quote: "icons.lapki",
      heading: "\u041D\u0430\u0448 \u043F\u0430\u0433\u043E\u0440\u0431 \u2014 \u0446\u0435 \u043C\u0456\u0441\u0446\u0435 \u0441\u0438\u043B\u0438 \u0456 \u0441\u043F\u043E\u043A\u043E\u044E.",
      body: "\u0422\u0443\u0442 \u0442\u0438 \u043C\u043E\u0436\u0435\u0448 \u0431\u0443\u0442\u0438 \u0441\u043F\u0440\u0430\u0432\u0436\u043D\u0456\u043C, \u043C\u043E\u0436\u0435\u0448 \u0431\u0443\u0442\u0438 \u0441\u043E\u0431\u043E\u044E, \u043C\u043E\u0436\u0435\u0448 \u043F\u0440\u043E\u0441\u0442\u043E \u0431\u0443\u0442\u0438...."
    }
  },
  {
    id: 11,
    imageOnly: false,
    image: "gallery.image11",
    text: {
      quote: "icons.lapki",
      heading: "\u0410 \u0437\u0430 \u043D\u0430\u043C\u0438 \u2014 \u0442\u0443\u0440\u0431\u043E\u0442\u0430, \u043F\u0440\u043E\u0444\u0435\u0441\u0456\u043E\u043D\u0430\u043B\u0456\u0437\u043C \u0456 \u0441\u0435\u0440\u0432\u0456\u0441, \u043F\u0440\u043E\u0434\u0443\u043C\u0430\u043D\u0438\u0439 \u0434\u043E \u0434\u0435\u0442\u0430\u043B\u0435\u0439.",
      body: "\u0412\u0438\u0434\u0438\u0445\u0430\u0439. \u0414\u043E\u0432\u0456\u0440\u044F\u0439. \u0416\u0438\u0432\u0438."
    }
  }
];
function SliderSection() {
  const [currentSlide, setCurrentSlide] = reactExports.useState(0);
  const totalSlides = slides.length;
  const nextSlide = reactExports.useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);
  const prevSlide = reactExports.useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);
  reactExports.useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "ArrowLeft") {
        prevSlide();
      } else if (e.key === "ArrowRight") {
        nextSlide();
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [nextSlide, prevSlide]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-[#FBFBF9] pb-16", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1440px] mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2 px-4 sm:px-6 md:px-8 lg:px-[100px] xl:px-[215px] py-0 mb-6 sm:mb-8 md:mb-12 lg:mb-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-alternates text-[#111111] text-[28px] sm:text-[36px] md:text-[48px] lg:text-[62px] font-medium leading-[1.1em] tracking-[-2%] text-center", children: "\u041C\u0438. \u0422\u0430\u043A\u0456, \u044F\u043A \u0454" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[#28694D] text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] font-medium leading-[1.3em] tracking-[1.5%] text-center", children: "\u0441\u043F\u0440\u0430\u0432\u0436\u043D\u0456" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative w-full max-w-[1360px] mx-auto bg-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] xl:h-[800px] overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-1/2 left-0 right-0 flex justify-between px-2 sm:px-4 md:px-6 lg:px-10 -translate-y-1/2 pointer-events-none z-20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: prevSlide,
            className: "w-[48px] h-[48px] sm:w-[56px] sm:h-[56px] md:w-[64px] md:h-[64px] lg:w-[72px] lg:h-[72px] flex items-center justify-center bg-white/80 hover:bg-white rounded-full shadow-lg transition-all pointer-events-auto",
            "aria-label": "Previous slide",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "svg",
              {
                className: "w-[20px] h-[24px] sm:w-[24px] sm:h-[30px] md:w-[28px] md:h-[36px] text-[#404040]",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" })
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: nextSlide,
            className: "w-[48px] h-[48px] sm:w-[56px] sm:h-[56px] md:w-[64px] md:h-[64px] lg:w-[72px] lg:h-[72px] flex items-center justify-center bg-white/80 hover:bg-white rounded-full shadow-lg transition-all pointer-events-auto",
            "aria-label": "Next slide",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "svg",
              {
                className: "w-[20px] h-[24px] sm:w-[24px] sm:h-[30px] md:w-[28px] md:h-[36px] text-[#404040]",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" })
              }
            )
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex h-full transition-transform duration-500 ease-in-out",
          style: { transform: `translateX(-${currentSlide * 100}%)` },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full h-full flex-shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Image,
                {
                  src: `/images/slider/${slides[0].image.replace("gallery.image", "")}.png`,
                  alt: `Slide ${slides[0].id}`,
                  fill: true,
                  className: "object-cover",
                  unoptimized: true
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-0 left-0 right-0 flex justify-between items-end px-4 sm:px-6 md:px-8 lg:px-10 pb-8 sm:pb-12 md:pb-16 lg:pb-20 z-10", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", {}),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-white text-[16px] sm:text-[18px] md:text-[20px] font-semibold leading-[1.3em] tracking-[1.5%]", children: [
                  "1 / ",
                  totalSlides
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex flex-col lg:flex-row h-full w-full flex-shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full lg:w-[875px] h-full relative bg-[#F0F3F0] border-r border-[rgba(17,17,17,0.25)]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Image,
                  {
                    src: `/images/slider/${slides[1].image.replace("gallery.image", "")}.png`,
                    alt: `Slide ${slides[1].id}`,
                    fill: true,
                    className: "object-cover",
                    unoptimized: true
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-0 left-0 right-0 flex justify-between items-end px-4 sm:px-6 md:px-8 lg:px-10 pb-8 sm:pb-12 md:pb-16 lg:pb-20 z-10", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", {}),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-white text-[16px] sm:text-[18px] md:text-[20px] font-semibold leading-[1.3em] tracking-[1.5%]", children: [
                    "2 / ",
                    totalSlides
                  ] })
                ] })
              ] }),
              slides[1].text && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-start justify-center lg:justify-start pt-6 sm:pt-8 md:pt-10 px-4 sm:px-6 md:px-8 lg:px-10 lg:-ml-16 relative z-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white border border-[rgba(17,17,17,0.07)] p-4 sm:p-6 md:p-8 lg:p-10 w-full max-w-[526px] shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 sm:gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 sm:gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Image,
                    {
                      src: "/images/about/lapki.svg",
                      alt: "Quote mark",
                      width: 36,
                      height: 36,
                      className: "object-contain w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10",
                      unoptimized: true
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-alternates text-[#111111] text-[14px] sm:text-[15px] md:text-[16px] font-medium leading-[1.1em] tracking-[-2%]", children: slides[1].text.heading })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-montserrat text-[#111111] text-[14px] sm:text-[15px] md:text-[16px] font-normal leading-[1.5em] tracking-[0.5%] ml-[calc(2rem+0.5rem)] sm:ml-[calc(2.25rem+0.75rem)] md:ml-[calc(2.5rem+0.75rem)]", children: slides[1].text.body })
              ] }) }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex flex-col lg:flex-row h-full w-full flex-shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full lg:w-[875px] h-full relative bg-[#F0F3F0] border-r border-[rgba(17,17,17,0.25)]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Image,
                  {
                    src: `/images/slider/${slides[2].image.replace("gallery.image", "")}.png`,
                    alt: `Slide ${slides[2].id}`,
                    fill: true,
                    className: "object-cover",
                    unoptimized: true
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-0 left-0 right-0 flex justify-between items-end px-4 sm:px-6 md:px-8 lg:px-10 pb-8 sm:pb-12 md:pb-16 lg:pb-20 z-10", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", {}),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-white text-[16px] sm:text-[18px] md:text-[20px] font-semibold leading-[1.3em] tracking-[1.5%]", children: [
                    "3 / ",
                    totalSlides
                  ] })
                ] })
              ] }),
              slides[2].text && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-start justify-center lg:justify-start pt-6 sm:pt-8 md:pt-10 px-4 sm:px-6 md:px-8 lg:px-10 lg:-ml-16 relative z-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white border border-[rgba(17,17,17,0.07)] p-4 sm:p-6 md:p-8 lg:p-10 w-full max-w-[526px] shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 sm:gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 sm:gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Image,
                    {
                      src: "/images/about/lapki.svg",
                      alt: "Quote mark",
                      width: 36,
                      height: 36,
                      className: "object-contain w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10",
                      unoptimized: true
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-alternates text-[#111111] text-[14px] sm:text-[15px] md:text-[16px] font-medium leading-[1.1em] tracking-[-2%]", children: slides[2].text.heading })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-montserrat text-[#111111] text-[14px] sm:text-[15px] md:text-[16px] font-normal leading-[1.5em] tracking-[0.5%] ml-[calc(2rem+0.5rem)] sm:ml-[calc(2.25rem+0.75rem)] md:ml-[calc(2.5rem+0.75rem)]", children: slides[2].text.body })
              ] }) }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex flex-col lg:flex-row h-full w-full flex-shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full lg:w-[875px] h-full relative bg-[#F0F3F0] border-r border-[rgba(17,17,17,0.25)]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Image,
                  {
                    src: slides[3].image,
                    alt: `Slide ${slides[3].id}`,
                    fill: true,
                    className: "object-cover"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-0 left-0 right-0 flex justify-between items-end px-4 sm:px-6 md:px-8 lg:px-10 pb-8 sm:pb-12 md:pb-16 lg:pb-20 z-10", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", {}),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-white text-[16px] sm:text-[18px] md:text-[20px] font-semibold leading-[1.3em] tracking-[1.5%]", children: [
                    "4 / ",
                    totalSlides
                  ] })
                ] })
              ] }),
              slides[3].text && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-start justify-center lg:justify-start pt-6 sm:pt-8 md:pt-10 px-4 sm:px-6 md:px-8 lg:px-10 lg:-ml-16 relative z-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white border border-[rgba(17,17,17,0.07)] p-4 sm:p-6 md:p-8 lg:p-10 w-full max-w-[526px] shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 sm:gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 sm:gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Image,
                    {
                      src: slides[3].text.quote,
                      alt: "Quote mark",
                      width: 36,
                      height: 36,
                      className: "object-contain w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10"
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-alternates text-[#111111] text-[14px] sm:text-[15px] md:text-[16px] font-medium leading-[1.1em] tracking-[-2%]", children: slides[3].text.heading })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-montserrat text-[#111111] text-[14px] sm:text-[15px] md:text-[16px] font-normal leading-[1.5em] tracking-[0.5%] ml-[calc(2rem+0.5rem)] sm:ml-[calc(2.25rem+0.75rem)] md:ml-[calc(2.5rem+0.75rem)]", children: slides[3].text.body })
              ] }) }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex flex-col lg:flex-row h-full w-full flex-shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full lg:w-[875px] h-full relative bg-[#F0F3F0] border-r border-[rgba(17,17,17,0.25)]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Image,
                  {
                    src: slides[4].image,
                    alt: `Slide ${slides[4].id}`,
                    fill: true,
                    className: "object-cover"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-0 left-0 right-0 flex justify-between items-end px-4 sm:px-6 md:px-8 lg:px-10 pb-8 sm:pb-12 md:pb-16 lg:pb-20 z-10", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", {}),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-white text-[16px] sm:text-[18px] md:text-[20px] font-semibold leading-[1.3em] tracking-[1.5%]", children: [
                    "5 / ",
                    totalSlides
                  ] })
                ] })
              ] }),
              slides[4].text && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-start justify-center lg:justify-start pt-6 sm:pt-8 md:pt-10 px-4 sm:px-6 md:px-8 lg:px-10 lg:-ml-16 relative z-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white border border-[rgba(17,17,17,0.07)] p-4 sm:p-6 md:p-8 lg:p-10 w-full max-w-[526px] shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 sm:gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 sm:gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Image,
                    {
                      src: slides[4].text.quote,
                      alt: "Quote mark",
                      width: 36,
                      height: 36,
                      className: "object-contain w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10"
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-alternates text-[#111111] text-[14px] sm:text-[15px] md:text-[16px] font-medium leading-[1.1em] tracking-[-2%]", children: slides[4].text.heading })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-montserrat text-[#111111] text-[14px] sm:text-[15px] md:text-[16px] font-normal leading-[1.5em] tracking-[0.5%] ml-[calc(2rem+0.5rem)] sm:ml-[calc(2.25rem+0.75rem)] md:ml-[calc(2.5rem+0.75rem)]", children: slides[4].text.body })
              ] }) }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex flex-col lg:flex-row h-full w-full flex-shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full lg:w-[875px] h-full relative bg-[#F0F3F0] border-r border-[rgba(17,17,17,0.25)]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Image,
                  {
                    src: slides[5].image,
                    alt: `Slide ${slides[5].id}`,
                    fill: true,
                    className: "object-cover"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-0 left-0 right-0 flex justify-between items-end px-4 sm:px-6 md:px-8 lg:px-10 pb-8 sm:pb-12 md:pb-16 lg:pb-20 z-10", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", {}),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-white text-[16px] sm:text-[18px] md:text-[20px] font-semibold leading-[1.3em] tracking-[1.5%]", children: [
                    "6 / ",
                    totalSlides
                  ] })
                ] })
              ] }),
              slides[5].text && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-start justify-center lg:justify-start pt-6 sm:pt-8 md:pt-10 px-4 sm:px-6 md:px-8 lg:px-10 lg:-ml-16 relative z-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white border border-[rgba(17,17,17,0.07)] p-4 sm:p-6 md:p-8 lg:p-10 w-full max-w-[526px] shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 sm:gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 sm:gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Image,
                    {
                      src: slides[5].text.quote,
                      alt: "Quote mark",
                      width: 36,
                      height: 36,
                      className: "object-contain w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10"
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-alternates text-[#111111] text-[14px] sm:text-[15px] md:text-[16px] font-medium leading-[1.1em] tracking-[-2%]", children: slides[5].text.heading })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-montserrat text-[#111111] text-[14px] sm:text-[15px] md:text-[16px] font-normal leading-[1.5em] tracking-[0.5%] ml-[calc(2rem+0.5rem)] sm:ml-[calc(2.25rem+0.75rem)] md:ml-[calc(2.5rem+0.75rem)]", children: slides[5].text.body })
              ] }) }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex flex-col lg:flex-row h-full w-full flex-shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full lg:w-[875px] h-full relative bg-[#F0F3F0] border-r border-[rgba(17,17,17,0.25)]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Image,
                  {
                    src: slides[6].image,
                    alt: `Slide ${slides[6].id}`,
                    fill: true,
                    className: "object-cover"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-0 left-0 right-0 flex justify-between items-end px-4 sm:px-6 md:px-8 lg:px-10 pb-8 sm:pb-12 md:pb-16 lg:pb-20 z-10", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", {}),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-white text-[16px] sm:text-[18px] md:text-[20px] font-semibold leading-[1.3em] tracking-[1.5%]", children: [
                    "7 / ",
                    totalSlides
                  ] })
                ] })
              ] }),
              slides[6].text && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-start justify-center lg:justify-start pt-6 sm:pt-8 md:pt-10 px-4 sm:px-6 md:px-8 lg:px-10 lg:-ml-16 relative z-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white border border-[rgba(17,17,17,0.07)] p-4 sm:p-6 md:p-8 lg:p-10 w-full max-w-[526px] shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 sm:gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 sm:gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Image,
                    {
                      src: slides[6].text.quote,
                      alt: "Quote mark",
                      width: 36,
                      height: 36,
                      className: "object-contain w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10"
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-alternates text-[#111111] text-[14px] sm:text-[15px] md:text-[16px] font-medium leading-[1.1em] tracking-[-2%]", children: slides[6].text.heading })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-montserrat text-[#111111] text-[14px] sm:text-[15px] md:text-[16px] font-normal leading-[1.5em] tracking-[0.5%] ml-[calc(2rem+0.5rem)] sm:ml-[calc(2.25rem+0.75rem)] md:ml-[calc(2.5rem+0.75rem)]", children: slides[6].text.body })
              ] }) }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex flex-col lg:flex-row h-full w-full flex-shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full lg:w-[875px] h-full relative bg-[#F0F3F0] border-r border-[rgba(17,17,17,0.25)]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Image,
                  {
                    src: slides[7].image,
                    alt: `Slide ${slides[7].id}`,
                    fill: true,
                    className: "object-cover"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-0 left-0 right-0 flex justify-between items-end px-4 sm:px-6 md:px-8 lg:px-10 pb-8 sm:pb-12 md:pb-16 lg:pb-20 z-10", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", {}),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-white text-[16px] sm:text-[18px] md:text-[20px] font-semibold leading-[1.3em] tracking-[1.5%]", children: [
                    "8 / ",
                    totalSlides
                  ] })
                ] })
              ] }),
              slides[7].text && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-start justify-center lg:justify-start pt-6 sm:pt-8 md:pt-10 px-4 sm:px-6 md:px-8 lg:px-10 lg:-ml-16 relative z-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white border border-[rgba(17,17,17,0.07)] p-4 sm:p-6 md:p-8 lg:p-10 w-full max-w-[526px] shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 sm:gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 sm:gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Image,
                    {
                      src: slides[7].text.quote,
                      alt: "Quote mark",
                      width: 36,
                      height: 36,
                      className: "object-contain w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10"
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-alternates text-[#111111] text-[14px] sm:text-[15px] md:text-[16px] font-medium leading-[1.1em] tracking-[-2%]", children: slides[7].text.heading })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-montserrat text-[#111111] text-[14px] sm:text-[15px] md:text-[16px] font-normal leading-[1.5em] tracking-[0.5%] ml-[calc(2rem+0.5rem)] sm:ml-[calc(2.25rem+0.75rem)] md:ml-[calc(2.5rem+0.75rem)]", children: slides[7].text.body })
              ] }) }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex flex-col lg:flex-row h-full w-full flex-shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full lg:w-[875px] h-full relative bg-[#F0F3F0] border-r border-[rgba(17,17,17,0.25)]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Image,
                  {
                    src: slides[8].image,
                    alt: `Slide ${slides[8].id}`,
                    fill: true,
                    className: "object-cover"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-0 left-0 right-0 flex justify-between items-end px-4 sm:px-6 md:px-8 lg:px-10 pb-8 sm:pb-12 md:pb-16 lg:pb-20 z-10", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", {}),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-white text-[16px] sm:text-[18px] md:text-[20px] font-semibold leading-[1.3em] tracking-[1.5%]", children: [
                    "9 / ",
                    totalSlides
                  ] })
                ] })
              ] }),
              slides[8].text && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-start justify-center lg:justify-start pt-6 sm:pt-8 md:pt-10 px-4 sm:px-6 md:px-8 lg:px-10 lg:-ml-16 relative z-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white border border-[rgba(17,17,17,0.07)] p-4 sm:p-6 md:p-8 lg:p-10 w-full max-w-[526px] shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 sm:gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 sm:gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Image,
                    {
                      src: slides[8].text.quote,
                      alt: "Quote mark",
                      width: 36,
                      height: 36,
                      className: "object-contain w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10"
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-alternates text-[#111111] text-[14px] sm:text-[15px] md:text-[16px] font-medium leading-[1.1em] tracking-[-2%]", children: slides[8].text.heading })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-montserrat text-[#111111] text-[14px] sm:text-[15px] md:text-[16px] font-normal leading-[1.5em] tracking-[0.5%] ml-[calc(2rem+0.5rem)] sm:ml-[calc(2.25rem+0.75rem)] md:ml-[calc(2.5rem+0.75rem)]", children: slides[8].text.body })
              ] }) }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex flex-col lg:flex-row h-full w-full flex-shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full lg:w-[875px] h-full relative bg-[#F0F3F0] border-r border-[rgba(17,17,17,0.25)]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Image,
                  {
                    src: slides[9].image,
                    alt: `Slide ${slides[9].id}`,
                    fill: true,
                    className: "object-cover"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-0 left-0 right-0 flex justify-between items-end px-4 sm:px-6 md:px-8 lg:px-10 pb-8 sm:pb-12 md:pb-16 lg:pb-20 z-10", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", {}),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-white text-[16px] sm:text-[18px] md:text-[20px] font-semibold leading-[1.3em] tracking-[1.5%]", children: [
                    "10 / ",
                    totalSlides
                  ] })
                ] })
              ] }),
              slides[9].text && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-start justify-center lg:justify-start pt-6 sm:pt-8 md:pt-10 px-4 sm:px-6 md:px-8 lg:px-10 lg:-ml-16 relative z-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white border border-[rgba(17,17,17,0.07)] p-4 sm:p-6 md:p-8 lg:p-10 w-full max-w-[526px] shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 sm:gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 sm:gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Image,
                    {
                      src: slides[9].text.quote,
                      alt: "Quote mark",
                      width: 36,
                      height: 36,
                      className: "object-contain w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10"
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-alternates text-[#111111] text-[14px] sm:text-[15px] md:text-[16px] font-medium leading-[1.1em] tracking-[-2%]", children: slides[9].text.heading })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-montserrat text-[#111111] text-[14px] sm:text-[15px] md:text-[16px] font-normal leading-[1.5em] tracking-[0.5%] ml-[calc(2rem+0.5rem)] sm:ml-[calc(2.25rem+0.75rem)] md:ml-[calc(2.5rem+0.75rem)]", children: slides[9].text.body })
              ] }) }) })
            ] })
          ]
        }
      )
    ] }) })
  ] }) });
}

export { SliderSection as default };
//# sourceMappingURL=SliderSection-CONsQm4i.mjs.map
