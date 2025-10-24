import { Link} from "react-router-dom";
import PageWrapper from "../../components/auth/PageWrapper";
import InputPassword from "../../components/auth/InputPassword";
import SocialButtons from "../../components/auth/Socialbtns";
import Spinner from "../../components/auth/Spinner";
import { useContext, useState } from "react";
import { useToast } from "../../components/ui/Toast";
import { AuthContext } from "../../contexts/AuthContext";

function Login() {
  const {login} = useContext(AuthContext)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const {toast} = useToast()
  const handleSubmit = async (e) => {
    e.preventDefault();

    // --------- VALIDATIONS ----------
    if (!email.trim() || !password.trim()) {
      toast.error("All fields are required");
      return;
    }

    // Optional: email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email format");
      return;
    }

    setLoading(true);
    await login({email,password})
  };

  return (
    <PageWrapper description="Log in to continue your learning journey 🚀">
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded-lg"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <InputPassword
          placeholder="Password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full flex items-center justify-center bg-blue-600 text-white p-3 rounded-lg"
          disabled={loading}
        >
          {loading ? <Spinner size={5} color="white" /> : "Login"}
        </button>
      </form>

      <div className="text-right mt-2">
        <Link
          to="/auth/forgot-password"
          className="text-sm text-blue-600 hover:underline"
        >
          Forgot Password?
        </Link>
      </div>

      <SocialButtons />

      <p className="text-center text-sm mt-6">
        Don't have an account?{" "}
        <Link to="/auth/signup" className="text-blue-600">
          Sign Up
        </Link>
      </p>
    </PageWrapper>
  );
}

export default Login;
