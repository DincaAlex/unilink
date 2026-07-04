import { useNavigate } from 'react-router-dom'
import { Download, Pencil, Mail, MapPin, GraduationCap, Briefcase, Star, BookOpen, Building2, Globe, ClipboardList } from 'lucide-react'
import Navbar from '../components/Navbar'
import { useAppData } from '../context/AppDataContext'

const STATUS_LABELS = {
  en_revision: 'En revisión',
  entrevista: 'Entrevista',
  rechazado: 'Rechazado',
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const { role, student, company, jobs, applications } = useAppData()
  const isCompany = role === 'empresa'
  const data = isCompany ? company : student

  if (!data) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center py-32 text-[#948f87] text-sm">Cargando perfil…</div>
      </div>
    )
  }

  const displayName = isCompany ? data.contactName : data.name
  const initials = displayName.split(' ').slice(0, 2).map((n) => n[0]).join('')
  const myJobs = isCompany ? jobs.filter((j) => j.postedBy === 'company') : []
  const myApplications = isCompany
    ? []
    : applications.map((a) => ({ ...a, job: jobs.find((j) => j.id === a.jobId) })).filter((a) => a.job)

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Header de perfil */}
      <div className="bg-[#1c1c19] border-b border-[#2a2a24]">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <div className="flex items-start justify-between gap-6">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="w-16 h-16 flex-shrink-0 border-2 border-[#c4983a]/50 flex items-center justify-center">
                <span className="serif text-2xl text-[#c4983a]">{initials}</span>
              </div>

              <div>
                <p className="text-xs tracking-[0.24em] uppercase text-[#948f87] font-medium mb-1.5">
                  {isCompany ? data.companyName : data.faculty}
                </p>
                <h1 className="serif text-4xl text-[#f0ece4] leading-tight">{displayName}</h1>
                <p className="text-base font-medium text-[#c4983a] mt-1">
                  {isCompany ? data.role : data.career}
                </p>

                <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 text-sm text-[#948f87]">
                  <span className="flex items-center gap-1.5">
                    <Mail size={13} />
                    {data.email}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={13} />
                    {data.location}
                  </span>
                  {isCompany ? (
                    <>
                      <span className="flex items-center gap-1.5">
                        <Building2 size={13} />
                        {data.industry}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Globe size={13} />
                        {data.website}
                      </span>
                    </>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <GraduationCap size={13} />
                      {data.semester} — Prom. {data.gpa}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 flex flex-col gap-2">
              <button
                onClick={() => navigate('/profile/edit')}
                className="flex items-center gap-2 border border-[#2a2a24] text-[#948f87] hover:text-[#f0ece4] hover:border-[#c4983a]/40 text-xs tracking-[0.18em] uppercase font-medium px-4 py-2.5 transition-colors cursor-pointer"
              >
                <Pencil size={13} />
                Editar perfil
              </button>
              <button
                onClick={() => navigate('/profile/cv')}
                className="flex items-center gap-2 border border-[#2a2a24] text-[#948f87] hover:text-[#f0ece4] hover:border-[#c4983a]/40 text-xs tracking-[0.18em] uppercase font-medium px-4 py-2.5 transition-colors cursor-pointer"
              >
                <Download size={13} />
                Descargar CV
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-6 py-8 flex flex-col gap-4">

        {isCompany && (
          <Card icon={Building2} label="Sobre la empresa">
            <p className="text-[15px] text-[#ccc8c0] leading-relaxed">{data.companyDescription}</p>
          </Card>
        )}

        {/* Sobre mí */}
        <Card icon={BookOpen} label="Sobre mí">
          <p className="text-[15px] text-[#ccc8c0] leading-relaxed">{data.bio}</p>
        </Card>

        {/* Habilidades */}
        <Card icon={Star} label="Habilidades">
          <div className="flex flex-wrap gap-2">
            {data.skills.map((s) => (
              <span
                key={s}
                className="text-sm font-medium text-[#ccc8c0] border border-[#2a2a24] px-3 py-1 hover:border-[#c4983a]/40 hover:text-[#f0ece4] transition-colors"
              >
                {s}
              </span>
            ))}
          </div>
        </Card>

        {!isCompany && (
          <Card icon={ClipboardList} label="Mis postulaciones">
            {myApplications.length === 0 ? (
              <p className="text-sm text-[#948f87]">Aún no has postulado a ninguna oferta.</p>
            ) : (
              <div className="flex flex-col divide-y divide-[#2a2a24]">
                {myApplications.map(({ job, status, appliedDate }) => (
                  <button
                    key={job.id}
                    onClick={() => navigate(`/jobs/${job.id}`)}
                    className="text-left py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4 hover:text-[#c4983a] transition-colors cursor-pointer"
                  >
                    <div>
                      <p className="text-[15px] font-semibold text-[#f0ece4]">{job.title}</p>
                      <p className="text-sm text-[#948f87]">{job.company} · {appliedDate}</p>
                    </div>
                    <span className="text-xs tracking-[0.15em] uppercase font-medium text-[#c4983a] border border-[#c4983a]/30 px-2.5 py-1 flex-shrink-0">
                      {STATUS_LABELS[status] ?? status}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </Card>
        )}

        {isCompany && (
          <Card icon={Briefcase} label="Ofertas publicadas">
            {myJobs.length === 0 ? (
              <p className="text-sm text-[#948f87]">Aún no has publicado ninguna oferta.</p>
            ) : (
              <div className="flex flex-col divide-y divide-[#2a2a24]">
                {myJobs.map((job) => (
                  <button
                    key={job.id}
                    onClick={() => navigate(`/jobs/${job.id}`)}
                    className="text-left py-3 first:pt-0 last:pb-0 hover:text-[#c4983a] transition-colors cursor-pointer"
                  >
                    <p className="text-[15px] font-semibold text-[#f0ece4]">{job.title}</p>
                    <p className="text-sm text-[#948f87]">{job.applicants} postulantes</p>
                  </button>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* Experiencia */}
        <Card icon={Briefcase} label="Experiencia">
          <div className="flex flex-col divide-y divide-[#2a2a24]">
            {data.experience.map((exp, i) => (
              <div key={exp.id} className="flex gap-5 py-4 first:pt-0 last:pb-0">
                <span className="text-xs tabular-nums font-medium text-[#7a5f22] flex-shrink-0 w-5 mt-0.5">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-[15px] font-semibold text-[#f0ece4]">{exp.role}</p>
                    <p className="text-xs text-[#625e5a] flex-shrink-0 mt-0.5">{exp.period}</p>
                  </div>
                  <p className="text-sm font-medium text-[#948f87] mt-0.5">{exp.org}</p>
                  <p className="text-sm text-[#ccc8c0] leading-relaxed mt-2">{exp.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Educación */}
        <Card icon={GraduationCap} label="Educación">
          <div className="flex gap-5">
            <span className="text-xs tabular-nums font-medium text-[#7a5f22] flex-shrink-0 w-5 mt-0.5">
              01
            </span>
            <div>
              <p className="text-[15px] font-semibold text-[#f0ece4]">{data.education.degree}</p>
              <p className="text-sm font-medium text-[#948f87] mt-0.5">{data.education.university}</p>
              <p className="text-sm text-[#625e5a] mt-0.5">{data.education.years}</p>
            </div>
          </div>
        </Card>

      </main>
    </div>
  )
}

function Card({ icon: Icon, label, children }) {
  return (
    <div className="bg-[#1c1c19] border border-[#2a2a24] px-6 py-5">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#2a2a24]">
        <Icon size={14} className="text-[#c4983a]" />
        <p className="text-xs tracking-[0.24em] uppercase font-medium text-[#948f87]">{label}</p>
      </div>
      {children}
    </div>
  )
}
