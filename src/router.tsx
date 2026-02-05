import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

function DefaultNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FBFBF9] px-4">
      <div className="text-center">
        <h1 className="font-alternates text-[#111111] text-[48px] md:text-[64px] lg:text-[80px] font-medium leading-[1.1em] tracking-[-2%] mb-4">
          404
        </h1>
        <p className="font-montserrat text-[#404040] text-[18px] md:text-[20px] lg:text-[24px] leading-[1.5em] tracking-[0.5%] mb-8">
          Сторінку не знайдено
        </p>
        <a
          href="/"
          className="inline-block font-montserrat text-[#28694D] text-[16px] md:text-[18px] font-medium hover:underline transition-colors"
        >
          Повернутися на головну
        </a>
      </div>
    </div>
  )
}

export function getRouter() {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultNotFoundComponent: DefaultNotFound,
  })

  return router
}
