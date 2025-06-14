# AI-Powered Assessment Tool

> A web application that transforms educational documents into interactive assessments and tutoring workflows, organized into user-defined “Learning Spaces.”

## Overview

- **Upload Content**: Students can upload PDFs, text files, or enter website links (with extracted text) into a Learning Space.
- **Generate Assessments**: Automatically produce essay prompts or multiple-choice quizzes based on the uploaded content.
- **Automatic Grading**: AI-driven evaluation of responses with immediate feedback and guidance.
- **Tutoring Interface**: Chat-based follow-up questions powered by a large language model.
- **Tech Stack**: React frontend, FastAPI backend.
- **Deployment**: Docker and Kubernetes containerization.

## User Interface

### Main Page (Learning Spaces)

- **Learning Spaces List**
  - Display existing Learning Spaces as cards or list items.
  - Each card shows:
    - Name of the space
    - Date created
  - **Actions**
    - **Create New Space**: Button or input to name and create a new Learning Space.
    - **Open**: Click on a card to navigate into that space.

### Learning Space Page

- **Header**
  - Space name (editable/rename)
  - “Back to Spaces” link/button
- **File Management**
  - **Upload Area**
    - Drag-and-drop or “Select File” button
    - Accepts:
      - `.pdf`
      - `.txt`
      - Website link (extract and store text)
      - Freeform text input
  - **Files List**
    - Table or list showing each uploaded item:
      - Icon by type (PDF, TXT, Link, Text)
      - Filename or link title
      - Preview toggle (show extracted or input text snippet)
      - **Delete** button
- **Learning Tools**
  - **Select Practice Type menu list**
    - Essay Prompt & Guidelines
    - Multiple-Choice Quiz
  - **Generate Assessment**: Button to trigger generation based on selected type and current files

## Front-End Components

- **LearningSpacesPage**
  - Renders LearningSpaceCard list and “Create New” control.
- **LearningSpaceCard**
  - Displays name, date, and click handler.
- **LearningSpaceView**
  - Header, FileUploadForm, FileList, PracticeSelector, PracticeDisplay.
- **FileUploadForm**
  - Handles drag/drop, input, and link extraction.
- **FileList**
  - Lists files with preview and delete controls.
- **PracticeSelector**
  - Lets user choose essay or quiz.
- **PracticeDisplay**
  - Shows generated prompts/quizzes and collects answers.
- **ChatTutor**
  - Embedded chat UI for follow-up questions.

## Back-End Development

- **Framework**: FastAPI (Python)

## Containerization & Deployment

- **Docker**  
  - Dockerfile for frontend  
  - Dockerfile for backend  

## Submission Guidelines

- **GitHub Repository**  
  - All source code, clearly organized  
- **README**  
  - Setup and installation instructions  
  - Dependencies and requirements  
  - Any unimplemented or incomplete features  
- **Documentation**  
  - Inline code comments  
  - API reference  

## Evaluation Criteria

- **Functionality**: Meets all core requirements  
- **Problem-Solving**: Creativity and effectiveness  
- **Code Quality**: Readability and maintainability  
- **Documentation**: Clarity of README and comments  
- **User Experience**: Intuitive and responsive UI  
- **Scope Management**: Appropriate feature scope with notes on gaps
