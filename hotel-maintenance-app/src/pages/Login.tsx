import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { KeyRound, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import assetflowLogo from '../assets/assetflow_logo.png';

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      return;
    }
    setLoading(true);
    const { error: signInError } = await signIn(email.trim(), password);
    if (signInError) {
      setError(signInError);
      setLoading(false);
    } else {
      navigate('/');
    }
  };

  return (
    <div
      className="relative min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #e8f0fb 0%, #e4f2ee 50%, #e2f5ea 100%)' }}
    >
      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex flex-col items-center">
          <img src={assetflowLogo} alt="AssetFlöw Logo" className="w-24 h-24 object-contain mb-4" />
          <h1 className="text-3xl font-extrabold text-[#1e3a5f] tracking-tight">AssetFlöw</h1>
          <p className="mt-1 text-xs font-semibold text-gray-400 uppercase tracking-[0.25em]">by DASSOLS</p>
        </div>
      </div>

      <div className="relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/70 backdrop-blur-xl py-8 px-6 shadow-2xl shadow-blue-900/5 rounded-2xl border border-white/60">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-5">
            Sign in to your account
          </label>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@hotel.com"
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition-all bg-white/80"
                  autoComplete="email"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition-all bg-white/80"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#1e3a5f] text-white text-sm font-semibold rounded-xl hover:bg-[#2d5a8e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1e3a5f] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 pt-5 border-t border-gray-100">
            <div className="flex items-center justify-center gap-2 text-gray-300">
              <KeyRound className="h-4 w-4" />
              <span className="text-xs font-medium">Secured by Supabase</span>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} DASSOLS. All rights reserved.
        </p>
      </div>
    </div>
  );
}
