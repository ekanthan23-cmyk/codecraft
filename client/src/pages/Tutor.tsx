import { useAuth } from "@/_core/hooks/useAuth";
import { AIChatBox, type Message } from "@/components/AIChatBox";
import { StudentPortalShell } from "@/components/StudentPortalShell";
import { trpc } from "@/lib/trpc";
import { Code2, ListTree, MessageCircleQuestion, Network, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type TutorTopic = "dsa" | "java" | "python" | "cpp" | "web" | "react" | "sql" | "project";
const topics: Array<{ id: TutorTopic; label: string; icon: typeof Code2 }> = [
  { id: "dsa", label: "DSA", icon: ListTree },
  { id: "java", label: "Java", icon: Code2 },
  { id: "python", label: "Python", icon: Code2 },
  { id: "cpp", label: "C++", icon: Code2 },
  { id: "web", label: "Web", icon: Network },
  { id: "react", label: "React", icon: Sparkles },
  { id: "sql", label: "SQL", icon: Network },
  { id: "project", label: "Project", icon: MessageCircleQuestion },
];
const suggestions = [
  "Explain two pointers step by step with a small array.",
  "Why is my Python list code not working?",
  "Help me plan the first version of my project.",
];

export default function Tutor() {
  const { isAuthenticated } = useAuth();
  const [topic, setTopic] = useState<TutorTopic>("dsa");
  const [conversationId, setConversationId] = useState<number | undefined>();
  const [messages, setMessages] = useState<Message[]>([]);
  const utils = trpc.useUtils();
  const conversationsQuery = trpc.codecraft.tutor.listConversations.useQuery(undefined, { enabled: isAuthenticated, retry: false });
  const conversationQuery = trpc.codecraft.tutor.getConversation.useQuery({ conversationId: conversationId ?? 0 }, { enabled: isAuthenticated && Boolean(conversationId), retry: false });
  const askMutation = trpc.codecraft.tutor.ask.useMutation({
    onSuccess: async result => { setConversationId(result.conversationId); setMessages(current => [...current, { role: "assistant", content: result.answer }]); await utils.codecraft.tutor.listConversations.invalidate(); },
    onError: error => { setMessages(current => current.slice(0, -1)); toast.error(error.message || "The tutor could not respond. Please try again."); },
  });
  const previewMutation = trpc.codecraft.tutor.preview.useMutation({
    onSuccess: result => setMessages(current => [...current, { role: "assistant", content: result.answer }]),
    onError: error => { setMessages(current => current.slice(0, -1)); toast.error(error.message || "The tutor could not respond. Please try again."); },
  });
  useEffect(() => { if (conversationQuery.data) setMessages(conversationQuery.data.messages.map(message => ({ role: message.role === "student" ? "user" : "assistant", content: message.content }))); }, [conversationQuery.data]);
  const ask = (question: string) => {
    setMessages(current => [...current, { role: "user", content: question }]);
    if (!isAuthenticated) { toast("Guest answer shown. Sign in to keep your private tutor history."); previewMutation.mutate({ question, topic, workspaceTool: topic }); return; }
    askMutation.mutate({ conversationId, question, topic, workspaceTool: topic });
  };
  const newConversation = () => { setConversationId(undefined); setMessages([]); };

  return <StudentPortalShell eyebrow="AI tutor / conversation" title="Ask. Understand. Build." description="Talk through a coding problem, DSA question, error, or project decision. CodeCraft explains the idea first and helps you choose the next step." action={<button onClick={newConversation} className="hidden items-center gap-2 border border-[#9fc3e8] bg-white px-3 py-2 text-xs font-semibold text-[#174a88] hover:bg-[#edf6ff] sm:inline-flex"><MessageCircleQuestion size={14}/>New chat</button>}>
    <section className="mx-auto max-w-4xl">
      <div className="mb-4 flex flex-wrap gap-2">
        {topics.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => setTopic(id)} className={`inline-flex items-center gap-2 border px-3 py-2 text-xs font-semibold transition ${topic === id ? "border-[#2f82d6] bg-[#174a88] text-white" : "border-[#b8d2ef] bg-white text-[#47709d] hover:bg-[#edf6ff]"}`}><Icon size={14}/>{label}</button>)}
      </div>
      <div className="border border-[#b8d2ef] bg-white p-3 shadow-[0_20px_60px_rgba(23,74,136,0.08)] sm:p-5">
        <div className="flex items-center justify-between border-b border-[#d6e4f4] px-2 pb-4"><div><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#5681b0]">{topic} tutor</p><h2 className="mt-1 font-display text-2xl font-bold tracking-[-0.055em] text-[#102447]">What are you working on?</h2></div><span className="hidden rounded-full bg-[#edf6ff] px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-[#47709d] sm:block">{isAuthenticated ? "Private history" : "Guest preview"}</span></div>
        <AIChatBox messages={messages} onSendMessage={ask} isLoading={askMutation.isPending || previewMutation.isPending} height="560px" className="mt-4 border-[#d6e4f4] bg-[#f8fbff] shadow-none" placeholder="Ask about an array, graph, bug, concept, or project…" emptyStateMessage="Ask your question in your own words. The tutor will explain it step by step." suggestedPrompts={suggestions}/>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[#5c7493]"><span>{isAuthenticated ? `${conversationsQuery.data?.length ?? 0} saved conversations` : "Sign in when you want private history"}</span><span className="font-medium text-[#174a88]">Try the answer in your workspace →</span></div>
    </section>
  </StudentPortalShell>;
}
