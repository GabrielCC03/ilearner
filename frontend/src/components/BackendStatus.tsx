import { useState, useEffect } from 'react'

interface BackendStatusProps {
  className?: string
}

export default function BackendStatus({ className = '' }: BackendStatusProps) {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await fetch('http://localhost:8000/template/ping')
        if (!response.ok) {
          throw new Error('Failed to fetch message')
        }
        const data = await response.json()
        setMessage(data.ping)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchMessage()
  }, [])

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Backend Message:</h2>
      {loading && <p className="text-blue-500">Loading message from backend...</p>}
      {error && <p className="text-red-500 font-semibold">Error: {error}</p>}
      {!loading && !error && (
        <p className="text-green-600 font-bold text-xl">Message: {message}</p>
      )}
    </div>
  )
} 