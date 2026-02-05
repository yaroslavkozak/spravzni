import { r as reactExports, j as jsxRuntimeExports, M as MediaImage, I as Image } from './ssr.mjs';
import 'node:async_hooks';
import 'node:stream';
import 'node:stream/web';

const features = [
  {
    id: 1,
    icon: "icons.sparks",
    text: "\u043F\u0440\u0438\u0440\u043E\u0434\u0430, \u0456\u0441\u0442\u043E\u0440\u0438\u0447\u043D\u0430 \u0441\u043F\u0430\u0434\u0449\u0438\u043D\u0430 \u0442\u0430 \u0430\u0440\u0445\u0456\u0442\u0435\u043A\u0442\u0443\u0440\u043D\u0456 \u0456\u043D\u043D\u043E\u0432\u0430\u0446\u0456\u0457 \u043F\u043E\u0454\u0434\u043D\u0430\u043D\u0456 \u0432 \u043E\u0434\u043D\u0456\u0439 \u043B\u043E\u043A\u0430\u0446\u0456\u0457"
  },
  {
    id: 2,
    icon: "icons.people-safe",
    text: "4 \u0456\u0437 5 \u0433\u0440\u0438\u0432\u0435\u043D\u044C \u043F\u0440\u0438\u0431\u0443\u0442\u043A\u0443 \u0456\u0434\u0443\u0442\u044C \u043D\u0430 \u0432\u0456\u0434\u043D\u043E\u0432\u043B\u0435\u043D\u043D\u044F \u0432\u0435\u0442\u0435\u0440\u0430\u043D\u0456\u0432, \u0430 \u043C\u0438 \u0437\u0432\u0456\u0442\u0443\u0454\u043C\u043E \u043F\u0443\u0431\u043B\u0456\u0447\u043D\u043E"
  },
  {
    id: 3,
    icon: "icons.wheelchair",
    text: "\u0454 \u0441\u0443\u0447\u0430\u0441\u043D\u0438\u0439 \u0431\u0435\u0437\u0431\u0430\u0440'\u0454\u0440\u043D\u0438\u0439 \u0441\u043F\u0430-\u0446\u0435\u043D\u0442\u0440, \u0430 \u0446\u0456\u043B\u044C \u2014 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0456\u0441\u0442\u044C \u0443\u0441\u0456\u0454\u0457 \u0456\u043D\u0444\u0440\u0430\u0441\u0442\u0440\u0443\u043A\u0442\u0443\u0440\u0438"
  },
  {
    id: 4,
    icon: "icons.coordinator",
    text: "\u043F\u0440\u043E \u043D\u0430\u0439\u043C\u0435\u043D\u0448\u0456 \u0434\u0435\u0442\u0430\u043B\u0456 \u0432\u0430\u0448\u043E\u0433\u043E \u043A\u043E\u043C\u0444\u043E\u0440\u0442\u0443 \u0434\u0431\u0430\u0454 \u0432\u0430\u0448 \u043F\u0435\u0440\u0441\u043E\u043D\u0430\u043B\u044C\u043D\u0438\u0439 \u043A\u043E\u043E\u0440\u0434\u0438\u043D\u0430\u0442\u043E\u0440"
  },
  {
    id: 5,
    icon: "icons.fork-spoon",
    text: "\u043A\u0435\u0439\u0442\u0435\u0440\u0438\u043D\u0433 \u0437\u0430\u0431\u0435\u0437\u043F\u0435\u0447\u0443\u0454 \u0441\u043C\u0430\u0447\u043D\u0435 \u0456 \u043F\u043E\u0436\u0438\u0432\u043D\u0435 \u0445\u0430\u0440\u0447\u0443\u0432\u0430\u043D\u043D\u044F"
  },
  {
    id: 6,
    icon: "icons.bus",
    text: "35 \u043A\u043C \u0432\u0456\u0434 \u041B\u044C\u0432\u043E\u0432\u0430, \u043C\u043E\u0436\u043B\u0438\u0432\u0438\u0439 \u0442\u0440\u0430\u043D\u0441\u0444\u0435\u0440"
  },
  {
    id: 7,
    icon: "icons.wifi",
    text: "\u0454 \u0440\u0435\u0437\u0435\u0440\u0432\u043D\u0435 \u0436\u0438\u0432\u043B\u0435\u043D\u043D\u044F \u0456 \u043D\u0430\u0434\u0456\u0439\u043D\u0438\u0439 WiFi"
  },
  {
    id: 8,
    icon: "icons.rotate",
    text: "\u043B\u043E\u044F\u043B\u044C\u043D\u0456 \u0443\u043C\u043E\u0432\u0438, \u044F\u043A\u0449\u043E \u0443 \u0432\u0430\u0441 \u0437\u043C\u0456\u043D\u0438\u043B\u0438\u0441\u044C \u043F\u043B\u0430\u043D\u0438"
  }
];
function SpaceSection() {
  const [currentImageIndex, setCurrentImageIndex] = reactExports.useState(0);
  const [isModalOpen, setIsModalOpen] = reactExports.useState(false);
  const totalImages = 7;
  const imageSources = [
    "/images/space/12.png",
    "/images/slider/2.png",
    "/images/slider/3.png",
    "/images/slider/4.png",
    "/images/slider/5.png",
    "/images/slider/6.png",
    "/images/slider/7.png"
  ];
  const handleImageClick = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  reactExports.useEffect(() => {
    if (!isModalOpen) return;
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isModalOpen]);
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % totalImages);
  };
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "bg-[#FBFBF9] py-16 md:py-20 lg:py-24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 sm:mb-10 md:mb-12 lg:mb-16", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-alternates text-[#111111] text-[36px] sm:text-[42px] md:text-[48px] lg:text-[56px] xl:text-[64px] font-medium leading-[1.1em] tracking-[-2%] mb-2", children: "\u041F\u0440\u043E\u0441\u0442\u0456\u0440" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-montserrat text-[#28694D] text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] font-medium leading-[1.3em] tracking-[1.5%]", children: "\u0434\u0435 \u0431\u0443\u0434\u0435\u043C\u043E \u0432\u0438\u0434\u0438\u0445\u0430\u0442\u0438 \u0440\u0430\u0437\u043E\u043C" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 xl:gap-20 items-stretch", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-full -ml-4 md:-ml-8 lg:-ml-16 xl:-ml-[calc(4rem+(100vw-1440px)/2)]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "relative w-full h-full bg-gray-300 overflow-hidden cursor-pointer group",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                MediaImage,
                {
                  src: imageSources[currentImageIndex],
                  alt: `Space image ${currentImageIndex + 1}`,
                  fill: true,
                  className: "object-cover"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: handleImageClick,
                  className: "absolute top-3 sm:top-4 right-3 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-10",
                  "aria-label": "Zoom image",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "svg",
                    {
                      className: "w-4 h-4 sm:w-5 sm:h-5 text-[#404040]",
                      fill: "none",
                      stroke: "currentColor",
                      viewBox: "0 0 24 24",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "path",
                        {
                          strokeLinecap: "round",
                          strokeLinejoin: "round",
                          strokeWidth: 2,
                          d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                        }
                      )
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-3 sm:bottom-4 left-3 sm:left-4 bg-black/60 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded text-xs sm:text-sm font-medium", children: [
                currentImageIndex + 1,
                " / ",
                totalImages
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: (e) => {
                    e.stopPropagation();
                    prevImage();
                  },
                  className: "absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100",
                  "aria-label": "Previous image",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "svg",
                    {
                      className: "w-4 h-4 sm:w-5 sm:h-5 text-[#404040]",
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
                  onClick: (e) => {
                    e.stopPropagation();
                    nextImage();
                  },
                  className: "absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100",
                  "aria-label": "Next image",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "svg",
                    {
                      className: "w-4 h-4 sm:w-5 sm:h-5 text-[#404040]",
                      fill: "none",
                      stroke: "currentColor",
                      viewBox: "0 0 24 24",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" })
                    }
                  )
                }
              )
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-4 sm:gap-5 md:gap-6 lg:gap-7 h-full ml-4 sm:ml-6 md:ml-8 lg:ml-12 xl:ml-16", children: features.map((feature) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 sm:gap-3 md:gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Image,
            {
              src: `/images/space/icons/${feature.icon.replace("icons.", "")}.svg`,
              alt: "",
              width: 32,
              height: 32,
              className: "object-contain w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9",
              unoptimized: true
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-montserrat text-[#111111] text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] leading-[1.5em] tracking-[0.5%] flex-1 pt-0.5 sm:pt-1", children: feature.text })
        ] }, feature.id)) })
      ] })
    ] }),
    isModalOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4",
        onClick: closeModal,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: closeModal,
              className: "absolute top-4 right-4 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all z-10",
              "aria-label": "Close modal",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "svg",
                {
                  className: "w-6 h-6 text-[#404040]",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" })
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "relative max-w-[90vw] max-h-[90vh] w-full h-full flex items-center justify-center",
              onClick: (e) => e.stopPropagation(),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                MediaImage,
                {
                  src: imageSources[currentImageIndex],
                  alt: `Space image ${currentImageIndex + 1} - enlarged`,
                  width: 1200,
                  height: 900,
                  className: "object-contain max-w-full max-h-full rounded-lg"
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: (e) => {
                e.stopPropagation();
                prevImage();
              },
              className: "absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all",
              "aria-label": "Previous image",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "svg",
                {
                  className: "w-6 h-6 text-[#404040]",
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
              onClick: (e) => {
                e.stopPropagation();
                nextImage();
              },
              className: "absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all",
              "aria-label": "Next image",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "svg",
                {
                  className: "w-6 h-6 text-[#404040]",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" })
                }
              )
            }
          )
        ]
      }
    )
  ] });
}

export { SpaceSection as default };
//# sourceMappingURL=SpaceSection-BO7k6SLx.mjs.map
