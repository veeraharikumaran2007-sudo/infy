export type UserRole = 'admin' | 'employee';

export interface Company {
  id: string;
  name: string;
  slug: string;
  logo: string;
  industry: string;
  employeeCount: number;
}

export interface User {
  id: string;
  companyId: string;
  email?: string;
  password?: string;
  username: string;
  fullName: string;
  avatar: string;
  role: UserRole;
  department: 'Engineering' | 'Design' | 'Marketing' | 'Product' | 'HR' | 'Leadership';
  designation: string;
  isVerified?: boolean;
  followersCount: number;
  followingCount: number;
  bio: string;
  website?: string;
  isFollowing?: boolean;
  achievements?: string[];
}

export interface Announcement {
  id: string;
  companyId: string;
  title: string;
  content: string;
  author: string;
  authorRole: string;
  timestamp: string;
  type: 'urgent' | 'general' | 'event';
}

export interface StoryItem {
  id: string;
  mediaUrl: string;
  duration?: number;
  timestamp: string;
  caption?: string;
}

export interface UserStory {
  id: string;
  companyId: string;
  user: User;
  items: StoryItem[];
  seen: boolean;
}

export interface Comment {
  id: string;
  user: {
    username: string;
    fullName?: string;
    avatar: string;
    department?: string;
    isVerified?: boolean;
  };
  text: string;
  timestamp: string;
  likesCount: number;
  isLiked?: boolean;
}

export interface Post {
  id: string;
  companyId: string;
  user: User;
  media: string[];
  caption: string;
  department: string;
  badge?: 'Daily Standup' | 'Sprint Milestone' | 'Shipped to Prod' | 'Bug Solved' | 'Team Win' | 'Official Announcement';
  isOfficialAnnouncement?: boolean;
  likesCount: number;
  isLiked: boolean;
  isSaved: boolean;
  comments: Comment[];
  timestamp: string;
  location?: string;
  filter?: string;
}

export interface Reel {
  id: string;
  companyId: string;
  user: User;
  videoUrl: string;
  caption: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  audioTitle: string;
  isLiked: boolean;
  isSaved: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isMine: boolean;
}

export interface ChatThread {
  id: string;
  companyId: string;
  user: User;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  messages: Message[];
}

export type ActiveTab = 
  | 'home' 
  | 'search' 
  | 'explore' 
  | 'reels' 
  | 'messages' 
  | 'notifications' 
  | 'create' 
  | 'profile' 
  | 'admin-dashboard' 
  | 'employees-directory';
