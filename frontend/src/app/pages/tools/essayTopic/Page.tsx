import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, Text, Title, Container, Stack, Alert, Group } from '@mantine/core';
import { IconArrowLeft, IconFileText } from '@tabler/icons-react';
import { Header } from '../../../../components';
import type { FileItem } from '../../../../types/learningSpace';

interface NavigationState {
  learningSpaceId: string;
  files: FileItem[];
  toolId: string;
}

export default function EssayTopicPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get the passed state from navigation
  const state = location.state as NavigationState | null;
  
  const handleBackToLearningSpace = () => {
    if (state?.learningSpaceId) {
      navigate(`/learning-space/${state.learningSpaceId}`);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <Container size="lg" className="flex-1 py-6">
        <Stack gap="lg">
          {/* Back button */}
          <Group>
            <Button
              variant="subtle"
              leftSection={<IconArrowLeft size={16} />}
              onClick={handleBackToLearningSpace}
            >
              Back to Learning Space
            </Button>
          </Group>

          {/* Title */}
          <div>
            <Title order={1} mb="sm">
              Essay Topic Generator
            </Title>
            <Text c="dimmed">
              Generate essay topics and guidelines based on your uploaded content
            </Text>
          </div>

          {/* Files info */}
          <Alert icon={<IconFileText size={16} />} variant="light">
            <Text size="sm">
              {state?.files ? (
                <>
                  Working with {state.files.length} file{state.files.length !== 1 ? 's' : ''} from your learning space:
                  <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
                    {state.files.map((file) => (
                      <li key={file.id}>{file.name}</li>
                    ))}
                  </ul>
                </>
              ) : (
                'No files available from the learning space'
              )}
            </Text>
          </Alert>

          {/* Placeholder content */}
          <Box 
            p="xl" 
            style={{ 
              border: '2px dashed #e9ecef',
              borderRadius: '8px',
              textAlign: 'center' 
            }}
          >
            <Text size="lg" fw={500} mb="sm">
              Essay Topic Generator Coming Soon
            </Text>
            <Text c="dimmed">
              This tool will analyze your uploaded files and generate relevant essay topics and guidelines.
            </Text>
          </Box>

          {/* Debug info for development */}
          {state && (
            <Box p="sm" style={{ backgroundColor: '#f8f9fa', borderRadius: '4px', fontSize: '12px' }}>
              <Text size="xs" c="dimmed">Debug Info:</Text>
              <pre style={{ margin: 0, fontSize: '11px' }}>
                {JSON.stringify({
                  learningSpaceId: state.learningSpaceId,
                  toolId: state.toolId,
                  fileCount: state.files?.length || 0
                }, null, 2)}
              </pre>
            </Box>
          )}
        </Stack>
      </Container>
    </div>
  );
}
