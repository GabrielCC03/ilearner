import { useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');
  const [selectedSpace, setSelectedSpace] = useState<string | null>(null);

  return <div>Home</div>;
}