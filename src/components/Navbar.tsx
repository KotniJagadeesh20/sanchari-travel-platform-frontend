import { Link, useLocation, useNavigate } from "react-router-dom";
import { Globe, Menu, X, UserCircle, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass shadow-card py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-gradient-hero rounded-xl p-2 transition-transform group-hover:scale-110">
            <Globe className="text-primary-foreground" size={20} />
          </div>
          <span className="text-xl font-display font-bold text-foreground">
            Sanchari
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <Link to="/trips" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Destinations</Link>
          <Link to="/all-packages" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Packages</Link>
          <Link to="/troops" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Troops</Link>
          <Link to="/services" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Services</Link>
          <Link to="/planner" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Planner</Link>
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="text-muted-foreground hover:text-foreground transition-colors">
                <UserCircle size={22} />
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Login</Link>
              <Link to="/register" className="bg-gradient-hero text-primary-foreground px-5 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-foreground">
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass mt-2 mx-4 rounded-xl overflow-hidden"
          >
            <div className="flex flex-col gap-1 p-4">
              <Link to="/" className="py-2 px-3 rounded-lg hover:bg-muted transition-colors text-sm">Home</Link>
              <Link to="/trips" className="py-2 px-3 rounded-lg hover:bg-muted transition-colors text-sm">Destinations</Link>
              <Link to="/all-packages" className="py-2 px-3 rounded-lg hover:bg-muted transition-colors text-sm">Packages</Link>
              <Link to="/troops" className="py-2 px-3 rounded-lg hover:bg-muted transition-colors text-sm">Troops</Link>
              <Link to="/services" className="py-2 px-3 rounded-lg hover:bg-muted transition-colors text-sm">Services</Link>
              <Link to="/planner" className="py-2 px-3 rounded-lg hover:bg-muted transition-colors text-sm">Planner</Link>
              {isAuthenticated ? (
                <>
                  <Link to="/profile" className="py-2 px-3 rounded-lg hover:bg-muted transition-colors text-sm flex items-center gap-2">
                    <UserCircle size={16} /> Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="py-2 px-3 rounded-lg hover:bg-muted transition-colors text-sm flex items-center gap-2 text-left"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="py-2 px-3 rounded-lg hover:bg-muted transition-colors text-sm">Login</Link>
                  <Link to="/register" className="bg-gradient-hero text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold text-center mt-2">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
