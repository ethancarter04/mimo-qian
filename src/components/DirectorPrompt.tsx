import { Clapperboard } from 'lucide-react'

interface Props {
  value: string
  onChange: (v: string) => void
  disabled?: boolean
}

export default function DirectorPrompt({ value, onChange, disabled = false }: Props) {
  return (
    <div className="bg-white/95 rounded-lg shadow-premium border border-black/[0.04] p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-main mb-3">
        <Clapperboard size={17} className="text-primary" />
        导演提示词
      </div>
      <textarea
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder="例如：请使用温柔、克制、稍慢的语气朗读。"
        rows={2}
        className="w-full resize-none rounded-md border border-border/80 bg-zinc-50/80 px-4 py-3 text-sm text-main placeholder:text-muted/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/40 disabled:opacity-60 transition-all"
      />
    </div>
  )
}
