import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  ArrowLeft, 
  Loader2,
  Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/admin';

  // If already authenticated, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) return;

    try {
      setIsSubmitting(true);
      await login({ username: username.trim(), password });
      navigate(from, { replace: true });
    } catch (err) {
      // Error toast is handled inside AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Ambient background glow accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full space-y-6 relative z-10">
        {/* Navigation Return Link */}
        <div className="flex justify-between items-center px-1">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-700 transition group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Return to Portal Home</span>
          </Link>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            Internal Access
          </span>
        </div>

        {/* Executive Sign-In Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/90 shadow-2xl p-8 sm:p-10 relative overflow-hidden">
          {/* Top Gold & Navy Accent Line */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#06172A] via-blue-700 to-amber-500"></div>

          {/* Header & Official Seals */}
          <div className="text-center space-y-4 mb-8">
            <div className="inline-flex items-center gap-3 bg-slate-50/90 p-2.5 rounded-2xl border border-slate-200/90 shadow-sm mx-auto">
              <img src="/assets/ched_logo.png" alt="Commission on Higher Education Logo" className="w-9 h-9 object-contain shrink-0" />
              <div className="w-px h-7 bg-slate-200 shrink-0"></div>
              <img src="/assets/ocdra-logo.png" alt="OCDRA Logo" className="h-8 w-auto object-contain shrink-0" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 text-[10px] font-extrabold uppercase tracking-widest rounded-full border border-amber-200/80 mb-2.5">
                <Lock className="w-3 h-3 text-amber-600" />
                For OCDRA Staff Use Only
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Staff Authentication
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-1.5 leading-relaxed">
                Enter your authorized credentials to access travel generation, approval workflows, and administrative records.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-2xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter system username"
                  required
                  autoFocus
                  autoComplete="username"
                  className="w-full bg-slate-50/90 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none transition shadow-2xs text-slate-900 placeholder-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-2xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter system password"
                  required
                  autoComplete="current-password"
                  className="w-full bg-slate-50/90 border border-slate-200 rounded-2xl pl-10 pr-11 py-3 text-xs sm:text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none transition shadow-2xs text-slate-900 placeholder-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 focus:outline-none p-0.5"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 bg-gradient-to-r from-[#06172A] via-[#0A2647] to-[#0E3A75] hover:from-[#0A2647] hover:to-[#124285] active:scale-95 text-white font-black text-xs sm:text-sm rounded-2xl py-3.5 shadow-lg shadow-[#06172A]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Authenticate & Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security Footnote */}
          <div className="mt-8 pt-5 border-t border-slate-100 flex items-start gap-2.5 text-slate-400 text-[11px] leading-relaxed">
            <Shield className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <p>
              Official internal portal of the Commission on Higher Education - OCDRA. Unauthorized access attempts are prohibited and recorded.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
