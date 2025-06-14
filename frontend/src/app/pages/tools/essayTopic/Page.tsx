import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Button, 
  Text, 
  Title, 
  Container, 
  Stack, 
  Group, 
  Grid,
  Progress,
  Alert
} from '@mantine/core';
import { IconArrowLeft, IconAlertCircle } from '@tabler/icons-react';
import { Header } from '../../../../components';
import type { FileItem } from '../../../../types/learningSpace';
import type { EssayInstructions, EssayFeedback } from '../../../../types/tools';
import { Instructions } from './Instructions';
import { Essay } from './Essay';
import { FeedbackComponent } from './Feedback';
import { generateEssayTopic, submitEssay, getEssayHistory } from '../../../../api/tools/essayTopic';

interface NavigationState {
  learningSpaceId: string;
  files: FileItem[];
  toolId: string;
  toolHistoryId?: string; // For reopening existing essays
}

export default function EssayTopicPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get the passed state from navigation
  const state = location.state as NavigationState | null;
  
  // UI State
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(true);
  const [studentEssay, setStudentEssay] = useState('');
  const [isGenerating, setIsGenerating] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Essay data
  const [essayInstructions, setEssayInstructions] = useState<EssayInstructions | null>(null);
  const [feedback, setFeedback] = useState<EssayFeedback | null>(null);
  const [toolHistoryId, setToolHistoryId] = useState<string | null>(null);
  // Prevent double initialization in StrictMode
  const hasInitialized = useRef(false);
  
  // Initialize the page - either generate new or load existing
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    const initialize = async () => {
      if (!state?.learningSpaceId) {
        setError('Learning space not found');
        setIsGenerating(false);
        return;
      }

      try {
        if (state.toolHistoryId) {
          // Reopening existing essay
          const history = await getEssayHistory(state.toolHistoryId);
          setEssayInstructions({
            toolHistoryId: history.toolHistoryId,
            topic: history.topic,
            guidelines: history.guidelines,
            helpingMaterial: history.helpingMaterial
          });
          setStudentEssay(history.studentEssay);
          setToolHistoryId(history.toolHistoryId);
          
          if (history.feedback && history.status === 'completed') {
            setFeedback(history.feedback);
            setIsSubmitted(true);
            setShowFeedback(true);
          }
        } else {
          // Generate new essay topic
          const instructions = await generateEssayTopic(state.learningSpaceId);
          setEssayInstructions(instructions);
          setToolHistoryId(instructions.toolHistoryId);
        }
      } catch (err) {
        console.error('Failed to initialize essay tool:', err);
        setError('Failed to load essay tool. Please try again.');
      } finally {
        setIsGenerating(false);
      }
    };

    initialize();
  }, [state]);
  
  const handleBackToLearningSpace = () => {
    if (state?.learningSpaceId) {
      navigate(`/learning-space/${state.learningSpaceId}`);
    } else {
      navigate('/');
    }
  };
  
  const handleSubmitEssay = async () => {
    if (!studentEssay.trim() || !toolHistoryId) return;
    
    try {
      setIsGenerating(true);
      const result = await submitEssay(toolHistoryId, studentEssay);
      setFeedback(result.feedback);
      setIsSubmitted(true);
      setShowFeedback(true);
    } catch (err) {
      console.error('Failed to submit essay:', err);
      setError('Failed to submit essay. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (isGenerating) {
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
              <Stack align="center" gap="lg">
                <Title order={2}>
                  {state?.toolHistoryId ? 'Loading Essay...' : 'Generating Essay Topic...'}
                </Title>
                <Text c="dimmed" ta="center">
                  {state?.toolHistoryId 
                    ? 'Loading your essay and feedback'
                    : 'Analyzing your uploaded materials to create a personalized essay topic'
                  }
                </Text>
                <Progress value={75} size="lg" radius="xl" style={{ width: '300px' }} animated />
              </Stack>
            </div>
          </Stack>
        </Container>
      </div>
    );
  }

  if (error) {
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
            
            <Alert 
              icon={<IconAlertCircle size={16} />} 
              title="Error" 
              color="red"
              variant="light"
            >
              {error}
            </Alert>
          </Stack>
        </Container>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <Container size="xl" className="flex-1 py-6">
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
              Write an essay based on your uploaded content
            </Text>
          </div>

          {/* Toggle buttons for post-submission */}
          {isSubmitted && (
            <Group justify="center">
              <Button
                variant={!showFeedback ? "filled" : "outline"}
                onClick={() => setShowFeedback(false)}
              >
                View Assignment & Essay
              </Button>
              <Button
                variant={showFeedback ? "filled" : "outline"}
                onClick={() => setShowFeedback(true)}
              >
                View Feedback
              </Button>
            </Group>
          )}

          {!isSubmitted ? (
            /* Pre-submission: Side by side layout */
            <Grid gutter="lg">
              <Grid.Col span={6}>
                <Instructions essayData={essayInstructions} />
              </Grid.Col>

              <Grid.Col span={6}>
                <Essay 
                  studentEssay={studentEssay}
                  onEssayChange={setStudentEssay}
                  onSubmit={handleSubmitEssay}
                />
              </Grid.Col>
            </Grid>
          ) : (
            /* Post-submission: Toggle between components and feedback */
            <>
              {showFeedback ? (
                <FeedbackComponent feedback={feedback} />
              ) : (
                <Grid gutter="lg">
                  <Grid.Col span={6}>
                    <Instructions essayData={essayInstructions} />
                  </Grid.Col>

                  <Grid.Col span={6}>
                    <Essay 
                      studentEssay={studentEssay}
                      onEssayChange={setStudentEssay}
                      onSubmit={handleSubmitEssay}
                    />
                  </Grid.Col>
                </Grid>
              )}
            </>
          )}
        </Stack>
      </Container>
    </div>
  );
}
