import type { Job, CreateJobRequest } from './types'

const BASE = '/api'

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, init)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail || `HTTP ${res.status}`)
  }
  return res.json()
}

export interface HealthInfo {
  ok: boolean
  mockMode: boolean
}

export async function checkHealth(): Promise<HealthInfo> {
  try {
    const data = await request<{ status: string; mock_mode: boolean }>('/health')
    return { ok: true, mockMode: data.mock_mode }
  } catch {
    return { ok: false, mockMode: false }
  }
}

export async function uploadSample(file: File): Promise<{ filename: string; path: string }> {
  const form = new FormData()
  form.append('file', file)
  const res = await fetch(`${BASE}/upload`, { method: 'POST', body: form })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail || `Upload failed: ${res.status}`)
  }
  return res.json()
}

export async function createJob(req: CreateJobRequest): Promise<Job> {
  return request<Job>('/jobs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  })
}

export async function getJob(jobId: string): Promise<Job> {
  return request<Job>(`/jobs/${jobId}`)
}

export async function getHistory(): Promise<Job[]> {
  return request<Job[]>('/history')
}

export function audioUrl(filename: string): string {
  return `${BASE}/audio/${filename}`
}
