import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import useLocalStorageState from '../lib/useLocalStorageState'
import * as api from '../lib/api'

const AppDataContext = createContext(null)

export function AppDataProvider({ children }) {
  const [user, setUser] = useLocalStorageState('sanmarcos:user', null)
  const [jobs, setJobs] = useState([])
  const [student, setStudent] = useState(null)
  const [company, setCompany] = useState(null)
  const [applications, setApplications] = useState([])
  const role = user?.role ?? null

  useEffect(() => {
    api.getJobs().then(setJobs)
    api.getStudentProfile().then(setStudent)
    api.getCompanyProfile().then(setCompany)
    api.getApplications().then(setApplications)
  }, [])

  async function login(email, password) {
    const loggedInUser = await api.login(email, password)
    setUser(loggedInUser)
    return loggedInUser
  }

  function logout() {
    setUser(null)
  }

  async function addJob(job) {
    const created = await api.createJob(job, role)
    setJobs((prev) => [...prev, created])
    return created
  }

  async function updateStudent(patch) {
    const updated = await api.updateStudentProfile(patch)
    setStudent(updated)
    return updated
  }

  async function updateCompany(patch) {
    const updated = await api.updateCompanyProfile(patch)
    setCompany(updated)
    return updated
  }

  async function applyToJob(jobId) {
    const application = await api.applyToJob(jobId)
    setApplications((prev) => (prev.some((a) => a.jobId === jobId) ? prev : [...prev, application]))
    return application
  }

  const value = useMemo(
    () => ({
      user, role, login, logout,
      jobs, addJob,
      student, updateStudent,
      company, updateCompany,
      applications, applyToJob,
    }),
    [user, role, jobs, student, company, applications]
  )

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

export function useAppData() {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error('useAppData debe usarse dentro de <AppDataProvider>')
  return ctx
}
