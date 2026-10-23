import { useAuth } from "@/_core/hooks/useAuth";
import { StudentPortalShell } from "@/components/StudentPortalShell";
import { trpc } from "@/lib/trpc";
import { ArrowUpRight, AtSign, Phone } from "lucide-react";

export default function Developer() {
  const { user, isAuthenticated } = useAuth();
  const profileQuery = trpc.codecraft.profile.get.useQuery(undefined, { enabled: isAuthenticated, retry: false });
  const profile = profileQuery.data;
  const name = user?.name || "Learner profile";
  const role = profile?.professionalRole || "Learner";
  const education = profile?.education || "Add your education";
  const email = user?.email || "support@codecraft.student";
  const phone = profile?.phone;
  const initials = name.split(" ").map(part => part[0]).join("").slice(0, 2).toUpperCase() || "L";

  return <StudentPortalShell eyebrow="Developer / contact" title={name} description="Your compact public-facing learner and developer profile, powered by the private details you choose to save.">
    <div className="flex min-h-[58vh] items-start justify-end">
      <section className="w-full max-w-md border border-[#b8d2ef] bg-white p-5 shadow-[0_20px_60px_rgba(23,74,136,0.10)] sm:p-6">
        <div className="flex items-start gap-4"><div className="grid h-24 w-24 shrink-0 place-items-center border-2 border-[#63a8ff] bg-[#1a609f] text-2xl font-bold text-white sm:h-28 sm:w-28">{initials}</div><div className="min-w-0 pt-1"><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#5681b0]">Developer</p><h2 className="mt-1 font-display text-2xl font-bold tracking-[-0.06em] text-[#102447]">{name}</h2><p className="mt-2 text-sm font-medium text-[#47709d]">{education} · {role}</p></div></div>
        <div className="mt-5 border-t border-[#d6e4f4] pt-4"><p className="text-sm leading-6 text-[#5c7493]">{profile?.bio || "Add a short introduction from your personal profile drawer to describe the work and learning journey you want to share."}</p></div>
        <div className="mt-5 grid grid-cols-2 gap-3"><a href={`mailto:${email}`} className="group inline-flex items-center justify-between border border-[#9fc3e8] bg-[#edf6ff] px-3 py-3 text-sm font-semibold text-[#174a88] transition hover:bg-[#dbeaff]"><span className="inline-flex items-center gap-2"><AtSign size={16} />Email</span><ArrowUpRight size={15} /></a>{phone ? <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="group inline-flex items-center justify-between border border-[#9fc3e8] bg-[#edf6ff] px-3 py-3 text-sm font-semibold text-[#174a88] transition hover:bg-[#dbeaff]"><span className="inline-flex items-center gap-2"><Phone size={16} />Call</span><ArrowUpRight size={15} /></a> : <div className="border border-[#d6e4f4] bg-[#f8fbff] px-3 py-3 text-sm text-[#7892b1]">Add phone in profile</div>}</div>
      </section>
    </div>
  </StudentPortalShell>;
}
