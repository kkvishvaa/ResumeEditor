import React from 'react';

interface RightPanelProps {
  newBulletKeyword: string;
  setNewBulletKeyword: (value: string) => void;
  newBulletLines: 1 | 2;
  setNewBulletLines: (value: 1 | 2) => void;
  newBulletHeader: boolean;
  setNewBulletHeader: (value: boolean) => void;
  handleGenerateNewBullet: () => void;
  isLoading: boolean;
  newBulletResult: string;
  handleInsertNewBullet: () => void;
}

const RightPanel: React.FC<RightPanelProps> = ({
  newBulletKeyword,
  setNewBulletKeyword,
  newBulletLines,
  setNewBulletLines,
  newBulletHeader,
  setNewBulletHeader,
  handleGenerateNewBullet,
  isLoading,
  newBulletResult,
  handleInsertNewBullet
}) => {
  return (
    <div className="w-full lg:w-1/4 bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Bullet Point Generator</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Enter Keyword
        </label>
        <input
          type="text"
          value={newBulletKeyword}
          onChange={(e) => setNewBulletKeyword(e.target.value)}
          placeholder="e.g. Project Management"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Length
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => setNewBulletLines(1)}
            className={`flex-1 py-2 rounded-md ${
              newBulletLines === 1 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            1 line (18 words)
          </button>
          <button
            onClick={() => setNewBulletLines(2)}
            className={`flex-1 py-2 rounded-md ${
              newBulletLines === 2 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            2 lines (32 words)
          </button>
        </div>
      </div>
      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          id="header-toggle"
          checked={newBulletHeader}
          onChange={(e) => setNewBulletHeader(e.target.checked)}
          className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
        />
        <label htmlFor="header-toggle" className="ml-2 block text-sm text-gray-700">
          Add Header (e.g., "Keyword: ")
        </label>
      </div>
      <button
        onClick={handleGenerateNewBullet}
        disabled={isLoading || !newBulletKeyword.trim()}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 mb-4"
      >
        {isLoading ? 'Generating...' : 'Generate Bullet Point'}
      </button>
      {newBulletResult && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h3 className="font-medium text-gray-700 mb-2">Generated Bullet:</h3>
          {newBulletHeader && newBulletKeyword ? (
            <p className="mb-3">
              <span className="text-blue-600 font-medium">{newBulletKeyword}:</span>
              <span className="text-gray-800"> {newBulletResult.replace(`${newBulletKeyword}:`, '')}</span>
            </p>
          ) : (
            <p className="mb-3 text-gray-800">{newBulletResult}</p>
          )}
          <button
            onClick={handleInsertNewBullet}
            className="w-full bg-blue-600 text-white py-1 px-3 rounded-md hover:bg-blue-700"
          >
            Insert into Resume
          </button>
        </div>
      )}
    </div>
  );
};

export default RightPanel;
