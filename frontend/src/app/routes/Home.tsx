import { LogoHeader, BackendStatus, Counter } from '../../components'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl mx-auto text-center">
        <LogoHeader />
        
        <BackendStatus className="mb-6" />
        
        <Counter className="mb-6" />
        
        <p className="text-gray-500 text-sm">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </div>
  )
} 