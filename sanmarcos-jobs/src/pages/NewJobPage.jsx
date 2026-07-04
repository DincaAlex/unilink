import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Send } from 'lucide-react'
import Navbar from '../components/Navbar'
import GlowInput from '../components/GlowInput'
import Select from '../components/Select'
import { useAppData } from '../context/AppDataContext'

const EMPTY_FORM = {
  title: '',
  type: 'externa',
  modality: 'Presencial',
  area: '',
  location: '',
  salaryNum: '',
  deadline: '',
  duration: '',
  hoursPerWeek: '',
  description: '',
  requirements: '',
  benefits: '',
  skills: '',
}

export default function NewJobPage() {
  const navigate = useNavigate()
  const { addJob, company, role } = useAppData()
  const [form, setForm] = useState(EMPTY_FORM)

  function set(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const salaryNum = Number(form.salaryNum) || 0
    const newJob = {
      title: form.title,
      company: company.companyName,
      location: form.location,
      type: form.type,
      modality: form.modality,
      area: form.area,
      salary: `S/ ${salaryNum.toLocaleString('es-PE')} / mes`,
      salaryNum,
      posted: 'Hace 0 días',
      daysAgo: 0,
      deadline: form.deadline,
      duration: form.duration,
      hoursPerWeek: Number(form.hoursPerWeek) || 0,
      status: 'abierto',
      initials: company.initials,
      color: company.color,
      description: form.description,
      requirements: form.requirements.split('\n').map((s) => s.trim()).filter(Boolean),
      benefits: form.benefits.split('\n').map((s) => s.trim()).filter(Boolean),
      skills: form.skills.split('\n').map((s) => s.trim()).filter(Boolean),
      applicants: 0,
      postedBy: 'company',
    }

    const created = await addJob(newJob)
    navigate(`/jobs/${created.id}`)
  }

  if (role !== 'empresa') {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center py-32 text-[#948f87] text-sm">
          Esta acción requiere una cuenta de empresa. Inicia sesión con esa cuenta.
        </div>
      </div>
    )
  }

  if (!company) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center py-32 text-[#948f87] text-sm">Cargando…</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="border-b border-[#2a2a24] bg-[#1c1c19]">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <button
            onClick={() => navigate('/feed')}
            className="flex items-center gap-2 text-xs tracking-[0.18em] uppercase font-medium text-[#948f87] hover:text-[#f0ece4] mb-8 transition-colors cursor-pointer"
          >
            <ArrowLeft size={13} />
            Volver a ofertas
          </button>
          <p className="text-xs tracking-[0.28em] uppercase text-[#948f87] font-medium mb-3">
            {company.companyName}
          </p>
          <h1 className="serif text-4xl text-[#f0ece4]">Publicar nueva oferta</h1>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Field label="Título del puesto">
            <GlowInput variant="box" required value={form.title} onChange={set('title')}
              inputClassName="px-3 py-2.5 text-sm text-[#f0ece4] placeholder-[#504c48]" />
          </Field>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Select label="Tipo" value={form.type} onChange={set('type')}>
              <option value="externa">Externa</option>
              <option value="interna">Interna</option>
            </Select>
            <Select label="Modalidad" value={form.modality} onChange={set('modality')}>
              <option value="Presencial">Presencial</option>
              <option value="Híbrido">Híbrido</option>
              <option value="Remoto">Remoto</option>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Área">
              <GlowInput variant="box" required value={form.area} onChange={set('area')}
                inputClassName="px-3 py-2.5 text-sm text-[#f0ece4] placeholder-[#504c48]" />
            </Field>
            <Field label="Ubicación">
              <GlowInput variant="box" required placeholder="Lima, Presencial" value={form.location} onChange={set('location')}
                inputClassName="px-3 py-2.5 text-sm text-[#f0ece4] placeholder-[#504c48]" />
            </Field>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Field label="Sueldo (S/ mensual)">
              <GlowInput variant="box" type="number" min="0" required value={form.salaryNum} onChange={set('salaryNum')}
                inputClassName="px-3 py-2.5 text-sm text-[#f0ece4] placeholder-[#504c48]" />
            </Field>
            <Field label="Horas/semana">
              <GlowInput variant="box" type="number" min="0" required value={form.hoursPerWeek} onChange={set('hoursPerWeek')}
                inputClassName="px-3 py-2.5 text-sm text-[#f0ece4] placeholder-[#504c48]" />
            </Field>
            <Field label="Duración">
              <GlowInput variant="box" required placeholder="6 meses" value={form.duration} onChange={set('duration')}
                inputClassName="px-3 py-2.5 text-sm text-[#f0ece4] placeholder-[#504c48]" />
            </Field>
            <Field label="Fecha límite">
              <GlowInput variant="box" type="date" required value={form.deadline} onChange={set('deadline')}
                inputClassName="px-3 py-2.5 text-sm text-[#f0ece4] placeholder-[#504c48]" />
            </Field>
          </div>

          <Field label="Descripción">
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={set('description')}
              className="w-full bg-[#1c1c19] border border-[#2a2a24] px-3 py-2.5 text-sm text-[#f0ece4] placeholder-[#504c48] outline-none focus:border-[#c4983a]/50 transition-colors"
            />
          </Field>

          <Field label="Requisitos" hint="Un requisito por línea">
            <textarea
              rows={4}
              value={form.requirements}
              onChange={set('requirements')}
              className="w-full bg-[#1c1c19] border border-[#2a2a24] px-3 py-2.5 text-sm text-[#f0ece4] placeholder-[#504c48] outline-none focus:border-[#c4983a]/50 transition-colors"
            />
          </Field>

          <Field label="Beneficios" hint="Un beneficio por línea">
            <textarea
              rows={3}
              value={form.benefits}
              onChange={set('benefits')}
              className="w-full bg-[#1c1c19] border border-[#2a2a24] px-3 py-2.5 text-sm text-[#f0ece4] placeholder-[#504c48] outline-none focus:border-[#c4983a]/50 transition-colors"
            />
          </Field>

          <Field label="Habilidades requeridas" hint="Una habilidad por línea">
            <textarea
              rows={3}
              value={form.skills}
              onChange={set('skills')}
              className="w-full bg-[#1c1c19] border border-[#2a2a24] px-3 py-2.5 text-sm text-[#f0ece4] placeholder-[#504c48] outline-none focus:border-[#c4983a]/50 transition-colors"
            />
          </Field>

          <button
            type="submit"
            className="self-start flex items-center gap-2 bg-[#c4983a] text-[#141412] text-xs tracking-[0.2em] uppercase font-semibold px-6 py-3 hover:bg-[#d4aa4a] transition-colors cursor-pointer mt-2"
          >
            <Send size={13} />
            Publicar oferta
          </button>
        </form>
      </main>
    </div>
  )
}

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="block text-xs tracking-[0.22em] uppercase text-[#948f87] font-medium mb-2.5">
        {label}
        {hint && <span className="normal-case tracking-normal text-[#625e5a] font-normal ml-2">— {hint}</span>}
      </label>
      {children}
    </div>
  )
}
