import { useRef, useEffect } from 'react'
import { Play, Pause, Download, Loader2, FileAudio } from 'lucide-react'
import { useState } from 'react'
import { audioUrl } from '../api'
import type { JobStatus } from '../types'

interface Props {
  filename: string | null
  loading: boolean
  status?: JobStatus
}

export default function AudioResult({ filename, loading, status }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!filename) return
    const el = audioRef.current
    if (!el) return
    el.src = audioUrl(filename)
    el.load()
    setPlaying(false)
  }, [filename])

  const toggle = () => {
    const el = audioRef.current
    if (!el) return
    if (playing) {
      el.pause()
    } else {
      el.play()
    }
    setPlaying(!playing)
  }

  useEffect(() => {
    const el = audioRef.current
    if (!el) return
    const onEnd = () => setPlaying(false)
    el.addEventListener('ended', onEnd)
    return () => el.removeEventListener('ended', onEnd)
  }, [])

  return (
    <div className="bg-white/95 rounded-lg shadow-premium border border-black/[0.04] p-4">
      <div className="text-sm font-medium text-main border-b border-border pb-3 mb-3">生成结果</div>

      {loading && (
        <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
          <Loader2 size={28} className="animate-spin text-primary" />
          <div>
            <p className="text-sm font-medium text-main">
              {status === 'queued' ? '任务排队中...' : 'AI 正在生成语音...'}
            </p>
            <p className="mt-1 text-xs text-muted">页面不会卡住，可以等待轮询完成</p>
          </div>
        </div>
      )}

      {!loading && !filename && (
        <div className="flex flex-col items-center justify-center gap-3 py-8 text-center text-muted">
          <Play size={28} />
          <p className="text-sm">生成完成后可在此播放</p>
        </div>
      )}

      {!loading && filename && (
        <div className="space-y-3">
          <audio ref={audioRef} preload="auto" />
          <div className="flex items-center gap-3 rounded-md bg-zinc-50 p-3 border border-border/70">
            <FileAudio size={28} className="shrink-0 text-success" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-main">{filename}</p>
              <p className="text-xs text-success">生成成功</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={toggle}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-zinc-800 transition"
            >
              {playing ? <Pause size={16} /> : <Play size={16} />}
              {playing ? '暂停' : '播放'}
            </button>
            <a
              href={audioUrl(filename)}
              download={filename}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-md border border-border text-sm text-muted hover:text-main hover:border-primary/40 transition"
            >
              <Download size={16} />
              下载
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
