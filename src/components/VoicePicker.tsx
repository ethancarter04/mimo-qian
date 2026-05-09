import { User } from 'lucide-react'
import clsx from 'clsx'

const VOICES = [
  '冰糖', '茉莉', '苏打', '白桦', 'Mia', 'Chloe', 'Milo', 'Dean',
]

interface Props {
  selected: string
  onSelect: (v: string) => void
}

export default function VoicePicker({ selected, onSelect }: Props) {
  return (
    <div className="bg-white rounded-lg border border-border p-4">
      <div className="flex items-center gap-2 text-sm font-medium text-main mb-3">
        <User size={16} />
        预置音色
      </div>
      <div className="grid grid-cols-4 gap-2">
        {VOICES.map((v) => (
          <button
            key={v}
            onClick={() => onSelect(v)}
            className={clsx(
              'px-3 py-2 rounded-md text-sm transition-colors border',
              selected === v
                ? 'bg-primary/10 border-primary text-primary font-medium'
                : 'border-border text-muted hover:border-primary/40 hover:text-main'
            )}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  )
}
