"use client";

import { Bell, BookOpen, ChevronLeft, Clock3, FileText, Grid2X2, Menu, Settings, Sparkles, Users } from "lucide-react";
import type { ReactNode } from "react";

export default function AppShell({ children }: { children: ReactNode }) {
  const navItems = [[Grid2X2, "Home"], [Users, "My Classroom"], [FileText, "Assignments"], [BookOpen, "Exams"], [Clock3, "My Library"]] as const;

  return <main className="min-h-screen bg-[#e9e8e7] text-[#2f3030] md:flex md:p-3">
    <aside className="hidden w-63.75 shrink-0 flex-col rounded-sm bg-white px-5 py-5 shadow-sm md:flex">
      <div className="flex items-center gap-2 text-[22px] font-extrabold tracking-[-1px]"><span className="grid h-8 w-8 place-items-center rounded-lg bg-[#303131] text-white">V</span>VedaAI</div>
      <button className="mt-12 flex items-center justify-center gap-2 rounded-full border-2 border-[#ff7957] bg-[#303131] py-2.5 text-sm font-medium text-white"><Sparkles className="h-4 w-4" /> AI Teacher&apos;s Toolkit</button>
      <nav className="mt-10 space-y-1">{navItems.map(([Icon, label]) => <div key={label} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${label === "Exams" ? "bg-[#eeeeee] font-medium" : "text-[#858382]"}`}><Icon className="h-4 w-4" />{label}</div>)}</nav>
      <div className="mt-auto"><div className="flex items-center gap-3 px-3 py-2.5 text-sm text-[#858382]"><Settings className="h-4 w-4" />Settings</div><div className="mt-3 flex items-center gap-3 rounded-2xl bg-[#f0f0f0] p-3"><div className="grid h-10 w-10 place-items-center rounded-full bg-white text-xl">♕</div><div><p className="text-xs font-semibold">Delhi Public School</p><p className="text-[11px] text-[#858382]">Bokaro Steel City</p></div></div></div>
    </aside>
    <section className="flex min-h-screen min-w-0 flex-1 flex-col md:ml-3 md:min-h-[calc(100vh-24px)] md:rounded-sm md:bg-[#f5f4f3]">
      <header className="flex h-14 items-center justify-between border-b border-[#e9e7e5] bg-white px-4 sm:px-7 md:rounded-t-sm"><div className="flex items-center gap-3"><ChevronLeft className="h-5 w-5" /><span className="text-sm font-medium text-[#aaa7a5]">▣ &nbsp; Exams</span></div><div className="flex items-center gap-4"><span className="hidden text-sm sm:inline">? &nbsp; ◇ &nbsp; ✦</span><Bell className="h-5 w-5" /><span className="hidden text-sm font-semibold sm:inline">Madhur Rastogi⌄</span><Menu className="h-5 w-5 md:hidden" /></div></header><div className="min-h-0 flex-1">{children}</div>
    </section>
  </main>;
}
