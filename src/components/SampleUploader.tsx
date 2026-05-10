import { useRef, useState } from 'react'
import { Upload, X, CheckCircle, Loader2 } from 'lucide-react'
import { uploadSample } from '../api'

interface Props {
  onUploaded: (filename: string) => void
  filename: string | null
  disabled?: boolean
  onError?: (message: string) => void
}

export default function SampleUploader({ onUploaded, filename, disabled = false, onError }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [displayName, setDisplayName] = useState('')

  const handleFile = async (file: File) => {
    if (file.size > 20 * 1024 * 1024) {
      const message = '文件不能超过 20MB'
      setError(message)
      onError?.(message)
      return
    }
    setUploading(true)
    setError('')
    try {
      const res = await uploadSample(file)
      setDisplayName(file.name)
      onUploaded(res.filename)
    } catch (e: any) {
      const message = e.message || '音频上传失败'
      setError(message)
      onError?.(message)
    } finally {
      setUploading(false)
    }
  }

  const clearFile = () => {
    setDisplayName('')
    onUploaded('')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="bg-white/95 rounded-lg shadow-premium border border-black/[0.04] p-5">
      <div className="flex items-center gap-2 text-sm font-semibold text-main mb-3">
        <Upload size={17} className="text-primary" />
        参考音频
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        disabled={disabled || uploading}
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />

      {filename ? (
        <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-success/10 text-success text-sm border border-success/20">
          <CheckCircle size={16} />
          <span className="truncate flex-1">{displayName || filename}</span>
          <button
            disabled={disabled}
            onClick={clearFile}
            className="text-muted hover:text-accent transition"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          disabled={disabled || uploading}
          className="w-full px-3 py-6 rounded-md border-2 border-dashed border-border/90 text-muted text-sm hover:border-primary/30 hover:bg-zinc-50 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all"
        >
          <span className="flex flex-col items-center gap-2">
            {uploading ? <Loader2 size={20} className="animate-spin text-primary" /> : <Upload size={20} />}
            <span>{uploading ? '上传中...' : '点击上传参考音频'}</span>
            <span className="text-xs text-muted">最大支持 20MB</span>
          </span>
        </button>
      )}

      {error && <p className="mt-2 text-xs text-accent">{error}</p>}
    </div>
  )
}
