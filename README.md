# Setup

## Backend

1. Create .venv in /backend
2. Run with python main.py

### Folder Structure:

```
backend/
├── internal/          # internal modules and utilities
│   └── __init__.py
├── routers/           # API route handlers
│   ├── __init__.py
│   ├── template.py    # template router example
│   └── __pycache__/   # Python cache files
├── api/               # API modules (empty - to be implemented)
├── main.py            # main application entry point
├── requirements.txt   # Python dependencies
├── __init__.py        # package initialization
├── .python-version    # Python version specification
├── __pycache__/       # Python cache files
└── .venv/             # virtual environment
```

## Frontend

1. In /frontend run npm install
2. npm run dev

### Folder Structure based on https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md:

src
|
+-- app               # application layer containing:
|   |                 # this folder might differ based on the meta framework used
|   +-- routes        # application routes / can also be pages
|   +-- app.tsx       # main application component
|   +-- provider.tsx  # application provider that wraps the entire application with different global providers - this might also differ based on meta framework used
|   +-- router.tsx    # application router configuration
+-- api               # API routers for communicating with the backend
|
+-- assets            # assets folder can contain all the static files such as images, fonts, etc.
|
+-- components        # shared components used across the entire application
|
+-- config            # global configurations, exported env variables etc.
|
+-- features          # feature based modules
|
+-- hooks             # shared hooks used across the entire application
|
+-- lib               # reusable libraries preconfigured for the application
|
+-- stores            # global state stores
|
+-- testing           # test utilities and mocks
|
+-- types             # shared types used across the application
|
+-- utils             # shared utility functions


## Docker (To be Implemented)

1. Run the docker compose up document
