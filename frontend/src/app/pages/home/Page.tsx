import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Stack,
  Loader,
  Alert
} from '@mantine/core';
import { 
  IconPlus, 
  IconLayoutGrid, 
  IconList, 
  IconChevronDown,
  IconExclamationMark
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { Header, LearningSpaceCard } from '../../../components';
import { learningSpaceApi } from '../../../api/database/learningSpace';
import type { LearningSpace } from '../../../types/learningSpace';

export default function Home() {
  
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<string>('recent');
  const [opened, { open, close }] = useDisclosure(false);
  const [newSpaceName, setNewSpaceName] = useState('');
  
  // API state management
  const [learningSpaces, setLearningSpaces] = useState<LearningSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  // Fetch learning spaces on component mount
  useEffect(() => {
    fetchLearningSpaces();
  }, []);

  const fetchLearningSpaces = async () => {
    try {
      setLoading(true);
      setError(null);
      const spaces = await learningSpaceApi.getAll();
      setLearningSpaces(spaces);
    } catch (err) {``
      setError('Failed to load learning spaces. Please try again.');
      console.error('Error fetching learning spaces:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSpace = async () => {
    if (!newSpaceName.trim()) return;

    try {
      setCreating(true);
      const newSpace = await learningSpaceApi.create({ name: newSpaceName.trim() });
      setLearningSpaces([newSpace, ...learningSpaces]);
      setNewSpaceName('');
      close();
    } catch (err) {
      setError('Failed to create learning space. Please try again.');
      console.error('Error creating learning space:', err);
    } finally {
      setCreating(false);
    }
  };

  const handleSpaceClick = async (spaceId: string) => { 
    
    const space = await learningSpaceApi.getById(spaceId);
    learningSpaceApi.update(spaceId, space);

    navigate(`/learning-space/${spaceId}`);
    
  };

  const handleEditSpace = (spaceId: string) => {
    //TODO: Implement edit space with db
    console.log('Editing space:', spaceId);
  };

  const handleDeleteSpace = async (spaceId: string) => {
    try {
      await learningSpaceApi.delete(spaceId);
      setLearningSpaces(spaces => spaces.filter(space => space.id !== spaceId));
    } catch (err) {
      setError('Failed to delete learning space. Please try again.');
      console.error('Error deleting learning space:', err);
    }
  };

  // Sort learning spaces based on selected option
  const sortedSpaces = [...learningSpaces].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'files':
        return b.fileCount - a.fileCount;
      case 'recent':
      default:
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
  });

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

        {/* Error Alert */}
        {error && (
          <Alert 
            icon={<IconExclamationMark size={16} />} 
            color="red" 
            mb="md"
            onClose={() => setError(null)}
            withCloseButton
          >
            {error}
          </Alert>
        )}

        {/* Action Bar */}
        <Group justify="space-between" mb="xl">
          <Button 
            leftSection={<IconPlus size={16} />}
            size="md"
            onClick={open}
            disabled={loading}
          >
            Create a new Learning Space
          </Button>
          
          <Group gap="md">
            <Group gap="xs">
              <ActionIcon 
                variant={viewMode === 'grid' ? 'filled' : 'subtle'}
                color="blue"
                onClick={() => setViewMode('grid')}
                disabled={loading}
              >
                <IconLayoutGrid size={16} />
              </ActionIcon>
              <ActionIcon 
                variant={viewMode === 'list' ? 'filled' : 'subtle'}
                color="blue"
                onClick={() => setViewMode('list')}
                disabled={loading}
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
              disabled={loading}
            />
          </Group>
        </Group>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-20">
            <Loader size="lg" mb="md" />
            <Text c="gray.5">Loading learning spaces...</Text>
          </div>
        ) : (
          <>
            {/* Learning Spaces Grid */}
            {sortedSpaces.length > 0 ? (
              <SimpleGrid 
                cols={viewMode === 'grid' ? { base: 1, sm: 2, lg: 3, xl: 4 } : 1}
                spacing="lg"
              >
                {sortedSpaces.map((space) => (
                  <LearningSpaceCard
                    key={space.id}
                    id={space.id}
                    name={space.name}
                    lastUpdated={space.updatedAt}
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
          </>
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
            disabled={creating}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={close} disabled={creating}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateSpace} 
              disabled={!newSpaceName.trim() || creating}
              loading={creating}
            >
              Create
            </Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  );
}