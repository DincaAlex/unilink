import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'
import GlowInput from '../components/GlowInput'
import { useAppData } from '../context/AppDataContext'

const DEMO_ACCOUNTS = {
  estudiante: { email: 'admin@unmsm.edu.pe', password: 'unmsm2025' },
  empresa: { email: 'maria.fernandez@talenthub.pe', password: 'talenthub2025' },
}

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAppData()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function fillDemo(kind) {
    setEmail(DEMO_ACCOUNTS[kind].email)
    setPassword(DEMO_ACCOUNTS[kind].password)
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      navigate('/feed')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">

        {/* Cabecera fuera del bloque */}
        <div className="text-center mb-7">
          <p className="text-xs tracking-[0.28em] uppercase text-[#948f87] font-medium mb-4">
            Universidad Nacional Mayor de San Marcos
          </p>
          <h1 className="serif text-[2.8rem] leading-none text-[#f0ece4]">
            SanMarcos Jobs
          </h1>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-px flex-1 bg-[#2a2a24]" />
            <span className="text-xs tracking-[0.24em] uppercase text-[#c4983a] font-medium">
              Portal de Empleo
            </span>
            <div className="h-px flex-1 bg-[#2a2a24]" />
          </div>
        </div>

        {/* Bloque del formulario */}
        <div className="bg-[#1c1c19] border border-[#2a2a24] px-8 py-8">
          <p className="text-xs tracking-[0.22em] uppercase text-[#948f87] font-medium mb-7">
            Acceso con cuenta institucional
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label className="block text-xs tracking-[0.22em] uppercase text-[#948f87] font-medium mb-2.5">
                Correo institucional
              </label>
              <GlowInput
                variant="box"
                type="email"
                placeholder="usuario@unmsm.edu.pe"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError('') }}
                inputClassName="px-3 py-2.5 text-sm text-[#f0ece4] placeholder-[#504c48]"
              />
            </div>

            <div>
              <label className="block text-xs tracking-[0.22em] uppercase text-[#948f87] font-medium mb-2.5">
                Contraseña
              </label>
              <GlowInput
                variant="box"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError('') }}
                inputClassName="px-3 py-2.5 text-sm text-[#f0ece4] placeholder-[#504c48]"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-[#d08070] text-sm font-medium">
                <AlertCircle size={14} className="flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#c4983a] text-[#141412] text-xs tracking-[0.24em] uppercase font-semibold py-3.5 hover:bg-[#d4aa4a] transition-colors cursor-pointer mt-1 disabled:opacity-60"
            >
              {loading ? 'Ingresando…' : 'Ingresar'}
            </button>
          </form>

          <div className="flex items-center gap-3 mt-6 mb-5">
            <div className="h-px flex-1 bg-[#2a2a24]" />
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#625e5a]">Cuentas demo</span>
            <div className="h-px flex-1 bg-[#2a2a24]" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => fillDemo('estudiante')}
              className="text-xs tracking-[0.15em] uppercase font-medium border border-[#2a2a24] text-[#948f87] hover:text-[#f0ece4] hover:border-[#c4983a]/40 py-2.5 transition-colors cursor-pointer"
            >
              Ver como estudiante
            </button>
            <button
              type="button"
              onClick={() => fillDemo('empresa')}
              className="text-xs tracking-[0.15em] uppercase font-medium border border-[#2a2a24] text-[#948f87] hover:text-[#f0ece4] hover:border-[#c4983a]/40 py-2.5 transition-colors cursor-pointer"
            >
              Ver como empresa
            </button>
          </div>
        </div>

        <p className="text-center text-xs tracking-[0.15em] text-[#3a3632] mt-6">
          © 2025 UNMSM
        </p>
      </div>
    </div>
  )
}
