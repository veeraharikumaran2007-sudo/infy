import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  INITIAL_COMPANIES,
  INITIAL_USERS,
  INITIAL_POSTS, 
  INITIAL_STORIES,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_REELS,
  INITIAL_CHATS
} from './mockData';
import { ActiveTab, Post, UserStory, User, Company, Announcement, Reel, ChatThread, Message } from './types';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { StoriesTray } from './components/StoriesTray';
import { PostCard } from './components/PostCard';
import { SuggestionsSidebar } from './components/SuggestionsSidebar';
import { StoryViewerModal } from './components/StoryViewerModal';
import { PostDetailModal } from './components/PostDetailModal';
import { CreatePostModal } from './components/CreatePostModal';
import { ExploreGrid } from './components/ExploreGrid';
import { ReelsViewer } from './components/ReelsViewer';
import { DirectMessages } from './components/DirectMessages';
import { ProfileView } from './components/ProfileView';
import { SearchDrawer } from './components/SearchDrawer';
import { NotificationsDrawer } from './components/NotificationsDrawer';
import { AdminDashboard } from './components/AdminDashboard';
import { EmployeeDirectory } from './components/EmployeeDirectory';
import { WorkspaceSwitcherModal } from './components/WorkspaceSwitcherModal';
import { AnnouncementBanner } from './components/AnnouncementBanner';
import { DepartmentFilter } from './components/DepartmentFilter';
import { LoginPage } from './components/LoginPage';
import { supabase } from './supabase';

export const App: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(false); // White Theme Default!
  
  // Persistent Session in localStorage so refresh never logs you out!
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('company_connect_auth') === 'true';
  });
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');

  // Multi-Company Workspaces State
  const [companies, setCompanies] = useState<Company[]>(INITIAL_COMPANIES);
  const [currentCompany, setCurrentCompany] = useState<Company>(INITIAL_COMPANIES[0]); // Infynux Solutions

  // Users & Current Authenticated User (Persistent from localStorage)
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('company_connect_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_USERS[0];
  });

  // Posts, Stories, Announcements, Reels
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [stories, setStories] = useState<UserStory[]>(INITIAL_STORIES);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [reels] = useState<Reel[]>(INITIAL_REELS);
  const [chats, setChats] = useState<ChatThread[]>(INITIAL_CHATS);

  // Modals state
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [detailPost, setDetailPost] = useState<Post | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);

  // Dark Mode class on <html>
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Real Supabase Cloud Database Initial Fetch & Sync
  useEffect(() => {
    const fetchSupabaseData = async () => {
      try {
        // 1. Fetch Companies
        const { data: compData } = await supabase.from('companies').select('*');
        if (compData && compData.length > 0) {
          const mappedCompanies: Company[] = compData.map((c: any) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            logo: c.logo || '/infynux-logo.png',
            industry: c.industry || 'Software & Cloud Engineering',
            employeeCount: c.employee_count || 1,
          }));
          setCompanies(mappedCompanies);
        }

        // 2. Fetch Employees
        const { data: empData } = await supabase.from('employees').select('*');
        if (empData && empData.length > 0) {
          const mappedUsers: User[] = empData.map((e: any) => ({
            id: e.id,
            companyId: e.company_id,
            username: e.username,
            fullName: e.full_name,
            email: e.email,
            password: e.password,
            avatar: e.avatar || '/admin-yogeshwaran-avatar.png',
            role: e.role,
            department: e.department,
            designation: e.designation,
            isVerified: e.is_verified,
            followersCount: e.followers_count || 0,
            followingCount: e.following_count || 0,
            bio: e.bio || '',
            achievements: e.achievements || [],
          }));
          setUsers(mappedUsers);

          // Update currentUser from Supabase WITHOUT forcing admin override!
          const savedUserId = localStorage.getItem('company_connect_user_id');
          if (savedUserId) {
            const matched = mappedUsers.find((u) => u.id === savedUserId);
            if (matched) {
              setCurrentUser(matched);
              localStorage.setItem('company_connect_user', JSON.stringify(matched));
            }
          }
        }

        // 3. Fetch Announcements
        const { data: annData } = await supabase.from('announcements').select('*');
        if (annData && annData.length > 0) {
          const mappedAnn: Announcement[] = annData.map((a: any) => ({
            id: a.id,
            companyId: a.company_id,
            title: a.title,
            content: a.content,
            author: a.author,
            authorRole: a.author_role,
            timestamp: new Date(a.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: a.type,
          }));
          setAnnouncements(mappedAnn);
        }

        // 3.5. Fetch Real Post Comments from Supabase
        const { data: commentsData } = await supabase
          .from('post_comments')
          .select('*, employees(*)')
          .order('created_at', { ascending: true });

        const postCommentsMap: Record<string, any[]> = {};
        if (commentsData && commentsData.length > 0) {
          commentsData.forEach((cm: any) => {
            if (!postCommentsMap[cm.post_id]) postCommentsMap[cm.post_id] = [];
            postCommentsMap[cm.post_id].push({
              id: cm.id,
              user: cm.employees ? {
                username: cm.employees.username,
                fullName: cm.employees.full_name,
                avatar: cm.employees.avatar || '/admin-yogeshwaran-avatar.png',
                department: cm.employees.department,
                isVerified: cm.employees.is_verified,
              } : {
                username: 'colleague',
                fullName: 'Colleague',
                avatar: '/admin-yogeshwaran-avatar.png',
                department: 'Engineering',
                isVerified: true,
              },
              text: cm.text,
              timestamp: 'Recent',
              likesCount: 0,
              isLiked: false,
            });
          });
        }

        // 4. Fetch Posts
        const { data: postData } = await supabase
          .from('posts')
          .select('*, employees(*)')
          .order('created_at', { ascending: false });

        if (postData && postData.length > 0) {
          const mappedPosts: Post[] = postData.map((p: any) => ({
            id: p.id,
            companyId: p.company_id,
            user: p.employees ? {
              id: p.employees.id,
              companyId: p.employees.company_id,
              username: p.employees.username,
              fullName: p.employees.full_name,
              avatar: p.employees.avatar || '/admin-yogeshwaran-avatar.png',
              role: p.employees.role,
              department: p.employees.department,
              designation: p.employees.designation,
              isVerified: p.employees.is_verified,
              followersCount: p.employees.followers_count,
              followingCount: p.employees.following_count,
              bio: p.employees.bio,
            } : INITIAL_USERS[0],
            media: p.media && p.media.length > 0 ? p.media : ['https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80'],
            caption: p.caption,
            department: p.department,
            badge: p.badge,
            isOfficialAnnouncement: p.is_official_announcement,
            likesCount: p.likes_count || 0,
            isLiked: false,
            isSaved: false,
            location: p.location || 'Company Workspace',
            timestamp: 'Recent',
            comments: postCommentsMap[p.id] || [],
          }));
          setPosts(mappedPosts);
        }
      } catch (err) {
        console.warn('Supabase fetch notice: using local state backup', err);
      }
    };

    fetchSupabaseData();
    const syncInterval = setInterval(fetchSupabaseData, 2500);
    return () => clearInterval(syncInterval);
  }, []);

  // Strict Multi-Tenant Data Separation by Active Company
  const companyPosts = posts.filter((p) => p.companyId === currentCompany.id);
  const filteredPosts = companyPosts.filter((p) => 
    selectedDepartment === 'All' ? true : p.department === selectedDepartment
  );
  const companyEmployees = users.filter((u) => u.companyId === currentCompany.id);
  const companyStories = stories.filter((s) => s.companyId === currentCompany.id);
  const companyAnnouncements = announcements.filter((a) => a.companyId === currentCompany.id);
  const myPosts = companyPosts.filter((p) => p.user.id === currentUser.id);
  const savedPosts = companyPosts.filter((p) => p.isSaved);

  // Tab change handler
  const handleTabChange = (tab: ActiveTab) => {
    if (tab === 'admin-dashboard' && currentUser.role !== 'admin') {
      setActiveTab('home');
      return;
    }
    if (tab === 'search') {
      setIsSearchOpen(true);
      setIsNotificationsOpen(false);
    } else if (tab === 'notifications') {
      setIsNotificationsOpen(true);
      setIsSearchOpen(false);
    } else {
      setIsSearchOpen(false);
      setIsNotificationsOpen(false);
      setActiveTab(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Like / Unlike Post
  const handleLikeToggle = async (postId: string) => {
    let nextLikesCount = 0;
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const nextLiked = !p.isLiked;
          nextLikesCount = nextLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1);
          return {
            ...p,
            isLiked: nextLiked,
            likesCount: nextLikesCount,
          };
        }
        return p;
      })
    );

    if (detailPost && detailPost.id === postId) {
      setDetailPost((prev) =>
        prev
          ? {
              ...prev,
              isLiked: !prev.isLiked,
              likesCount: !prev.isLiked ? prev.likesCount + 1 : Math.max(0, prev.likesCount - 1),
            }
          : null
      );
    }

    try {
      await supabase.from('posts').update({ likes_count: nextLikesCount }).eq('id', postId);
    } catch (e) {
      console.warn('Supabase like sync notice:', e);
    }
  };

  // Save / Bookmark Post
  const handleSaveToggle = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, isSaved: !p.isSaved } : p))
    );
  };

  // Add Comment to Post
  const handleAddComment = async (postId: string, text: string) => {
    const newComment = {
      id: 'cm_' + Date.now(),
      user: {
        username: currentUser.username,
        fullName: currentUser.fullName,
        avatar: currentUser.avatar,
        department: currentUser.department,
        isVerified: currentUser.isVerified,
      },
      text,
      timestamp: 'Just now',
      likesCount: 0,
      isLiked: false,
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [...p.comments, newComment],
          };
        }
        return p;
      })
    );

    try {
      await supabase.from('post_comments').insert({
        id: newComment.id,
        post_id: postId,
        user_id: currentUser.id,
        company_id: currentCompany.id,
        text,
      });
    } catch (e) {
      console.warn('Supabase comment sync notice:', e);
    }
  };

  // Publish new Post
  const handlePublishPost = async (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev]);
    setActiveTab('home');

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // Ignore
    }

    try {
      await supabase.from('posts').insert({
        id: newPost.id,
        company_id: newPost.companyId,
        user_id: newPost.user.id,
        caption: newPost.caption,
        media: newPost.media,
        department: newPost.department,
        badge: newPost.badge,
        is_official_announcement: newPost.isOfficialAnnouncement || false,
        likes_count: newPost.likesCount,
        location: newPost.location,
      });
    } catch (e) {
      console.warn('Supabase post insert notice:', e);
    }
  };

  // Admin Delete Post
  const handleDeletePost = async (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    if (detailPost && detailPost.id === postId) {
      setDetailPost(null);
    }
    try {
      await supabase.from('posts').delete().eq('id', postId);
    } catch (e) {
      console.warn('Supabase post delete notice:', e);
    }
  };

  // Admin Add Employee
  const handleAddEmployee = async (newEmp: User) => {
    setUsers((prev) => [...prev, newEmp]);

    // Send auto-DM from veeraharikumaran2007@gmail.com (Admin) to the new employee
    const autoWelcomeMessage: Message = {
      id: 'dm_auto_' + Date.now(),
      senderId: 'u_admin_infynux',
      text: `Hello ${newEmp.fullName}! 👋 Welcome to ${currentCompany.name} Company Connect! 🎉\n\nYour employee workspace credentials have been provisioned by the admin (veeraharikumaran2007@gmail.com).\n• Username: @${newEmp.username}\n• Registered Email: ${newEmp.email}\n• Department: ${newEmp.department} (${newEmp.designation})\n\nYou can now share daily work updates, collaborate with teammates, and follow leadership broadcasts! Let's build greatness together! 🚀`,
      timestamp: 'Just now',
      isMine: false,
    };

    const newChat: ChatThread = {
      id: 'ch_' + newEmp.id,
      companyId: currentCompany.id,
      user: newEmp,
      lastMessage: autoWelcomeMessage.text,
      timestamp: 'Just now',
      unread: true,
      messages: [autoWelcomeMessage],
    };

    setChats((prev) => [newChat, ...prev]);

    try {
      await supabase.from('employees').insert({
        id: newEmp.id,
        company_id: newEmp.companyId,
        username: newEmp.username,
        full_name: newEmp.fullName,
        email: newEmp.email,
        password: newEmp.password,
        avatar: newEmp.avatar,
        role: newEmp.role,
        department: newEmp.department,
        designation: newEmp.designation,
        is_verified: true,
        followers_count: newEmp.followersCount,
        following_count: newEmp.followingCount,
        bio: newEmp.bio,
        achievements: newEmp.achievements,
      });
    } catch (e) {
      console.warn('Supabase employee insert notice:', e);
    }
  };

  // Admin Delete / Revoke Employee
  const handleDeleteEmployee = async (empId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== empId));
    try {
      await supabase.from('employees').delete().eq('id', empId);
    } catch (e) {
      console.warn('Supabase employee delete notice:', e);
    }
  };

  // Admin Update Employee Profile, Picture, Department & PIN
  const handleUpdateEmployee = async (empId: string, updated: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === empId ? { ...u, ...updated } : u))
    );
    if (currentUser.id === empId) {
      setCurrentUser((prev) => ({ ...prev, ...updated }));
    }

    try {
      await supabase.from('employees').update({
        full_name: updated.fullName,
        username: updated.username,
        department: updated.department,
        designation: updated.designation,
        role: updated.role,
        avatar: updated.avatar,
        password: updated.password,
      }).eq('id', empId);
    } catch (e) {
      console.warn('Supabase employee update notice:', e);
    }
  };

  // Admin Post Announcement
  const handlePostAnnouncement = async (ann: Announcement) => {
    setAnnouncements((prev) => [ann, ...prev]);
    try {
      await supabase.from('announcements').insert({
        id: ann.id,
        company_id: ann.companyId,
        title: ann.title,
        content: ann.content,
        author: ann.author,
        author_role: ann.authorRole,
        type: ann.type,
      });
    } catch (e) {
      console.warn('Supabase announcement insert notice:', e);
    }
  };

  // Workspace Switcher
  const handleSelectCompany = (comp: Company) => {
    setCurrentCompany(comp);
    const compUser = users.find((u) => u.companyId === comp.id);
    if (compUser) {
      setCurrentUser(compUser);
    }
    setActiveTab('home');
  };

  // Register New Company
  const handleRegisterCompany = (newComp: Company) => {
    setCompanies((prev) => [...prev, newComp]);
    
    const newAdmin: User = {
      id: 'admin_' + newComp.id,
      companyId: newComp.id,
      username: 'admin_' + newComp.slug,
      fullName: 'Admin (' + newComp.name + ')',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      role: 'admin',
      department: 'Leadership',
      designation: 'Workspace Administrator',
      isVerified: true,
      followersCount: 1,
      followingCount: 0,
      bio: `Workspace Administrator at ${newComp.name}. Managing private company network.`,
    };

    setUsers((prev) => [...prev, newAdmin]);
    setCurrentCompany(newComp);
    setCurrentUser(newAdmin);
    setActiveTab('admin-dashboard');

    try {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    } catch (e) {}
  };

  const handleLogin = (user: User, company: Company) => {
    setCurrentCompany(company);
    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('company_connect_auth', 'true');
    localStorage.setItem('company_connect_user_id', user.id);
    localStorage.setItem('company_connect_user', JSON.stringify(user));
    setActiveTab('home');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('company_connect_auth');
    localStorage.removeItem('company_connect_user_id');
    localStorage.removeItem('company_connect_user');
  };

  const handleUpdateUser = (updated: Partial<User>) => {
    setCurrentUser((prev) => {
      const updatedUser = { ...prev, ...updated };
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === prev.id ? updatedUser : u))
      );
      localStorage.setItem('company_connect_user', JSON.stringify(updatedUser));
      try {
        supabase.from('employees').update({
          full_name: updatedUser.fullName,
          username: updatedUser.username,
          designation: updatedUser.designation,
          bio: updatedUser.bio,
          avatar: updatedUser.avatar,
        }).eq('id', updatedUser.id).then();
      } catch (e) {
        console.warn('Supabase update notice:', e);
      }
      return updatedUser;
    });
  };

  // If not authenticated, display the dedicated clean Login Page!
  if (!isAuthenticated) {
    return (
      <LoginPage
        companies={companies}
        currentCompany={currentCompany}
        users={users}
        onLogin={handleLogin}
        onRegisterEmployee={(newEmp, comp) => {
          setUsers((prev) => [...prev, newEmp]);
          handleLogin(newEmp, comp);
        }}
        onOpenRegisterWorkspace={() => setIsWorkspaceModalOpen(true)}
      />
    );
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-white text-neutral-800 flex flex-col md:flex-row transition-colors duration-200">
      {/* Desktop Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'profile') setViewingUser(null);
          handleTabChange(tab);
        }}
        openCreateModal={() => setIsCreateOpen(true)}
        openWorkspaceModal={() => setIsWorkspaceModalOpen(true)}
        currentUser={currentUser}
        currentCompany={currentCompany}
        isDark={isDark}
        setIsDark={setIsDark}
        unreadMessagesCount={0}
        unreadNotificationsCount={announcements.length}
        allUsers={users}
        onSwitchUser={(u) => {
          setCurrentUser(u);
          localStorage.setItem('company_connect_user', JSON.stringify(u));
          localStorage.setItem('company_connect_user_id', u.id);
        }}
        onLogout={handleLogout}
      />

      {/* Mobile Header & Bottom Navigation */}
      <MobileNav
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'profile') setViewingUser(null);
          handleTabChange(tab);
        }}
        openCreateModal={() => setIsCreateOpen(true)}
        currentUser={currentUser}
        unreadMessagesCount={0}
        unreadNotificationsCount={announcements.length}
      />

      {/* Search & Notifications Drawers */}
      <SearchDrawer
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        users={companyEmployees}
        onSelectUser={(u) => {
          setViewingUser(u);
          setActiveTab('profile');
          setIsSearchOpen(false);
        }}
      />

      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        announcements={companyAnnouncements}
        posts={companyPosts}
        users={companyEmployees}
      />

      {/* Workspace Switcher Modal */}
      <WorkspaceSwitcherModal
        isOpen={isWorkspaceModalOpen}
        onClose={() => setIsWorkspaceModalOpen(false)}
        companies={companies}
        currentCompany={currentCompany}
        onSelectCompany={handleSelectCompany}
        onRegisterCompany={handleRegisterCompany}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 w-full max-w-full min-w-0 md:ml-18 xl:ml-64 pt-16 md:pt-4 pb-16 md:pb-6 px-1.5 sm:px-4 flex flex-col items-center overflow-x-hidden">
        {/* VIEW 1: COMPANY FEED */}
        {activeTab === 'home' && (
          <div className="w-full max-w-[975px] flex justify-center mx-auto">
            {/* Center Feed Column */}
            <div className="w-full max-w-[470px] flex-shrink-0">
              {/* Official Announcements Top Pin */}
              <AnnouncementBanner announcements={companyAnnouncements} />

              {/* Department Feed Filter */}
              <DepartmentFilter
                selectedDepartment={selectedDepartment}
                onSelectDepartment={setSelectedDepartment}
              />

              {/* Daily Work Stories Tray */}
              <div className="mb-4 bg-white border border-rose-100 rounded-2xl shadow-sm">
                <StoriesTray
                  stories={companyStories}
                  currentUser={currentUser}
                  onSelectStory={(idx) => setActiveStoryIndex(idx)}
                  openCreateModal={() => setIsCreateOpen(true)}
                />
              </div>

              {/* Work Posts Feed */}
              <div className="space-y-4">
                {filteredPosts.length === 0 ? (
                  <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-8 text-center">
                    <p 
                      className="text-xs text-neutral-400"
                      style={{ fontFamily: '"Times New Roman", Times, serif' }}
                    >
                      No updates found for {selectedDepartment} department in {currentCompany.name}.
                    </p>
                    <button
                      onClick={() => setIsCreateOpen(true)}
                      className="mt-3 text-xs font-bold text-amber-500 hover:underline"
                      style={{ fontFamily: '"Times New Roman", Times, serif' }}
                    >
                      + Share the first update
                    </button>
                  </div>
                ) : (
                  filteredPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      currentUser={currentUser}
                      onLikeToggle={handleLikeToggle}
                      onSaveToggle={handleSaveToggle}
                      onAddComment={handleAddComment}
                      onOpenCommentsModal={(p) => setDetailPost(p)}
                      onDeletePost={handleDeletePost}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Desktop Suggestions & Workspace Sidebar */}
            <SuggestionsSidebar
              currentUser={currentUser}
              currentCompany={currentCompany}
              colleagues={companyEmployees.filter((u) => u.id !== currentUser.id)}
              onOpenProfile={() => setActiveTab('profile')}
              openWorkspaceModal={() => setIsWorkspaceModalOpen(true)}
              onOpenDirectory={() => setActiveTab('employees-directory')}
            />
          </div>
        )}

        {/* VIEW 2: ADMIN DASHBOARD (Strictly guarded for Admin Role only) */}
        {activeTab === 'admin-dashboard' && currentUser.role === 'admin' && (
          <AdminDashboard
            currentCompany={currentCompany}
            currentUser={currentUser}
            employees={companyEmployees}
            posts={companyPosts}
            announcements={companyAnnouncements}
            onAddEmployee={handleAddEmployee}
            onUpdateEmployee={handleUpdateEmployee}
            onDeleteEmployee={handleDeleteEmployee}
            onPostAnnouncement={handlePostAnnouncement}
            onDeletePost={handleDeletePost}
            onSwitchUser={(user) => {
              setCurrentUser(user);
              setActiveTab('home');
            }}
          />
        )}

        {/* VIEW 3: EMPLOYEES DIRECTORY */}
        {activeTab === 'employees-directory' && (
          <EmployeeDirectory
            currentCompany={currentCompany}
            employees={companyEmployees}
            onSelectEmployee={(emp) => {
              setViewingUser(emp);
              setActiveTab('profile');
            }}
          />
        )}

        {/* VIEW 4: EXPLORE WORK */}
        {activeTab === 'explore' && (
          <ExploreGrid onSelectPost={(p) => setDetailPost(p)} />
        )}

        {/* VIEW 5: WORK REELS / CLIPS */}
        {activeTab === 'reels' && <ReelsViewer />}

        {/* VIEW 6: DIRECT COMMS / MESSAGES */}
        {activeTab === 'messages' && (
          <DirectMessages 
            currentUser={currentUser} 
            chats={chats} 
            colleagues={companyEmployees} 
          />
        )}

        {/* VIEW 7: EMPLOYEE PROFILE */}
        {activeTab === 'profile' && (
          <ProfileView
            currentUser={currentUser}
            viewingUser={viewingUser}
            userPosts={myPosts.length > 0 ? myPosts : companyPosts}
            savedPosts={savedPosts}
            onSelectPost={(p) => setDetailPost(p)}
            openCreateModal={() => setIsCreateOpen(true)}
            onUpdateUser={handleUpdateUser}
          />
        )}
      </main>

      {/* Story Player Modal */}
      {activeStoryIndex !== null && (
        <StoryViewerModal
          stories={companyStories}
          initialUserIndex={activeStoryIndex}
          onClose={() => setActiveStoryIndex(null)}
          onStorySeen={() => {}}
        />
      )}

      {/* Post Detail & Comments Modal */}
      {detailPost && (
        <PostDetailModal
          post={detailPost}
          currentUser={currentUser}
          onClose={() => setDetailPost(null)}
          onLikeToggle={handleLikeToggle}
          onSaveToggle={handleSaveToggle}
          onAddComment={handleAddComment}
        />
      )}

      {/* Create Work Post Modal */}
      {isCreateOpen && (
        <CreatePostModal
          currentUser={currentUser}
          onClose={() => setIsCreateOpen(false)}
          onPublishPost={handlePublishPost}
        />
      )}
    </div>
  );
};

export default App;
