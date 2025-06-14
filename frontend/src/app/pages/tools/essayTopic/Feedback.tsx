import { Card, Stack, Title, Text, Group, Grid, Paper, List, Divider } from '@mantine/core';
import type { EssayFeedback } from '../../../../types/tools';

interface FeedbackProps {
  feedback: EssayFeedback | null;
}

export function FeedbackComponent({ feedback }: FeedbackProps) {
  if (!feedback) return null;

  return (
    <Card shadow="lg" padding="xl" radius="md" withBorder>
      <Stack gap="lg" align="center">
        <Title order={2} ta="center">Essay Feedback</Title>
        
        <Group gap="xl">
          <div style={{ textAlign: 'center' }}>
            <Text size="xs" c="dimmed" mb="xs">Overall Score</Text>
            <Text size="3rem" fw={700} c="blue">
              {feedback.score}
            </Text>
            <Text size="sm" c="dimmed">/100</Text>
          </div>
        </Group>
        
        {/* Rubric Scores */}
        <Grid gutter="lg" w="100%">
          <Grid.Col span={6}>
            <Paper p="md" radius="md" withBorder>
              <Stack gap="sm">
                <Group justify="space-between">
                  <Text fw={600} size="sm">Understanding & Accuracy</Text>
                  <Text fw={600} size="sm" c="blue">
                    {feedback.rubricScores.understandingAccuracy.score}/{feedback.rubricScores.understandingAccuracy.maxScore}
                  </Text>
                </Group>
                <Text size="xs" c="dimmed">
                  {feedback.rubricScores.understandingAccuracy.feedback}
                </Text>
              </Stack>
            </Paper>
          </Grid.Col>
          
          <Grid.Col span={6}>
            <Paper p="md" radius="md" withBorder>
              <Stack gap="sm">
                <Group justify="space-between">
                  <Text fw={600} size="sm">Clarity, Organization & Style</Text>
                  <Text fw={600} size="sm" c="blue">
                    {feedback.rubricScores.clarityOrganization.score}/{feedback.rubricScores.clarityOrganization.maxScore}
                  </Text>
                </Group>
                <Text size="xs" c="dimmed">
                  {feedback.rubricScores.clarityOrganization.feedback}
                </Text>
              </Stack>
            </Paper>
          </Grid.Col>
          
          <Grid.Col span={6}>
            <Paper p="md" radius="md" withBorder>
              <Stack gap="sm">
                <Group justify="space-between">
                  <Text fw={600} size="sm">Critical Thinking & Evidence</Text>
                  <Text fw={600} size="sm" c="blue">
                    {feedback.rubricScores.criticalThinking.score}/{feedback.rubricScores.criticalThinking.maxScore}
                  </Text>
                </Group>
                <Text size="xs" c="dimmed">
                  {feedback.rubricScores.criticalThinking.feedback}
                </Text>
              </Stack>
            </Paper>
          </Grid.Col>
          
          <Grid.Col span={6}>
            <Paper p="md" radius="md" withBorder>
              <Stack gap="sm">
                <Group justify="space-between">
                  <Text fw={600} size="sm">Language & Grammar</Text>
                  <Text fw={600} size="sm" c="blue">
                    {feedback.rubricScores.languageGrammar.score}/{feedback.rubricScores.languageGrammar.maxScore}
                  </Text>
                </Group>
                <Text size="xs" c="dimmed">
                  {feedback.rubricScores.languageGrammar.feedback}
                </Text>
              </Stack>
            </Paper>
          </Grid.Col>
        </Grid>
        
        <Divider w="100%" />
        
        {/* Overall Strengths and Improvements */}
        <Grid gutter="xl" w="100%">
          <Grid.Col span={6}>
            <Stack gap="sm">
              <Text fw={600} c="green" size="lg">Overall Strengths</Text>
              <List size="sm" spacing="xs">
                {feedback.overallStrengths.map((strength, index) => (
                  <List.Item key={index}>{strength}</List.Item>
                ))}
              </List>
            </Stack>
          </Grid.Col>
          
          <Grid.Col span={6}>
            <Stack gap="sm">
              <Text fw={600} c="orange" size="lg">Areas for Improvement</Text>
              <List size="sm" spacing="xs">
                {feedback.overallImprovements.map((improvement, index) => (
                  <List.Item key={index}>{improvement}</List.Item>
                ))}
              </List>
            </Stack>
          </Grid.Col>
        </Grid>
        
        <Divider w="100%" />
        
        <div style={{ width: '100%' }}>
          <Text fw={600} mb="sm" size="lg">Detailed Feedback</Text>
          <Text size="sm" style={{ lineHeight: 1.6 }}>
            {feedback.detailedFeedback}
          </Text>
        </div>
      </Stack>
    </Card>
  );
}
