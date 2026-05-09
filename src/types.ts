export type Mode = 'preset' | 'design' | 'clone'

export type JobStatus = 'queued' | 'running' | 'done' | 'failed'

export interface Job {
  job_id: string
  status: JobStatus
  mode: Mode
  text: string
  voice: string
  filename: string | null
  error: string | null
  created_at: string
  finished_at: string | null
}

export interface CreateJobRequest {
  mode: Mode
  text: string
  director_prompt: string
  voice: string
  voice_description: string
  output_format: string
  clone_sample?: string
}
