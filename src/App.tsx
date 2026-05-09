import { useState, useEffect, useRef, useCallback } from 'react'
import { Radio, Loader2, Zap } from 'lucide-react'
import type { Mode, Job } from './types'
import { checkHealth, createJob, getJob, getHistory, audioUrl } from './api'
import ModeTabs from './components/ModeTabs'
import ScriptEditor from './components/ScriptEditor'
import DirectorPrompt from './components/DirectorPrompt'
import VoicePicker from './components/VoicePicker'
import SampleUploader from './components/SampleUploader'
import AudioResult from './components/AudioResult'
import HistoryList from './components/HistoryList'

const DIRECTOR_PRESETS: Record<Mode, string> = {
  preset: '请使用温柔、克制、稍慢的语气朗读。语速适中，音量自然。整体风格是温暖叙事。适合场景：有声书、独白。需要自然、有呼吸感，避免机械播报。',
  design: '设计一个25岁左右的女性声音。声音质感：温暖清亮。情绪基调：平和。语速：中等。适合内容：有声书旁白。请让声音自然、清晰、有辨识度，不要过度表演。',
  clone: '请参考上传音频中的声音特征进行朗读。保持自然语气，不要夸张模仿。语速稳定，吐字清晰。情绪：平和。场景：有声书。',
}

export default function App() {
  const [mode, setMode] = useState<Mode>('preset')
  const [text, setText] = useState('')
  const [directorPrompt, setDirectorPrompt] = useState(DIRECTOR_PRESETS.preset)
  const [voice, setVoice] = useState('冰糖')
  const [voiceDesc, setVoiceDesc] = useState('')
  const [cloneSample, setCloneSample] = useState<string | null>(null)
  const [resultFile, setResultFile] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const [currentJobId, setCurrentJobId] = useState<string | null>(null)
  const [history, setHistory] = useState<Job[]>([])
  const [apiOk, setApiOk] = useState<boolean | null>(null)
  const [mockMode, setMockMode] = useState(false)
  const [error, setError] = useState('')
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    checkHealth().then((info) => {
      setApiOk(info.ok)
      setMockMode(info.mockMode)
    })
    refreshHistory()
  }, [])

  const refreshHistory = useCallback(async () => {
    try {
      const h = await getHistory()
      setHistory(h)
    } catch {}
  }, [])

  useEffect(() => {
    setDirectorPrompt(DIRECTOR_PRESETS[mode])
    setVoiceDesc('')
  }, [mode])

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [])

  const startPolling = useCallback((jobId: string) => {
    if (pollRef.current) clearInterval(pollRef.current)
    pollRef.current = setInterval(async () => {
      try {
        const job = await getJob(jobId)
        if (job.status === 'done') {
          if (pollRef.current) clearInterval(pollRef.current)
          setResultFile(job.filename)
          setGenerating(false)
          setCurrentJobId(null)
          refreshHistory()
        } else if (job.status === 'failed') {
          if (pollRef.current) clearInterval(pollRef.current)
          setError(job.error || '生成失败')
          setGenerating(false)
          setCurrentJobId(null)
          refreshHistory()
        }
      } catch {
        // network hiccup, keep polling
      }
    }, 1000)
  }, [refreshHistory])

  const handleGenerate = async () => {
    if (!text.trim()) return
    setError('')
    setResultFile(null)
    setGenerating(true)

    try {
      const job = await createJob({
        mode,
        text,
        director_prompt: directorPrompt,
        voice: mode === 'preset' ? voice : '',
        voice_description: mode === 'design' ? voiceDesc : '',
        output_format: 'wav',
        clone_sample: mode === 'clone' ? cloneSample || undefined : undefined,
      })
      setCurrentJobId(job.job_id)
      startPolling(job.job_id)
    } catch (e: any) {
      setError(e.message)
      setGenerating(false)
    }
  }

  const handlePlayHistory = (filename: string) => {
    setResultFile(filename)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-border px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <Radio size={20} className="text-primary" />
          <span className="text-base font-semibold text-main">MiMo Voice Studio</span>
        </div>
        <div className="flex items-center gap-3">
          {mockMode && (
            <span className="text-xs font-medium bg-amber-100 text-amber-700 px-2 py-0.5 rounded">
              MOCK
            </span>
          )}
          <div className="flex items-center gap-1.5 text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                apiOk === true ? 'bg-success' : apiOk === false ? 'bg-accent' : 'bg-muted'
              }`}
            />
            <span className="text-muted">
              {apiOk === true ? 'API 已连接' : apiOk === false ? 'API 未连接' : '检查中...'}
            </span>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="flex-1 flex flex-col lg:flex-row gap-4 p-4 overflow-hidden">
        {/* Left: controls */}
        <div className="w-full lg:w-80 shrink-0 flex flex-col gap-4 overflow-y-auto scrollbar-thin">
          <ModeTabs active={mode} onChange={setMode} />

          {mode === 'preset' && (
            <VoicePicker selected={voice} onSelect={setVoice} />
          )}

          {mode === 'design' && (
            <div className="bg-white rounded-lg border border-border p-4">
              <label className="block text-sm font-medium text-main mb-2">音色描述</label>
              <textarea
                value={voiceDesc}
                onChange={(e) => setVoiceDesc(e.target.value)}
                placeholder="描述你想要的声音特征，例如：温暖、清澈、年轻女性..."
                rows={3}
                className="w-full resize-none rounded-md border border-border bg-surface px-3 py-2 text-sm text-main placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              />
            </div>
          )}

          {mode === 'clone' && (
            <SampleUploader filename={cloneSample} onUploaded={setCloneSample} />
          )}

          <HistoryList jobs={history} onPlay={handlePlayHistory} />
        </div>

        {/* Center: editor */}
        <div className="flex-1 flex flex-col gap-4 min-w-0 overflow-y-auto scrollbar-thin">
          <ScriptEditor text={text} onChange={setText} />

          <DirectorPrompt value={directorPrompt} onChange={setDirectorPrompt} />

          {error && (
            <div className="bg-accent/10 border border-accent/30 rounded-lg px-4 py-3 text-sm text-accent">
              {error}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={generating || !text.trim() || (mode === 'clone' && !cloneSample)}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-medium text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition shrink-0"
          >
            {generating ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                生成中...
              </>
            ) : (
              <>
                <Zap size={18} />
                生成语音
              </>
            )}
          </button>
        </div>

        {/* Right: result */}
        <div className="w-full lg:w-80 shrink-0 flex flex-col gap-4 overflow-y-auto scrollbar-thin">
          <AudioResult filename={resultFile} loading={generating} />

          <div className="bg-white rounded-lg border border-border p-4">
            <div className="text-sm font-medium text-main mb-2">当前参数</div>
            <dl className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <dt className="text-muted">模式</dt>
                <dd className="text-main">
                  {mode === 'preset' ? '预置音色' : mode === 'design' ? '音色设计' : '语音克隆'}
                </dd>
              </div>
              {mode === 'preset' && (
                <div className="flex justify-between">
                  <dt className="text-muted">音色</dt>
                  <dd className="text-main">{voice}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-muted">文本长度</dt>
                <dd className="text-main">{text.length} 字</dd>
              </div>
              {currentJobId && (
                <div className="flex justify-between">
                  <dt className="text-muted">任务 ID</dt>
                  <dd className="text-main font-mono">{currentJobId}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </main>
    </div>
  )
}
