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
  ShieldCheck,
  QrCode,
  CreditCard,
  Building2,
  Upload,
  Trash2,
  Check
} from 'lucide-react';
import { resolveImageUrl } from '../../services/api';

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

  // Equipment Owner Banking & Payment details states
  const [upiId, setUpiId] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [isUploadingQr, setIsUploadingQr] = useState(false);
  const qrFileInputRef = useRef<HTMLInputElement>(null);

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

      // Initialize payment details
      if (user.paymentDetails) {
        setUpiId(user.paymentDetails.upiId || '');
        setQrCodeUrl(user.paymentDetails.qrCodeUrl || '');
        setAccountHolderName(user.paymentDetails.accountHolderName || user.name || '');
        setBankName(user.paymentDetails.bankName || '');
        setAccountNumber(user.paymentDetails.accountNumber || '');
        setIfscCode(user.paymentDetails.ifscCode || '');
      } else {
        setAccountHolderName(user.name || '');
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

  // Handle QR Code Scanner Upload
  const handleQrCodeSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (PNG, JPG, WEBP) for the payment scanner.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Payment scanner image size must be less than 5 MB.');
      return;
    }

    try {
      setIsUploadingQr(true);
      setErrorMessage(null);
      const urls = await uploadService.uploadImages([file]);
      if (urls && urls.length > 0) {
        setQrCodeUrl(urls[0]);
        setSuccessMessage('Payment scanner photo uploaded! Click "Save Changes" to apply.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to upload scanner image. Please try again.');
    } finally {
      setIsUploadingQr(false);
      if (qrFileInputRef.current) qrFileInputRef.current.value = '';
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

    // Optional UPI validation if provided
    if (role === 'EQUIPMENT_OWNER' && upiId.trim()) {
      if (!/^[\w.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(upiId.trim())) {
        newErrors.upiId = 'Enter a valid UPI ID (e.g. 9049840856@upi or name@oksbi).';
      }
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
        avatar: avatar || undefined,
        paymentDetails: role === 'EQUIPMENT_OWNER' ? {
          upiId: upiId.trim(),
          qrCodeUrl: qrCodeUrl.trim(),
          accountHolderName: accountHolderName.trim() || name.trim(),
          bankName: bankName.trim(),
          accountNumber: accountNumber.trim(),
          ifscCode: ifscCode.trim().toUpperCase()
        } : undefined
      });

      setSuccessMessage('Your profile and payment details have been saved successfully!');
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

          {/* Profile Header Background */}
          <div className="h-32 bg-gradient-to-r from-[#166534] via-emerald-700 to-[#004C22] relative">
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
          </div>

          {/* Avatar Section */}
          <div className="px-6 sm:px-8 pb-6 relative -mt-16">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-6 border-b border-slate-100">
              
              <div className="flex items-end gap-5">
                {/* Avatar Image with Upload Overlay */}
                <div className="relative group">
                  <div className="w-28 h-28 rounded-2xl bg-white p-1 shadow-lg ring-4 ring-emerald-500/20 overflow-hidden">
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

                  {/* Camera Upload Overlay Button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingPhoto}
                    className="absolute -bottom-2 -right-2 p-2.5 rounded-xl bg-[#166534] hover:bg-[#004C22] text-white shadow-md transition-all group-hover:scale-105 disabled:opacity-50"
                    title="Upload profile picture"
                  >
                    {isUploadingPhoto ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4" />
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

                {/* User Name & Role Pill */}
                <div className="pb-1">
                  <h1 className="text-2xl font-black text-white leading-tight drop-shadow-sm">
                    {name || user.name}
                  </h1>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-white/20 text-white border border-white/30 backdrop-blur-sm">
                      {role === 'EQUIPMENT_OWNER' ? <Wrench className="w-3 h-3" /> : <Tractor className="w-3 h-3" />}
                      {role === 'EQUIPMENT_OWNER' ? 'Equipment Owner' : 'Farmer'}
                    </span>
                    <span className="text-xs text-white/80 font-medium">
                      {selectedDistrict ? `${selectedDistrict}, ${selectedState}` : user.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Avatar Action Buttons */}
              <div className="flex items-center gap-2 self-start sm:self-end">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingPhoto}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5"
                >
                  <Camera className="w-3.5 h-3.5 text-slate-500" />
                  <span>Upload Photo</span>
                </button>
                <button
                  type="button"
                  onClick={handleGenerateAvatar}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-50 border border-emerald-200 text-[#166534] hover:bg-emerald-100 transition-colors inline-flex items-center gap-1.5"
                  title="Generate a unique avatar"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Random Avatar</span>
                </button>
              </div>

            </div>

            {/* Profile Edit Form */}
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">

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

              {/* Equipment Owner Banking & Payment Details Section */}
              {role === 'EQUIPMENT_OWNER' && (
                <div className="pt-6 border-t border-slate-200/80 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#166534] flex items-center justify-center font-bold">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <h3 className="text-base font-extrabold text-slate-900">Banking & UPI Payment Setup</h3>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Add your UPI ID, bank account details, and upload your payment QR scanner photo so farmers can pay you directly upon work completion.
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200/80 rounded-full text-[11px] font-bold self-start sm:self-auto">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Direct P2P Settlement
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    
                    {/* Payment Scanner / QR Code Upload Box */}
                    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                          <QrCode className="w-4 h-4 text-[#166534]" />
                          Payment Scanner (QR Code)
                        </label>
                        {qrCodeUrl && (
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">
                            Active Scanner
                          </span>
                        )}
                      </div>

                      {qrCodeUrl ? (
                        <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-slate-200">
                          <div className="w-32 h-32 rounded-xl border-2 border-emerald-600/30 overflow-hidden bg-slate-50 flex items-center justify-center shrink-0 shadow-xs">
                            <img
                              src={resolveImageUrl(qrCodeUrl)}
                              alt="Payment QR Code Scanner"
                              className="w-full h-full object-contain p-1"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=400&q=80';
                              }}
                            />
                          </div>

                          <div className="space-y-2 text-center sm:text-left flex-1">
                            <div className="text-xs font-bold text-slate-800">Scanner Image Uploaded</div>
                            <p className="text-[11px] text-slate-500 leading-relaxed">
                              Farmers will scan this QR code using Google Pay, PhonePe, Paytm, or BHIM to pay you.
                            </p>
                            <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => qrFileInputRef.current?.click()}
                                disabled={isUploadingQr}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                {isUploadingQr ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                                Change Image
                              </button>
                              <button
                                type="button"
                                onClick={() => setQrCodeUrl('')}
                                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => qrFileInputRef.current?.click()}
                          className="border-2 border-dashed border-slate-300 hover:border-[#166534] bg-white rounded-xl p-6 text-center cursor-pointer transition-all group"
                        >
                          <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#166534] flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                            {isUploadingQr ? (
                              <Loader2 className="w-6 h-6 animate-spin text-[#166534]" />
                            ) : (
                              <QrCode className="w-6 h-6" />
                            )}
                          </div>
                          <div className="text-xs font-bold text-slate-800 mb-1">
                            {isUploadingQr ? 'Uploading Scanner...' : 'Click to Upload Payment Scanner Photo'}
                          </div>
                          <p className="text-[11px] text-slate-500">
                            Upload your GPay, PhonePe, Paytm or Bank QR code image (PNG, JPG up to 5MB)
                          </p>
                        </div>
                      )}
                      <input
                        ref={qrFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleQrCodeSelect}
                        className="hidden"
                      />
                    </div>

                    {/* UPI ID & Basic Account Details */}
                    <div className="space-y-4">
                      {/* UPI ID Field */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                          <span>UPI ID (VPA)</span>
                          <span className="text-[11px] text-slate-400 font-normal lowercase">e.g. 9049840856@upi</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <CreditCard className="w-4 h-4" />
                          </div>
                          <input
                            type="text"
                            value={upiId}
                            onChange={(e) => {
                              setUpiId(e.target.value);
                              if (errors.upiId) setErrors(prev => ({ ...prev, upiId: '' }));
                            }}
                            placeholder="e.g. yourname@oksbi or 9049840856@upi"
                            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-mono bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#166534] transition-all ${
                              errors.upiId ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'
                            }`}
                          />
                        </div>
                        {errors.upiId && <p className="text-xs text-red-600 mt-1">{errors.upiId}</p>}
                        <p className="text-[11px] text-slate-400">
                          Farmers can use this to send money directly via Google Pay, PhonePe, or BHIM.
                        </p>
                      </div>

                      {/* Account Holder Name */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Account Holder Name
                        </label>
                        <input
                          type="text"
                          value={accountHolderName}
                          onChange={(e) => setAccountHolderName(e.target.value)}
                          placeholder="Name as per bank passbook"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#166534] transition-all"
                        />
                      </div>

                      {/* Bank Details Grid: Bank Name & IFSC */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                            Bank Name
                          </label>
                          <input
                            type="text"
                            value={bankName}
                            onChange={(e) => setBankName(e.target.value)}
                            placeholder="e.g. State Bank of India"
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#166534] transition-all"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                            IFSC Code
                          </label>
                          <input
                            type="text"
                            value={ifscCode}
                            onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                            placeholder="e.g. SBIN0001829"
                            maxLength={11}
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono uppercase bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#166534] transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Account Number
                        </label>
                        <input
                          type="text"
                          value={accountNumber}
                          onChange={(e) => setAccountNumber(e.target.value.replace(/[^0-9]/g, ''))}
                          placeholder="e.g. 5010048291029"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#166534] transition-all"
                        />
                      </div>

                    </div>

                  </div>
                </div>
              )}

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

        {/* Quick Links Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Quick Navigation</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link
              to={user.role === 'FARMER' ? '/farmer/dashboard' : '/owner/dashboard'}
              className="p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-center transition-all group"
            >
              <span className="text-xs font-bold text-slate-800 group-hover:text-[#166534] block">Dashboard</span>
              <span className="text-[10px] text-slate-500">View activity</span>
            </Link>
            <Link
              to={user.role === 'FARMER' ? '/farmer/rentals' : '/owner/equipment'}
              className="p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-center transition-all group"
            >
              <span className="text-xs font-bold text-slate-800 group-hover:text-[#166534] block">
                {user.role === 'FARMER' ? 'My Rentals' : 'My Equipment'}
              </span>
              <span className="text-[10px] text-slate-500">Manage listings</span>
            </Link>
            <Link
              to={user.role === 'FARMER' ? '/farmer/receipts' : '/owner/receipts'}
              className="p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-center transition-all group"
            >
              <span className="text-xs font-bold text-slate-800 group-hover:text-[#166534] block">Receipts</span>
              <span className="text-[10px] text-slate-500">Billing records</span>
            </Link>
            <Link
              to="/equipment"
              className="p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-center transition-all group"
            >
              <span className="text-xs font-bold text-slate-800 group-hover:text-[#166534] block">Marketplace</span>
              <span className="text-[10px] text-slate-500">Browse machines</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
