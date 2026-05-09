import { useRef, useState } from 'react'
import { Upload, X, CheckCircle } from 'lucide-react'
import { uploadSample } from '../api'

interface Props {
  onUploaded: (filename: string) => void
  filename: string | null
}

export default function SampleUploader({ onUploaded, filename }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFile = async (file: File) => {
    if (file.size > 20 * 1024 * 1024) {
      setError('文件不能超过 20MB')
      return
    }
    setUploading(true)
    setError('')
    try {
      const res = await uploadSample(file)
      onUploaded(res.filename)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg border border-border p-4">
      <div className="flex items-center gap-2 text-sm font-medium text-main mb-3">
        <Upload size={16} />
        参考音频
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />

      {filename ? (
        <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-success/10 text-success text-sm">
          <CheckCircle size={16} />
          <span className="truncate flex-1">{filename}</span>
          <button
            onClick={() => onUploaded('')}
            className="text-muted hover:text-accent transition"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full px-3 py-6 rounded-md border-2 border-dashed border-border text-muted text-sm hover:border-primary/40 hover:text-primary disabled:opacity-50 transition"
        >
          {uploading ? '上传中...' : '点击上传音频文件 (≤ 20MB)'}
        </button>
      )}

      {error && <p className="mt-2 text-xs text-accent">{error}</p>}
    </div>
  )
}
