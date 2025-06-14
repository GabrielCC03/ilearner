export interface EssayInstructions {
  toolHistoryId: string;
  topic: string;
  guidelines: string[];
  helpingMaterial: string[];
}

export interface EssayFeedback {
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

export interface EssayHistory {
  toolHistoryId: string;
  topic: string;
  guidelines: string[];
  helpingMaterial: string[];
  status: string;
  studentEssay: string;
  feedback?: EssayFeedback;
  createdAt: string;
  updatedAt: string;
}
