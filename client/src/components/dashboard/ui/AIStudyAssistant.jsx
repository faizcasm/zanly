import React from 'react';
import { Volume2, Mic } from 'lucide-react';

const AIStudyAssistant = ({ topic, setTopic, isLoading, resultText, handleSummarize, handleQuiz, handleTtsClick, ttsReady, ttsPlaying }) => {
  return (
    <div className="rounded-3xl shadow-xl p-6 bg-white flex flex-col">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex justify-between items-center">
        ✨ AI Study Assistant
        <button
          onClick={handleTtsClick}
          className={`ml-4 p-2 rounded-full transition duration-150 flex items-center justify-center ${
            ttsReady && !isLoading ? 'bg-emerald-50 text-teal-600 hover:bg-emerald-100' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
          disabled={!ttsReady || isLoading}
        >
          {isLoading ? <Volume2 className="w-5 h-5 animate-pulse" /> : ttsPlaying ? <Mic className="w-5 h-5 fill-current" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </h3>

      <input
        type="text"
        placeholder="Enter a study topic..."
        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-600 focus:border-teal-600 mb-4"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        disabled={isLoading}
        name='topic'
      />

      <div className="flex space-x-3 mb-6">
        <button onClick={handleSummarize} disabled={isLoading} className="flex-1 bg-teal-600 text-white py-3 rounded-xl hover:bg-teal-700 transition shadow-md">Summarize Topic</button>
        <button onClick={handleQuiz} disabled={isLoading} className="flex-1 bg-amber-500 text-white py-3 rounded-xl hover:bg-amber-600 transition shadow-md">Generate Quiz</button>
      </div>

      <div className="min-h-32 p-4 rounded-xl border border-gray-200 bg-gray-50 max-h-96 overflow-y-auto">
        {isLoading ? <p className="text-teal-700">Zanly AI is thinking...</p> : <p className="text-gray-600 whitespace-pre-wrap">{resultText}</p>}
      </div>
    </div>
  );
};

export default AIStudyAssistant;
