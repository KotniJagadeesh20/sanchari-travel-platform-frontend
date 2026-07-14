import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Globe, Mail, Lock, Eye, EyeOff, User, Plane, MapPin, Phone, Calendar, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError } from "@/lib/api";
import registerBg from "@/assets/register-bg.jpg";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !phone || !dob || !gender || !age) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (!agreedToTerms) {
      toast.error("Please agree to the Terms & Privacy Policy.");
      return;
    }
    setIsSubmitting(true);
    try {
      await register({ name, email, password, phone, dob, gender, age: Number(age) });
      toast.success("Account created! Welcome to Sanchari.");
      navigate("/", { replace: true });
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
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
            Start Your Journey
          </h1>
          <p className="text-muted-foreground mb-8">
            Create an account and explore the world with us
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  type="text"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 h-12 rounded-xl border-border/50 bg-muted/30 focus:bg-background transition-colors"
                />
              </div>
            </div>

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
                  placeholder="Create a strong password"
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

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  type="tel"
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-10 h-12 rounded-xl border-border/50 bg-muted/30 focus:bg-background transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Date of Birth</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="pl-10 h-12 rounded-xl border-border/50 bg-muted/30 focus:bg-background transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Age</label>
                <Input
                  type="number"
                  min={1}
                  placeholder="29"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="h-12 rounded-xl border-border/50 bg-muted/30 focus:bg-background transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full h-12 rounded-xl border border-border/50 bg-muted/30 focus:bg-background transition-colors px-3 text-sm"
              >
                <option value="">Select gender</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="rounded border-border"
              />
              <span>
                I agree to the{" "}
                <a href="#" className="text-primary hover:underline">Terms</a>
                {" & "}
                <a href="#" className="text-primary hover:underline">Privacy Policy</a>
              </span>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-xl bg-gradient-hero text-primary-foreground font-semibold text-base hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right - Image Side */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src={registerBg}
          alt="Travel together"
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
              Travel Together, Create Memories
            </h2>
            <p className="text-lg text-white/80 max-w-md">
              Join thousands of travelers discovering hidden gems and planning unforgettable trips with Sanchari.
            </p>
          </motion.div>
          <motion.div
            className="absolute top-20 left-16 text-white/20"
            animate={{ y: [0, -12, 0], rotate: [0, -10, 0] }}
            transition={{ duration: 7, repeat: Infinity }}
          >
            <Plane size={44} />
          </motion.div>
          <motion.div
            className="absolute top-1/4 left-10 text-white/15"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: 2 }}
          >
            <MapPin size={36} />
          </motion.div>
          <motion.div
            className="absolute top-1/2 right-12 text-white/10"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Globe size={80} />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;
