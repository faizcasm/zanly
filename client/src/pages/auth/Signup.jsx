import { Link } from "react-router-dom";
import InputPassword from "../../components/auth/InputPassword";
import PageWrapper from "../../components/auth/PageWrapper";
import SocialButtons from "../../components/auth/Socialbtns";
import { useContext, useState } from "react";
import { useToast } from "../../components/ui/Toast";
import { z } from "zod";
import Spinner from "../../components/auth/Spinner";
import { AuthContext } from "../../contexts/AuthContext";

// ---------------- Zod Schema ----------------
const signupSchema = z.object({
  name: z.string().min(5, "Name must be at least 5 characters").max(20,"Name must be at max 20 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

function Signup() {
  const {toast} = useToast()
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
 const {signup} = useContext(AuthContext)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // --------- Validate Inputs using Zod ----------
    const result = signupSchema.safeParse({ name, email, password });

    if (!result.success) {
      result.error.errors.forEach((err) => toast.error(err.message));
      return;
    }

    setLoading(true);
    await signup({name,email,password})
  };

  return (
    <PageWrapper description="Join Zanly today and explore endless study materials 📚">
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-3 border rounded-lg"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded-lg"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <InputPassword
          placeholder="Password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full flex items-center justify-center bg-blue-600 text-white p-3 rounded-lg"
          type="submit"
          disabled={loading}
        >
          {loading ? <Spinner size={5} color="white" /> : "Signup"}
        </button>
      </form>

      <SocialButtons />

      <p className="text-center text-sm mt-6">
        Already have an account?{" "}
        <Link to="/auth/login" className="text-blue-600">
          Login
        </Link>
      </p>
    </PageWrapper>
  );
}

export default Signup;
