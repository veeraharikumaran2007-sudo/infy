import { Company, User, UserStory, Post, Reel, ChatThread, Announcement } from './types';

export const INITIAL_COMPANIES: Company[] = [
  {
    id: 'c1',
    name: 'Infynux Solutions',
    slug: 'infynux',
    logo: '/infynux-logo.png',
    industry: 'Software & Cloud Engineering',
    employeeCount: 48,
  },
  {
    id: 'c2',
    name: 'Apex Innovations',
    slug: 'apex',
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=200&q=80',
    industry: 'FinTech & AI Systems',
    employeeCount: 32,
  },
];

export const INITIAL_USERS: User[] = [
  // --- INFYNUX SOLUTIONS (c1) ---
  {
    id: 'u_admin_infynux',
    companyId: 'c1',
    email: 'veeraharikumaran2007@gmail.com',
    password: 'hari@5213',
    username: 'yogeshwaran',
    fullName: 'Mr. D. Yogeshwaran',
    avatar: '/admin-yogeshwaran-avatar.png',
    role: 'admin',
    department: 'Leadership',
    designation: 'Founder & CEO, Infynux Solutions',
    isVerified: true,
    followersCount: 148,
    followingCount: 30,
    bio: 'Founder and CEO @ INFYNUX SOLUTIONS',
    website: 'https://infynuxsolutions.in',
    achievements: ['Founder & CEO', 'Company Admin', 'Shipped to Prod', 'Sprint MVP', '10x Contributor', 'Verified Access'],
  },

  // --- APEX INNOVATIONS (c2 - Isolated Multi-tenant Workspace) ---
  {
    id: 'u_admin_apex',
    companyId: 'c2',
    username: 'david_apex_admin',
    fullName: 'David Sterling',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    role: 'admin',
    department: 'Leadership',
    designation: 'Managing Director @ Apex',
    isVerified: true,
    followersCount: 65,
    followingCount: 15,
    bio: 'MD at Apex Innovations. All workspace data strictly confidential.',
    achievements: ['Executive Admin'],
  },
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann_1',
    companyId: 'c1',
    title: '🚀 Q4 Product Milestone Achieved Ahead of Schedule!',
    content: 'Massive shoutout to our Engineering & Design teams for shipping the Company Connect platform prototype! Celebration dinner this Friday at 6:30 PM.',
    author: 'Mr. D. Yogeshwaran (Founder & CEO)',
    authorRole: 'Founder & CEO, Infynux Solutions',
    timestamp: 'Today at 9:00 AM',
    type: 'urgent',
  },
  {
    id: 'ann_2',
    companyId: 'c1',
    title: '🌿 Annual Wellness Week & Mental Health Days Announced',
    content: 'HR is pleased to announce 2 additional recharge days next month. Check the People portal for complete guidelines and workshop schedules.',
    author: 'Priya Raman (Head of People)',
    authorRole: 'People & Culture',
    timestamp: 'Yesterday at 3:15 PM',
    type: 'general',
  },
  {
    id: 'ann_apex_1',
    companyId: 'c2',
    title: '🔒 Apex Innovations Workspace Initialized',
    content: 'Welcome all Apex employees to our private internal workspace.',
    author: 'David Sterling (Admin)',
    authorRole: 'Admin',
    timestamp: '2 days ago',
    type: 'general',
  },
];

export const INITIAL_POSTS: Post[] = [
  // --- INFYNUX SOLUTIONS POSTS (c1) ---
  {
    id: 'post_infynux_4',
    companyId: 'c1',
    user: INITIAL_USERS[0], // Mr. D. Yogeshwaran (Founder & CEO)
    media: [
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    ],
    caption: '📢 Official Announcement: Infynux has officially crossed 50 enterprise client deployments this quarter! Grateful for each employee dedication. Innovate. Integrate. Elevate. Keep building greatness together! 🚀 #Infynux #Leadership #CEO',
    department: 'Leadership',
    badge: 'Official Announcement',
    isOfficialAnnouncement: true,
    likesCount: 148,
    isLiked: true,
    isSaved: true,
    location: 'Executive Boardroom • Infynux HQ',
    timestamp: '1 HOUR AGO',
    comments: [],
  },

  // --- APEX INNOVATIONS POSTS (c2 - Isolated Workspace) ---
  {
    id: 'post_apex_1',
    companyId: 'c2',
    user: INITIAL_USERS[1], // David Sterling (Apex MD)
    media: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    ],
    caption: 'Welcome to Apex Innovations private internal portal. Strictly confidential financial tech updates will be shared here.',
    department: 'Leadership',
    badge: 'Official Announcement',
    isOfficialAnnouncement: true,
    likesCount: 14,
    isLiked: false,
    isSaved: false,
    timestamp: '1 DAY AGO',
    comments: [],
  },
];

export const INITIAL_STORIES: UserStory[] = [
  {
    id: 's_infy_ceo',
    companyId: 'c1',
    user: INITIAL_USERS[0], // Mr. D. Yogeshwaran
    seen: false,
    items: [
      {
        id: 'si_ceo_1',
        mediaUrl: '/admin-yogeshwaran.png',
        caption: 'Welcoming all teams to the Q4 Innovation Summit! 🚀',
        timestamp: '1h ago',
      },
    ],
  },
];

export const INITIAL_REELS: Reel[] = [
  {
    id: 'r_1',
    companyId: 'c1',
    user: INITIAL_USERS[0], // Mr. D. Yogeshwaran
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-typing-on-a-laptop-42998-large.mp4',
    caption: 'Infynux Solutions Vision 2026. Empowering businesses through innovation and collaboration. 💼✨ #Infynux #Vision',
    likesCount: 124,
    commentsCount: 22,
    sharesCount: 38,
    audioTitle: 'Infynux Theme • Leadership Vision',
    isLiked: true,
    isSaved: true,
  },
];

export const INITIAL_CHATS: ChatThread[] = [
  {
    id: 'ch_2',
    companyId: 'c1',
    user: INITIAL_USERS[0], // Mr. D. Yogeshwaran
    lastMessage: 'Great progress on the Company Connect platform Mohan!',
    timestamp: '15m',
    unread: true,
    messages: [
      { id: 'm4', senderId: 'u_admin_infynux', text: 'Mohan, let’s showcase Company Connect during the townhall!', timestamp: '9:00 AM', isMine: false },
      { id: 'm5', senderId: 'u_emp_mohan', text: 'Yes Yogeshwaran sir! All features are ready and 100% functional.', timestamp: '9:05 AM', isMine: true },
      { id: 'm6', senderId: 'u_admin_infynux', text: 'Great progress on the Company Connect platform Mohan!', timestamp: '9:10 AM', isMine: false },
    ],
  },
];

export const EXPLORE_ITEMS = [
  { id: 'e1', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80', likes: 45, comments: 8, isReel: false, dept: 'Engineering' },
  { id: 'e2', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80', likes: 62, comments: 14, isReel: false, dept: 'Design' },
];
