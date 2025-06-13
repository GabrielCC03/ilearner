import { Group, Text, ActionIcon } from '@mantine/core';
import { IconSettings, IconUser } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const navigate = useNavigate();

  return (
    <header className="border-b border-gray-700 bg-gray-900 px-6 py-4">
      <Group justify="space-between">
        <Group gap="md">
          <div 
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/')}
          >
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <img src="/i-learner-logo.png" alt="iLearner Logo" className="w-10 h-10 rounded-2xl" />
            </div>
            <Text size="xl" fw={600} c="white">
              ilearner
            </Text>
          </div>
        </Group>
        
        <Group gap="sm">
          <ActionIcon variant="subtle" color="gray" size="lg">
            <IconSettings size={20} />
          </ActionIcon>
          <ActionIcon variant="subtle" color="gray" size="lg">
            <IconUser size={20} />
          </ActionIcon>
        </Group>
      </Group>
    </header>
  );
} 