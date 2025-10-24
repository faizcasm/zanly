import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleAuth = () => {
    navigate("/auth/signup");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Features", href: "#features" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "Pricing", href: "#pricing" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Contact", href: "#contact" },
  ];
  function home(){
    navigate('/')
  }
  return (
    <header
  className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
    isScrolled
      ? "bg-white bg-opacity-95 shadow-lg backdrop-blur-md"
      : "bg-transparent"
  }`}
>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white bg-95 shadow-lg backdrop-blur-md">
    <div className="flex items-center justify-between h-16" >
      {/* Logo */}
      <div className="flex-shrink-0">
        <h1 className="text-2xl font-bold text-blue-700 font-mono" onClick={home}>Zanly</h1>
      </div>

      {/* Desktop Nav */}
      <nav className="hidden md:block">
        <div className="flex items-center space-x-1 bg-slate-100/80 backdrop-blur-sm rounded-full px-2 py-2">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="px-4 py-2 text-sm font-medium text-zinc-900 hover:text-blue-700 rounded-full transition-colors duration-200"
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Desktop Button */}
      <div className="hidden md:block">
        <button
          onClick={handleAuth}
          className="bg-blue-700 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-800 transition-colors duration-200 shadow-lg"
        >
          Signup
        </button>
      </div>

      {/* Mobile Menu Toggle */}
      <div className="md:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-zinc-900 hover:text-blue-700 transition-colors duration-200"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </div>
  </div>

  {/* Mobile Menu */}
  {isMobileMenuOpen && (
    <div className="md:hidden bg-white bg-opacity-95 backdrop-blur-md border-t border-slate-200">
      <div className="px-4 py-4 space-y-2">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="block px-4 py-2 text-sm font-medium text-zinc-900 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition-colors duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {item.label}
          </a>
        ))}
        <button
          onClick={handleAuth}
          className="w-full bg-blue-700 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-800 transition-colors duration-200 mt-4"
        >
          Signup
        </button>
      </div>
    </div>
  )}
</header>

  );
};

export default Header;
