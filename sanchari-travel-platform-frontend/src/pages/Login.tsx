import { useState } from "react";
import { Link, useLocation, useNavigate, Location } from "react-router-dom";
import { motion } from "framer-motion";
import { Globe, Mail, Lock, Eye, EyeOff, Plane, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError } from "@/lib/api";
import type { Role } from "@/services/authService";
import loginBg from "@/assets/login-bg.jpg";

function homeRouteForRole(role: Role): string {
  if (role === "ROLE_ADMIN") return "/admin";
  if (role === "ROLE_PARTNER") return "/planner";
  return "/";
}

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }
    setIsSubmitting(true);
    try {
      const user = await login({ email, password });
      toast.success("Welcome back!");
      const redirectTo = (location.state as { from?: Location })?.from?.pathname;
      navigate(redirectTo || homeRouteForRole(user.role), { replace: true });
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Image Side */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src={loginBg}
          alt="Adventure awaits"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="relative z-10 flex flex-col justify-end p-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-display font-bold mb-4">
              Your Next Adventure Awaits
            </h2>
            <p className="text-lg text-white/80 max-w-md">
              Sign in to explore breathtaking destinations, discover curated travel packages, and plan your dream journey.
            </p>
          </motion.div>
          {/* Floating travel elements */}
          <motion.div
            className="absolute top-20 right-16 text-white/20"
            animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
          >
            <Plane size={48} />
          </motion.div>
          <motion.div
            className="absolute top-1/3 right-10 text-white/15"
            animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          >
            <Globe size={64} />
          </motion.div>
        </div>
      </div>

      {/* Right - Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-10 group">
            <div className="bg-gradient-hero rounded-xl p-2 transition-transform group-hover:scale-110">
              <Globe className="text-primary-foreground" size={24} />
            </div>
            <span className="text-2xl font-display font-bold text-foreground">
              Sanchari
            </span>
          </Link>

          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Welcome Back
          </h1>
          <p className="text-muted-foreground mb-8">
            Sign in to continue your travel journey
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  type="email"
                  placeholder="hello@sanchari.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 rounded-xl border-border/50 bg-muted/30 focus:bg-background transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 rounded-xl border-border/50 bg-muted/30 focus:bg-background transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input type="checkbox" className="rounded border-border" />
                Remember me
              </label>
              <a href="#" className="text-sm text-primary hover:underline">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-xl bg-gradient-hero text-primary-foreground font-semibold text-base hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Create one
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
