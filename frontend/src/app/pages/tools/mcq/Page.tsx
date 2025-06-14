import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Title, Text, Container, Stack, Group } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { Header } from '../../../../components';

interface NavigationState {
  learningSpaceId?: string;
}

export default function MCQPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state as NavigationState) || {};

  const handleBackToLearningSpace = () => {
    if (state.learningSpaceId) {
      navigate(`/learning-space/${state.learningSpaceId}`);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <Container size="xl" className="flex-1 py-6">
        <Stack gap="lg">
          <Group>
            <Button
              variant="subtle"
              leftSection={<IconArrowLeft size={16} />}
              onClick={handleBackToLearningSpace}
            >
              Back to Learning Space
            </Button>
          </Group>
          <div className="flex flex-col items-center justify-center flex-1">
            <Title order={1}>MCQ Tool</Title>
            <Text c="dimmed">To be implemented</Text>
          </div>
        </Stack>
      </Container>
    </div>
  );
} 