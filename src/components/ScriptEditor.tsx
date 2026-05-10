import { FileText, Sparkles } from 'lucide-react'

interface Props {
  text: string
  onChange: (text: string) => void
  onOptimize?: () => void
  disabled?: boolean
}

export default function ScriptEditor({ text, onChange, onOptimize, disabled = false }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-premium border border-border/70 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-main tracking-tight">
          <FileText size={17} className="text-primary" />
          朗读文本
        </div>
        <span className="text-xs font-mono bg-surface px-2 py-1 rounded-md text-muted">
          {text.length} <span className="opacity-60">/ 1000</span>
        </span>
      </div>
      <textarea
        value={text}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value.slice(0, 1000))}
        placeholder="在此输入要合成语音的文本段落..."
        rows={12}
        className="w-full resize-none rounded-md border border-border/80 bg-surface/70 px-4 py-3 text-[15px] leading-relaxed text-main placeholder:text-muted/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 disabled:opacity-60 transition-all"
      />
      {onOptimize && (
        <div className="mt-3 flex justify-end">
          <button
            onClick={onOptimize}
            disabled={!text.trim()}
            className="flex items-center gap-1.5 text-[13px] font-medium text-primary bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-md disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Sparkles size={14} />
            AI 优化文本
          </button>
        </div>
      )}
    </div>
  )
}
