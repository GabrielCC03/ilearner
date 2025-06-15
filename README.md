# AI-Powered Assessment Tool

A web application that transforms educational documents into interactive assessments and tutoring workflows.

## Setup & Installation

1. If the file was sent to you by email put it under /backend

Else:

1. Create a .env file as: /backend/.env
2. Add the openrouter key with name: OPENROUTER_API_KEY

### Prerequisites

- Docker

### Running the project

From root run: docker-compose up

Services will be available at:

- Frontend: http://localhost:5173
- Backend:  http://localhost:8000

## Overview

The AI-Powered Assessment Tool is a web application that allows learners to transform educational documents into interactive assessments and personalized tutoring workflows by organizing materials "Learning Spaces."

## Features

- Create Learning Spaces. Learning Spaces are used to divide contents by topic (math, biology, etc...)
- Upload documents into learning spaces. Users can upload multiple documents to a learning space
- Delete and view the documents uploaded in the learning spaces
- Chat-based tutoring interface for questions based on the material of the learning space
- Tools for practicing and testing with the content on the learning space
  - Essay topic: Generates an essay topic with guidelines and hints and provides feedback of the student answer
  - MCQ: *(To be implemented)* Generate MCQs, evaluates the user answers, and provides explanations
- Tool history for visualizing previous practices, their scores and feedbackm and repeating them.

## Project Structure

ilearner/
├── backend/                # FastAPI backend
│   ├── routers/            # API routers
│   ├── models/             # Data models
│   ├── internal/           # Internal utilities
│   ├── main.py             # Application entrypoint
│   └── requirements.txt    # Python dependencies
├── frontend/               # React + Vite application
│   ├── src/                # Source code
│   │   ├── assets/         # Static assets (images, fonts, etc.)
│   │   ├── api/            # API client & hooks
│   │   ├── app/            # App entrypoint, routing, providers
│   │   │   └── pages/      # Route pages
│   │   ├── components/     # Reusable UI components
│   │   ├── types/          # TypeScript types & interfaces
│   │   ├── index.css       # Global CSS
│   │   ├── main.tsx        # Main entrypoint
│   ├── public/             # Static files served by Vite
│   ├── Dockerfile
├── docker-compose.yaml     # Docker Compose configuration
├── schema.md               # MongoDB schema documentation
├── PROJECT.md              # Project overview and requirements
├── LICENSE                 # License file
└── README.md               # This file

For the backend, the routers handle the requests from the server, while internal handles the actual app functionality.
In the frontend, each page has their own API client to handle the requests sent to the server. The pages are added to the router under src/app.

The structure provides separation of concerns, letting implement functionality, routes, pages, and server-client integration separately.

## Schema

*For the schema, please refer to schema.md.*
A non-SQL database like MongoDB was used to ensure flexibility towards the toolHistory as the tool details of the interaction (such as the generated test, feedback, etc...) vary according to the tool, thus, MongoDB allow us to have documents with different structure in the same collection

## Tech Stack

- Frontend: React + TypeScript + Vite
- Backend: FastAPI + Uvicorn
- Database: MongoDB
- Containerization: Docker

## Notes and TODO

### Incomplete and Unimplemented Features

- MCQ
  - Route, prompt, and internal functionality not implemented yet
  - Page and components not implemented yet
  - The workflow would be similar to essay tool, generating the topic, questions, and correct answers of the mcq, then evaluating the questions, answers, and running through an llm again to provide explanations
- After assessment chat
  - The current implementation of routes and chat divides each chat message and interaction by learning space and by tool history. Meaning that each tool history can add the chatInterface component and have their own chat.
  - The implementation of having a chatbot for each tool history would need to add passing the previous evaluation (task, response, feedback) as context to the chatbot so it can answer questions based on it
- Kubernetes
  - Lack of familiarity and limited time made this a non-important non-urgent task as I had to focus on the other requirements.

### Notes

- As I mentioned above, the idea of this app was to demonstrate the idea of the whole workflow. One of the key concepts I want to show is how tools can be further added to the toolsPanel and into the project, providing independent modules for each tool and following Open/Closed principle. Thus, the MCQ tool was not implemented due to time constraints and refusal to vibe code it from my side.

- RAG was not implemented as the requirements and current demo focuses on one file, which passing it completely should be enough. To improve the performance and experience of the learning spaces when having multiple files, using RAG will help.

### Other features needed

Closer to requirements:

1. **OCR Input component for student input (llm parse file)*
2. Support for implementing chat and asking questions about assessment and answers*
3. RAG and vector databases for multiple files (for multi-file implementation)
4. Dynamic layout in learning space for better ux/ui
5. Prompt engineering for generating content and feedback
6. Improving parse of essay feedback output and UI from the markdown

Extras:

1. Session/Authentication
2. Security for loading learning spaces and auth
3. File dropping not implemented. Accept written text input and websites
4. Cost-tracking for chatbot
5. Tool Registry for selecting and disabling tools dinamically
6. Document Parsing strategies
7. Support images or other document types. There is a bug with images that can not extract text. 
8. Components for tools themselves to adjust generation difficulty and parameters
9. Axios for frontend requests
10. Delete tool histories
11. Caching files
12. Change name of learning space
13. Bug in datetime UI