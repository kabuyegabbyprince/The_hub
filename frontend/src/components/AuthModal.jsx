import React, { useState } from 'react';
import { X, Lock, CheckCircle2, User, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { loginUser, registerUser } from '../services/api';

export const AuthModal = ({ isOpen, onClose, onLoginSuccess, targetCourse }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      if (isRegister) {
        const data = await registerUser(email, password, fullName || email.split('@')[0], null);
        // After successful registration, show success message and switch to login mode
        setIsRegister(false);
        setSuccess(data.message || 'Account created! Please sign in to continue.');
      } else {
        const data = await loginUser(email, password);
        onLoginSuccess(data.user);
        onClose();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-200 border border-slate-300 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Futuristic top accent hairline */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-900 via-blue-600 to-red-600" />

        {/* Header */}
        <div className="p-6 border-b border-slate-300 bg-slate-100/90 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-blue-900 font-bold text-xs uppercase tracking-wider font-mono">
              <Lock className="w-3.5 h-3.5 text-red-600" />
              <span>Authentication Gate</span>
            </div>
            <h2 className="text-base font-extrabold text-blue-950 mt-1">
              {targetCourse ? `Enroll in ${targetCourse.title}` : 'Sign In to The Hub'}
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Authenticate to save course progress, complete assessments, and verify skills.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 p-1.5 rounded-xl hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl font-medium animate-pulse">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-xl font-medium">
                {success}
              </div>
            )}

            {isRegister && (
              <div className="space-y-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full bg-slate-100 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-mono"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-slate-700 mb-1 font-semibold">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="learner@thehub.rw"
                className="w-full bg-slate-100 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1 font-semibold">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-100 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 hover:from-blue-800 hover:to-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-950/20 transition-all active:scale-98 mt-2"
            >
              {loading ? 'Authenticating...' : isRegister ? 'Create Learner Account' : 'Sign In & Continue'}
            </button>
          </form>

          <div className="text-center text-xs text-slate-600 pt-1">
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-blue-800 hover:text-blue-950 font-semibold hover:underline"
            >
              {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
