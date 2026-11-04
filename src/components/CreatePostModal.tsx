import React, { useState } from 'react';
import { X, Image as ImageIcon, ArrowLeft, Award } from 'lucide-react';
import { Post, User } from '../types';

interface CreatePostModalProps {
  currentUser: User;
  onClose: () => void;
  onPublishPost: (newPost: Post) => void;
}

const WORK_PRESET_PHOTOS = [
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
];

const BADGES = [
  'Daily Standup',
  'Sprint Milestone',
  'Shipped to Prod',
  'Bug Solved',
  'Team Win',
  'Official Announcement',
] as const;

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  currentUser,
  onClose,
  onPublishPost,
}) => {
  const [step, setStep] = useState<'upload' | 'edit'>('upload');
  const [selectedImage, setSelectedImage] = useState<string>(WORK_PRESET_PHOTOS[0]);
  const [caption, setCaption] = useState<string>('');
  const [department, setDepartment] = useState<string>(currentUser.department);
  const [badge, setBadge] = useState<typeof BADGES[number]>('Sprint Milestone');
  const [location, setLocation] = useState<string>('Infynux HQ • Tech Hub');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setStep('edit');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUsePreset = (url: string) => {
    setSelectedImage(url);
    setStep('edit');
  };

  const handleShare = () => {
    const newPost: Post = {
      id: 'post_' + Date.now(),
      companyId: currentUser.companyId,
      user: currentUser,
      media: [selectedImage],
      caption: caption || 'Completed today\'s sprint deliverables and code reviews! 💻✨ #Infynux #DailyUpdate',
      department: department,
      badge: badge,
      isOfficialAnnouncement: badge === 'Official Announcement',
      likesCount: 1,
      isLiked: true,
      isSaved: false,
      location: location,
      timestamp: 'JUST NOW',
      comments: [],
    };

    onPublishPost(newPost);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 md:p-6">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-neutral-300 p-2 z-50"
      >
        <X size={28} />
      </button>

      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl overflow-hidden max-w-3xl w-full flex flex-col shadow-2xl border border-rose-100 animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-rose-100 flex items-center justify-between bg-rose-50/40">
          {step === 'edit' ? (
            <button
              onClick={() => setStep('upload')}
              className="text-rose-600 hover:text-rose-800 flex items-center gap-1 text-xs font-bold"
            >
              <ArrowLeft size={16} /> Back
            </button>
          ) : (
            <div className="w-12" />
          )}

          <h2 
            className="font-bold text-xs text-neutral-900 text-center"
            style={{ fontFamily: '"Times New Roman", Times, serif' }}
          >
            {step === 'upload' ? 'Share Daily Work Activity / Milestone' : 'Details & Achievement Tag'}
          </h2>

          {step === 'edit' ? (
            <button
              onClick={handleShare}
              className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold text-xs px-4 py-1.5 rounded-xl transition shadow"
              style={{ fontFamily: '"Times New Roman", Times, serif' }}
            >
              Share to Feed
            </button>
          ) : (
            <div className="w-12" />
          )}
        </div>

        {/* Step 1: Upload or Choose Workplace Screenshot */}
        {step === 'upload' && (
          <div className="p-8 flex flex-col items-center justify-center min-h-[400px] text-center bg-white">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center mb-4 text-rose-600 shadow-xs">
              <ImageIcon size={32} />
            </div>

            <h3 
              className="text-base font-bold text-neutral-900 mb-1"
              style={{ fontFamily: '"Times New Roman", Times, serif' }}
            >
              Select Work Screenshot or Milestone Photo
            </h3>
            <p className="text-xs text-neutral-500 mb-5 max-w-sm">
              Share project updates, sprint accomplishments, bug fixes, or team events with your colleagues.
            </p>

            <label 
              className="bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer transition shadow mb-6"
              style={{ fontFamily: '"Times New Roman", Times, serif' }}
            >
              Upload from computer
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {/* Presets */}
            <div className="w-full mt-2 border-t border-rose-100 pt-4">
              <p 
                className="text-[11px] text-rose-500 font-bold mb-3"
                style={{ fontFamily: '"Times New Roman", Times, serif' }}
              >
                Or choose a sample workplace photo:
              </p>
              <div className="flex items-center justify-center gap-3 overflow-x-auto pb-2">
                {WORK_PRESET_PHOTOS.map((photo, i) => (
                  <img
                    key={i}
                    src={photo}
                    alt="Preset"
                    onClick={() => handleUsePreset(photo)}
                    className="w-16 h-16 rounded-xl object-cover cursor-pointer hover:scale-105 hover:ring-2 hover:ring-rose-500 transition shadow"
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Edit Form */}
        {step === 'edit' && (
          <div className="flex flex-col md:flex-row h-[480px] bg-white">
            {/* Left: Image preview */}
            <div className="w-full md:w-3/5 bg-neutral-900 flex items-center justify-center overflow-hidden">
              <img
                src={selectedImage}
                alt="Selected preview"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right: Caption & Badges */}
            <div className="w-full md:w-2/5 p-4 flex flex-col justify-between overflow-y-auto bg-white">
              <div className="space-y-4">
                {/* Employee badge */}
                <div className="flex items-center gap-3">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.username}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-rose-200"
                  />
                  <div>
                    <span 
                      className="font-bold text-xs text-neutral-900 block"
                      style={{ fontFamily: '"Times New Roman", Times, serif' }}
                    >
                      {currentUser.fullName}
                    </span>
                    <span className="text-[10px] text-neutral-400">
                      {currentUser.department} • {currentUser.designation}
                    </span>
                  </div>
                </div>

                {/* Caption input */}
                <div>
                  <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                    Work Description / Milestone
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe your daily task or milestone..."
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="w-full bg-rose-50/50 border border-rose-100 rounded-xl p-2.5 text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-rose-400 resize-none"
                  />
                </div>

                {/* Department Selector */}
                <div>
                  <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-rose-50/50 border border-rose-100 rounded-xl px-3 py-2 text-xs text-neutral-800 focus:outline-none focus:ring-1 focus:ring-rose-400 font-medium"
                  >
                    <option value="Engineering">Engineering 💻</option>
                    <option value="Design">Design 🎨</option>
                    <option value="Product">Product 🚀</option>
                    <option value="Marketing">Marketing 📈</option>
                    <option value="HR">People / HR 👥</option>
                    <option value="Leadership">Leadership 👔</option>
                  </select>
                </div>

                {/* Achievement Badge */}
                <div>
                  <label className="text-[11px] font-semibold text-neutral-600 block mb-1 flex items-center gap-1">
                    <Award size={13} className="text-rose-600" />
                    Achievement / Status Badge
                  </label>
                  <select
                    value={badge}
                    onChange={(e) => setBadge(e.target.value as any)}
                    className="w-full bg-rose-50/50 border border-rose-100 rounded-xl px-3 py-2 text-xs text-neutral-800 focus:outline-none focus:ring-1 focus:ring-rose-400 font-medium"
                  >
                    {BADGES.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="text-[10px] text-neutral-400 pt-2 border-t border-rose-100">
                🔒 Stays private inside {currentUser.companyId === 'c1' ? 'Infynux Solutions' : 'Company'} workspace.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
