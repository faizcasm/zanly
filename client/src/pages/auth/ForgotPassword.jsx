import { Link } from "react-router-dom";
import PageWrapper from "../../components/auth/PageWrapper";
import { useContext, useState } from "react";
import { useToast } from "../../components/ui/Toast";
import Spinner from "../../components/auth/Spinner"; // optional modern spinner
import { AuthContext } from "../../contexts/AuthContext";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const {toast} = useToast()
  const {forgotPassword} = useContext(AuthContext)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    // Optional: email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email format");
      return;
    }

    setLoading(true);
    await forgotPassword(email)
  };

  return (
    <PageWrapper description="Enter your email to receive a 6-digit OTP and reset your password 🔑">
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-3 border rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          className="w-full flex items-center justify-center bg-blue-600 text-white p-3 rounded-lg"
          type="submit"
          disabled={loading}
        >
          {loading ? <Spinner size={5} color="white" /> : "Send OTP"}
        </button>
      </form>

      <p className="text-center text-sm mt-6">
        Back to <Link to="/auth/login" className="text-blue-600">Login</Link>
      </p>
    </PageWrapper>
  );
}

export default ForgotPassword;
