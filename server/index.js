import express from 'express'
import cors from 'cors'
import db from './db.js'

const app = express()
const PORT = 3001

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

function parseJob(row) {
  if (!row) return row
  return {
    ...row,
    requirements: JSON.parse(row.requirements),
    benefits: JSON.parse(row.benefits),
    skills: JSON.parse(row.skills),
  }
}

function parseStudent(row) {
  if (!row) return row
  return {
    ...row,
    skills: JSON.parse(row.skills),
    languages: JSON.parse(row.languages),
    certifications: JSON.parse(row.certifications),
    experience: JSON.parse(row.experience),
    education: JSON.parse(row.education),
    savedJobs: JSON.parse(row.savedJobs),
  }
}

function parseCompany(row) {
  if (!row) return row
  return {
    ...row,
    skills: JSON.parse(row.skills),
    languages: JSON.parse(row.languages),
    certifications: JSON.parse(row.certifications),
    experience: JSON.parse(row.experience),
    education: JSON.parse(row.education),
  }
}

// ---- Auth ----
app.post('/api/login', (req, res) => {
  const { email, password } = req.body
  const user = db.prepare('SELECT email, role FROM users WHERE email = ? AND password = ?').get(email, password)
  if (!user) return res.status(401).json({ error: 'Correo o contraseña incorrectos.' })
  res.json(user)
})

// ---- Jobs ----
app.get('/api/jobs', (req, res) => {
  const rows = db.prepare('SELECT * FROM jobs ORDER BY id').all()
  res.json(rows.map(parseJob))
})

app.get('/api/jobs/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM jobs WHERE id = ?').get(Number(req.params.id))
  if (!row) return res.status(404).json({ error: 'Oferta no encontrada.' })
  res.json(parseJob(row))
})

app.post('/api/jobs', (req, res) => {
  if (req.header('x-role') !== 'empresa') {
    return res.status(403).json({ error: 'Esta acción requiere una cuenta de empresa.' })
  }
  const nextId = db.prepare('SELECT COALESCE(MAX(id), 0) + 1 AS id FROM jobs').get().id
  const job = { ...req.body, id: nextId }
  db.prepare(`
    INSERT INTO jobs (id, title, company, location, type, modality, area, salary, salaryNum,
      posted, daysAgo, deadline, duration, hoursPerWeek, status, initials, color, description,
      requirements, benefits, skills, applicants, postedBy)
    VALUES (@id, @title, @company, @location, @type, @modality, @area, @salary, @salaryNum,
      @posted, @daysAgo, @deadline, @duration, @hoursPerWeek, @status, @initials, @color, @description,
      @requirements, @benefits, @skills, @applicants, @postedBy)
  `).run({
    ...job,
    requirements: JSON.stringify(job.requirements),
    benefits: JSON.stringify(job.benefits),
    skills: JSON.stringify(job.skills),
  })
  res.status(201).json(job)
})

// ---- Profiles ----
app.get('/api/profile/student', (req, res) => {
  res.json(parseStudent(db.prepare('SELECT * FROM students WHERE id = 1').get()))
})

app.put('/api/profile/student', (req, res) => {
  const patch = req.body
  db.prepare(`
    UPDATE students SET name=@name, career=@career, faculty=@faculty, semester=@semester,
      gpa=@gpa, email=@email, phone=@phone, location=@location, bio=@bio, skills=@skills
    WHERE id = 1
  `).run({ ...patch, skills: JSON.stringify(patch.skills) })
  res.json(parseStudent(db.prepare('SELECT * FROM students WHERE id = 1').get()))
})

app.get('/api/profile/company', (req, res) => {
  res.json(parseCompany(db.prepare('SELECT * FROM companies WHERE id = 1').get()))
})

app.put('/api/profile/company', (req, res) => {
  const patch = req.body
  db.prepare(`
    UPDATE companies SET contactName=@contactName, role=@role, companyName=@companyName,
      industry=@industry, companyDescription=@companyDescription, website=@website,
      email=@email, phone=@phone, location=@location, bio=@bio, skills=@skills
    WHERE id = 1
  `).run({ ...patch, skills: JSON.stringify(patch.skills) })
  res.json(parseCompany(db.prepare('SELECT * FROM companies WHERE id = 1').get()))
})

// ---- Applications ----
app.get('/api/applications', (req, res) => {
  res.json(db.prepare('SELECT * FROM applications WHERE studentId = 1').all())
})

app.post('/api/applications', (req, res) => {
  const { jobId } = req.body
  const existing = db.prepare('SELECT * FROM applications WHERE studentId = 1 AND jobId = ?').get(jobId)
  if (existing) return res.status(200).json(existing)

  const appliedDate = new Date().toISOString().slice(0, 10)
  const info = db.prepare(`
    INSERT INTO applications (studentId, jobId, status, appliedDate) VALUES (1, ?, 'en_revision', ?)
  `).run(jobId, appliedDate)
  res.status(201).json({ id: info.lastInsertRowid, studentId: 1, jobId, status: 'en_revision', appliedDate })
})

app.listen(PORT, () => {
  console.log(`API corriendo en http://localhost:${PORT}`)
})
