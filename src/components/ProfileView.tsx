import React, { useState, useEffect, useRef } from 'react';
import { 
  Grid, 
  Film, 
  Bookmark, 
  Heart, 
  MessageCircle, 
  Award, 
  ShieldCheck, 
  Plus, 
  Camera, 
  Check 
} from 'lucide-react';
import { User, Post } from '../types';

interface ProfileViewProps {
  currentUser: User;
  userPosts: Post[];
  savedPosts: Post[];
  onSelectPost: (post: Post) => void;
  openCreateModal: () => void;
  onUpdateUser?: (updated: Partial<User>) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  userPosts,
  savedPosts,
  onSelectPost,
  openCreateModal,
  onUpdateUser,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'posts' | 'reels' | 'saved'>('posts');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [nameText, setNameText] = useState(currentUser.fullName);
  const [usernameText, setUsernameText] = useState(currentUser.username);
  const [designationText, setDesignationText] = useState(currentUser.designation);
  const [bioText, setBioText] = useState(currentUser.bio);
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatar);
  const [imgError, setImgError] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state whenever currentUser changes
  useEffect(() => {
    setNameText(currentUser.fullName);
    setUsernameText(currentUser.username);
    setDesignationText(currentUser.designation);
    setBioText(currentUser.bio);
    setAvatarUrl(currentUser.avatar);
    setImgError(false);
  }, [currentUser]);

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setAvatarUrl(result);
        setImgError(false);
        currentUser.avatar = result;
        if (onUpdateUser) {
          onUpdateUser({ avatar: result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    currentUser.fullName = nameText;
    currentUser.username = usernameText;
    currentUser.designation = designationText;
    currentUser.bio = bioText;
    currentUser.avatar = avatarUrl;
    
    if (onUpdateUser) {
      onUpdateUser({
        fullName: nameText,
        username: usernameText,
        designation: designationText,
        bio: bioText,
        avatar: avatarUrl,
      });
    }
    setIsEditingBio(false);
  };

  const displayedPosts = activeSubTab === 'saved' ? savedPosts : userPosts;

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 md:px-8 bg-white min-h-[85vh]">
      {/* Hidden file input for uploading photo */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
        {/* Large Avatar with Upload Photo Hover Badge */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="relative w-28 h-28 md:w-36 md:h-36 rounded-full p-[3px] bg-gradient-to-tr from-red-600 via-rose-500 to-pink-500 shadow-md shadow-rose-200 cursor-pointer group"
          title="Click to upload your photo"
        >
          <div className="w-full h-full rounded-full p-[3px] bg-white overflow-hidden flex items-center justify-center">
            {!imgError ? (
              <img
                src={avatarUrl}
                alt={currentUser.fullName}
                onError={() => setImgError(true)}
                className="w-full h-full rounded-full object-cover group-hover:scale-105 transition duration-300"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-red-600 to-pink-500 flex items-center justify-center text-white text-3xl font-bold font-serif">
                {currentUser.fullName.charAt(0)}
              </div>
            )}
          </div>

          {/* Camera Hover Overlay */}
          <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold">
            <Camera size={22} className="mb-0.5" />
            <span>Change Photo</span>
          </div>
        </div>

        {/* User Info & Controls */}
        <div className="flex-1 space-y-3.5 text-center md:text-left">
          {/* Top row */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            {isEditingBio ? (
              <input
                type="text"
                value={nameText}
                onChange={(e) => setNameText(e.target.value)}
                placeholder="Full Name"
                className="text-lg font-bold text-neutral-900 border border-rose-300 px-2 py-1 rounded-xl bg-rose-50/50"
              />
            ) : (
              <h1 
                className="text-xl font-bold text-neutral-900 flex items-center gap-2"
                style={{ fontFamily: '"Times New Roman", Times, serif' }}
              >
                {nameText}
                {currentUser.role === 'admin' ? (
                  <span className="text-[10px] bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                    <ShieldCheck size={12} /> Company Admin
                  </span>
                ) : (
                  <span className="text-[10px] bg-rose-50 text-rose-600 font-bold px-2.5 py-0.5 rounded-full border border-rose-200">
                    {currentUser.department}
                  </span>
                )}
              </h1>
            )}

            <div className="flex items-center gap-2">
              <button 
                onClick={isEditingBio ? handleSaveProfile : () => setIsEditingBio(true)}
                className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition border border-rose-200 flex items-center gap-1"
              >
                {isEditingBio ? <Check size={14} /> : null}
                {isEditingBio ? 'Save Profile' : 'Edit Profile'}
              </button>

              <button 
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold transition border border-rose-200 flex items-center gap-1"
              >
                <Camera size={14} /> Upload Photo
              </button>

              <button 
                onClick={openCreateModal}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white text-xs font-bold transition shadow-sm flex items-center gap-1"
                style={{ fontFamily: '"Times New Roman", Times, serif' }}
              >
                <Plus size={14} /> New Update
              </button>
            </div>
          </div>

          {/* Subtitle: username and designation */}
          {isEditingBio ? (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="flex items-center">
                <span className="text-neutral-400 mr-1">@</span>
                <input
                  type="text"
                  value={usernameText}
                  onChange={(e) => setUsernameText(e.target.value)}
                  placeholder="username"
                  className="px-2 py-0.5 text-xs rounded-lg border border-rose-200 bg-rose-50/40 w-28"
                />
              </div>
              <span className="text-neutral-400">•</span>
              <input
                type="text"
                value={designationText}
                onChange={(e) => setDesignationText(e.target.value)}
                placeholder="Designation / Title"
                className="px-2 py-0.5 text-xs rounded-lg border border-rose-200 bg-rose-50/40 flex-1 max-w-xs"
              />
            </div>
          ) : (
            <div className="text-xs text-neutral-500">
              @{currentUser.username} • <strong className="text-neutral-800">{currentUser.designation}</strong>
            </div>
          )}

          {/* Stats count */}
          <div className="flex items-center justify-center md:justify-start gap-8 text-xs">
            <span>
              <strong className="font-bold text-neutral-900">{userPosts.length}</strong> work updates
            </span>
            <span>
              <strong className="font-bold text-neutral-900">{currentUser.followersCount}</strong> colleagues
            </span>
            <span>
              <strong className="font-bold text-neutral-900">{currentUser.followingCount}</strong> following
            </span>
          </div>

          {/* Bio text */}
          <div className="text-xs leading-relaxed max-w-md">
            {isEditingBio ? (
              <textarea
                value={bioText}
                onChange={(e) => setBioText(e.target.value)}
                className="w-full mt-2 p-2.5 rounded-xl bg-rose-50/50 text-xs border border-rose-200 focus:outline-none"
                rows={3}
                placeholder="Enter bio..."
              />
            ) : (
              <p className="whitespace-pre-line text-neutral-700 mt-1">
                {bioText}
              </p>
            )}

            {/* Achievement Badges */}
            {currentUser.achievements && currentUser.achievements.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 mt-3">
                {currentUser.achievements.map((ach, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-md flex items-center gap-1"
                  >
                    <Award size={11} className="text-pink-500" /> {ach}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-12 border-b border-rose-100 text-xs font-semibold tracking-wider">
        <button
          onClick={() => setActiveSubTab('posts')}
          className={`flex items-center gap-2 py-3 border-t-2 -mt-[1px] transition ${
            activeSubTab === 'posts'
              ? 'border-rose-600 text-rose-600 font-bold'
              : 'border-transparent text-neutral-400 hover:text-rose-500'
          }`}
          style={{ fontFamily: '"Times New Roman", Times, serif' }}
        >
          <Grid size={15} />
          <span>WORK UPDATES</span>
        </button>

        <button
          onClick={() => setActiveSubTab('reels')}
          className={`flex items-center gap-2 py-3 border-t-2 -mt-[1px] transition ${
            activeSubTab === 'reels'
              ? 'border-rose-600 text-rose-600 font-bold'
              : 'border-transparent text-neutral-400 hover:text-rose-500'
          }`}
          style={{ fontFamily: '"Times New Roman", Times, serif' }}
        >
          <Film size={15} />
          <span>WORK CLIPS</span>
        </button>

        <button
          onClick={() => setActiveSubTab('saved')}
          className={`flex items-center gap-2 py-3 border-t-2 -mt-[1px] transition ${
            activeSubTab === 'saved'
              ? 'border-rose-600 text-rose-600 font-bold'
              : 'border-transparent text-neutral-400 hover:text-rose-500'
          }`}
          style={{ fontFamily: '"Times New Roman", Times, serif' }}
        >
          <Bookmark size={15} />
          <span>BOOKMARKED</span>
        </button>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-3 gap-1 md:gap-4 mt-6">
        {displayedPosts.length === 0 ? (
          <div className="col-span-3 py-16 text-center text-neutral-400 space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500">
              <Grid size={24} />
            </div>
            <p 
              className="text-sm font-semibold text-neutral-700"
              style={{ fontFamily: '"Times New Roman", Times, serif' }}
            >
              No work updates yet
            </p>
            <p className="text-xs text-neutral-400 max-w-xs mx-auto">
              Share milestones, code snippets, sprint wins, or design artifacts with your team.
            </p>
            <button
              onClick={openCreateModal}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold text-xs shadow-sm hover:from-red-700 hover:to-pink-700 transition"
              style={{ fontFamily: '"Times New Roman", Times, serif' }}
            >
              + Post First Update
            </button>
          </div>
        ) : (
          displayedPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => onSelectPost(post)}
              className="relative aspect-square group cursor-pointer overflow-hidden rounded-xl bg-neutral-100 border border-rose-100/60"
            >
              <img
                src={post.media[0]}
                alt="Post"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* Department badge top left */}
              <div className="absolute top-2 left-2 z-10">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-xs">
                  {post.department}
                </span>
              </div>

              {/* Hover overlay with likes/comments */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-bold text-sm">
                <div className="flex items-center gap-1.5">
                  <Heart size={18} fill="currentColor" />
                  <span>{post.likesCount}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MessageCircle size={18} fill="currentColor" />
                  <span>{post.comments.length}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
