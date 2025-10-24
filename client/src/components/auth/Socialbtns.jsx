import { FaGithub, FaGoogle } from "react-icons/fa";
function SocialButtons() {
  const URL = import.meta.env.VITE_API_URL
  const github = ()=>{
   window.location.href = `${URL}/github`
  }

  const google = ()=>{
    window.location.href = `${URL}/google`
  }
  return (
    <div className="w-full">
      {/* Divider */}
      <div className="flex items-center gap-3 mt-6">
        <div className="flex-1 h-px bg-gray-300"></div>
        <span className="text-sm text-gray-500">or continue with</span>
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        {/* GitHub */}
        <button
          className="flex items-center justify-center gap-2 flex-1 px-4 py-2 rounded-lg border border-gray-300 bg-white shadow-sm hover:bg-gray-50 transition"
          onClick={github}
        >
          <FaGithub className="text-gray-800 text-lg"/>
          <span className="text-sm font-medium text-gray-700">GitHub</span>
        </button>

        {/* Google */}
        <button
          className="flex items-center justify-center gap-2 flex-1 px-4 py-2 rounded-lg border border-gray-300 bg-white shadow-sm hover:bg-gray-50 transition"
          onClick={google}
        >
          <FaGoogle className="text-red-500 text-lg" />
          <span className="text-sm font-medium text-gray-700">Google</span>
        </button>
      </div>
    </div>
  );
}

export default SocialButtons;
