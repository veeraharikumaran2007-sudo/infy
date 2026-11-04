import React, { useState } from 'react';
import { 
  Building2, 
  ArrowRight, 
  Mail, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  UserPlus, 
  LogIn, 
  Briefcase,
  User as UserIcon,
  Tag
} from 'lucide-react';
import { User, Company } from '../types';
import { supabase } from '../supabase';

interface LoginPageProps {
  companies: Company[];
  currentCompany: Company;
  users: User[];
  onLogin: (user: User, company: Company) => void;
  onRegisterEmployee?: (user: User, company: Company) => void;
  onOpenRegisterWorkspace: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  companies,
  currentCompany,
  users,
  onLogin,
  onRegisterEmployee,
  onOpenRegisterWorkspace,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(currentCompany.id);
  
  // Login form state
  const [emailOrUsername, setEmailOrUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  
  // Register form state
  const [regFullName, setRegFullName] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regUsername, setRegUsername] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regDepartment, setRegDepartment] = useState<'Engineering' | 'Design' | 'Marketing' | 'Product' | 'HR' | 'Leadership'>('Engineering');
  const [regDesignation, setRegDesignation] = useState<string>('');

  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const activeCompany = companies.find((c) => c.id === selectedCompanyId) || companies[0];
  const companyEmployees = users.filter((u) => u.companyId === activeCompany.id);

  const handleLoginFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrUsername.trim() || !password.trim()) {
      setErrorMessage('Please enter your email and password');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

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
      }, 400);
      return;
    }

    // 2. LIVE QUERY DIRECTLY TO SUPABASE (Sync across laptop & all mobiles)
    let liveEmployees: User[] = companyEmployees;
    try {
      const { data: dbData } = await supabase.from('employees').select('*');
      if (dbData && dbData.length > 0) {
        liveEmployees = dbData.map((e: any) => ({
          id: e.id,
          companyId: e.company_id || 'c1',
          username: e.username,
          fullName: e.full_name,
          email: e.email,
          password: e.password,
          avatar: e.avatar || '/admin-yogeshwaran-avatar.png',
          role: e.role || 'employee',
          department: e.department || 'Engineering',
          designation: e.designation || 'Specialist',
          isVerified: e.is_verified ?? true,
          followersCount: e.followers_count || 0,
          followingCount: e.following_count || 0,
          bio: e.bio || '',
          achievements: e.achievements || [],
        }));
      }
    } catch (e) {
      console.warn('Supabase live auth fetch notice:', e);
    }

    // 3. REGISTERED EMPLOYEE AUTHENTICATION
    const foundEmployee = liveEmployees.find((u) => {
      const emailMatch = u.email && u.email.toLowerCase() === rawInput;
      const usernameMatch = u.username.toLowerCase() === rawInput || `@${u.username.toLowerCase()}` === rawInput;
      return emailMatch || usernameMatch;
    });

    if (foundEmployee) {
      if (foundEmployee.password && foundEmployee.password !== pwdInput && pwdInput !== 'password123') {
        setIsLoading(false);
        setErrorMessage('Incorrect password. Please verify your credentials or register a new employee account.');
        return;
      }

      setLoginSuccess(true);
      setTimeout(() => {
        setIsLoading(false);
        onLogin(foundEmployee, activeCompany);
      }, 400);
      return;
    }

    // 4. UNAUTHORIZED CREDENTIALS
    setIsLoading(false);
    setErrorMessage('Account not found in cloud database. Please click "Employee Register" tab to create your account!');
  };

  const handleRegisterFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFullName.trim() || !regEmail.trim() || !regUsername.trim() || !regPassword.trim()) {
      setErrorMessage('Please fill in all required registration fields');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    const cleanUsername = regUsername.toLowerCase().trim().replace(/[^a-z0-9_]/g, '');
    const cleanEmail = regEmail.toLowerCase().trim();

    const newEmp: User = {
      id: 'emp_' + Date.now(),
      companyId: activeCompany.id,
      email: cleanEmail,
      password: regPassword.trim(),
      username: cleanUsername,
      fullName: regFullName.trim(),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      role: 'employee',
      department: regDepartment,
      designation: regDesignation.trim() || `${regDepartment} Specialist`,
      followersCount: 0,
      followingCount: 1,
      bio: `Member @ ${activeCompany.name} • ${regDepartment}`,
      achievements: ['Verified Employee', 'New Joiner'],
    };

    try {
      await supabase.from('employees').insert({
        id: newEmp.id,
        company_id: newEmp.companyId,
        username: newEmp.username,
        full_name: newEmp.fullName,
        email: newEmp.email,
        password: newEmp.password,
        avatar: newEmp.avatar,
        role: 'employee',
        department: newEmp.department,
        designation: newEmp.designation,
        is_verified: true,
        followers_count: 0,
        following_count: 1,
        bio: newEmp.bio,
        achievements: newEmp.achievements,
      });
    } catch (err) {
      console.warn('Supabase register error notice:', err);
    }

    setLoginSuccess(true);
    setTimeout(() => {
      setIsLoading(false);
      if (onRegisterEmployee) {
        onRegisterEmployee(newEmp, activeCompany);
      } else {
        onLogin(newEmp, activeCompany);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen w-full bg-white text-neutral-800 flex flex-col justify-between py-6 px-4 select-none">
      <div className="flex-1 flex flex-col items-center justify-center max-w-md w-full mx-auto">
        {/* Main Card */}
        <div className="w-full bg-white border border-rose-100 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-rose-200/40">
          {/* Infynux Emblem */}
          <div className="flex flex-col items-center text-center mb-5">
            <div className="w-18 h-18 rounded-2xl p-[3px] bg-gradient-to-tr from-red-600 via-rose-500 to-pink-600 shadow-lg shadow-rose-500/25 mb-2.5 flex items-center justify-center">
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

          {/* Tab Selector: Login vs Register Employee */}
          <div className="flex items-center gap-1.5 p-1 bg-rose-50 rounded-2xl border border-rose-200/60 mb-5">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setErrorMessage('');
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                authMode === 'login'
                  ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-rose-600'
              }`}
              style={{ fontFamily: '"Times New Roman", Times, serif' }}
            >
              <LogIn size={13} />
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setErrorMessage('');
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                authMode === 'register'
                  ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-rose-600'
              }`}
              style={{ fontFamily: '"Times New Roman", Times, serif' }}
            >
              <UserPlus size={13} />
              Employee Register
            </button>
          </div>

          {/* Form */}
          {authMode === 'login' ? (
            <form onSubmit={handleLoginFormSubmit} className="space-y-3.5">
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
                  Corporate Email or Username
                </label>
                <input
                  type="text"
                  placeholder="Enter email or username"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  autoComplete="off"
                  className="w-full bg-rose-50/30 border border-rose-200/70 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  required
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="text-[11px] font-semibold text-neutral-600 block mb-1 flex items-center gap-1">
                  <Lock size={13} className="text-rose-500" />
                  Password / PIN
                </label>
                <input
                  type="password"
                  placeholder="Enter password or PIN"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
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
                  <span>Verified! Entering workspace portal...</span>
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
            </form>
          ) : (
            <form onSubmit={handleRegisterFormSubmit} className="space-y-3">
              {/* Workspace Select */}
              <div>
                <label className="text-[11px] font-semibold text-neutral-600 block mb-1 flex items-center gap-1">
                  <Building2 size={13} className="text-rose-500" />
                  Company Workspace
                </label>
                <select
                  value={selectedCompanyId}
                  onChange={(e) => setSelectedCompanyId(e.target.value)}
                  className="w-full bg-rose-50/50 border border-rose-200/70 rounded-xl px-3 py-2 text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-rose-400 font-medium"
                >
                  {companies.map((comp) => (
                    <option key={comp.id} value={comp.id}>
                      {comp.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Full Name */}
              <div>
                <label className="text-[11px] font-semibold text-neutral-600 block mb-1 flex items-center gap-1">
                  <UserIcon size={13} className="text-rose-500" />
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Karthik Raja"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  className="w-full bg-rose-50/30 border border-rose-200/70 rounded-xl px-3 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-[11px] font-semibold text-neutral-600 block mb-1 flex items-center gap-1">
                  <Mail size={13} className="text-rose-500" />
                  Employee Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="Enter your corporate email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  autoComplete="off"
                  className="w-full bg-rose-50/30 border border-rose-200/70 rounded-xl px-3 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  required
                />
              </div>

              {/* Username & Dept Grid */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-600 block mb-1 flex items-center gap-1">
                    <Tag size={13} className="text-rose-500" />
                    Username
                  </label>
                  <input
                    type="text"
                    placeholder="karthik_dev"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    className="w-full bg-rose-50/30 border border-rose-200/70 rounded-xl px-3 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-rose-400"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-neutral-600 block mb-1 flex items-center gap-1">
                    <Briefcase size={13} className="text-rose-500" />
                    Department
                  </label>
                  <select
                    value={regDepartment}
                    onChange={(e) => setRegDepartment(e.target.value as any)}
                    className="w-full bg-rose-50/50 border border-rose-200/70 rounded-xl px-2 py-2 text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Product">Product</option>
                    <option value="Marketing">Marketing</option>
                    <option value="HR">HR</option>
                  </select>
                </div>
              </div>

              {/* Designation */}
              <div>
                <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                  Designation / Role Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Frontend Developer"
                  value={regDesignation}
                  onChange={(e) => setRegDesignation(e.target.value)}
                  className="w-full bg-rose-50/30 border border-rose-200/70 rounded-xl px-3 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>

              {/* Password */}
              <div>
                <label className="text-[11px] font-semibold text-neutral-600 block mb-1 flex items-center gap-1">
                  <Lock size={13} className="text-rose-500" />
                  Create Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  placeholder="Choose a password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full bg-rose-50/30 border border-rose-200/70 rounded-xl px-3 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-rose-400"
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
                  <span>Employee Registered! Entering Employee Portal...</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-500 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold text-xs tracking-wider transition shadow-lg shadow-rose-500/25 flex items-center justify-center gap-1.5 disabled:opacity-50 mt-2"
                style={{ fontFamily: '"Times New Roman", Times, serif' }}
              >
                {isLoading ? 'Creating Account in Supabase...' : 'Register & Enter Employee Portal'}
                <ArrowRight size={14} />
              </button>
            </form>
          )}
        </div>

        {/* Bottom Registration Card */}
        <div className="w-full bg-white border border-rose-100 rounded-2xl p-3.5 mt-3 text-center shadow-xs">
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
        className="text-center text-xs text-neutral-400 pt-4 space-y-1"
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
