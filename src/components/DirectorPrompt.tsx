import { Clapperboard } from 'lucide-react'

interface Props {
  value: string
  onChange: (v: string) => void
  disabled?: boolean
}

export default function DirectorPrompt({ value, onChange, disabled = false }: Props) {
  return (
    <div className="bg-white rounded-lg border border-border p-4">
      <div className="flex items-center gap-2 text-sm font-medium text-main mb-3">
        <Clapperboard size={16} />
        导演提示词
      </div>
      <textarea
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder="例如：请使用温柔、克制、稍慢的语气朗读。"
        rows={3}
        className="w-full resize-none rounded-md border border-border bg-surface px-3 py-2 text-sm text-main placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:opacity-60 transition"
      />
    </div>
  )
}
