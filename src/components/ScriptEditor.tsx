import { FileText, Sparkles } from 'lucide-react'

interface Props {
  text: string
  onChange: (text: string) => void
  onOptimize?: () => void
}

export default function ScriptEditor({ text, onChange, onOptimize }: Props) {
  return (
    <div className="bg-white rounded-lg border border-border p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-sm font-medium text-main">
          <FileText size={16} />
          朗读文本
        </div>
        <span className="text-xs text-muted">{text.length}/1000</span>
      </div>
      <textarea
        value={text}
        onChange={(e) => onChange(e.target.value.slice(0, 1000))}
        placeholder="输入要朗读的文本..."
        rows={6}
        className="w-full resize-none rounded-md border border-border bg-surface px-3 py-2 text-sm text-main placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
      />
      {onOptimize && (
        <button
          onClick={onOptimize}
          disabled={!text.trim()}
          className="mt-2 flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <Sparkles size={14} />
          AI 优化文本
        </button>
      )}
    </div>
  )
}
