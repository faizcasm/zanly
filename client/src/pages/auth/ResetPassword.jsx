import { useContext, useRef, useState } from "react";
import { Link } from "react-router-dom";
import InputPassword from "../../components/auth/InputPassword";
import PageWrapper from "../../components/auth/PageWrapper";
import { z } from "zod";
import Spinner from "../../components/auth/Spinner";
import { useToast } from "../../components/ui/Toast";
import { AuthContext } from "../../contexts/AuthContext";

const resetSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

function ResetPassword() {
  const {toast} = useToast()
  const inputsRef = useRef([]);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const {resetPassword} = useContext(AuthContext)
  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/, ""); // only digits
    e.target.value = value;
    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const otp = inputsRef.current.map((input) => input.value).join("");

    const result = resetSchema.safeParse({ otp, password });
    if (!result.success) {
      result.error.errors.forEach((err) => toast.error(err.message));
      return;
    }
    setLoading(true);
     await resetPassword({otp,newPassword:password})
  };

  return (
    <PageWrapper
      title="Reset your password"
      description="Enter the 6-digit OTP and your new password to secure your Zanly account 🔒"
    >
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="text-gray-700 font-medium text-sm">
            OTP <span className="text-red-600">*</span>
          </label>
        </div>

        <div className="grid grid-cols-6 gap-1 justify-center mb-4">
          {[...Array(6)].map((_, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              maxLength={1}
              placeholder="0"
              className="w-11 h-11 border rounded-lg text-center text-lg"
              onChange={(e) => handleChange(e, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
            />
          ))}
        </div>

        <InputPassword
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full flex items-center justify-center bg-blue-600 text-white p-3 rounded-lg mt-4"
          type="submit"
          disabled={loading}
        >
          {loading ? <Spinner size={5} color="white" /> : "Reset Password"}
        </button>
      </form>

      <p className="text-center text-sm mt-6">
        Back to <Link to="/auth/login" className="text-blue-600">Login</Link>
      </p>
    </PageWrapper>
  );
}

export default ResetPassword;
