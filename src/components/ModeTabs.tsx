import type { Mode } from '../types'
import { Mic, Palette, Copy } from 'lucide-react'
import clsx from 'clsx'

const tabs: { key: Mode; label: string; icon: typeof Mic }[] = [
  { key: 'preset', label: '预置音色', icon: Mic },
  { key: 'design', label: '音色设计', icon: Palette },
  { key: 'clone', label: '语音克隆', icon: Copy },
]

interface Props {
  active: Mode
  onChange: (mode: Mode) => void
}

export default function ModeTabs({ active, onChange }: Props) {
  return (
    <div className="flex gap-1 bg-white rounded-lg p-1 border border-border">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={clsx(
            'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors',
            active === t.key
              ? 'bg-primary text-white'
              : 'text-muted hover:bg-surface'
          )}
        >
          <t.icon size={16} />
          {t.label}
        </button>
      ))}
    </div>
  )
}
