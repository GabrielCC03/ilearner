import { useState } from 'react';
import { 
  Container, 
  Title, 
  Text, 
  Button, 
  Group, 
  ActionIcon, 
  Select,
  SimpleGrid,
  Modal,
  TextInput,
  Stack
} from '@mantine/core';
import { 
  IconPlus, 
  IconLayoutGrid, 
  IconList, 
  IconChevronDown 
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { Header, LearningSpaceCard } from '../../../components';

interface LearningSpace {
  id: string;
  name: string;
  createdAt: string;
  fileCount: number;
}

export default function Home() {

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<string>('recent');
  const [opened, { open, close }] = useDisclosure(false);
  const [newSpaceName, setNewSpaceName] = useState('');
  
  //TODO: Replace with actual API calls and data
  const [learningSpaces, setLearningSpaces] = useState<LearningSpace[]>([
    {
      id: '1',
      name: 'Machine Learning Fundamentals',
      createdAt: '2024-01-15',
      fileCount: 3
    },
    {
      id: '2', 
      name: 'Spanish Literature',
      createdAt: '2024-01-12',
      fileCount: 5
    },
    {
      id: '3',
      name: 'Physics - Quantum Mechanics',
      createdAt: '2024-01-10',
      fileCount: 2
    }
  ]);

  const handleCreateSpace = () => {
    if (newSpaceName.trim()) {
      const newSpace: LearningSpace = {
        id: Date.now().toString(),
        name: newSpaceName.trim(),
        createdAt: new Date().toISOString(),
        fileCount: 0
      };
      setLearningSpaces([newSpace, ...learningSpaces]);
      setNewSpaceName('');
      close();
    }
  };

  const handleSpaceClick = (spaceId: string) => {
    //TODO Navigate to learning space - you'll implement routing here
    console.log('Opening space:', spaceId);
  };

  const handleEditSpace = (spaceId: string) => {
    //TODO: Implement edit space with db
    console.log('Editing space:', spaceId);
  };

  const handleDeleteSpace = (spaceId: string) => {
    //TODO: Implement delete space with db
    setLearningSpaces(spaces => spaces.filter(space => space.id !== spaceId));
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <Container size="xl" py="xl">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <Title order={1} size="3rem" c="white" mb="md">
            Welcome to iLearner
          </Title>
          <Text size="lg" c="gray.4">
            Transform your educational content into interactive assessments and personalized learning experiences
          </Text>
        </div>

        {/* Action Bar */}
        <Group justify="space-between" mb="xl">
          <Button 
            leftSection={<IconPlus size={16} />}
            size="md"
            onClick={open}
          >
            Create a new Learning Space
          </Button>
          
          <Group gap="md">
            <Group gap="xs">
              <ActionIcon 
                variant={viewMode === 'grid' ? 'filled' : 'subtle'}
                color="blue"
                onClick={() => setViewMode('grid')}
              >
                <IconLayoutGrid size={16} />
              </ActionIcon>
              <ActionIcon 
                variant={viewMode === 'list' ? 'filled' : 'subtle'}
                color="blue"
                onClick={() => setViewMode('list')}
              >
                <IconList size={16} />
              </ActionIcon>
            </Group>
            
            <Select
              placeholder="Most recent"
              data={[
                { value: 'recent', label: 'Most recent' },
                { value: 'name', label: 'Name A-Z' },
                { value: 'files', label: 'Most files' }
              ]}
              value={sortBy}
              onChange={(value) => setSortBy(value || 'recent')}
              rightSection={<IconChevronDown size={16} />}
              className="w-40"
            />
          </Group>
        </Group>

        {/* Learning Spaces Grid */}
        {learningSpaces.length > 0 ? (
          <SimpleGrid 
            cols={viewMode === 'grid' ? { base: 1, sm: 2, lg: 3, xl: 4 } : 1}
            spacing="lg"
          >
            {learningSpaces.map((space) => (
              <LearningSpaceCard
                key={space.id}
                id={space.id}
                name={space.name}
                createdAt={space.createdAt}
                fileCount={space.fileCount}
                onClick={() => handleSpaceClick(space.id)}
                onEdit={() => handleEditSpace(space.id)}
                onDelete={() => handleDeleteSpace(space.id)}
              />
            ))}
          </SimpleGrid>
        ) : (
          <div className="text-center py-20">
            <Text size="xl" c="gray.5" mb="md">
              No learning spaces yet
            </Text>
            <Text c="gray.6" mb="xl">
              Create your first learning space to get started
            </Text>
            <Button 
              leftSection={<IconPlus size={16} />}
              size="lg"
              onClick={open}
            >
              Create Learning Space
            </Button>
          </div>
        )}
      </Container>

      {/* Create New Space Modal */}
      <Modal opened={opened} onClose={close} title="Create New Learning Space" centered>
        <Stack>
          <TextInput
            label="Learning Space Name"
            placeholder="Enter a name for your learning space"
            value={newSpaceName}
            onChange={(event) => setNewSpaceName(event.currentTarget.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleCreateSpace();
              }
            }}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={close}>
              Cancel
            </Button>
            <Button onClick={handleCreateSpace} disabled={!newSpaceName.trim()}>
              Create
            </Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  );
}