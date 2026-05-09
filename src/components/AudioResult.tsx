import { useRef, useEffect } from 'react'
import { Play, Pause, Download, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { audioUrl } from '../api'

interface Props {
  filename: string | null
  loading: boolean
}

export default function AudioResult({ filename, loading }: Props) {
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
    <div className="bg-white rounded-lg border border-border p-4">
      <div className="text-sm font-medium text-main mb-3">生成结果</div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-primary py-8 justify-center">
          <Loader2 size={18} className="animate-spin" />
          正在生成...
        </div>
      )}

      {!loading && !filename && (
        <div className="text-sm text-muted text-center py-8">
          生成完成后可在此播放
        </div>
      )}

      {!loading && filename && (
        <div className="space-y-3">
          <audio ref={audioRef} preload="auto" />
          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary/90 transition"
            >
              {playing ? <Pause size={16} /> : <Play size={16} />}
              {playing ? '暂停' : '播放'}
            </button>
            <a
              href={audioUrl(filename)}
              download={filename}
              className="flex items-center gap-2 px-4 py-2 rounded-md border border-border text-sm text-muted hover:text-main hover:border-primary/40 transition"
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
