import { User } from 'lucide-react'
import clsx from 'clsx'

const VOICES = [
  '冰糖', '茉莉', '苏打', '白桦', 'Mia', 'Chloe', 'Milo', 'Dean',
]

interface Props {
  selected: string
  onSelect: (v: string) => void
  disabled?: boolean
}

export default function VoicePicker({ selected, onSelect, disabled = false }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-premium border border-border/70 p-5">
      <div className="flex items-center gap-2 text-sm font-semibold text-main mb-3">
        <User size={17} className="text-primary" />
        预置音色
      </div>
      <div className="grid grid-cols-2 gap-2">
        {VOICES.map((v) => (
          <button
            key={v}
            disabled={disabled}
            onClick={() => onSelect(v)}
            className={clsx(
              'px-3 py-2 rounded-md text-sm transition-all border disabled:cursor-not-allowed disabled:opacity-50',
              selected === v
                ? 'bg-primary/10 border-primary/60 text-primary font-semibold shadow-sm'
                : 'border-border/80 text-muted hover:border-primary/40 hover:bg-surface hover:text-main'
            )}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  )
}
