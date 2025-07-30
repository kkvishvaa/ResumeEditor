import React from 'react';

interface LeftPanelProps {
  jobDescription: string;
  setJobDescription: (value: string) => void;
  isLoading: boolean;
  handleExtractKeywords: () => void;
  keywords: string[];
  selectedKeywords: string[];
  toggleKeyword: (keyword: string) => void;
  selectedBullet: string;
  setSelectedBullet: (value: string) => void;
  handleGenerateBullet: () => void;
  generatedBullet: string;
  handleAcceptBullet: () => void;
  setGeneratedBullet: (value: string) => void;
}

const LeftPanel: React.FC<LeftPanelProps> = ({
  jobDescription,
  setJobDescription,
  isLoading,
  handleExtractKeywords,
  keywords,
  selectedKeywords,
  toggleKeyword,
  selectedBullet,
  setSelectedBullet,
  handleGenerateBullet,
  generatedBullet,
  handleAcceptBullet,
  setGeneratedBullet
}) => {
  return (
    <div className="w-full lg:w-1/4 bg-white p-4 rounded-lg shadow">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Job Description</h2>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste job description here..."
          className="w-full h-32 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
        <button
          onClick={handleExtractKeywords}
          disabled={isLoading || !jobDescription.trim()}
          className="mt-2 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          {isLoading ? 'Extracting...' : 'Extract Keywords'}
        </button>
      </div>

      {keywords.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Keywords</h2>
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword, index) => (
              <button
                key={index}
                onClick={() => toggleKeyword(keyword)}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedKeywords.includes(keyword)
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {keyword}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedBullet && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <h3 className="font-medium text-gray-700 mb-2">Selected Bullet:</h3>
          <p className="text-sm text-gray-600">{selectedBullet}</p>
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Enter Bullet Point
        </label>
        <textarea
          value={selectedBullet}
          onChange={(e) => setSelectedBullet(e.target.value)}
          placeholder="Enter a bullet point to modify..."
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div className="mb-4">
        <button
          onClick={handleGenerateBullet}
          disabled={isLoading || selectedKeywords.length === 0 || !selectedBullet.trim()}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          {isLoading ? 'Generating...' : 'Modify Bullet Point'}
        </button>
      </div>

      {generatedBullet && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <h3 className="font-medium text-gray-700 mb-2">Generated Bullet:</h3>
          <p className="mb-3 text-gray-800">{generatedBullet}</p>
          <div className="flex gap-2">
            <button
              onClick={handleAcceptBullet}
              className="flex-1 bg-green-600 text-white py-1 px-3 rounded-md hover:bg-green-700"
            >
              Accept
            </button>
            <button
              onClick={() => setGeneratedBullet('')}
              className="flex-1 bg-gray-600 text-white py-1 px-3 rounded-md hover:bg-gray-700"
            >
              Go Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeftPanel;
