import { Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import type { Job } from '../types'

interface Props {
  jobs: Job[]
  onPlay: (filename: string) => void
}

const modeLabel: Record<string, string> = {
  preset: '预置',
  design: '设计',
  clone: '克隆',
}

const statusIcon = {
  queued: <Loader2 size={14} className="animate-spin text-muted" />,
  running: <Loader2 size={14} className="animate-spin text-primary" />,
  done: <CheckCircle size={14} className="text-success" />,
  failed: <XCircle size={14} className="text-accent" />,
}

export default function HistoryList({ jobs, onPlay }: Props) {
  if (jobs.length === 0) {
    return (
      <div className="bg-white/95 rounded-lg shadow-premium border border-black/[0.04] p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-main mb-3">
          <Clock size={17} className="text-primary" />
          生成历史
        </div>
        <p className="text-sm text-muted text-center py-4">暂无记录</p>
      </div>
    )
  }

  return (
    <div className="bg-white/95 rounded-lg shadow-premium border border-black/[0.04] p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-main mb-3">
        <Clock size={17} className="text-primary" />
        最近历史
      </div>
      <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-thin">
        {jobs.map((j) => (
          <div
            key={j.job_id}
            className="flex items-center gap-3 px-3 py-2 rounded-md bg-zinc-50 text-sm transition-colors hover:bg-zinc-100"
          >
            {statusIcon[j.status]}
            <span className="text-xs text-muted w-10 shrink-0">
              {modeLabel[j.mode] || j.mode}
            </span>
            <span className="truncate flex-1 text-main">{j.text}</span>
            {j.status === 'done' && j.filename && (
              <button
                onClick={() => onPlay(j.filename!)}
                className="text-xs text-primary hover:underline shrink-0"
              >
                播放
              </button>
            )}
            {j.status === 'failed' && (
              <span className="text-xs text-accent shrink-0">
                {j.error?.slice(0, 30)}
              </span>
            )}
            <span className="text-xs text-muted shrink-0">
              {j.created_at.slice(11, 19)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
