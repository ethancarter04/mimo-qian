import { FileText, Sparkles } from 'lucide-react'
import clsx from 'clsx'

export type EditorHeight = 'compact' | 'comfortable' | 'large'

const heightOptions: { value: EditorHeight; label: string; className: string }[] = [
  { value: 'compact', label: '小', className: 'h-44' },
  { value: 'comfortable', label: '中', className: 'h-60' },
  { value: 'large', label: '大', className: 'h-80' },
]

interface Props {
  text: string
  onChange: (text: string) => void
  onOptimize?: () => void
  disabled?: boolean
  height: EditorHeight
  onHeightChange: (height: EditorHeight) => void
}

export default function ScriptEditor({
  text,
  onChange,
  onOptimize,
  disabled = false,
  height,
  onHeightChange,
}: Props) {
  const selectedHeight = heightOptions.find((option) => option.value === height) || heightOptions[1]

  return (
    <div className="bg-white/95 rounded-lg shadow-premium border border-black/[0.04] p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-main tracking-tight">
          <FileText size={17} className="text-primary" />
          朗读文本
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-md bg-zinc-100 p-1">
            {heightOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onHeightChange(option.value)}
                disabled={disabled}
                className={clsx(
                  'px-2.5 py-1 text-xs font-medium rounded transition disabled:cursor-not-allowed disabled:opacity-50',
                  height === option.value
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-muted hover:text-main'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
          <span className="text-xs font-mono bg-surface px-2 py-1 rounded-md text-muted">
            {text.length} <span className="opacity-60">/ 1000</span>
          </span>
        </div>
      </div>
      <textarea
        value={text}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value.slice(0, 1000))}
        placeholder="在此输入要合成语音的文本段落..."
        className={clsx(
          'w-full resize-y min-h-36 max-h-[520px] rounded-md border border-border/80 bg-zinc-50/80 px-4 py-3 text-[15px] leading-relaxed text-main placeholder:text-muted/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/40 disabled:opacity-60 transition-all',
          selectedHeight.className
        )}
      />
      {onOptimize && (
        <div className="mt-3 flex justify-end">
          <button
            onClick={onOptimize}
            disabled={!text.trim()}
            className="flex items-center gap-1.5 text-[13px] font-medium text-primary bg-primary/[0.04] hover:bg-primary/[0.08] px-3 py-1.5 rounded-md disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Sparkles size={14} />
            AI 优化文本
          </button>
        </div>
      )}
    </div>
  )
}
