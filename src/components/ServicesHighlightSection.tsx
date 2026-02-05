export default function ServicesHighlightSection() {
  return (
    <div className="w-full">
      <div className="border-y border-[#1111111C]">
          <div className="max-w-[90rem] mx-auto px-0 sm:px-0 md:px-0 lg:px-0">
            <div className="hidden lg:flex items-stretch gap-0 !py-0 min-w-0">
              <div className="w-[clamp(0px,14.93vw,215px)] flex-shrink-0" />
              <div className="w-[clamp(280px,24.86vw,358px)] flex-shrink-0 flex flex-col h-[clamp(320px,45.83vw,660px)] pt-[clamp(24px,4.44vw,64px)] justify-between">
                <div>
                  <h3 className="font-montserrat text-[#111111] text-[clamp(1.5rem,_calc(1.236rem+1.126vw),_2.25rem)] font-bold leading-[1.3em] tracking-[-1%]">
                    Placeholder title
                  </h3>
                  <div className="space-y-5 pt-4">
                    <p className="font-montserrat text-[hsla(0,0%,7%,1)] text-[16px] font-normal leading-[1.5em] tracking-[0.5%]">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <p className="font-montserrat text-[hsla(0,0%,7%,1)] text-[16px] font-normal leading-[1.5em] tracking-[0.5%]">
                      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                    <p className="font-montserrat text-[hsla(0,0%,7%,1)] text-[16px] font-normal leading-[1.5em] tracking-[0.5%]">
                      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-4 w-full pt-[clamp(16px,2.78vw,40px)] pb-[24px]">
                <button className="w-full bg-[#28694D] rounded-[2rem] px-6 py-3 flex items-center justify-center transition-all duration-300 hover:opacity-95">
                  <span className="hover-bold-no-shift font-montserrat text-white text-[clamp(1rem,_calc(0.912rem+0.375vw),_1.25rem)] font-normal leading-[1.5em] tracking-[0.5%]">
                    Primary
                  </span>
                </button>
                <button className="w-full bg-white text-[#28694D] border border-[#1111111A] rounded-[2rem] px-6 py-3 flex items-center justify-center transition-all duration-300 hover:opacity-95">
                  <span className="hover-bold-no-shift font-montserrat text-[clamp(1rem,_calc(0.912rem+0.375vw),_1.25rem)] font-normal leading-[1.5em] tracking-[0.5%]">
                    Secondary
                  </span>
                </button>
              </div>
            </div>
              <div className="w-[clamp(0px,8.68vw,125px)] flex-shrink-0" />
            <div className="relative flex-1 h-full min-w-0 flex justify-end">
              <div className="relative w-[clamp(320px,45.83vw,660px)] aspect-square bg-gray-300 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-[#11111199] font-montserrat text-[16px]">
                  Image placeholder
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
