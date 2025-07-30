# ResumeEditor

ResumeEditor is a web application that leverages AI to help users create and enhance resumes. It provides features like keyword extraction, bullet point generation, ATS (Applicant Tracking System) score checking, and integration with Collabora Online for document editing.

## Features

- **AI-Powered Resume Enhancement**: Generate and improve resume bullet points using AI.
- **Keyword Extraction**: Extract important keywords from job descriptions.
- **ATS Score Checker**: Evaluate resumes against job descriptions for ATS compatibility.
- **Collabora Online Integration**: Edit resumes directly in the browser using Collabora Online.
- **File Upload Support**: Upload and process `.docx`, `.pdf`, and `.txt` files.

## Project Structure

```
resume-editor/
├── public/                # Static assets
├── src/                   # Source code
│   ├── components/        # React components
│   ├── App.tsx            # Main application component
│   ├── handlers.ts        # AI-related logic
│   ├── hooks.ts           # Custom React hooks
│   ├── utils.ts           # Utility functions
├── .env                   # Environment variables
├── package.json           # Project dependencies and scripts
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
└── README.md              # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/resume-editor.git
   cd resume-editor
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   Create a `.env` file in the root directory and add your API key for Google Generative AI:

   ```env
   VITE_GEMINI_API_KEY="your-api-key-here"
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`.

### Backend Setup

The project includes a backend service for handling file uploads and WOPI (Web Application Open Platform Interface) integration. The backend is located in the `backend3/` directory.

1. Navigate to the backend directory:

   ```bash
   cd backend3
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the backend server:

   ```bash
   node server.js
   ```

   The backend will run on `http://localhost:8080`.

### Collabora Online Setup

To enable document editing, you need a running instance of Collabora Online. Update the `backendHost` in [`App.tsx`](resume-editor/src/App.tsx) to point to your Collabora Online server.

## Scripts

- `npm run dev`: Start the development server.


## Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, Multer
- **AI Integration**: Google Generative AI
- **Document Processing**: Collabora Online, Mammoth.js, jsPDF


## Acknowledgments

- [Google Generative AI](https://developers.generativeai.google/)
- [Collabora Online](https://www.collaboraoffice.com/collabora-online/)
- [Mammoth.js](https://github.com/mwilliamson/mammoth.js)
