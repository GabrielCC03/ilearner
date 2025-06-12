import { useState } from 'react'

interface CounterProps {
  className?: string
}

export default function Counter({ className = '' }: CounterProps) {
  const [count, setCount] = useState(0)

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <button 
        onClick={() => setCount((count) => count + 1)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
      >
        count is {count}
      </button>
      <p className="mt-4 text-gray-600">
        Edit <code className="bg-gray-200 px-2 py-1 rounded text-sm">src/App.tsx</code> and save to test HMR
      </p>
    </div>
  )
} 