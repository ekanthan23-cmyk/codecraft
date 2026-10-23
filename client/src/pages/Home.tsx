import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { StudentPortalShell } from "@/components/StudentPortalShell";
import { trpc } from "@/lib/trpc";
import { defaultWorkspaceTool, isWorkspaceToolSlug, workspaceTools, type WorkspaceTool } from "@/lib/workspace-tools";
import { ArrowRight, BookOpen, CalendarDays, ChevronDown, ChevronRight, CirclePlay, Code2, ExternalLink, Flame, FolderKanban, GraduationCap, MonitorPlay, Play, Sparkles, Target, Trophy } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

const workshopUpdates = [
  {
    type: "LIVE WORKSHOP",
    title: "Python problem-solving room",
    detail: "Loops, lists, and small interview patterns",
    date: "Today · 7:00 PM",
    tone: "from-[#1b5da1] via-[#2d7fc8] to-[#72c7e8]",
  },
  {
    type: "NEW RESOURCE",
    title: "DSA: two-pointer patterns",
    detail: "A short visual guide before your next practice set",
    date: "Updated today",
    tone: "from-[#19376d] via-[#285a9f] to-[#82b5e9]",
  },
  {
    type: "BUILD UPDATE",
    title: "React mini-project clinic",
    detail: "Bring one component and leave with a cleaner UI",
    date: "Saturday · 10:00 AM",
    tone: "from-[#0e5b6c] via-[#1e8c9a] to-[#78d1cb]",
  },
];

const scheduleItems = [
  { label: "Functions", meta: "Programming foundations", status: "Continue", progress: 72, color: "#46a7aa" },
  { label: "Two pointers", meta: "DSA practice", status: "Practice", progress: 38, color: "#4c89d6" },
  { label: "Components", meta: "React workspace", status: "Start", progress: 12, color: "#8c70d2" },
];

function Meter({ value, color = "#4d94d9" }: { value: number; color?: string }) {
  return <div className="h-2 overflow-hidden rounded-full bg-[#e4edf8]"><div className="h-full rounded-full transition-all" style={{ width: `${Math.max(0, Math.min(100, value))}%`, backgroundColor: color }} /></div>;
}

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [activeToolSlug, setActiveToolSlug] = useState<WorkspaceTool["slug"]>(defaultWorkspaceTool.slug);
  const utils = trpc.useUtils();
  const dashboardQuery = trpc.codecraft.dashboard.useQuery(undefined, { enabled: isAuthenticated, retry: false, refetchOnWindowFocus: false });
  const preferenceQuery = trpc.codecraft.preferences.workspace.useQuery(undefined, { enabled: isAuthenticated, retry: false });
  const selectToolMutation = trpc.codecraft.preferences.selectWorkspaceTool.useMutation({ onSuccess: () => utils.codecraft.preferences.workspace.invalidate(), onError: () => toast.error("Your workspace preference could not be saved.") });

  useEffect(() => { const timer = window.setInterval(() => setCurrentDate(new Date()), 60_000); return () => window.clearInterval(timer); }, []);
  useEffect(() => { const selected = preferenceQuery.data?.selectedTool; if (selected && isWorkspaceToolSlug(selected)) setActiveToolSlug(selected); }, [preferenceQuery.data?.selectedTool]);

  const dashboard = dashboardQuery.data;
  const activePath = dashboard?.activePath;
  const activeTool = workspaceTools.find(tool => tool.slug === activeToolSlug) ?? defaultWorkspaceTool;
  const firstName = user?.name?.split(" ")[0] || "Learner";
  const profileName = user?.name || "Learner profile";
  const greeting = currentDate.getHours() < 12 ? "Good morning" : currentDate.getHours() < 18 ? "Good afternoon" : "Good evening";
  const dateLabel = new Intl.DateTimeFormat(undefined, { weekday: "long", day: "numeric", month: "short", year: "numeric" }).format(currentDate);
  const progress = activePath?.progressPercent ?? 0;
  const completedLessons = dashboard?.summary.completedLessons ?? 0;
  const totalLessons = activePath?.totalLessons ?? 50;
  const monthDays = useMemo(() => Array.from({ length: 14 }, (_, index) => index + 1), []);
  const chooseTool = (tool: WorkspaceTool) => { setActiveToolSlug(tool.slug); if (isAuthenticated) selectToolMutation.mutate({ selectedTool: tool.slug }); };

  return <StudentPortalShell eyebrow="Student portal" title={`${greeting}, ${firstName}`} description="" profileDetails={{ goal: "Build practical coding confidence", path: activePath?.courseTitle ?? activeTool.courseTitle, progress: `${progress}% complete`, nextAction: activeTool.lessonTitle }}>
    <div className="space-y-8 pb-10">
      <section className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#6d89ae]">{dateLabel} · personal learning space</p>
          <h2 className="mt-2 max-w-3xl font-display text-3xl font-bold tracking-[-0.06em] text-[#102447] sm:text-4xl">Welcome {firstName} <span className="text-[#4e9ad8]">✦</span></h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#607a9d]">Your workshops, study plan, project practice, and personal developer data are collected here in one place.</p>
        </div>
        <button onClick={() => setLocation("/developer")} className="flex w-full items-center gap-3 border border-[#b8d2ed] bg-white p-3 text-left shadow-[0_8px_24px_rgba(23,74,136,0.06)] transition hover:-translate-y-0.5 hover:border-[#4d94d9] sm:w-auto sm:min-w-[235px]">
          <span className="grid h-12 w-12 place-items-center rounded-full border-2 border-[#dcecff] bg-[#1a609f] text-sm font-bold text-white">{profileName.split(" ").map(part => part[0]).join("").slice(0, 2).toUpperCase()}</span>
          <span className="min-w-0"><span className="block text-sm font-bold text-[#173d72]">{profileName}</span><span className="block text-xs text-[#7189a8]">{dashboard?.profile?.professionalRole || "Learner"} · {dashboard?.profile?.education || "Add your education"}</span><span className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-[#2f72b0]">Open personal profile <ChevronRight size={13}/></span></span>
        </button>
      </section>

      <section aria-label="Workshop updates" className="relative overflow-hidden bg-[#0d2346] p-5 text-white shadow-[0_20px_45px_rgba(13,35,70,0.18)] sm:p-7">
        <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full bg-[#4aa9dd]/20 blur-3xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-4"><div><div className="flex items-center gap-2 text-[#99d9fa]"><Sparkles size={15}/><p className="font-mono text-[10px] uppercase tracking-[0.18em]">Workshop & portal updates</p></div><h3 className="mt-2 font-display text-2xl font-bold tracking-[-0.05em] sm:text-3xl">What is happening in CodeCraft</h3></div><button onClick={() => setLocation("/workshops")} className="inline-flex items-center gap-1 text-xs font-semibold text-[#bde8ff] hover:text-white">View all workshops <ArrowRight size={14}/></button></div>
        <div className="relative mt-6 flex snap-x gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">{workshopUpdates.map(update => <button key={update.title} onClick={() => setLocation("/workshops")} className={`group min-w-[260px] snap-start bg-gradient-to-br ${update.tone} p-5 text-left transition hover:-translate-y-1 sm:min-w-[31%]`}><div className="flex items-center justify-between gap-3"><span className="font-mono text-[9px] tracking-[0.16em] text-white/75">{update.type}</span><CirclePlay size={16} className="text-white/80 transition group-hover:scale-110" /></div><p className="mt-7 font-display text-xl font-bold leading-tight tracking-[-0.04em]">{update.title}</p><p className="mt-2 min-h-10 text-xs leading-5 text-white/80">{update.detail}</p><div className="mt-5 flex items-center justify-between border-t border-white/20 pt-3 text-[11px] text-white/80"><span>{update.date}</span><ChevronRight size={14}/></div></button>)}</div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.7fr)]">
        <div className="border border-[#bfd3ea] bg-white p-5 shadow-[0_12px_32px_rgba(23,74,136,0.05)] sm:p-7">
          <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="font-mono text-[10px] uppercase tracking-[0.17em] text-[#6b87ab]">Your schedule</p><h3 className="mt-1 font-display text-2xl font-bold tracking-[-0.055em] text-[#102447]">Keep your learning moving</h3></div><div className="flex items-center gap-2 text-xs font-semibold text-[#4e6e98]"><span className="rounded-full bg-[#e8f4ff] px-3 py-1.5">Week 2</span><ChevronDown size={15}/></div></div>
          <div className="mt-5 flex gap-1 overflow-x-auto pb-2">{monthDays.map(day => <div key={day} className={`min-w-[42px] border px-2 py-2 text-center ${day === currentDate.getDate() ? "border-[#3185cb] bg-[#e9f5ff] text-[#17609b]" : "border-transparent text-[#9aacc3]"}`}><span className="block font-mono text-[9px] uppercase">{["M", "T", "W", "T", "F", "S", "S"][day % 7]}</span><span className="mt-1 block text-xs font-bold">{day}</span>{day % 3 === 0 && <span className="mx-auto mt-1 block h-1 w-1 rounded-full bg-[#48a6aa]"/>}</div>)}</div>
          <div className="mt-5 space-y-3">{scheduleItems.map(item => <button key={item.label} onClick={() => setLocation("/projects")} className="group flex w-full items-center gap-4 border border-[#e0eaf5] p-4 text-left transition hover:border-[#7fb4df] hover:bg-[#f8fbff]"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-4 border-[#e3eef8]" style={{ borderTopColor: item.color }}><Code2 size={15} style={{ color: item.color }}/></span><span className="min-w-0 flex-1"><span className="flex flex-wrap items-center justify-between gap-2"><span className="text-sm font-bold text-[#183e73]">{item.label}</span><span className="text-[11px] font-semibold text-[#7690b1]">{item.status} <ChevronRight size={13} className="ml-1 inline transition group-hover:translate-x-1"/></span></span><span className="mt-1 block text-xs text-[#8196b3]">{item.meta}</span><span className="mt-3 block"><Meter value={item.progress} color={item.color}/></span></span></button>)}</div>
        </div>

        <aside className="border border-[#bfd3ea] bg-[#f8fbff] p-5 sm:p-7"><div className="flex items-center justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[0.17em] text-[#6b87ab]">Monthly tracker</p><h3 className="mt-1 font-display text-xl font-bold tracking-[-0.045em] text-[#102447]">September 2026</h3></div><CalendarDays size={21} className="text-[#368bd1]"/></div><div className="mt-6 grid grid-cols-7 gap-1 text-center text-[10px] text-[#91a5bd]">{["M", "T", "W", "T", "F", "S", "S"].map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}</div><div className="mt-2 grid grid-cols-7 gap-1 text-center text-xs">{Array.from({ length: 30 }, (_, index) => index + 1).map(day => <span key={day} className={`grid h-8 place-items-center ${day === currentDate.getDate() ? "bg-[#1a609f] font-bold text-white" : day % 4 === 0 ? "bg-[#dff4f1] text-[#207f7a]" : "text-[#58769b]"}`}>{day}</span>)}</div><div className="mt-5 flex flex-wrap gap-3 text-[10px] text-[#7189a8]"><span className="flex items-center gap-1"><i className="h-2 w-2 bg-[#dff4f1]"/> Achieved</span><span className="flex items-center gap-1"><i className="h-2 w-2 bg-[#1a609f]"/> Today</span><span className="flex items-center gap-1"><i className="h-2 w-2 bg-[#edf1f6]"/> Planned</span></div></aside>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="border border-[#bfd3ea] bg-white p-5 sm:p-7"><div className="flex items-center justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[0.17em] text-[#6b87ab]">Learning pulse</p><h3 className="mt-1 font-display text-2xl font-bold tracking-[-0.05em] text-[#102447]">Your progress at a glance</h3></div><Flame size={20} className="text-[#ee9f4b]"/></div><div className="mt-6 grid grid-cols-2 gap-3"><div className="bg-[#f3f8fe] p-4"><p className="text-[11px] text-[#7b92ae]">Path completion</p><p className="mt-1 text-2xl font-bold text-[#174a88]">{progress}%</p></div><div className="bg-[#f3f8fe] p-4"><p className="text-[11px] text-[#7b92ae]">Lessons done</p><p className="mt-1 text-2xl font-bold text-[#174a88]">{completedLessons}<span className="text-sm font-normal text-[#7d95b2]">/{totalLessons}</span></p></div><div className="bg-[#f3f8fe] p-4"><p className="text-[11px] text-[#7b92ae]">Problems solved</p><p className="mt-1 text-2xl font-bold text-[#174a88]">{dashboard?.summary.solvedProblems ?? 0}</p></div><div className="bg-[#f3f8fe] p-4"><p className="text-[11px] text-[#7b92ae]">Craft points</p><p className="mt-1 text-2xl font-bold text-[#174a88]">{dashboard?.summary.totalCraftPoints ?? 0}</p></div></div><div className="mt-5"><Meter value={progress}/></div></div>
        <div className="border border-[#bfd3ea] bg-white p-5 sm:p-7"><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="font-mono text-[10px] uppercase tracking-[0.17em] text-[#6b87ab]">Choose your workspace</p><h3 className="mt-1 font-display text-2xl font-bold tracking-[-0.05em] text-[#102447]">Learn, then write code.</h3></div><span className="text-xs text-[#7890ad]">{activeTool.label} selected</span></div><div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">{workspaceTools.map(tool => { const Icon = tool.icon; const selected = activeTool.slug === tool.slug; return <button key={tool.slug} onClick={() => chooseTool(tool)} className={`flex min-h-[78px] flex-col justify-between border p-3 text-left transition ${selected ? "border-[#2f82d6] bg-[#edf6ff] text-[#174a88]" : "border-[#d6e4f4] bg-white text-[#6a82a2] hover:border-[#9fc3e8] hover:bg-[#f4f9ff]"}`}><span className="flex items-center justify-between"><Icon size={16}/><span className="font-mono text-[9px]">{tool.mark}</span></span><span className="text-xs font-semibold">{tool.label}</span></button>; })}</div><div className="mt-5 flex flex-wrap gap-3"><button onClick={() => { if (!isAuthenticated) startLogin(); else setLocation("/projects"); }} className="inline-flex items-center gap-2 bg-[#174a88] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#2265a3]"><Play size={13} fill="currentColor"/> {isAuthenticated ? "Continue learning" : "Sign in to save"}</button><button onClick={() => setLocation("/tutor")} className="inline-flex items-center gap-2 border border-[#a9c7e5] px-4 py-2.5 text-xs font-semibold text-[#174a88] hover:bg-[#edf6ff]">Ask AI Tutor <ArrowRight size={13}/></button></div></div>
      </section>

      <section className="grid gap-5 md:grid-cols-3"><button onClick={() => setLocation("/workshops")} className="group border border-[#bfd3ea] bg-white p-5 text-left transition hover:-translate-y-1 hover:border-[#4d94d9]"><MonitorPlay size={19} className="text-[#2f82d6]"/><p className="mt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#6d89ae]">Live classes</p><p className="mt-1 font-display text-xl font-bold text-[#102447]">Join a workshop and ask questions</p><span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#174a88]">Open workshops <ArrowRight size={14}/></span></button><button onClick={() => setLocation("/library")} className="group border border-[#bfd3ea] bg-white p-5 text-left transition hover:-translate-y-1 hover:border-[#4d94d9]"><BookOpen size={19} className="text-[#2f82d6]"/><p className="mt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#6d89ae]">Course library</p><p className="mt-1 font-display text-xl font-bold text-[#102447]">Read study material without leaving CodeCraft</p><span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#174a88]">Open library <ArrowRight size={14}/></span></button><button onClick={() => setLocation("/projects")} className="group border border-[#bfd3ea] bg-white p-5 text-left transition hover:-translate-y-1 hover:border-[#4d94d9]"><FolderKanban size={19} className="text-[#2f82d6]"/><p className="mt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#6d89ae]">Project lane</p><p className="mt-1 font-display text-xl font-bold text-[#102447]">Build, save, submit, and publish</p><span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#174a88]">Open projects <ArrowRight size={14}/></span></button></section>

      <section className="flex flex-col gap-4 border-t border-[#c8d9eb] pt-6 text-xs text-[#7890ad] sm:flex-row sm:items-center sm:justify-between"><p className="flex items-center gap-2"><Target size={15} className="text-[#3c91cd]"/> One focused session today is enough to move forward.</p><div className="flex items-center gap-4"><span className="inline-flex items-center gap-1"><Trophy size={14} className="text-[#e7a549]"/> {dashboard?.summary.totalCraftPoints ?? 0} craft points</span><button onClick={() => setLocation("/developer")} className="inline-flex items-center gap-1 font-semibold text-[#2d73b1]">Personal data <ExternalLink size={12}/></button></div></section>
    </div>
  </StudentPortalShell>;
}
