import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'

interface LogoHeaderProps {
  className?: string
}

export default function LogoHeader({ className = '' }: LogoHeaderProps) {
  return (
    <div className={className}>
      <div className="flex justify-center space-x-8 mb-8">
        <a href="https://vite.dev" target="_blank" className="transition-transform hover:scale-110">
          <img src={viteLogo} className="h-24 w-24" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" className="transition-transform hover:scale-110">
          <img src={reactLogo} className="h-24 w-24 animate-spin" alt="React logo" />
        </a>
      </div>
      
      <h1 className="text-5xl font-bold text-gray-800 mb-8">Vite + React</h1>
    </div>
  )
} 