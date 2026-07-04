import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import Navbar from '../components/Navbar'
import GlowInput from '../components/GlowInput'
import { useAppData } from '../context/AppDataContext'

export default function EditProfilePage() {
  const navigate = useNavigate()
  const { role, student, updateStudent, company, updateCompany } = useAppData()
  const isCompany = role === 'empresa'
  const source = isCompany ? company : student

  const [form, setForm] = useState(null)

  useEffect(() => {
    if (source && !form) {
      setForm({ ...source, skills: source.skills.join(', ') })
    }
  }, [source])

  function set(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const patch = {
      ...form,
      skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
    }
    if (isCompany) {
      await updateCompany(patch)
    } else {
      await updateStudent(patch)
    }
    navigate('/profile')
  }

  if (!form) {
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
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 text-xs tracking-[0.18em] uppercase font-medium text-[#948f87] hover:text-[#f0ece4] mb-8 transition-colors cursor-pointer"
          >
            <ArrowLeft size={13} />
            Volver al perfil
          </button>
          <h1 className="serif text-4xl text-[#f0ece4]">Editar perfil</h1>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {isCompany ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Nombre de contacto">
                  <GlowInput variant="box" required value={form.contactName} onChange={set('contactName')}
                    inputClassName="px-3 py-2.5 text-sm text-[#f0ece4]" />
                </Field>
                <Field label="Cargo">
                  <GlowInput variant="box" required value={form.role} onChange={set('role')}
                    inputClassName="px-3 py-2.5 text-sm text-[#f0ece4]" />
                </Field>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Empresa">
                  <GlowInput variant="box" required value={form.companyName} onChange={set('companyName')}
                    inputClassName="px-3 py-2.5 text-sm text-[#f0ece4]" />
                </Field>
                <Field label="Industria">
                  <GlowInput variant="box" required value={form.industry} onChange={set('industry')}
                    inputClassName="px-3 py-2.5 text-sm text-[#f0ece4]" />
                </Field>
              </div>
              <Field label="Descripción de la empresa">
                <textarea
                  rows={3}
                  value={form.companyDescription}
                  onChange={set('companyDescription')}
                  className="w-full bg-[#1c1c19] border border-[#2a2a24] px-3 py-2.5 text-sm text-[#f0ece4] outline-none focus:border-[#c4983a]/50 transition-colors"
                />
              </Field>
              <Field label="Sitio web">
                <GlowInput variant="box" value={form.website} onChange={set('website')}
                  inputClassName="px-3 py-2.5 text-sm text-[#f0ece4]" />
              </Field>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Nombre completo">
                  <GlowInput variant="box" required value={form.name} onChange={set('name')}
                    inputClassName="px-3 py-2.5 text-sm text-[#f0ece4]" />
                </Field>
                <Field label="Carrera">
                  <GlowInput variant="box" required value={form.career} onChange={set('career')}
                    inputClassName="px-3 py-2.5 text-sm text-[#f0ece4]" />
                </Field>
              </div>
              <Field label="Facultad">
                <GlowInput variant="box" required value={form.faculty} onChange={set('faculty')}
                  inputClassName="px-3 py-2.5 text-sm text-[#f0ece4]" />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Semestre">
                  <GlowInput variant="box" required value={form.semester} onChange={set('semester')}
                    inputClassName="px-3 py-2.5 text-sm text-[#f0ece4]" />
                </Field>
                <Field label="Promedio ponderado">
                  <GlowInput variant="box" required value={form.gpa} onChange={set('gpa')}
                    inputClassName="px-3 py-2.5 text-sm text-[#f0ece4]" />
                </Field>
              </div>
              <Field label="Sobre mí">
                <textarea
                  rows={3}
                  value={form.bio}
                  onChange={set('bio')}
                  className="w-full bg-[#1c1c19] border border-[#2a2a24] px-3 py-2.5 text-sm text-[#f0ece4] outline-none focus:border-[#c4983a]/50 transition-colors"
                />
              </Field>
            </>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Email">
              <GlowInput variant="box" type="email" required value={form.email} onChange={set('email')}
                inputClassName="px-3 py-2.5 text-sm text-[#f0ece4]" />
            </Field>
            <Field label="Teléfono">
              <GlowInput variant="box" value={form.phone} onChange={set('phone')}
                inputClassName="px-3 py-2.5 text-sm text-[#f0ece4]" />
            </Field>
          </div>

          <Field label="Ubicación">
            <GlowInput variant="box" value={form.location} onChange={set('location')}
              inputClassName="px-3 py-2.5 text-sm text-[#f0ece4]" />
          </Field>

          {isCompany && (
            <Field label="Sobre mí (reclutador/a)">
              <textarea
                rows={3}
                value={form.bio}
                onChange={set('bio')}
                className="w-full bg-[#1c1c19] border border-[#2a2a24] px-3 py-2.5 text-sm text-[#f0ece4] outline-none focus:border-[#c4983a]/50 transition-colors"
              />
            </Field>
          )}

          <Field label="Habilidades" hint="separadas por coma">
            <GlowInput variant="box" value={form.skills} onChange={set('skills')}
              inputClassName="px-3 py-2.5 text-sm text-[#f0ece4]" />
          </Field>

          <button
            type="submit"
            className="self-start flex items-center gap-2 bg-[#c4983a] text-[#141412] text-xs tracking-[0.2em] uppercase font-semibold px-6 py-3 hover:bg-[#d4aa4a] transition-colors cursor-pointer mt-2"
          >
            <Save size={13} />
            Guardar cambios
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
