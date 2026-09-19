import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { uploadService } from '../../services/uploadService';
import { UserRole } from '../../types';
import { INDIAN_STATES, STATE_DISTRICTS_MAP } from '../../data/indiaLocations';
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Tractor,
  Wrench,
  Calendar,
  Sparkles,
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';

const PHONE_REGEX = /^[6-9]\d{9}$/;
const NAME_REGEX = /^[a-zA-Z\s'.]{2,50}$/;

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('FARMER');
  const [selectedState, setSelectedState] = useState('Maharashtra');
  const [selectedDistrict, setSelectedDistrict] = useState('Chhatrapati Sambhajinagar');
  const [avatar, setAvatar] = useState('');

  // Status states
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [comingSoonToast, setComingSoonToast] = useState<string | null>(null);

  const showComingSoon = (feature: string) => {
    setComingSoonToast(feature);
    setTimeout(() => setComingSoonToast(null), 3000);
  };

  // Initialize form with current user data
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setRole(user.role || 'FARMER');
      setAvatar(user.avatar || '');

      // Parse user.location ("District, State" or just "State")
      if (user.location) {
        const parts = user.location.split(',').map(s => s.trim());
        if (parts.length >= 2) {
          const possibleDistrict = parts[0];
          const possibleState = parts[1];
          if (INDIAN_STATES.includes(possibleState)) {
            setSelectedState(possibleState);
            setSelectedDistrict(possibleDistrict);
          } else if (INDIAN_STATES.includes(possibleDistrict)) {
            setSelectedState(possibleDistrict);
            setSelectedDistrict(possibleState);
          }
        } else if (INDIAN_STATES.includes(user.location)) {
          setSelectedState(user.location);
          const firstDist = STATE_DISTRICTS_MAP[user.location]?.[0] || '';
          setSelectedDistrict(firstDist);
        }
      }
    }
  }, [user]);

  // Handle State Change -> Update Districts
  const handleStateChange = (stateName: string) => {
    setSelectedState(stateName);
    const districts = STATE_DISTRICTS_MAP[stateName] || [];
    setSelectedDistrict(districts[0] || '');
  };

  // Handle Photo File Upload
  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image size must be less than 5 MB.');
      return;
    }

    try {
      setIsUploadingPhoto(true);
      setErrorMessage(null);
      const urls = await uploadService.uploadImages([file]);
      if (urls && urls.length > 0) {
        setAvatar(urls[0]);
        setSuccessMessage('Photo uploaded! Click "Save Changes" to apply.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to upload photo. Please try again.');
    } finally {
      setIsUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Generate new DiceBear Avatar
  const handleGenerateAvatar = () => {
    const seed = `${name || 'farmer'}_${Date.now()}`;
    const newAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;
    setAvatar(newAvatar);
    setSuccessMessage('New avatar generated! Click "Save Changes" to apply.');
  };

  // Validate form inputs
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    const trimmedName = name.trim();
    if (!trimmedName) {
      newErrors.name = 'Full name is required.';
    } else if (!NAME_REGEX.test(trimmedName)) {
      newErrors.name = 'Name must be between 2 and 50 characters with letters only.';
    }

    const sanitizedPhone = phone.replace(/^(\+91|91)/, '').replace(/[\s\-\(\)]/g, '').trim();
    if (!sanitizedPhone) {
      newErrors.phone = 'Mobile number is required.';
    } else if (!PHONE_REGEX.test(sanitizedPhone)) {
      newErrors.phone = 'Enter a valid 10-digit Indian phone number.';
    }

    if (!selectedState || !selectedDistrict) {
      newErrors.location = 'Please select both State and District.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit profile updates
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!validate()) return;

    try {
      setIsSaving(true);
      const sanitizedPhone = phone.replace(/^(\+91|91)/, '').replace(/[\s\-\(\)]/g, '').trim();
      const formattedLocation = `${selectedDistrict}, ${selectedState}`;

      await updateProfile({
        name: name.trim(),
        phone: sanitizedPhone,
        location: formattedLocation,
        role,
        avatar: avatar || undefined
      });

      setSuccessMessage('Your profile has been updated successfully!');
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-slate-600 mb-4">Please sign in to view your profile.</p>
          <Link to="/login" className="px-5 py-2.5 bg-[#166534] text-white rounded-lg font-bold">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const availableDistricts = STATE_DISTRICTS_MAP[selectedState] || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-emerald-50/20 to-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Back navigation & Page Title */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#166534] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-[#166534]">
            <ShieldCheck className="w-4 h-4" />
            <span>Verified Account</span>
          </div>
        </div>

        {/* Success Banner */}
        {successMessage && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 shadow-xs animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="text-sm font-medium">{successMessage}</p>
          </div>
        )}

        {/* Error Banner */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-center gap-3 shadow-xs animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <p className="text-sm font-medium">{errorMessage}</p>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          {/* Green Profile Header Banner with White Name & Badges */}
          <div className="bg-gradient-to-r from-[#166534] via-emerald-700 to-[#004C22] p-6 sm:p-8 text-white relative">
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                {/* Avatar Image with Camera Upload Button */}
                <div className="relative group shrink-0">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white p-1 shadow-xl ring-4 ring-white/30 overflow-hidden">
                    <div className="w-full h-full rounded-xl bg-emerald-100 flex items-center justify-center overflow-hidden">
                      {avatar ? (
                        <img
                          src={avatar}
                          alt={name || user.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || 'user')}`;
                          }}
                        />
                      ) : (
                        <span className="text-3xl font-extrabold text-[#166534]">
                          {(name || user.name || 'U').charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Camera Upload Button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingPhoto}
                    className="absolute -bottom-1 -right-1 p-2.5 rounded-xl bg-white text-[#166534] hover:bg-emerald-50 shadow-md transition-all group-hover:scale-105 disabled:opacity-50 border border-slate-200 cursor-pointer"
                    title="Upload profile picture"
                  >
                    {isUploadingPhoto ? (
                      <Loader2 className="w-4 h-4 animate-spin text-[#166534]" />
                    ) : (
                      <Camera className="w-4 h-4 text-[#166534]" />
                    )}
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                </div>

                {/* User Name in WHITE font on green layer */}
                <div className="space-y-1.5">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight drop-shadow-xs">
                    {name || user.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-white/20 text-white backdrop-blur-xs border border-white/20">
                      {role === 'EQUIPMENT_OWNER' ? <Wrench className="w-3.5 h-3.5 text-emerald-200" /> : <Tractor className="w-3.5 h-3.5 text-emerald-200" />}
                      <span>{role === 'EQUIPMENT_OWNER' ? 'Equipment Owner' : 'Farmer'}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-100 bg-black/15 px-2.5 py-1 rounded-lg border border-white/10">
                      <MapPin className="w-3.5 h-3.5 text-emerald-300" />
                      <span>{selectedDistrict ? `${selectedDistrict}, ${selectedState}` : user.location}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Photo Action Buttons on Green Layer */}
              <div className="flex items-center gap-2 self-start sm:self-center">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingPhoto}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-[#166534] hover:bg-emerald-50 shadow-sm transition-all inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-[#166534]" />
                  <span>Upload Photo</span>
                </button>
                <button
                  type="button"
                  onClick={handleGenerateAvatar}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/15 hover:bg-white/25 text-white border border-white/30 backdrop-blur-xs transition-all inline-flex items-center gap-1.5 cursor-pointer"
                  title="Generate a unique avatar"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
                  <span>Random Avatar</span>
                </button>
              </div>
            </div>
          </div>

          {/* Profile Edit Form */}
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">

              <div>
                <h2 className="text-base font-bold text-slate-900">Personal Information</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update your account details and machinery preferences registered on KrushiConnect.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                      }}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-medium bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#166534] transition-all ${
                        errors.name ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'
                      }`}
                      placeholder="e.g. Ramesh Patel"
                    />
                  </div>
                  {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                </div>

                {/* Email (Readonly) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Email Address
                    </label>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Verified
                    </span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium bg-slate-100 text-slate-500 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">Email is linked to your account and verification OTP.</p>
                </div>

                {/* Mobile Phone Number */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Mobile Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                      }}
                      maxLength={10}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-medium bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#166534] transition-all ${
                        errors.phone ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'
                      }`}
                      placeholder="e.g. 9876543210"
                    />
                  </div>
                  {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
                </div>

                {/* Role Selector */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Account Role <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole('FARMER')}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        role === 'FARMER'
                          ? 'bg-[#166534] text-white border-[#166534] shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Tractor className="w-4 h-4" />
                      <span>Farmer</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('EQUIPMENT_OWNER')}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        role === 'EQUIPMENT_OWNER'
                          ? 'bg-[#166534] text-white border-[#166534] shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Wrench className="w-4 h-4" />
                      <span>Equipment Owner</span>
                    </button>
                  </div>
                </div>

                {/* State Dropdown */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    State <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <select
                      value={selectedState}
                      onChange={(e) => handleStateChange(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#166534] transition-all cursor-pointer"
                    >
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* District Dropdown */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    District <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <select
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#166534] transition-all cursor-pointer"
                    >
                      {availableDistricts.map((dst) => (
                        <option key={dst} value={dst}>
                          {dst}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

              </div>

              {/* Save Button Bar */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '2026'}</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2.5 rounded-xl bg-[#166534] hover:bg-[#004C22] text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </form>

          </div>
        </div>

        {/* Quick Navigation */}
        {comingSoonToast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-slate-800 text-white text-sm font-medium rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span><strong>{comingSoonToast}</strong> — Coming Soon! This feature is under development.</span>
          </div>
        )}
        <div className="mt-6">
          <h2 className="text-base font-bold text-slate-800 mb-3 px-1">Quick Navigation</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

            {/* Dashboard — real route exists */}
            <button
              type="button"
              onClick={() => navigate(role === 'EQUIPMENT_OWNER' ? '/owner/dashboard' : '/farmer/dashboard')}
              className="flex flex-col items-start p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all text-left cursor-pointer"
            >
              <span className="text-sm font-bold text-slate-800">Dashboard</span>
              <span className="text-xs text-blue-500 mt-1">View activity</span>
            </button>

            {/* My Rentals — real route exists for Farmer; Coming Soon for Owner */}
            <button
              type="button"
              onClick={() => {
                if (role === 'FARMER') navigate('/farmer/rentals');
                else showComingSoon('My Rentals');
              }}
              className="flex flex-col items-start p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all text-left cursor-pointer"
            >
              <span className="text-sm font-bold text-slate-800">My Rentals</span>
              <span className="text-xs text-teal-500 mt-1">Manage listings</span>
            </button>

            {/* Receipts — real route exists for both roles */}
            <button
              type="button"
              onClick={() => navigate(role === 'EQUIPMENT_OWNER' ? '/owner/receipts' : '/farmer/receipts')}
              className="flex flex-col items-start p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all text-left cursor-pointer"
            >
              <span className="text-sm font-bold text-slate-800">Receipts</span>
              <span className="text-xs text-violet-500 mt-1">Billing records</span>
            </button>

            {/* Marketplace — real public route exists */}
            <button
              type="button"
              onClick={() => navigate('/equipment')}
              className="flex flex-col items-start p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all text-left cursor-pointer"
            >
              <span className="text-sm font-bold text-slate-800">Marketplace</span>
              <span className="text-xs text-orange-400 mt-1">Browse machines</span>
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};
