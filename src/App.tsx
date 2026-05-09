import { useCallback, useEffect, useRef, useState } from 'react'
import { Activity, AlertCircle, Loader2, Zap } from 'lucide-react'
import type { Job, Mode } from './types'
import { checkHealth, createJob, getHistory, getJob } from './api'
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
  const [currentJob, setCurrentJob] = useState<Job | null>(null)
  const [history, setHistory] = useState<Job[]>([])
  const [apiOk, setApiOk] = useState<boolean | null>(null)
  const [mockMode, setMockMode] = useState(false)
  const [error, setError] = useState('')
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const refreshHistory = useCallback(async () => {
    try {
      const records = await getHistory()
      setHistory(records.slice(0, 20))
    } catch {
      // History is useful but should not block the workspace.
    }
  }, [])

  useEffect(() => {
    checkHealth().then((info) => {
      setApiOk(info.ok)
      setMockMode(info.mockMode)
    })
    refreshHistory()
  }, [refreshHistory])

  useEffect(() => {
    setDirectorPrompt(DIRECTOR_PRESETS[mode])
    setVoiceDesc('')
    setError('')
  }, [mode])

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [])

  const stopPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current)
      pollRef.current = null
    }
  }

  const startPolling = useCallback((jobId: string) => {
    stopPolling()
    pollRef.current = setInterval(async () => {
      try {
        const job = await getJob(jobId)
        setCurrentJob(job)

        if (job.status === 'done') {
          stopPolling()
          setResultFile(job.filename)
          setGenerating(false)
          refreshHistory()
        } else if (job.status === 'failed') {
          stopPolling()
          setError(job.error || '生成失败')
          setGenerating(false)
          refreshHistory()
        }
      } catch {
        // A short network hiccup should not stop an active generation.
      }
    }, 1000)
  }, [refreshHistory])

  const handleGenerate = async () => {
    const cleanText = text.trim()
    setError('')

    if (!cleanText) {
      setError('请输入朗读文本')
      return
    }
    if (mode === 'design' && !voiceDesc.trim()) {
      setError('请先填写音色描述')
      return
    }
    if (mode === 'clone' && !cloneSample) {
      setError('请先上传参考音频')
      return
    }

    setResultFile(null)
    setCurrentJob(null)
    setGenerating(true)

    try {
      const job = await createJob({
        mode,
        text: cleanText,
        director_prompt: directorPrompt,
        voice: mode === 'preset' ? voice : '',
        voice_description: mode === 'design' ? voiceDesc : '',
        output_format: 'wav',
        clone_sample: mode === 'clone' ? cloneSample || undefined : undefined,
      })
      setCurrentJob(job)
      startPolling(job.job_id)
    } catch (e: any) {
      setError(e.message || '创建生成任务失败')
      setGenerating(false)
    }
  }

  const handlePlayHistory = (filename: string) => {
    setResultFile(filename)
    setCurrentJob(null)
    setError('')
  }

  return (
    <div className="min-h-screen bg-surface text-main flex flex-col">
      <header className="h-14 bg-white border-b border-border px-5 lg:px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <Activity size={20} className="text-primary" />
          <span className="text-base font-semibold text-main">MiMo Voice Studio</span>
        </div>
        <div className="flex items-center gap-3">
          {mockMode && (
            <span className="text-xs font-medium bg-amber-100 text-amber-700 px-2 py-0.5 rounded">
              MOCK
            </span>
          )}
          {generating && (
            <span className="hidden sm:flex items-center gap-1.5 text-xs text-primary">
              <Loader2 size={13} className="animate-spin" />
              {currentJob?.status === 'queued' ? '排队中' : '生成中'}
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

      <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start">
        <section className="lg:col-span-3 flex flex-col gap-4 min-w-0">
          <ModeTabs active={mode} onChange={setMode} disabled={generating} />

          {mode === 'preset' && (
            <VoicePicker selected={voice} onSelect={setVoice} disabled={generating} />
          )}

          {mode === 'design' && (
            <div className="bg-white rounded-lg border border-border p-4">
              <label className="block text-sm font-medium text-main mb-2">音色描述</label>
              <textarea
                value={voiceDesc}
                disabled={generating}
                onChange={(e) => setVoiceDesc(e.target.value)}
                placeholder="描述你想要的声音特征，例如：温暖、清澈、年轻女性..."
                rows={4}
                className="w-full resize-none rounded-md border border-border bg-surface px-3 py-2 text-sm text-main placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:opacity-60 transition"
              />
            </div>
          )}

          {mode === 'clone' && (
            <SampleUploader
              filename={cloneSample}
              onUploaded={setCloneSample}
              disabled={generating}
              onError={setError}
            />
          )}

          <HistoryList jobs={history} onPlay={handlePlayHistory} />
        </section>

        <section className="lg:col-span-6 flex flex-col gap-4 min-w-0">
          {error && (
            <div className="bg-accent/10 border border-accent/30 rounded-lg px-4 py-3 text-sm text-accent flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <ScriptEditor text={text} onChange={setText} disabled={generating} />
          <DirectorPrompt
            value={directorPrompt}
            onChange={setDirectorPrompt}
            disabled={generating}
          />

          <button
            onClick={handleGenerate}
            disabled={generating || !text.trim() || (mode === 'clone' && !cloneSample)}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-medium text-sm hover:bg-primary/90 disabled:bg-border disabled:text-muted disabled:cursor-not-allowed transition"
          >
            {generating ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                生成中...
              </>
            ) : (
              <>
                <Zap size={18} />
                开始生成语音
              </>
            )}
          </button>
        </section>

        <section className="lg:col-span-3 flex flex-col gap-4 min-w-0">
          <AudioResult filename={resultFile} loading={generating} status={currentJob?.status} />

          <div className="bg-white rounded-lg border border-border p-4">
            <div className="text-sm font-medium text-main mb-3">当前参数</div>
            <dl className="space-y-2 text-xs">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">模式</dt>
                <dd className="text-main">
                  {mode === 'preset' ? '预置音色' : mode === 'design' ? '音色设计' : '语音克隆'}
                </dd>
              </div>
              {mode === 'preset' && (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">音色</dt>
                  <dd className="text-main">{voice}</dd>
                </div>
              )}
              <div className="flex justify-between gap-4">
                <dt className="text-muted">文本长度</dt>
                <dd className="text-main">{text.length} / 1000 字</dd>
              </div>
              {currentJob && (
                <>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted">任务状态</dt>
                    <dd className="text-main">{currentJob.status}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted">任务 ID</dt>
                    <dd className="text-main font-mono truncate">{currentJob.job_id}</dd>
                  </div>
                </>
              )}
            </dl>
          </div>
        </section>
      </main>
    </div>
  )
}
