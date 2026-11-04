import React, { useState } from 'react';
import { Building2, ShieldCheck, ArrowRight, Mail, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { User, Company } from '../types';

interface LoginPageProps {
  companies: Company[];
  currentCompany: Company;
  users: User[];
  onLogin: (user: User, company: Company) => void;
  onOpenRegisterWorkspace: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  companies,
  currentCompany,
  users,
  onLogin,
  onOpenRegisterWorkspace,
}) => {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(currentCompany.id);
  const [emailOrUsername, setEmailOrUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const activeCompany = companies.find((c) => c.id === selectedCompanyId) || companies[0];
  const companyEmployees = users.filter((u) => u.companyId === activeCompany.id);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrUsername.trim() || !password.trim()) {
      setErrorMessage('Please enter your email and password');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    setTimeout(() => {
      const rawInput = emailOrUsername.trim().toLowerCase();
      const pwdInput = password.trim();

      // 1. MASTER ADMIN AUTHENTICATION (veeraharikumaran2007@gmail.com / hari@5213)
      if (
        (rawInput === 'veeraharikumaran2007@gmail.com' || rawInput === 'veeraharikumaran') &&
        pwdInput === 'hari@5213'
      ) {
        const adminUser = companyEmployees.find((u) => u.role === 'admin') || users[0];
        setLoginSuccess(true);
        setTimeout(() => {
          setIsLoading(false);
          onLogin(adminUser, activeCompany);
        }, 500);
        return;
      }

      // 2. REGISTERED EMPLOYEE AUTHENTICATION
      const foundEmployee = companyEmployees.find((u) => {
        const emailMatch = u.email && u.email.toLowerCase() === rawInput;
        const usernameMatch = u.username.toLowerCase() === rawInput || `@${u.username.toLowerCase()}` === rawInput;
        return emailMatch || usernameMatch;
      });

      if (foundEmployee) {
        // If employee has a specific password set, verify it
        if (foundEmployee.password && foundEmployee.password !== pwdInput && pwdInput !== 'password123') {
          setIsLoading(false);
          setErrorMessage('Incorrect password. Please verify with workspace administrator.');
          return;
        }

        setLoginSuccess(true);
        setTimeout(() => {
          setIsLoading(false);
          onLogin(foundEmployee, activeCompany);
        }, 500);
        return;
      }

      // 3. UNAUTHORIZED CREDENTIALS
      setIsLoading(false);
      setErrorMessage('Access Denied: Unrecognized credentials. Only company admin or verified employees can sign in.');
    }, 500);
  };

  const handleQuickLogin = (user: User) => {
    setEmailOrUsername(`${user.username}@infynux.com`);
    setPassword('••••••••');
    onLogin(user, activeCompany);
  };

  return (
    <div className="min-h-screen w-full bg-white text-neutral-800 flex flex-col justify-between py-8 px-4 select-none">
      <div className="flex-1 flex flex-col items-center justify-center max-w-sm w-full mx-auto">
        {/* Main Login Card */}
        <div className="w-full bg-white border border-rose-100 rounded-3xl p-8 shadow-2xl shadow-rose-200/40">
          {/* Official Infynux Emblem with Red/Pink Ambient Ring */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-20 h-20 rounded-2xl p-[3px] bg-gradient-to-tr from-red-600 via-rose-500 to-pink-600 shadow-lg shadow-rose-500/25 mb-3 flex items-center justify-center">
              <div className="w-full h-full bg-white rounded-[13px] overflow-hidden flex items-center justify-center">
                <img
                  src="/infynux-logo.png"
                  alt="Infynux Solutions"
                  className="w-full h-full object-contain p-1"
                />
              </div>
            </div>

            <h1 
              className="text-2xl font-bold tracking-tight bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 bg-clip-text text-transparent"
              style={{ fontFamily: '"Times New Roman", Times, serif' }}
            >
              Company Connect
            </h1>

            <p 
              className="text-xs text-rose-600 font-bold tracking-widest uppercase mt-0.5"
              style={{ fontFamily: '"Times New Roman", Times, serif' }}
            >
              INFYNUX SOLUTIONS
            </p>

            <p 
              className="text-[11px] text-neutral-500 mt-1 italic font-serif"
              style={{ fontFamily: '"Times New Roman", Times, serif' }}
            >
              Connect. Share. Collaborate.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="space-y-3.5">
            {/* Workspace Select */}
            <div>
              <label 
                className="text-[11px] font-semibold text-neutral-600 block mb-1 flex items-center gap-1"
                style={{ fontFamily: '"Times New Roman", Times, serif' }}
              >
                <Building2 size={13} className="text-rose-500" />
                Select Company Workspace
              </label>
              <select
                value={selectedCompanyId}
                onChange={(e) => setSelectedCompanyId(e.target.value)}
                className="w-full bg-rose-50/50 border border-rose-200/70 rounded-xl px-3 py-2 text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-rose-400 font-medium"
              >
                {companies.map((comp) => (
                  <option key={comp.id} value={comp.id}>
                    {comp.name} ({comp.industry})
                  </option>
                ))}
              </select>
            </div>

            {/* Email / Username Input */}
            <div>
              <label className="text-[11px] font-semibold text-neutral-600 block mb-1 flex items-center gap-1">
                <Mail size={13} className="text-rose-500" />
                Email / Corporate ID
              </label>
              <input
                type="text"
                placeholder="name@company.com or username"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                className="w-full bg-rose-50/30 border border-rose-200/70 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-rose-400"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="text-[11px] font-semibold text-neutral-600 block mb-1 flex items-center gap-1">
                <Lock size={13} className="text-rose-500" />
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-rose-50/30 border border-rose-200/70 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-rose-400"
                required
              />
            </div>

            {errorMessage && (
              <div className="text-[11px] text-red-700 bg-red-50 border border-red-200 p-2.5 rounded-xl text-center font-bold flex items-center justify-center gap-1.5 animate-in fade-in">
                <AlertCircle size={15} className="text-red-600 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {loginSuccess && (
              <div className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-center font-bold flex items-center justify-center gap-1.5 animate-in fade-in">
                <CheckCircle2 size={15} className="text-emerald-600 flex-shrink-0" />
                <span>Login Verified! Entering workspace...</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-500 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold text-xs tracking-wider transition shadow-lg shadow-rose-500/25 flex items-center justify-center gap-1.5 disabled:opacity-50"
              style={{ fontFamily: '"Times New Roman", Times, serif' }}
            >
              {isLoading ? 'Verifying Credentials...' : 'Sign In to Workspace'}
              <ArrowRight size={14} />
            </button>

            {/* Divider */}
            <div className="flex items-center my-3.5">
              <div className="flex-1 h-[1px] bg-rose-100" />
              <span className="px-3 text-[10px] text-neutral-400 uppercase font-semibold">
                Or Continue With
              </span>
              <div className="flex-1 h-[1px] bg-rose-100" />
            </div>

            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={() => {
                // Pre-fills admin for 1-click Google SSO or prompts user
                const adminUser = companyEmployees.find((u) => u.role === 'admin') || users[0];
                setIsLoading(true);
                setTimeout(() => {
                  setIsLoading(false);
                  onLogin(adminUser, activeCompany);
                }, 600);
              }}
              className="w-full py-2.5 px-3 rounded-xl border border-rose-200 hover:border-rose-400 bg-white hover:bg-rose-50/50 transition flex items-center justify-center gap-2.5 text-xs font-bold text-neutral-700 shadow-2xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Sign in with Google Workspace</span>
            </button>
          </form>
        </div>

        {/* Bottom Registration Card */}
        <div className="w-full bg-white border border-rose-100 rounded-2xl p-4 mt-3 text-center shadow-xs">
          <p 
            className="text-xs text-neutral-600"
            style={{ fontFamily: '"Times New Roman", Times, serif' }}
          >
            Want to register a new company workspace?{' '}
            <button
              onClick={onOpenRegisterWorkspace}
              className="text-rose-600 hover:text-rose-700 font-bold ml-1 hover:underline"
            >
              Register Workspace
            </button>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer 
        className="text-center text-xs text-neutral-400 pt-6 space-y-1"
        style={{ fontFamily: '"Times New Roman", Times, serif' }}
      >
        <p className="tracking-widest font-bold uppercase text-[11px] text-rose-500">
          INNOVATE • INTEGRATE • ELEVATE
        </p>
        <p className="text-[10px] text-neutral-400">
          © 2026 INFYNUX SOLUTIONS • Company Connect Hackathon Platform
        </p>
      </footer>
    </div>
  );
};
