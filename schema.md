# MongoDB Database Schema

## Collections Overview

This schema uses separate collections for better scalability, performance, and to avoid MongoDB's 16MB document size limit.

### 1. LearningSpaces Collection

{
  _id: ObjectId,
  name: String,
  createdAt: Date,
  updatedAt: Date,
  // Metadata fields
  fileCount: Number, // Denormalized count for quick access
}

### 2. Files Collection

{
  _id: ObjectId,
  learningSpaceId: ObjectId, // Reference to LearningSpaces._id
  name: String,
  type: String, // 'pdf', 'txt', 'text'
  size: Number, // File size in bytes
  mimeType: String, // MIME type for uploaded files
  content: Bytes
  
  // Metadata
  uploadedAt: Date,

}

### 3. ToolHistory Collection

{
  _id: ObjectId,
  learningSpaceId: ObjectId, // Reference to LearningSpaces._id
  type: String, // 'essay', 'mcq', etc.
  createdAt: Date,
  updatedAt: Date,
  
  // Essay Tool fields
  prompt: String,
  guidelines: String,
  response: String,
  feedback: {
    score: Number, // 0-100
    strengths: [String],
    improvements: [String],
    detailedFeedback: String
  },
  rubric: {
    criteria: [
      {
        name: String,
        score: Number,
        maxScore: Number,
        feedback: String
      }
    ]
  },
  
  // MCQ Tool fields
  title: String,
  questions: [
    {
      id: String,
      question: String,
      options: [String],
      correctAnswer: String,
      userAnswer: String,
      explanation: String,
      difficulty: String, // 'easy', 'medium', 'hard'
      topic: String
    }
  ],
  results: {
    totalQuestions: Number,
    correctAnswers: Number,
    score: Number, // Percentage
    timeSpent: Number, // Seconds
    completedAt: Date
  },
  
  // Common metadata
  status: String, // 'active', 'completed', 'archived'
  tags: [String], // User-defined tags
  
}

### 4. Chat Collection

{
  _id: ObjectId,
  learningSpaceId: ObjectId, // Reference to LearningSpaces._id
  toolHistoryId: ObjectId, // Reference to ToolHistory._id (null for general learning space chat)
  
  // Message details
  role: String, // 'user', 'assistant'
  content: String,
  timestamp: Date,
  
  // Message metadata
  messageId: String, // Unique identifier for this message
  
}
