import React from 'react';

interface ATSCheckerModalProps {
  uploadedResume: File | null;
  handleResumeUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleCheckATSForUploadedResume: () => void;
  isLoading: boolean;
  jobDescription: string;
}

const ATSCheckerModal: React.FC<ATSCheckerModalProps> = ({
  uploadedResume,
  handleResumeUpload,
  handleCheckATSForUploadedResume,
  isLoading,
  jobDescription
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-xl font-semibold mb-4">ATS Score Checker</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload Edited Resume
          </label>
          <input
            type="file"
            accept=".txt,.docx,.pdf"
            onChange={handleResumeUpload}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <button
          onClick={handleCheckATSForUploadedResume}
          disabled={isLoading || !uploadedResume || !jobDescription.trim()}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          {isLoading ? "Checking..." : "Check ATS Score"}
        </button>
      </div>
    </div>
  );
};

export default ATSCheckerModal;
