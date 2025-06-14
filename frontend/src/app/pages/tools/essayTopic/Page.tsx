import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Button, 
  Text, 
  Title, 
  Container, 
  Stack, 
  Group, 
  Grid,
  Progress} from '@mantine/core';
import { 
  IconArrowLeft} from '@tabler/icons-react';
import { Header } from '../../../../components';
import type { FileItem } from '../../../../types/learningSpace';
import { Instructions } from './Instructions';
import { Essay } from './Essay';
import { FeedbackComponent } from './Feedback';

interface NavigationState {
  learningSpaceId: string;
  files: FileItem[];
  toolId: string;
}

interface EssayData {
  topic: string;
  guidelines: string[];
  helpingMaterial: string[];
}

interface Feedback {
  score: number;
  overallStrengths: string[];
  overallImprovements: string[];
  detailedFeedback: string;
  rubricScores: {
    understandingAccuracy: { score: number; maxScore: number; feedback: string; };
    clarityOrganization: { score: number; maxScore: number; feedback: string; };
    criticalThinking: { score: number; maxScore: number; feedback: string; };
    languageGrammar: { score: number; maxScore: number; feedback: string; };
  };
}

export default function EssayTopicPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get the passed state from navigation
  const state = location.state as NavigationState | null;
  
  // UI State
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(true); // Toggle between components and feedback
  const [studentEssay, setStudentEssay] = useState('');
  const [isGenerating, setIsGenerating] = useState(true);
  
  // Essay data
  const [essayData, setEssayData] = useState<EssayData | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  
  // Mock data generation
  useEffect(() => {
    // Simulate API call to generate essay topic
    const generateEssayTopic = async () => {
      setIsGenerating(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock generated data based on files
      const mockEssayData: EssayData = {
        topic: "The Impact of Digital Technology on Modern Education",
        guidelines: [
          "Write a 300-400 word essay discussing the topic",
          "Include at least 2 specific examples from the provided materials",
          "Structure your essay with an introduction, body paragraphs, and conclusion",
          "Use clear topic sentences and transitions between paragraphs",
          "Support your arguments with evidence from the readings"
        ],
        helpingMaterial: [
          "Consider the transformation of traditional classroom settings",
          "Think about both positive and negative impacts of technology",
          "Reference specific technologies mentioned in your materials (e.g., LMS, interactive whiteboards)",
          "Consider different perspectives: students, teachers, and institutions",
          "Key themes to explore: accessibility, engagement, digital divide, personalized learning"
        ]
      };
      
      setEssayData(mockEssayData);
      setIsGenerating(false);
    };
    
    generateEssayTopic();
  }, []);
  
  const handleBackToLearningSpace = () => {
    if (state?.learningSpaceId) {
      navigate(`/learning-space/${state.learningSpaceId}`);
    } else {
      navigate('/');
    }
  };
  
  const handleSubmitEssay = async () => {
    if (!studentEssay.trim()) return;
    
    // Mock feedback generation
    const mockFeedback: Feedback = {
      score: 85,
      overallStrengths: [
        "Clear thesis statement and well-structured arguments",
        "Good use of examples from the provided materials",
        "Effective transitions between paragraphs"
      ],
      overallImprovements: [
        "Consider expanding on the digital divide discussion",
        "Add more specific statistics or data to support claims",
        "Strengthen the conclusion with a call to action"
      ],
      detailedFeedback: "Your essay demonstrates a solid understanding of the topic with well-organized thoughts and relevant examples. The introduction effectively sets up your argument, and you've done well to incorporate evidence from the provided materials. To improve, consider adding more quantitative data to support your claims and expanding on the socioeconomic implications of the digital divide in education.",
      rubricScores: {
        understandingAccuracy: {
          score: 22,
          maxScore: 25,
          feedback: "Demonstrates strong understanding of the topic with accurate information and relevant examples from the materials."
        },
        clarityOrganization: {
          score: 20,
          maxScore: 25,
          feedback: "Well-organized structure with clear introduction, body, and conclusion. Good use of transitions between paragraphs."
        },
        criticalThinking: {
          score: 18,
          maxScore: 25,
          feedback: "Shows good analysis but could benefit from deeper critical evaluation and more diverse perspectives."
        },
        languageGrammar: {
          score: 25,
          maxScore: 25,
          feedback: "Excellent grammar, vocabulary, and sentence structure throughout the essay."
        }
      }
    };
    
    setFeedback(mockFeedback);
    setIsSubmitted(true);
    setShowFeedback(true); // Show feedback first after submission
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
                <Title order={2}>Generating Essay Topic...</Title>
                <Text c="dimmed" ta="center">
                  Analyzing your uploaded materials to create a personalized essay topic
                </Text>
                <Progress value={75} size="lg" radius="xl" style={{ width: '300px' }} animated />
              </Stack>
            </div>
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
                <Instructions essayData={essayData} />
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
                    <Instructions essayData={essayData} />
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
