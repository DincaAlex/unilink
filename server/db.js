import Database from 'better-sqlite3'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { users, jobs, student, company } from './seedData.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const db = new Database(join(__dirname, 'data.sqlite'))
db.pragma('journal_mode = WAL')

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY,
    name TEXT, career TEXT, faculty TEXT, semester TEXT, gpa TEXT,
    email TEXT, phone TEXT, location TEXT, bio TEXT,
    skills TEXT, languages TEXT, certifications TEXT, experience TEXT,
    education TEXT, savedJobs TEXT
  );

  CREATE TABLE IF NOT EXISTS companies (
    id INTEGER PRIMARY KEY,
    contactName TEXT, role TEXT, companyName TEXT, industry TEXT,
    companyDescription TEXT, website TEXT, initials TEXT, color TEXT,
    email TEXT, phone TEXT, location TEXT, bio TEXT,
    skills TEXT, languages TEXT, certifications TEXT, experience TEXT, education TEXT
  );

  CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY,
    title TEXT, company TEXT, location TEXT, type TEXT, modality TEXT, area TEXT,
    salary TEXT, salaryNum INTEGER, posted TEXT, daysAgo INTEGER, deadline TEXT,
    duration TEXT, hoursPerWeek INTEGER, status TEXT, initials TEXT, color TEXT,
    description TEXT, requirements TEXT, benefits TEXT, skills TEXT,
    applicants INTEGER, postedBy TEXT
  );

  CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    studentId INTEGER NOT NULL,
    jobId INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'en_revision',
    appliedDate TEXT NOT NULL
  );
`)

const jobCount = db.prepare('SELECT COUNT(*) AS n FROM jobs').get().n

if (jobCount === 0) {
  const insertUser = db.prepare('INSERT INTO users (id, email, password, role) VALUES (@id, @email, @password, @role)')
  const insertJob = db.prepare(`
    INSERT INTO jobs (id, title, company, location, type, modality, area, salary, salaryNum,
      posted, daysAgo, deadline, duration, hoursPerWeek, status, initials, color, description,
      requirements, benefits, skills, applicants, postedBy)
    VALUES (@id, @title, @company, @location, @type, @modality, @area, @salary, @salaryNum,
      @posted, @daysAgo, @deadline, @duration, @hoursPerWeek, @status, @initials, @color, @description,
      @requirements, @benefits, @skills, @applicants, @postedBy)
  `)

  const seedTx = db.transaction(() => {
    for (const u of users) insertUser.run(u)
    for (const j of jobs) {
      insertJob.run({
        ...j,
        requirements: JSON.stringify(j.requirements),
        benefits: JSON.stringify(j.benefits),
        skills: JSON.stringify(j.skills),
      })
    }
    db.prepare(`
      INSERT INTO students (id, name, career, faculty, semester, gpa, email, phone, location, bio,
        skills, languages, certifications, experience, education, savedJobs)
      VALUES (1, @name, @career, @faculty, @semester, @gpa, @email, @phone, @location, @bio,
        @skills, @languages, @certifications, @experience, @education, @savedJobs)
    `).run({
      ...student,
      skills: JSON.stringify(student.skills),
      languages: JSON.stringify(student.languages),
      certifications: JSON.stringify(student.certifications),
      experience: JSON.stringify(student.experience),
      education: JSON.stringify(student.education),
      savedJobs: JSON.stringify(student.savedJobs),
    })

    db.prepare(`
      INSERT INTO companies (id, contactName, role, companyName, industry, companyDescription,
        website, initials, color, email, phone, location, bio, skills, languages, certifications,
        experience, education)
      VALUES (1, @contactName, @role, @companyName, @industry, @companyDescription,
        @website, @initials, @color, @email, @phone, @location, @bio, @skills, @languages,
        @certifications, @experience, @education)
    `).run({
      ...company,
      skills: JSON.stringify(company.skills),
      languages: JSON.stringify(company.languages),
      certifications: JSON.stringify(company.certifications),
      experience: JSON.stringify(company.experience),
      education: JSON.stringify(company.education),
    })
  })

  seedTx()
  console.log('Base de datos sembrada con datos iniciales.')
}

export default db
