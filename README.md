# ClassTracker - Backend

Backend application for ClassTracker, built using Node.js to handle API requests, application logic, and PostgreSQL database operations.

## Tech Stack
- Node.js
- Express.js (if used)
- PostgreSQL
- JavaScript
- npm

## Features
- REST API development
- Student management
- Class management
- PostgreSQL database integration
- Application business logic
- Frontend API communication

## Installation

Clone the repository:

```bash
git clone YOUR_BACKEND_REPOSITORY_URL
```

Navigate to the project directory:

```bash
cd ClassTracker-backend
```

Install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root and configure the required variables.

Example:

```env
PORT=5000
DATABASE_URL=your_postgresql_connection_string
```

Use your actual application's environment variable names. Never commit `.env` or database passwords to GitHub.

## Run the Application

```bash
npm start
```

For development (if nodemon is configured):

```bash
npm run dev
```

## Deployment

The backend will be deployed on a separate AWS EC2 instance.

## Author

ClassTracker Development Team
