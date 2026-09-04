export default function TypingIndicator() {
  return (
    <div className="flex justify-start px-4">
      <div className="flex items-center gap-1 px-4 py-3 bg-white border border-slate-100 rounded-2xl rounded-bl-sm shadow-sm">
        <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce-subtle" />
        <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce-subtle" />
        <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce-subtle" />
      </div>
    </div>
  );
}
