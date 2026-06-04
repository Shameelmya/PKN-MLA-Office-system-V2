import { useState, useEffect, FormEvent } from 'react';
import { Shield, ChevronRight, User as UserIcon, Key } from 'lucide-react';
import { User as UserType } from '../types';
import { ISLAMIC_QUOTES } from '../utils/constants';
import { LiveClock } from '../components/Shared/LiveClock';

interface LoginScreenProps {
  onLogin: (user: UserType) => void;
  users: UserType[];
}

export function LoginScreen({ onLogin, users }: LoginScreenProps) {
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [showPass, setShowPass] = useState(false);

  const activeUsers = users.filter(u => u.enabled);

  // Auto rotate quotes dynamically based on translation text length to give proper gap
  useEffect(() => {
    const currentText = ISLAMIC_QUOTES[quoteIdx]?.malayalam || '';
    // Scaled gap: 90ms per character plus a baseline of 6 seconds (6000ms)
    const readDelay = Math.max(6000, currentText.length * 90);
    
    const timer = setTimeout(() => {
      setQuoteIdx(prev => (prev + 1) % ISLAMIC_QUOTES.length);
    }, readDelay);
    
    return () => clearTimeout(timer);
  }, [quoteIdx]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!selectedUser) {
      setError('Please select a profile to continue');
      return;
    }

    if (selectedUser.pass === password) {
      onLogin(selectedUser);
    } else {
      setError('Incorrect Password. Please check and try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F6FA] flex flex-col justify-start items-center font-sans">
      
      {/* Top Header Banner: Islamic scripture & translation with extremely elegant & compact design */}
      <div className="w-full bg-[#0B1528] pt-10 pb-4 px-4 text-center text-[#94A3B8] border-b border-slate-900 shadow-md select-none">
        <div className="max-w-4xl mx-auto space-y-1 transition-all duration-500 animate-in fade-in">
          {/* Elegant Arabic verse, small size, matched color with Malaylam translation */}
          <h1 
            className="text-sm sm:text-base md:text-2xl text-[#94A3B8] leading-relaxed font-normal tracking-wide text-center" 
            style={{ fontFamily: "'Scheherazade New', serif", direction: 'rtl' }}
          >
            {ISLAMIC_QUOTES[quoteIdx].arabic}
          </h1>
          
          {/* Malayalam meaning translation, 'Anek Malayalam' regular and small text */}
          <p 
            className="text-[10px] sm:text-xs md:text-sm text-[#94A3B8] max-w-2xl mx-auto leading-normal font-normal min-h-[28px] sm:min-h-[18px] flex items-center justify-center mt-2"
            style={{ fontFamily: "'Anek Malayalam', sans-serif" }}
          >
            {ISLAMIC_QUOTES[quoteIdx].malayalam}
          </p>
        </div>
      </div>

      {/* Main Content Area - Stacked perfectly underneath banner */}
      <div className="flex-1 w-full flex items-center justify-center p-4 sm:p-6 md:p-8">
        
        {/* Main Login Card Wrapper */}
        <div className="bg-white rounded-[24px] shadow-2xl border border-slate-100 max-w-4xl w-full overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[300px] transition-all">
          
          {/* Left Column: Purple Brand Identity Block (no metrics) */}
          <div className="md:col-span-5 col-span-1 bg-gradient-to-br from-[#1E256F] to-[#121544] text-white p-6 sm:p-8 md:p-10 flex flex-col justify-between relative overflow-hidden">
            
            {/* Geometric wireframe layout graphics */}
            <div className="absolute inset-0 opacity-15 pointer-events-none">
              <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full border border-white/20"></div>
              <div className="absolute -top-16 -right-16 w-60 h-60 rounded-full border border-white/10"></div>
              <div className="absolute -bottom-12 -left-12 w-36 h-36 rounded-full border border-white/10"></div>
            </div>

            <div className="relative z-10 space-y-4">
              {/* Profile icon badge */}
              <div className="bg-white/10 backdrop-blur-md border border-white/10 h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg">
                <UserIcon size={26} className="text-[#969FE7]" />
              </div>
              
              <div className="space-y-1">
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                  MLA Office Management
                </h2>
                <p className="text-xs sm:text-sm font-semibold text-slate-300/90 tracking-wide">
                  PK Navas • Tanur Constituency
                </p>
              </div>
            </div>

            {/* Date-time element inside a pill near the bottom */}
            <div className="relative z-10 my-10">
              <div className="inline-flex items-center gap-2 bg-black/30 border border-white/10 px-4 py-2.5 rounded-xl font-bold text-xs text-white/95 shadow-inner w-full justify-center">
                <LiveClock className="text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2" />
              </div>
            </div>

            {/* Copyright badge at bottom */}
            <div className="relative z-10 text-[9px] sm:text-[10px] font-black uppercase text-slate-400 tracking-widest border-t border-white/10 pt-4">
              <span>© 2026 SECURE SYSTEM</span>
            </div>

          </div>

          {/* Right Column: Profile Selector or Password Entrance */}
          <div className="md:col-span-7 p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-center bg-[#FAFBFC]">
            <div className="w-full">
              
              {/* Profile Cards Selection Grid */}
              {!selectedUser ? (
                <div className="space-y-6">
                  {/* Exact header spacing and bold style */}
                  <div className="mb-6 text-left">
                    <h3 className="text-2xl font-black text-[#1E293B] tracking-tight leading-tight">
                      Select Staff Profile
                    </h3>
                  </div>

                  {/* Profile Cards list - exact match with 2-column gap-2 spacing */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeUsers.map(u => {
                      const isAdmin = u.role === 'admin';
                      return (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => {
                            setSelectedUser(u);
                            setPassword('');
                            setError('');
                          }}
                          className={`w-full p-4 flex items-center gap-3 border rounded-[24px] text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer ${
                            isAdmin 
                              ? 'bg-[#EBF5FF] border-[#BFDBFE] hover:bg-[#E1F0FF] hover:border-[#93C5FD]' 
                              : 'bg-white border-[#E2E8F0] hover:bg-slate-50/50 hover:border-slate-350'
                          }`}
                        >
                          {/* Profile rounded icon area matching exactly */}
                          <div className={`h-10 w-10 rounded-[16px] flex items-center justify-center shrink-0 shadow-sm ${
                            isAdmin ? 'bg-blue-600 text-white' : 'bg-[#EBF5FF] text-[#2563EB]'
                          }`}>
                            {isAdmin ? <Shield size={18} /> : <UserIcon size={18} />}
                          </div>
                          
                          {/* Profile name and tag details */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm sm:text-base font-extrabold text-[#1E293B] tracking-tight whitespace-normal break-words leading-tight mb-1">
                              {u.name}
                            </p>
                            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block font-sans">
                              {isAdmin ? 'Super Admin' : 'Officer Login'}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Password Entrance Frame (Exact Match to Screens) */
                <div className="space-y-6 animate-in fade-in duration-300">
                  
                  {/* Pill Back Button */}
                  <div className="flex justify-start">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedUser(null);
                        setPassword('');
                        setError('');
                      }}
                      className="bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all px-3 py-1.5 rounded-lg text-xs font-bold font-sans cursor-pointer tracking-wide border border-blue-100"
                    >
                      Back to profiles
                    </button>
                  </div>

                  {/* Profile Indicator Card */}
                  <div className="bg-white border border-slate-150 p-4 rounded-2xl flex items-center gap-4 shadow-sm">
                    <div className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0 bg-blue-600 text-white">
                      {selectedUser.role === 'admin' ? <Shield size={20} /> : <UserIcon size={20} />}
                    </div>
                    <div className="text-left">
                      <h4 className="font-extrabold text-slate-800 text-base leading-tight">
                        {selectedUser.name}
                      </h4>
                      <p className="text-xs font-medium text-slate-400 mt-0.5 font-sans">
                        Enter your secure passcode
                      </p>
                    </div>
                  </div>

                  {/* Error Notification Alert */}
                  {error && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-xl text-xs font-bold leading-normal">
                      {error}
                    </div>
                  )}

                  {/* Password Entry Area */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                      {/* Big placeholder bullet code input */}
                      <input 
                        type={showPass ? 'text' : 'password'} 
                        placeholder="••••••••••••" 
                        value={password} 
                        onChange={e => {
                          setPassword(e.target.value);
                          setError('');
                        }}
                        autoFocus
                        className="w-full px-5 py-4 bg-blue-50/20 border border-blue-100 rounded-2xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#1E256F] focus:border-[#1E256F] transition-all text-base tracking-widest text-center sm:text-left shadow-sm" 
                      />
                      
                      {password && (
                        <button 
                          type="button" 
                          onClick={() => setShowPass(!showPass)} 
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-indigo-600 hover:text-indigo-800 outline-none cursor-pointer"
                        >
                          {showPass ? 'Hide' : 'Show'}
                        </button>
                      )}
                    </div>

                    {/* Submit Login action */}
                    <button 
                      type="submit" 
                      className="w-full bg-[#0F172A] hover:bg-[#1E293B] active:bg-[#020617] text-white font-extrabold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs sm:text-sm uppercase tracking-wider cursor-pointer shadow-md"
                    >
                      <span>Secure Login</span>
                      <ChevronRight size={16} />
                    </button>
                  </form>

                </div>
              )}

              {/* Spacing alignment */}
              <div className="pt-2"></div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

