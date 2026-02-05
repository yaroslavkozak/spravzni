import { r as reactExports, j as jsxRuntimeExports, M as MediaImage } from './ssr.mjs';
import { M as MediaVideo } from './index-UQ9qTyF1.mjs';
import 'node:async_hooks';
import 'node:stream';
import 'node:stream/web';

function VideoSection() {
  const [isPlaying, setIsPlaying] = reactExports.useState(false);
  const [isCenterHovered, setIsCenterHovered] = reactExports.useState(false);
  const [volume, setVolume] = reactExports.useState(1);
  const [showVolumeControl, setShowVolumeControl] = reactExports.useState(false);
  const videoRef = reactExports.useRef(null);
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
    }
  };
  const toggleMute = () => {
    if (videoRef.current) {
      if (volume > 0) {
        setVolume(0);
        videoRef.current.volume = 0;
      } else {
        setVolume(1);
        videoRef.current.volume = 1;
      }
    }
  };
  reactExports.useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.volume = volume;
    }
  }, [volume]);
  reactExports.useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      setIsPlaying(!video.paused);
      video.addEventListener("play", handlePlay);
      video.addEventListener("pause", handlePause);
      return () => {
        video.removeEventListener("play", handlePlay);
        video.removeEventListener("pause", handlePause);
      };
    }
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-[#FBFBF9] py-16 md:py-20 lg:py-24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "relative w-full aspect-video bg-gray-900 overflow-hidden",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          MediaVideo,
          {
            ref: videoRef,
            mediaKey: "videos.hero",
            className: "w-full h-full object-cover",
            loop: true,
            playsInline: true
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
  ) }) });
}

export { VideoSection as default };
//# sourceMappingURL=VideoSection-x0jHOyH9.mjs.map
