import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Briefcase, UserCircle, LogOut, PlusCircle } from 'lucide-react'
import { useAppData } from '../context/AppDataContext'

export default function Navbar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { role, logout } = useAppData()

  const navLink = (to, label, Icon) => {
    const active = pathname === to
    return (
      <Link
        to={to}
        className={`flex items-center gap-2 text-xs tracking-[0.18em] uppercase font-medium transition-colors px-1 ${
          active
            ? 'text-[#c4983a]'
            : 'text-[#948f87] hover:text-[#f0ece4]'
        }`}
      >
        <Icon size={15} />
        {label}
      </Link>
    )
  }

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <nav className="sticky top-0 z-50 bg-[#1c1c19] border-b border-[#2a2a24]">
      <div className="max-w-5xl mx-auto px-6 py-0 flex items-center justify-between" style={{ height: '64px' }}>

        {/* Logo */}
        <Link to="/feed" className="flex items-center gap-3 group">
          <div className="flex items-center justify-center w-8 h-8 border border-[#c4983a]/50 group-hover:border-[#c4983a] transition-colors">
            <Briefcase size={15} className="text-[#c4983a]" />
          </div>
          <span className="serif text-[#f0ece4] text-lg tracking-wide">
            SanMarcos Jobs
          </span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6">
          <span className="text-xs tracking-[0.15em] uppercase font-medium text-[#c4983a] border border-[#c4983a]/30 px-3 py-1.5">
            {role === 'empresa' ? 'Empresa' : 'Estudiante'}
          </span>

          {navLink('/feed', 'Ofertas', Briefcase)}
          {role === 'empresa' && navLink('/jobs/new', 'Publicar oferta', PlusCircle)}
          {navLink('/profile', 'Mi Perfil', UserCircle)}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs tracking-[0.18em] uppercase font-medium text-[#625e5a] hover:text-[#948f87] transition-colors px-1 cursor-pointer"
          >
            <LogOut size={15} />
            Salir
          </button>
        </div>
      </div>
    </nav>
  )
}
