const API_BASE = 'http://localhost:3001/api'

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  })
  const data = await res.json().catch(() => null)
  if (!res.ok) throw new Error(data?.error || 'Error de red')
  return data
}

export function login(email, password) {
  return request('/login', { method: 'POST', body: JSON.stringify({ email, password }) })
}

export function getJobs() {
  return request('/jobs')
}

export function getJob(id) {
  return request(`/jobs/${id}`)
}

export function createJob(job, role) {
  return request('/jobs', { method: 'POST', headers: { 'x-role': role }, body: JSON.stringify(job) })
}

export function getStudentProfile() {
  return request('/profile/student')
}

export function updateStudentProfile(patch) {
  return request('/profile/student', { method: 'PUT', body: JSON.stringify(patch) })
}

export function getCompanyProfile() {
  return request('/profile/company')
}

export function updateCompanyProfile(patch) {
  return request('/profile/company', { method: 'PUT', body: JSON.stringify(patch) })
}

export function getApplications() {
  return request('/applications')
}

export function applyToJob(jobId) {
  return request('/applications', { method: 'POST', body: JSON.stringify({ jobId }) })
}
