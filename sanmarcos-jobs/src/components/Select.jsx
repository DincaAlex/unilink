import { ChevronDown } from 'lucide-react'

export default function Select({ label, value, onChange, children }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className={`appearance-none bg-[#1c1c19] border text-xs tracking-[0.12em] uppercase font-medium pl-3 pr-7 py-2 cursor-pointer transition-colors focus:outline-none ${
          value
            ? 'border-[#c4983a]/50 text-[#c4983a]'
            : 'border-[#2a2a24] text-[#948f87] hover:border-[#c4983a]/30 hover:text-[#f0ece4]'
        }`}
      >
        <option value="">{label}</option>
        {children}
      </select>
      <ChevronDown
        size={11}
        className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#625e5a]"
      />
    </div>
  )
}
