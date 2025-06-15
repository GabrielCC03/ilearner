# AI-Powered Assessment Tool

A web application that transforms educational documents into interactive assessments and tutoring workflows.

## Setup & Installation

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

## Schema

*For the schema, please refer to schema.md.*
A non-SQL database like MongoDB was used to ensure flexibility towards the toolHistory as the tool details of the interaction (such as the generated test, feedback, etc...) vary according to the tool, thus, MongoDB allow us to have documents with different structure in the same collection

## Tech Stack

- Frontend: React + TypeScript + Vite
- Backend: FastAPI + Uvicorn
- Database: MongoDB
- Containerization: Docker

## Notes and TODO
