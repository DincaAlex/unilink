import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, MapPin, DollarSign, Clock, Users, Building2, Send, FileText, ListChecks, Wrench } from 'lucide-react'
import Navbar from '../components/Navbar'
import { useAppData } from '../context/AppDataContext'

export default function JobDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { jobs, applications, applyToJob } = useAppData()
  const jobId = Number(id)
  const job = jobs.find((j) => j.id === jobId)
  const [applied, setApplied] = useState(false)

  useEffect(() => {
    setApplied(applications.some((a) => a.jobId === jobId))
  }, [applications, jobId])

  function handleApply() {
    applyToJob(jobId)
    setApplied(true)
  }

  if (!job) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center py-32 text-[#948f87] text-sm">
          Oferta no encontrada.
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Header block */}
      <div className="bg-[#1c1c19] border-b border-[#2a2a24]">
        <div className="max-w-3xl mx-auto px-6 py-10">

          <button
            onClick={() => navigate('/feed')}
            className="flex items-center gap-2 text-xs tracking-[0.18em] uppercase font-medium text-[#948f87] hover:text-[#f0ece4] mb-8 transition-colors cursor-pointer"
          >
            <ArrowLeft size={13} />
            Volver a ofertas
          </button>

          <div className="flex items-start justify-between gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center gap-1.5 text-sm font-medium text-[#948f87]">
                  <Building2 size={13} className="text-[#625e5a]" />
                  {job.company}
                </div>
                <span className="text-[#2a2a24]">·</span>
                <span className={`text-xs tracking-[0.18em] uppercase font-medium ${
                  job.type === 'interna' ? 'text-[#c4983a]' : 'text-[#948f87]'
                }`}>
                  {job.type === 'interna' ? 'Interna' : 'Externa'}
                </span>
              </div>

              <h1 className="serif text-4xl text-[#f0ece4] leading-tight">
                {job.title}
              </h1>
            </div>

            {/* Botón postular */}
            <div className="flex-shrink-0">
              {applied ? (
                <div className="flex items-center gap-2 text-sm font-medium text-[#c4983a] border border-[#c4983a]/30 px-5 py-3">
                  <CheckCircle2 size={15} />
                  Postulación enviada
                </div>
              ) : (
                <button
                  onClick={handleApply}
                  className="flex items-center gap-2 bg-[#c4983a] text-[#141412] text-xs tracking-[0.2em] uppercase font-semibold px-6 py-3 hover:bg-[#d4aa4a] transition-colors cursor-pointer"
                >
                  <Send size={13} />
                  Postular
                </button>
              )}
            </div>
          </div>

          {/* Metadata grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-7">
            {[
              { icon: MapPin,      value: job.location },
              { icon: DollarSign, value: job.salary },
              { icon: Clock,      value: job.posted },
              { icon: Users,      value: `${job.applicants} postulantes` },
            ].map(({ icon: Icon, value }) => (
              <div
                key={value}
                className="bg-[#141412] border border-[#2a2a24] px-3 py-2.5 flex items-center gap-2 text-sm text-[#948f87]"
              >
                <Icon size={13} className="text-[#625e5a] flex-shrink-0" />
                {value}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contenido */}
      <main className="max-w-3xl mx-auto px-6 py-8 flex flex-col gap-4">

        <Card icon={FileText} label="Descripción del puesto">
          <p className="text-[15px] text-[#ccc8c0] leading-relaxed">{job.description}</p>
        </Card>

        <Card icon={ListChecks} label="Requisitos">
          <ol className="flex flex-col divide-y divide-[#2a2a24]">
            {job.requirements.map((req, i) => (
              <li key={req} className="flex items-start gap-5 py-3 first:pt-0 last:pb-0 text-[15px] text-[#ccc8c0]">
                <span className="text-xs tabular-nums font-medium text-[#7a5f22] flex-shrink-0 mt-0.5">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {req}
              </li>
            ))}
          </ol>
        </Card>

        <Card icon={Wrench} label="Habilidades requeridas">
          <div className="flex flex-wrap gap-2">
            {job.skills.map((s) => (
              <span
                key={s}
                className="text-sm font-medium text-[#ccc8c0] border border-[#2a2a24] px-3 py-1 hover:border-[#c4983a]/40 hover:text-[#f0ece4] transition-colors"
              >
                {s}
              </span>
            ))}
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
