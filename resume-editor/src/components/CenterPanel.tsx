import React, { useRef } from 'react';

interface CenterPanelProps {
  editorUrl: string;
  resumeRef: React.RefObject<HTMLDivElement | null>; // Updated to allow null
  atsScore: number | null;
  atsFeedback: string;
  toggleATSChecker: () => void;
  docxLoading: boolean;
  handleUpload: () => void;
  fileInput: React.RefObject<HTMLInputElement>;
}

const CenterPanel: React.FC<CenterPanelProps> = ({
  editorUrl,
  resumeRef,
  atsScore,
  atsFeedback,
  toggleATSChecker,
  docxLoading,
  handleUpload,
  fileInput
}) => {
  return (
    <div className="w-full lg:w-2/4 flex flex-col">
      <div className="bg-white rounded-lg shadow flex-1 flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Resume Editor</h2>
          <div className="flex gap-2">
            <input
              type="file"
              accept=".docx"
              className="hidden"
              ref={fileInput}
              onChange={handleUpload}
            />
            <button
              onClick={() => fileInput.current?.click()}
              disabled={docxLoading}
              className="bg-green-600 text-white py-1 px-3 rounded-md text-sm hover:bg-green-700 disabled:opacity-50"
            >
              {docxLoading ? "Uploading..." : "Upload DOCX Resume"}
            </button>
            {editorUrl && (
              <a
                href={editorUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white py-1 px-3 rounded-md text-sm hover:bg-blue-700"
              >
                Open in Collabora Editor
              </a>
            )}
            <button
              onClick={toggleATSChecker}
              className="bg-blue-600 text-white py-1 px-3 rounded-md text-sm hover:bg-blue-700"
            >
              {atsScore !== null ? "Hide ATS Checker" : "Check ATS Score"}
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto" ref={resumeRef}>
          {editorUrl ? (
            <iframe
              title="Collabora Editor"
              src={editorUrl}
              style={{ width: '100%', height: '80vh', border: '1px solid #ccc' }}
            />
          ) : (
            <div className="p-6 min-h-full flex items-center justify-center">
              <p className="text-gray-500">Upload a DOCX file to start editing with Collabora.</p>
            </div>
          )}
        </div>
      </div>
      {atsScore !== null && (
        <div className="mt-4 bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-3">
            <h3 className="text-lg font-semibold">ATS Score: {atsScore}%</h3>
            {atsScore >= 80 && (
              <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Excellent
              </span>
            )}
            {atsScore >= 60 && atsScore < 80 && (
              <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                Good
              </span>
            )}
            {atsScore < 60 && (
              <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                Needs Improvement
              </span>
            )}
          </div>
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap font-sans">{atsFeedback}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default CenterPanel;
