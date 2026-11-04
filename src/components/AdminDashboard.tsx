import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Users, 
  ShieldCheck, 
  Megaphone, 
  Trash2, 
  Plus, 
  Building2, 
  CheckCircle2, 
  AlertTriangle,
  FileText,
  Camera,
  Search,
  LogIn,
  Sparkles,
  ArrowRight,
  Edit2,
  RefreshCw,
  X,
  KeyRound,
  Check
} from 'lucide-react';
import { User, Company, Post, Announcement } from '../types';

interface AdminDashboardProps {
  currentCompany: Company;
  currentUser: User;
  employees: User[];
  posts: Post[];
  announcements: Announcement[];
  onAddEmployee: (newEmp: User) => void;
  onUpdateEmployee?: (empId: string, updated: Partial<User>) => void;
  onDeleteEmployee: (empId: string) => void;
  onPostAnnouncement: (announcement: Announcement) => void;
  onDeletePost: (postId: string) => void;
  onSwitchUser?: (user: User) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentCompany,
  currentUser,
  employees,
  posts,
  announcements,
  onAddEmployee,
  onUpdateEmployee,
  onDeleteEmployee,
  onPostAnnouncement,
  onDeletePost,
  onSwitchUser,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'employees' | 'announcements' | 'moderation'>('employees');
  
  // Random PIN generator (e.g. 6-digit numeric PIN)
  const generateRandomPin = () => Math.floor(100000 + Math.random() * 900000).toString();

  // New Employee Form State
  const [empName, setEmpName] = useState('');
  const [empUsername, setEmpUsername] = useState('');
  const [empEmail, setEmpEmail] = useState('');
  const [empPassword, setEmpPassword] = useState(generateRandomPin());
  const [empDepartment, setEmpDepartment] = useState<'Engineering' | 'Design' | 'Marketing' | 'Product' | 'HR' | 'Leadership'>('Engineering');
  const [empDesignation, setEmpDesignation] = useState('');
  const [empRole, setEmpRole] = useState<'employee' | 'admin'>('employee');
  const [empAvatar, setEmpAvatar] = useState<string>('');
  const [showAddSuccess, setShowAddSuccess] = useState(false);
  const [createdInfo, setCreatedInfo] = useState<{ name: string; email: string; pin: string } | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDept, setFilterDept] = useState('All');

  // Edit Employee Modal State
  const [editingEmp, setEditingEmp] = useState<User | null>(null);
  const [editName, setEditName] = useState('');
  const [editDept, setEditDept] = useState<'Engineering' | 'Design' | 'Marketing' | 'Product' | 'HR' | 'Leadership'>('Engineering');
  const [editDesignation, setEditDesignation] = useState('');
  const [editRole, setEditRole] = useState<'employee' | 'admin'>('employee');
  const [editPin, setEditPin] = useState('');
  const [editAvatar, setEditAvatar] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // New Announcement Form State
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annType, setAnnType] = useState<'urgent' | 'general' | 'event'>('general');
  const [showAnnSuccess, setShowAnnSuccess] = useState(false);

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setEmpAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setEditAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const openEditModal = (emp: User) => {
    setEditingEmp(emp);
    setEditName(emp.fullName);
    setEditDept(emp.department);
    setEditDesignation(emp.designation);
    setEditRole(emp.role);
    setEditPin(emp.password || generateRandomPin());
    setEditAvatar(emp.avatar);
  };

  const handleSaveEditedEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmp) return;

    if (onUpdateEmployee) {
      onUpdateEmployee(editingEmp.id, {
        fullName: editName.trim(),
        department: editDept,
        designation: editDesignation.trim(),
        role: editRole,
        avatar: editAvatar,
        password: editPin,
      });
    }

    setEditingEmp(null);
  };

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empName || !empUsername || !empEmail) return;

    // Pick avatar or fallback
    const fallbackAvatars = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    ];
    const pickedAvatar = empAvatar || fallbackAvatars[employees.length % fallbackAvatars.length];
    const cleanUsername = empUsername.toLowerCase().trim().replace(/[^a-z0-9_]/g, '');
    const cleanEmail = empEmail.trim().toLowerCase();
    const assignedPin = empPassword.trim() || generateRandomPin();

    const newEmp: User = {
      id: 'emp_' + Date.now(),
      companyId: currentCompany.id,
      email: cleanEmail,
      password: assignedPin,
      username: cleanUsername,
      fullName: empName.trim(),
      avatar: pickedAvatar,
      role: empRole,
      department: empDepartment,
      designation: empDesignation.trim() || `${empDepartment} Specialist`,
      followersCount: 1,
      followingCount: 5,
      bio: `Member @ ${currentCompany.name} • ${empDesignation || empDepartment}`,
      achievements: ['New Joiner', 'Verified Access'],
    };

    onAddEmployee(newEmp);
    setCreatedInfo({ name: newEmp.fullName, email: cleanEmail, pin: assignedPin });

    setEmpName('');
    setEmpUsername('');
    setEmpEmail('');
    setEmpPassword(generateRandomPin());
    setEmpDesignation('');
    setEmpAvatar('');
    setShowAddSuccess(true);

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (e) {}

    setTimeout(() => setShowAddSuccess(false), 8000);
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle || !annContent) return;

    const newAnn: Announcement = {
      id: 'ann_' + Date.now(),
      companyId: currentCompany.id,
      title: annTitle.trim(),
      content: annContent.trim(),
      author: `${currentUser.fullName} (${currentUser.role === 'admin' ? 'Admin' : 'Lead'})`,
      authorRole: currentUser.designation,
      timestamp: 'Just now',
      type: annType,
    };

    onPostAnnouncement(newAnn);
    setAnnTitle('');
    setAnnContent('');
    setShowAnnSuccess(true);
    setTimeout(() => setShowAnnSuccess(false), 3000);
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = emp.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          emp.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          emp.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (emp.email && emp.email.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDept = filterDept === 'All' || emp.department === filterDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="max-w-5xl mx-auto py-3 sm:py-6 px-2 sm:px-4 md:px-8 space-y-4 sm:space-y-6 bg-white min-h-[85vh]">
      {/* Hidden file input for adding employee avatar */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarFile}
        accept="image/*"
        className="hidden"
      />

      {/* Hidden file input for editing employee avatar */}
      <input
        type="file"
        ref={editFileInputRef}
        onChange={handleEditAvatarFile}
        accept="image/*"
        className="hidden"
      />

      {/* Workspace Header in White Theme with Red & Pink Accents */}
      <div className="bg-gradient-to-r from-rose-50/80 via-white to-pink-50/80 border border-rose-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-500 to-pink-500 text-white flex items-center justify-center shadow-md shadow-rose-300/40 flex-shrink-0">
            <Building2 size={24} className="sm:hidden" />
            <Building2 size={28} className="hidden sm:block" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 
                className="text-base sm:text-xl font-bold text-neutral-900 truncate"
                style={{ fontFamily: '"Times New Roman", Times, serif' }}
              >
                {currentCompany.name} Admin Portal
              </h1>
              <span className="bg-gradient-to-r from-red-600 to-pink-600 text-white text-[10px] sm:text-[11px] font-bold px-2 sm:px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs flex-shrink-0">
                <ShieldCheck size={11} /> Master Admin
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-neutral-500 mt-0.5 line-clamp-2">
              Full workspace control • Provision random login PINs, manage credentials, edit profiles & broadcast announcements
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-2.5 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-rose-100">
          <button
            onClick={() => setActiveTab('employees')}
            className="flex-1 md:flex-initial px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition"
            style={{ fontFamily: '"Times New Roman", Times, serif' }}
          >
            <Plus size={15} /> Add Employee
          </button>

          <div className="flex items-center gap-2 bg-white p-1.5 sm:p-2 sm:px-3 rounded-2xl border border-rose-100 shadow-2xs">
            <div className="text-right">
              <div 
                className="text-xs font-bold text-neutral-900 truncate max-w-[120px] sm:max-w-none"
                style={{ fontFamily: '"Times New Roman", Times, serif' }}
              >
                {currentUser.fullName}
              </div>
              <div className="text-[10px] sm:text-[11px] text-rose-600 font-semibold">{currentUser.designation}</div>
            </div>
            <img
              src={currentUser.avatar}
              alt={currentUser.username}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-rose-400 flex-shrink-0"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 sm:gap-2 border-b border-rose-100 pb-2 overflow-x-auto no-scrollbar -mx-2 px-2">
        <button
          onClick={() => setActiveTab('employees')}
          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'employees'
              ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-sm'
              : 'text-neutral-600 hover:text-rose-600 hover:bg-rose-50'
          }`}
          style={{ fontFamily: '"Times New Roman", Times, serif' }}
        >
          <Users size={14} />
          Add & Manage ({employees.length})
        </button>
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-sm'
              : 'text-neutral-600 hover:text-rose-600 hover:bg-rose-50'
          }`}
          style={{ fontFamily: '"Times New Roman", Times, serif' }}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('announcements')}
          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'announcements'
              ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-sm'
              : 'text-neutral-600 hover:text-rose-600 hover:bg-rose-50'
          }`}
          style={{ fontFamily: '"Times New Roman", Times, serif' }}
        >
          <Megaphone size={14} />
          Announcements ({announcements.length})
        </button>
        <button
          onClick={() => setActiveTab('moderation')}
          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'moderation'
              ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-sm'
              : 'text-neutral-600 hover:text-rose-600 hover:bg-rose-50'
          }`}
          style={{ fontFamily: '"Times New Roman", Times, serif' }}
        >
          <ShieldCheck size={14} />
          Moderation ({posts.length})
        </button>
      </div>

      {/* TAB 1: ADD & MANAGE EMPLOYEES */}
      {activeTab === 'employees' && (
        <div className="space-y-6">
          {/* Add Employee Form Card */}
          <div className="bg-white border-2 border-rose-200/80 rounded-3xl p-6 shadow-md shadow-rose-100/50">
            <div className="mb-4 pb-3 border-b border-rose-100">
              <h2 
                className="text-base font-bold text-neutral-900 flex items-center gap-2"
                style={{ fontFamily: '"Times New Roman", Times, serif' }}
              >
                <Plus size={18} className="text-rose-600" />
                Add New Employee to {currentCompany.name}
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Generates a secure random 6-digit login PIN. Auto-dispatches onboarding credentials to employee email.
              </p>
            </div>

            {showAddSuccess && createdInfo && (
              <div className="mb-4 bg-emerald-50 border-2 border-emerald-300 text-emerald-900 p-4 rounded-2xl flex items-start gap-3 animate-in fade-in shadow-xs">
                <CheckCircle2 size={24} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 text-xs">
                  <div className="flex items-center gap-2">
                    <strong className="text-sm font-bold">Employee Account Created Successfully!</strong>
                    <span className="bg-emerald-200 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Live in Supabase
                    </span>
                  </div>
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 bg-white/70 p-2.5 rounded-xl border border-emerald-200">
                    <div>
                      <span className="text-[10px] text-neutral-500 block">Employee:</span>
                      <strong className="text-neutral-800">{createdInfo.name}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-500 block">Registered Email:</span>
                      <strong className="text-neutral-800">{createdInfo.email}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-500 block">Generated Login PIN:</span>
                      <strong className="text-base font-mono text-rose-600 tracking-widest">{createdInfo.pin}</strong>
                    </div>
                  </div>
                  <p className="text-[11px] text-emerald-700 mt-2">
                    ✉️ Auto-DM containing this login PIN was dispatched from <strong>veeraharikumaran2007@gmail.com</strong>!
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleCreateEmployee} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {/* Full Name */}
                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">
                    Employee Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Arun Karthik"
                    value={empName}
                    onChange={(e) => setEmpName(e.target.value)}
                    className="w-full bg-rose-50/40 border border-rose-200 rounded-xl px-3 py-2.5 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-rose-400"
                    required
                  />
                </div>

                {/* Company Username */}
                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">
                    Company Username <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-neutral-400">@</span>
                    <input
                      type="text"
                      placeholder="arun_eng"
                      value={empUsername}
                      onChange={(e) => setEmpUsername(e.target.value)}
                      className="w-full bg-rose-50/40 border border-rose-200 rounded-xl pl-7 pr-3 py-2.5 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-rose-400"
                      required
                    />
                  </div>
                </div>

                {/* Employee Email Slot */}
                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">
                    Employee Email (Login Slot) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. arun@infynux.com or personal mail"
                    value={empEmail}
                    onChange={(e) => setEmpEmail(e.target.value)}
                    className="w-full bg-rose-50/40 border border-rose-200 rounded-xl px-3 py-2.5 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-rose-400"
                    required
                  />
                </div>

                {/* Random Numeric PIN Slot */}
                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1 flex items-center justify-between">
                    <span>Generated Login PIN</span>
                    <button
                      type="button"
                      onClick={() => setEmpPassword(generateRandomPin())}
                      className="text-[10px] text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1"
                    >
                      <RefreshCw size={10} /> Generate New
                    </button>
                  </label>
                  <div className="relative">
                    <KeyRound size={13} className="absolute left-3 top-3 text-rose-500" />
                    <input
                      type="text"
                      value={empPassword}
                      onChange={(e) => setEmpPassword(e.target.value)}
                      className="w-full bg-rose-50/60 border border-rose-300 rounded-xl pl-8 pr-3 py-2.5 text-xs font-mono font-bold text-rose-700 tracking-wider focus:outline-none focus:ring-2 focus:ring-rose-400"
                      required
                    />
                  </div>
                </div>

                {/* Department */}
                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">Department</label>
                  <select
                    value={empDepartment}
                    onChange={(e) => setEmpDepartment(e.target.value as any)}
                    className="w-full bg-rose-50/40 border border-rose-200 rounded-xl px-3 py-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  >
                    <option value="Engineering">💻 Engineering</option>
                    <option value="Design">🎨 Design</option>
                    <option value="Product">🚀 Product</option>
                    <option value="Marketing">📈 Marketing</option>
                    <option value="HR">👥 People / HR</option>
                    <option value="Leadership">👔 Leadership</option>
                  </select>
                </div>

                {/* Designation */}
                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">Designation / Role Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Backend Engineer"
                    value={empDesignation}
                    onChange={(e) => setEmpDesignation(e.target.value)}
                    className="w-full bg-rose-50/40 border border-rose-200 rounded-xl px-3 py-2.5 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>

                {/* Access Level */}
                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">Access Level</label>
                  <select
                    value={empRole}
                    onChange={(e) => setEmpRole(e.target.value as any)}
                    className="w-full bg-rose-50/40 border border-rose-200 rounded-xl px-3 py-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  >
                    <option value="employee">Standard Employee (Feed & Updates only)</option>
                    <option value="admin">Company Administrator (Admin Portal)</option>
                  </select>
                </div>

                {/* Photo Upload */}
                <div className="md:col-span-2">
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">Employee Photo</label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="py-2.5 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold border border-rose-200 flex items-center justify-center gap-1.5 transition"
                    >
                      <Camera size={14} />
                      {empAvatar ? 'Change Photo ✓' : 'Upload Employee Photo'}
                    </button>
                    {empAvatar && (
                      <div className="flex items-center gap-2">
                        <img src={empAvatar} alt="Preview" className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-400" />
                        <span className="text-[11px] text-emerald-600 font-semibold">Ready to upload</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-rose-100">
                <span className="text-[11px] text-neutral-500">
                  ⚡ Auto-DM welcome message from <strong className="text-neutral-700">veeraharikumaran2007@gmail.com</strong> will be automatically written to this employee!
                </span>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-red-600 via-rose-500 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold text-xs rounded-xl transition shadow-md shadow-rose-500/25 flex items-center justify-center gap-1.5"
                  style={{ fontFamily: '"Times New Roman", Times, serif' }}
                >
                  <Plus size={15} />
                  <span>Create Employee & Dispatch PIN</span>
                </button>
              </div>
            </form>
          </div>

          {/* Current Employees Table with Edit & Delete */}
          <div className="bg-white border border-rose-100 rounded-3xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-rose-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-gradient-to-r from-rose-50/40 to-pink-50/30">
              <div>
                <span 
                  className="font-bold text-sm text-neutral-900 block"
                  style={{ fontFamily: '"Times New Roman", Times, serif' }}
                >
                  Workspace Personnel Directory ({employees.length} Members)
                </span>
                <span className="text-[11px] text-neutral-500">
                  Admin full access: Edit profile, change picture, reset PIN, or remove employees
                </span>
              </div>

              {/* Search & Filter */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search size={13} className="absolute left-2.5 top-2.5 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search personnel..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs bg-white border border-rose-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-400 w-40 sm:w-48"
                  />
                </div>

                <select
                  value={filterDept}
                  onChange={(e) => setFilterDept(e.target.value)}
                  className="px-2.5 py-1.5 text-xs bg-white border border-rose-200 rounded-xl focus:outline-none text-neutral-700"
                >
                  <option value="All">All Depts</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Design">Design</option>
                  <option value="Product">Product</option>
                  <option value="HR">HR</option>
                  <option value="Leadership">Leadership</option>
                </select>
              </div>
            </div>

            <div className="divide-y divide-rose-50">
              {filteredEmployees.length === 0 ? (
                <div className="p-8 text-center text-xs text-neutral-400">
                  No personnel matching "{searchQuery}"
                </div>
              ) : (
                filteredEmployees.map((emp) => (
                  <div key={emp.id} className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-rose-50/40 transition">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={emp.avatar}
                        alt={emp.username}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-200 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                          <span 
                            className="font-bold text-xs text-neutral-900"
                            style={{ fontFamily: '"Times New Roman", Times, serif' }}
                          >
                            {emp.fullName}
                          </span>
                          <span className="text-[11px] text-neutral-400 font-mono">@{emp.username}</span>
                          {emp.role === 'admin' ? (
                            <span className="bg-gradient-to-r from-red-600 to-pink-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <ShieldCheck size={10} /> ADMIN
                            </span>
                          ) : (
                            <span className="bg-pink-100 text-pink-700 text-[9px] font-bold px-2 py-0.5 rounded-full">
                              EMPLOYEE
                            </span>
                          )}
                          {emp.email && (
                            <span className="text-[10px] text-neutral-500 bg-neutral-100 px-2 py-0.2 rounded font-mono break-all">
                              {emp.email}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-neutral-500 mt-1 flex items-center gap-1.5 flex-wrap">
                          <span>{emp.designation}</span>
                          <span>•</span>
                          <span className="text-rose-600 font-semibold">{emp.department}</span>
                          {emp.password && (
                            <span className="text-rose-600 bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded font-mono font-bold text-[10px]">
                              PIN: {emp.password}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-rose-100/70 w-full sm:w-auto justify-end">
                      {/* Edit Employee Button (Admin full power) */}
                      <button
                        onClick={() => openEditModal(emp)}
                        className="px-2.5 py-1.5 text-neutral-600 hover:text-rose-600 transition rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200/80 flex items-center gap-1 text-[11px] font-semibold"
                        title="Edit Employee Profile & Picture"
                      >
                        <Edit2 size={13} className="text-rose-600" />
                        <span>Edit</span>
                      </button>

                      {/* Test Login Button */}
                      {onSwitchUser && emp.id !== currentUser.id && (
                        <button
                          onClick={() => onSwitchUser(emp)}
                          className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-semibold border border-rose-200 transition flex items-center gap-1"
                          title="Instant test login as this employee"
                        >
                          <LogIn size={12} />
                          <span>Login</span>
                        </button>
                      )}

                      {/* Delete / Revoke Access */}
                      {emp.id !== currentUser.id && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to remove ${emp.fullName} from ${currentCompany.name}?`)) {
                              onDeleteEmployee(emp.id);
                            }
                          }}
                          className="px-2.5 py-1.5 text-red-500 hover:text-red-700 transition rounded-xl bg-red-50 hover:bg-red-100 border border-red-200/80 flex items-center gap-1 text-[11px] font-semibold"
                          title="Remove Employee"
                        >
                          <Trash2 size={13} />
                          <span>Delete</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* EDIT EMPLOYEE MODAL */}
      {editingEmp && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-rose-200 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-rose-100">
              <h3 
                className="text-base font-bold text-neutral-900 flex items-center gap-2"
                style={{ fontFamily: '"Times New Roman", Times, serif' }}
              >
                <Edit2 size={16} className="text-rose-600" />
                Edit Employee Profile: {editingEmp.fullName}
              </h3>
              <button 
                onClick={() => setEditingEmp(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEditedEmployee} className="space-y-4 mt-4">
              {/* Avatar Picture with Change Button */}
              <div className="flex items-center gap-4">
                <img src={editAvatar} alt="Avatar" className="w-16 h-16 rounded-full object-cover ring-2 ring-rose-400" />
                <div>
                  <button
                    type="button"
                    onClick={() => editFileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold border border-rose-200 flex items-center gap-1.5"
                  >
                    <Camera size={14} /> Change Photo
                  </button>
                  <span className="text-[10px] text-neutral-400 block mt-1">Upload new employee portrait</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-rose-50/40 border border-rose-200 rounded-xl px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-rose-400"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">Department</label>
                  <select
                    value={editDept}
                    onChange={(e) => setEditDept(e.target.value as any)}
                    className="w-full bg-rose-50/40 border border-rose-200 rounded-xl px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  >
                    <option value="Engineering">💻 Engineering</option>
                    <option value="Design">🎨 Design</option>
                    <option value="Product">🚀 Product</option>
                    <option value="Marketing">📈 Marketing</option>
                    <option value="HR">👥 HR</option>
                    <option value="Leadership">👔 Leadership</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">Designation</label>
                  <input
                    type="text"
                    value={editDesignation}
                    onChange={(e) => setEditDesignation(e.target.value)}
                    className="w-full bg-rose-50/40 border border-rose-200 rounded-xl px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1 flex items-center justify-between">
                    <span>Login PIN</span>
                    <button
                      type="button"
                      onClick={() => setEditPin(generateRandomPin())}
                      className="text-[10px] text-rose-600 hover:underline"
                    >
                      🎲 Reset PIN
                    </button>
                  </label>
                  <input
                    type="text"
                    value={editPin}
                    onChange={(e) => setEditPin(e.target.value)}
                    className="w-full bg-rose-50/40 border border-rose-200 rounded-xl px-3 py-2 text-xs text-neutral-900 font-mono font-bold text-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-700 block mb-1">Access Role</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as any)}
                  className="w-full bg-rose-50/40 border border-rose-200 rounded-xl px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-rose-400"
                >
                  <option value="employee">Standard Employee</option>
                  <option value="admin">Company Administrator</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-rose-100">
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Delete ${editingEmp.fullName}?`)) {
                      onDeleteEmployee(editingEmp.id);
                      setEditingEmp(null);
                    }
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition"
                >
                  Delete Employee
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingEmp(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-500 hover:bg-neutral-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold text-xs shadow-sm hover:from-red-700 hover:to-pink-700 transition"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div 
              onClick={() => setActiveTab('employees')}
              className="bg-white border border-rose-100 rounded-2xl p-4 shadow-sm hover:border-rose-300 transition cursor-pointer group"
            >
              <div className="text-neutral-500 text-xs font-medium flex items-center justify-between">
                <span>Active Employees</span>
                <Users size={16} className="text-rose-500" />
              </div>
              <div className="text-2xl font-bold text-neutral-900 mt-2 group-hover:text-rose-600 transition">
                {employees.length}
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                <CheckCircle2 size={11} /> Synced with Supabase
              </span>
            </div>

            <div 
              onClick={() => setActiveTab('moderation')}
              className="bg-white border border-rose-100 rounded-2xl p-4 shadow-sm hover:border-rose-300 transition cursor-pointer group"
            >
              <div className="text-neutral-500 text-xs font-medium flex items-center justify-between">
                <span>Work Updates Shared</span>
                <FileText size={16} className="text-pink-500" />
              </div>
              <div className="text-2xl font-bold text-neutral-900 mt-2 group-hover:text-pink-600 transition">
                {posts.length}
              </div>
              <span className="text-[10px] text-pink-600 font-semibold block mt-1">In this workspace</span>
            </div>

            <div 
              onClick={() => setActiveTab('announcements')}
              className="bg-white border border-rose-100 rounded-2xl p-4 shadow-sm hover:border-rose-300 transition cursor-pointer group"
            >
              <div className="text-neutral-500 text-xs font-medium flex items-center justify-between">
                <span>Announcements</span>
                <Megaphone size={16} className="text-rose-500" />
              </div>
              <div className="text-2xl font-bold text-neutral-900 mt-2 group-hover:text-rose-600 transition">
                {announcements.length}
              </div>
              <span className="text-[10px] text-rose-600 font-semibold block mt-1">Pinned notices</span>
            </div>

            <div className="bg-white border border-rose-100 rounded-2xl p-4 shadow-sm">
              <div className="text-neutral-500 text-xs font-medium flex items-center justify-between">
                <span>Privacy Boundary</span>
                <ShieldCheck size={16} className="text-emerald-500" />
              </div>
              <div className="text-lg font-bold text-emerald-600 mt-2">
                ISOLATED
              </div>
              <span className="text-[10px] text-neutral-400 block mt-1">Zero external leakage</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ANNOUNCEMENTS */}
      {activeTab === 'announcements' && (
        <div className="space-y-6">
          <div className="bg-white border border-rose-100 rounded-2xl p-5 shadow-sm">
            <h2 
              className="text-sm font-bold text-neutral-900 mb-1 flex items-center gap-2"
              style={{ fontFamily: '"Times New Roman", Times, serif' }}
            >
              <Megaphone size={16} className="text-rose-600" />
              Broadcast Official Company Announcement
            </h2>
            <p className="text-xs text-neutral-500 mb-4">
              Announcements will be pinned to all {currentCompany.name} employees' feed headers.
            </p>

            {showAnnSuccess && (
              <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-xs p-3 rounded-xl flex items-center gap-2">
                <CheckCircle2 size={16} /> Announcement broadcasted live across workspace!
              </div>
            )}

            <form onSubmit={handleCreateAnnouncement} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="text-[11px] font-semibold text-neutral-600 block mb-1">Headline / Title</label>
                  <input
                    type="text"
                    placeholder="e.g. 🏆 All-Hands Townhall & Q4 Roadmap Unveiling"
                    value={annTitle}
                    onChange={(e) => setAnnTitle(e.target.value)}
                    className="w-full bg-rose-50/40 border border-rose-100 rounded-xl px-3 py-2 text-xs text-neutral-800 focus:outline-none focus:ring-1 focus:ring-rose-400"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-600 block mb-1">Notice Type</label>
                  <select
                    value={annType}
                    onChange={(e) => setAnnType(e.target.value as any)}
                    className="w-full bg-rose-50/40 border border-rose-100 rounded-xl px-3 py-2 text-xs text-neutral-800 focus:outline-none focus:ring-1 focus:ring-rose-400"
                  >
                    <option value="general">Regular Announcement</option>
                    <option value="urgent">🚨 Urgent / Priority</option>
                    <option value="event">🎉 Company Event / Celebration</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-600 block mb-1">Announcement Body</label>
                <textarea
                  placeholder="Type the full announcement message here..."
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  className="w-full bg-rose-50/40 border border-rose-100 rounded-xl p-3 text-xs text-neutral-800 focus:outline-none focus:ring-1 focus:ring-rose-400"
                  rows={3}
                  required
                />
              </div>

              <button
                type="submit"
                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold text-xs py-2 px-5 rounded-xl transition shadow flex items-center gap-1.5"
                style={{ fontFamily: '"Times New Roman", Times, serif' }}
              >
                <Megaphone size={14} />
                Publish Announcement
              </button>
            </form>
          </div>

          {/* Existing Announcements List */}
          <div className="bg-white border border-rose-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-3 border-b border-rose-100 bg-rose-50/30">
              <span 
                className="font-bold text-xs text-neutral-900"
                style={{ fontFamily: '"Times New Roman", Times, serif' }}
              >
                Active Broadcasts ({announcements.length})
              </span>
            </div>

            <div className="divide-y divide-rose-50">
              {announcements.map((ann) => (
                <div key={ann.id} className="p-4 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        ann.type === 'urgent'
                          ? 'bg-red-100 text-red-700'
                          : ann.type === 'event'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}>
                        {ann.type.toUpperCase()}
                      </span>
                      <h3 className="font-bold text-xs text-neutral-900">{ann.title}</h3>
                      <span className="text-[10px] text-neutral-400">• {ann.timestamp}</span>
                    </div>
                    <p className="text-xs text-neutral-600 leading-relaxed">{ann.content}</p>
                    <div className="text-[10px] text-neutral-400 mt-2">
                      Posted by: <strong className="text-neutral-700">{ann.author}</strong> ({ann.authorRole})
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MODERATION */}
      {activeTab === 'moderation' && (
        <div className="space-y-4">
          <div className="bg-white border border-rose-100 rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <h2 
                className="text-sm font-bold text-neutral-900"
                style={{ fontFamily: '"Times New Roman", Times, serif' }}
              >
                Workspace Feed Content Moderation
              </h2>
              <p className="text-xs text-neutral-500">
                Admins have permissions to delete inappropriate updates or sensitive internal leaks.
              </p>
            </div>
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
              {posts.length} Active Posts
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-white border border-rose-100 rounded-2xl p-4 shadow-sm flex gap-4">
                <img
                  src={post.media[0]}
                  alt="Post preview"
                  className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-neutral-900 truncate">
                        {post.user.fullName}
                      </span>
                      <span className="text-[10px] text-neutral-400">{post.timestamp}</span>
                    </div>
                    <p className="text-xs text-neutral-600 line-clamp-2 mt-1">
                      {post.caption}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-rose-50">
                    <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                      {post.department}
                    </span>

                    <button
                      onClick={() => onDeletePost(post.id)}
                      className="text-neutral-400 hover:text-red-600 text-xs font-semibold flex items-center gap-1 transition"
                    >
                      <Trash2 size={13} /> Delete Post
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
