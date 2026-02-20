'use client'

import { Link, useRouterState } from '@tanstack/react-router'
import { useState } from 'react'

interface AdminShellProps {
  title: string
  subtitle?: string
  userEmail?: string | null
  onLogout: () => void | Promise<void>
  children: React.ReactNode
}

interface NavItem {
  label: string
  to?: '/admin/dashboard' | '/admin/report' | '/admin/translations'
  subitems?: Array<{
    label: string
    to: '/admin/services' | '/admin/partners' | '/admin/space'
  }>
}

const navItems: NavItem[] = [
  { label: 'Запити', to: '/admin/dashboard' },
  { label: 'Звіт', to: '/admin/report' },
  { label: 'Переклади', to: '/admin/translations' },
  {
    label: 'Секції',
    subitems: [
      { label: 'Послуги', to: '/admin/services' },
      { label: 'Бренди', to: '/admin/partners' },
      { label: 'Простір', to: '/admin/space' },
    ],
  },
]

export default function AdminShell({ title, subtitle, userEmail, onLogout, children }: AdminShellProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sectionsExpanded, setSectionsExpanded] = useState(true)

  return (
    <div className="min-h-screen bg-[#F6F7F5] font-montserrat text-[#111111]">
      <div
        className={`fixed inset-0 z-30 bg-black/30 transition-opacity md:hidden ${
          sidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-[#1111111C] bg-[#FBFBF9] p-5 transition-transform md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.08em] text-[#28694D]">Адмінпанель Spravzni</p>
          <h2 className="mt-1 text-lg font-semibold">Панель управління</h2>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            if (item.subitems && item.subitems.length > 0) {
              const hasActiveChild = item.subitems.some((sub) => pathname.startsWith(sub.to))
              return (
                <div key={item.label} className="rounded-lg">
                  <button
                    type="button"
                    onClick={() => setSectionsExpanded((prev) => !prev)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium ${
                      hasActiveChild ? 'bg-[#28694D14] text-[#28694D]' : 'text-[#111111B3] hover:bg-[#1111110A]'
                    }`}
                  >
                    {item.label}
                    <span className="text-xs">{sectionsExpanded ? '−' : '+'}</span>
                  </button>
                  {sectionsExpanded && (
                    <div className="mt-1 space-y-1 pl-2">
                      {item.subitems.map((sub) => {
                        const active = pathname.startsWith(sub.to)
                        return (
                          <Link
                            key={sub.to}
                            to={sub.to}
                            onClick={() => setSidebarOpen(false)}
                            className={`block rounded-lg px-3 py-2 text-sm ${
                              active
                                ? 'bg-[#28694D] text-white'
                                : 'text-[#111111CC] hover:bg-[#1111110A]'
                            }`}
                          >
                            {sub.label}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            }

            const active = item.to ? pathname.startsWith(item.to) : false
            return (
              <Link
                key={item.label}
                to={item.to!}
                onClick={() => setSidebarOpen(false)}
                className={`block rounded-lg px-3 py-2 text-sm font-medium ${
                  active ? 'bg-[#28694D] text-white' : 'text-[#111111CC] hover:bg-[#1111110A]'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="mt-8 border-t border-[#1111111C] pt-4">
          {userEmail && <p className="mb-3 truncate text-xs text-[#11111180]">{userEmail}</p>}
          <button
            type="button"
            onClick={onLogout}
            className="w-full rounded-lg border border-[#11111133] px-3 py-2 text-sm font-medium text-[#111111CC] hover:bg-[#1111110A]"
          >
            Вийти
          </button>
        </div>
      </aside>

      <div className="md:pl-72">
        <header className="border-b border-[#1111111C] bg-[#FBFBF9] px-4 py-4 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold sm:text-2xl">{title}</h1>
              {subtitle && <p className="mt-1 text-sm text-[#11111199]">{subtitle}</p>}
            </div>
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg border border-[#11111133] px-3 py-2 text-sm md:hidden"
            >
              Меню
            </button>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6">{children}</main>
      </div>
    </div>
  )
}
