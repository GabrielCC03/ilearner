import { useState } from 'react';
import { openRouter } from '../../../api/common';

export default function Home() {
  const [message, setMessage] = useState('Not message yet');
  const [selectedSpace, setSelectedSpace] = useState<string | null>(null);

  return <div>

  </div>;
}