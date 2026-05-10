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
    <div className="bg-white rounded-lg shadow-premium border border-border/70 p-1.5">
      <div className="bg-surface/80 rounded-md p-1 grid grid-cols-3 gap-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            disabled={disabled}
            onClick={() => onChange(t.key)}
            className={clsx(
              'flex items-center justify-center gap-2 px-3 py-2.5 rounded-md text-[13px] font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50',
              active === t.key
                ? 'bg-white text-primary shadow-sm ring-1 ring-border/80'
                : 'text-muted hover:bg-white/60 hover:text-main'
            )}
          >
            <t.icon size={15} className={active === t.key ? 'text-primary' : 'text-muted'} />
            {t.label}
          </button>
        ))}
      </div>
    </div>
  )
}
