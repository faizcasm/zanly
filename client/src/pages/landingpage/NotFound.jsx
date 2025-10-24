import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 px-4">
      <div className="text-center">
        <h1 className="text-6xl sm:text-8xl font-extrabold text-blue-700 mb-4">
          404
        </h1>
        <h2 className="text-2xl sm:text-4xl font-bold text-zinc-900 mb-6">
          Page Not Found
        </h2>
        <p className="text-zinc-600 text-base sm:text-lg mb-8 max-w-md mx-auto">
          Oops! The page you’re looking for doesn’t exist or has been moved.
        </p>
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center bg-blue-700 text-white px-6 py-3 rounded-full font-semibold text-base sm:text-lg hover:bg-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Go Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
