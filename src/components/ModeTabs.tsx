import type { Mode } from '../types'
import { Mic, Wand2, Fingerprint } from 'lucide-react'
import clsx from 'clsx'

const tabs: { key: Mode; label: string; icon: typeof Mic }[] = [
  { key: 'preset', label: '预置音色', icon: Mic },
  { key: 'design', label: '音色设计', icon: Wand2 },
  { key: 'clone', label: '语音克隆', icon: Fingerprint },
]

interface Props {
  active: Mode
  onChange: (mode: Mode) => void
  disabled?: boolean
}

export default function ModeTabs({ active, onChange, disabled = false }: Props) {
  return (
    <div className="bg-white rounded-lg p-2 border border-border grid grid-cols-3 gap-2">
      {tabs.map((t) => (
        <button
          key={t.key}
          disabled={disabled}
          onClick={() => onChange(t.key)}
          className={clsx(
            'flex flex-col items-center gap-1 px-3 py-3 rounded-md text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
            active === t.key
              ? 'bg-primary text-white'
              : 'text-muted hover:bg-surface hover:text-main'
          )}
        >
          <t.icon size={16} />
          {t.label}
        </button>
      ))}
    </div>
  )
}
