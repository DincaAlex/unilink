import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Printer, ArrowLeft } from 'lucide-react'
import { useAppData } from '../context/AppDataContext'

export default function CvPrintPage() {
  const navigate = useNavigate()
  const { role, student, company } = useAppData()
  const isCompany = role === 'empresa'
  const data = isCompany ? company : student

  useEffect(() => {
    if (!data) return
    const timer = setTimeout(() => window.print(), 300)
    return () => clearTimeout(timer)
  }, [data])

  if (!data) return null

  const name = isCompany ? data.contactName : data.name
  const title = isCompany ? `${data.role} — ${data.companyName}` : data.career

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="no-print flex items-center justify-between max-w-2xl mx-auto px-6 pt-6">
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2 text-xs tracking-[0.18em] uppercase font-medium text-gray-500 hover:text-black transition-colors cursor-pointer"
        >
          <ArrowLeft size={13} />
          Volver al perfil
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-black text-white text-xs tracking-[0.18em] uppercase font-medium px-4 py-2 hover:bg-gray-800 transition-colors cursor-pointer"
        >
          <Printer size={13} />
          Imprimir / Guardar PDF
        </button>
      </div>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <header className="border-b-2 border-black pb-4 mb-6">
          <h1 className="text-3xl font-bold">{name}</h1>
          <p className="text-lg text-gray-700">{title}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-600">
            <span>{data.email}</span>
            <span>{data.phone}</span>
            <span>{data.location}</span>
            {isCompany && <span>{data.website}</span>}
          </div>
        </header>

        <Section title="Sobre mí">
          <p className="text-sm leading-relaxed">{data.bio}</p>
        </Section>

        {isCompany && (
          <Section title="Empresa">
            <p className="text-sm font-semibold">{data.companyName} — {data.industry}</p>
            <p className="text-sm leading-relaxed mt-1">{data.companyDescription}</p>
          </Section>
        )}

        <Section title="Habilidades">
          <p className="text-sm">{data.skills.join(' · ')}</p>
        </Section>

        <Section title="Experiencia">
          <div className="flex flex-col gap-3">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex items-baseline justify-between">
                  <p className="text-sm font-semibold">{exp.role}</p>
                  <p className="text-xs text-gray-500">{exp.period}</p>
                </div>
                <p className="text-sm text-gray-700">{exp.org}</p>
                <p className="text-sm mt-0.5">{exp.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Educación">
          <p className="text-sm font-semibold">{data.education.degree}</p>
          <p className="text-sm text-gray-700">{data.education.university} — {data.education.years}</p>
        </Section>

        {data.certifications?.length > 0 && (
          <Section title="Certificaciones">
            <div className="flex flex-col gap-1">
              {data.certifications.map((c) => (
                <p key={c.name} className="text-sm">{c.name} — {c.issuer} ({c.year})</p>
              ))}
            </div>
          </Section>
        )}

        {data.languages?.length > 0 && (
          <Section title="Idiomas">
            <p className="text-sm">
              {data.languages.map((l) => `${l.lang} (${l.level})`).join(' · ')}
            </p>
          </Section>
        )}
      </main>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <section className="mb-5">
      <h2 className="text-xs tracking-[0.2em] uppercase font-bold border-b border-gray-300 pb-1 mb-2">
        {title}
      </h2>
      {children}
    </section>
  )
}
