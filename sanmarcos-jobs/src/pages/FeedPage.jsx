import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Search, MapPin, DollarSign, Users, Building2, X } from 'lucide-react'
import Navbar from '../components/Navbar'
import GlowInput from '../components/GlowInput'
import Select from '../components/Select'
import { useAppData } from '../context/AppDataContext'

const TYPE_FILTERS = ['Todas', 'Internas', 'Externas']

function checkSalary(num, range) {
  if (range === 'lt1000') return num < 1000
  if (range === '1000-2000') return num >= 1000 && num <= 2000
  if (range === 'gt2000') return num > 2000
  return true
}

export default function FeedPage() {
  const navigate = useNavigate()
  const { jobs } = useAppData()
  const [activeType, setActiveType] = useState('Todas')
  const [query, setQuery]           = useState('')
  const [modality, setModality]     = useState('')
  const [salary, setSalary]         = useState('')
  const [days, setDays]             = useState('')

  const hasActiveFilters = modality || salary || days

  function clearFilters() {
    setModality(''); setSalary(''); setDays('')
  }

  const filtered = jobs.filter((j) => {
    const matchType     = activeType === 'Todas' || (activeType === 'Internas' ? j.type === 'interna' : j.type === 'externa')
    const matchQuery    = !query || j.title.toLowerCase().includes(query.toLowerCase()) || j.company.toLowerCase().includes(query.toLowerCase())
    const matchModality = !modality || j.modality === modality
    const matchSalary   = !salary || checkSalary(j.salaryNum, salary)
    const matchDays     = !days || j.daysAgo <= Number(days)
    return matchType && matchQuery && matchModality && matchSalary && matchDays
  })

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Header */}
      <div className="border-b border-[#2a2a24] bg-[#1c1c19]">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <p className="text-xs tracking-[0.28em] uppercase text-[#948f87] font-medium mb-3">
            Portal de empleo — UNMSM
          </p>
          <h1 className="serif text-5xl text-[#f0ece4] mb-2">Ofertas disponibles</h1>
          <p className="text-sm text-[#948f87]">
            Encuentra prácticas y empleos dentro y fuera de la universidad.
          </p>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-8">

        {/* Fila 1: tipo + buscador */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-6">
            {TYPE_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveType(f)}
                className={`text-xs tracking-[0.2em] uppercase font-medium pb-1.5 transition-colors cursor-pointer border-b ${
                  activeType === f
                    ? 'text-[#c4983a] border-[#c4983a]'
                    : 'text-[#948f87] hover:text-[#f0ece4] border-transparent'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#948f87] pointer-events-none" />
            <GlowInput
              variant="box"
              type="text"
              placeholder="Buscar oferta o empresa..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              inputClassName="pl-8 pr-3 py-2 text-sm text-[#f0ece4] placeholder-[#504c48]"
            />
          </div>
        </div>

        {/* Fila 2: filtros avanzados */}
        <div className="flex flex-wrap items-center gap-2 mb-7 pb-6 border-b border-[#2a2a24]">
          <Select
            label="Modalidad"
            value={modality}
            onChange={(e) => setModality(e.target.value)}
          >
            <option value="Presencial">Presencial</option>
            <option value="Híbrido">Híbrido</option>
            <option value="Remoto">Remoto</option>
          </Select>

          <Select
            label="Sueldo"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          >
            <option value="lt1000">Hasta S/ 1,000</option>
            <option value="1000-2000">S/ 1,000 – 2,000</option>
            <option value="gt2000">Más de S/ 2,000</option>
          </Select>

          <Select
            label="Publicación"
            value={days}
            onChange={(e) => setDays(e.target.value)}
          >
            <option value="1">Hoy</option>
            <option value="3">Últimos 3 días</option>
            <option value="7">Última semana</option>
          </Select>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-xs tracking-[0.15em] uppercase font-medium text-[#c4983a] hover:text-[#d4aa4a] transition-colors cursor-pointer ml-1"
            >
              <X size={12} />
              Limpiar
            </button>
          )}

          <span className="ml-auto text-sm text-[#625e5a] font-medium">
            {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <p className="text-[#948f87] text-sm py-20 text-center">Sin resultados para los filtros aplicados.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filtered.map((job, i) => (
              <button
                key={job.id}
                onClick={() => navigate(`/jobs/${job.id}`)}
                className="text-left group bg-[#1c1c19] border border-[#2a2a24] px-5 py-5 hover:border-[#c4983a]/40 transition-all cursor-pointer flex flex-col"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs tabular-nums font-medium text-[#7a5f22]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className={`text-xs tracking-[0.18em] uppercase font-medium ${
                    job.type === 'interna' ? 'text-[#c4983a]' : 'text-[#948f87]'
                  }`}>
                    {job.type === 'interna' ? 'Interna' : 'Externa'}
                  </span>
                </div>

                <h2 className="serif text-xl text-[#f0ece4] group-hover:text-[#c4983a] transition-colors leading-snug mb-2">
                  {job.title}
                </h2>

                <div className="flex items-center gap-1.5 text-sm font-medium text-[#ccc8c0] mb-3">
                  <Building2 size={13} className="text-[#625e5a] flex-shrink-0" />
                  {job.company}
                </div>

                <div className="flex flex-col gap-1.5 text-sm text-[#948f87] mb-4">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={12} className="flex-shrink-0" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <DollarSign size={12} className="flex-shrink-0" />
                    {job.salary}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users size={12} className="flex-shrink-0" />
                    {job.applicants} postulantes
                  </span>
                </div>

                <div className="flex items-end justify-between gap-2 mt-auto">
                  <div className="flex flex-wrap gap-1.5">
                    {job.skills.slice(0, 3).map((s) => (
                      <span key={s} className="text-xs font-medium text-[#948f87] border border-[#2a2a24] px-2 py-0.5">
                        {s}
                      </span>
                    ))}
                  </div>
                  <ArrowRight size={14} className="flex-shrink-0 text-[#2a2a24] group-hover:text-[#c4983a] transition-colors" />
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
