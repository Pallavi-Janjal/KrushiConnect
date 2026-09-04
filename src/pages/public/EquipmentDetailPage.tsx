import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { equipmentService } from '../../services/equipmentService';
import { reviewService } from '../../services/reviewService';
import { RatingStars } from '../../components/common/RatingStars';
import { BookingModal } from '../../components/booking/BookingModal';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Equipment, Review } from '../../types';
import { MapPin, UserCheck, ShieldCheck, Zap, Fuel, ArrowLeft, MessageSquare, PhoneCall, Star, Send, Globe, Pencil } from 'lucide-react';
import { useDynamicTranslation } from '../../hooks/useDynamicTranslation';
import { TranslatedText } from '../../components/common/TranslatedText';
import { EditEquipmentModal } from '../../components/equipment/EditEquipmentModal';

export const EquipmentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, saveReturnIntent } = useAuth();
  const { t } = useLanguage();

  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);

  // Review form state
  const [reviewRating, setReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  const isOwner = Boolean(
    user && equipment && (
      String(user.id) === String(equipment.ownerId) ||
      String((user as any)._id) === String(equipment.ownerId) ||
      (user.role === 'EQUIPMENT_OWNER' && user.name === equipment.ownerName)
    )
  );
  const alreadyReviewed = Boolean(user && reviews.some(r => String(r.farmerId) === String(user.id) || String(r.farmerId) === String((user as any)._id)));

  const { translatedText: translatedDesc, isTranslating: isTranslatingDesc } = useDynamicTranslation(equipment?.description);
  const { translatedText: translatedName } = useDynamicTranslation(equipment?.name);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      equipmentService.getEquipmentById(id),
      reviewService.getEquipmentReviews(id)
    ]).then(([eq, revs]) => {
      setEquipment(eq || null);
      setReviews(revs);
    }).catch(() => {
      setEquipment(null);
    }).finally(() => setLoadingPage(false));
  }, [id]);

  useEffect(() => {
    if (user && equipment && (location.state as any)?.autoOpenBooking) {
      setIsBookingOpen(true);
    }
  }, [user, equipment, location.state]);

  if (loadingPage) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-500 text-sm">Loading...</p>
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">{t('market.noEquipment')}</h2>
        <Link to="/equipment" className="inline-block px-4 py-2 rounded-lg bg-[#166534] text-white font-bold text-sm">
          {t('detail.back')}
        </Link>
      </div>
    );
  }

  const handleRentClick = () => {
    if (!user) {
      saveReturnIntent({ returnTo: `/equipment/${equipment.id}`, action: 'BOOK', equipmentId: equipment.id });
      navigate('/login');
    } else {
      setIsBookingOpen(true);
    }
  };

  const handleSubmitReview = async () => {
    if (reviewRating === 0) {
      setReviewError('Please select a star rating.');
      return;
    }
    if (!reviewComment.trim()) {
      setReviewError('Please write a comment.');
      return;
    }
    setSubmittingReview(true);
    setReviewError('');
    setReviewSuccess('');
    try {
      await reviewService.addReview({
        equipmentId: equipment!.id,
        rating: reviewRating,
        comment: reviewComment.trim()
      });
      // Refresh reviews
      const updatedReviews = await reviewService.getEquipmentReviews(equipment!.id);
      setReviews(updatedReviews);
      // Refresh equipment to get updated rating
      const updatedEq = await equipmentService.getEquipmentById(equipment!.id);
      if (updatedEq) setEquipment(updatedEq);
      setReviewRating(0);
      setReviewComment('');
      setReviewSuccess('Review submitted successfully!');
    } catch (err: any) {
      setReviewError(err.message || 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#166534] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t('detail.back')}</span>
      </button>

      {/* Main Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Images & Overview (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Display Image */}
          <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs relative">
            <div className="h-96 w-full bg-slate-100">
              <img
                src={equipment.images[activeImageIndex] || equipment.images[0]}
                alt={equipment.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Category Tag */}
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-lg text-xs font-extrabold bg-[#166534] text-white shadow-md">
                {t(`cat.${equipment.category}`) || equipment.category}
              </span>
            </div>
          </div>

          {/* Image Thumbnails */}
          {equipment.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {equipment.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    activeImageIndex === idx ? 'border-[#166534] ring-2 ring-[#166534]/20' : 'border-slate-200 opacity-70'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Description & Overview */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">{t('addEq.description')}</h3>
              {isTranslatingDesc && (
                <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 animate-pulse flex items-center gap-1">
                  <Globe className="w-3 h-3 text-emerald-600 animate-spin" />
                  <span>Translating...</span>
                </span>
              )}
            </div>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {translatedDesc || equipment.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-xs text-slate-500 font-medium">{t('addEq.hp')}</div>
                <div className="text-base font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>{equipment.hp} {t('common.hp')}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-xs text-slate-500 font-medium">Fuel Type</div>
                <div className="text-base font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                  <Fuel className="w-4 h-4 text-emerald-600" />
                  <span>{equipment.fuelType}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-xs text-slate-500 font-medium">{t('addEq.brand')}</div>
                <div className="text-base font-bold text-slate-900 truncate mt-0.5">
                  {equipment.brand}
                </div>
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">{t('detail.specifications')}</h3>
            <div className="divide-y divide-slate-100 text-sm">
              {Object.entries(equipment.specifications).map(([key, val]) => (
                <div key={key} className="py-2.5 flex justify-between">
                  <span className="font-semibold text-slate-600">{key}</span>
                  <span className="font-bold text-slate-900">{String(val)}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Pricing & Booking Action Card (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-6 shadow-lg sticky top-24">
            
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  {t('detail.verifiedOwner')}
                </span>
                <h1 className="text-2xl font-extrabold text-slate-900 mt-2">{translatedName || equipment.name}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <RatingStars rating={equipment.rating} reviewCount={equipment.reviewCount} size={18} />
                </div>
              </div>

              {/* Edit button visible ONLY to equipment owner */}
              {isOwner && (
                <button
                  type="button"
                  onClick={() => setIsEditOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs transition-all hover:scale-105 active:scale-95 shrink-0"
                  title="Edit Equipment Details"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>{t('common.edit') || 'Edit'}</span>
                </button>
              )}
            </div>

            {/* Location & Owner Details */}
            {/* Location & Owner Details */}
            <div className="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-100 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <MapPin className="w-4 h-4 text-[#166534] shrink-0" />
                <span>{t('common.location')}: <strong className="text-slate-900">{equipment.location}</strong></span>
              </div>
              <div className="flex items-center justify-between gap-2 text-slate-700 pt-2 border-t border-slate-200/60 flex-wrap">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t('market.owner')}: <strong className="text-slate-900">{equipment.ownerName}</strong></span>
                </div>
                {equipment.ownerPhone && (
                  <a
                    href={`tel:${equipment.ownerPhone}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#166534] hover:bg-[#004C22] text-white font-bold text-xs shadow-xs transition-all hover:scale-105 active:scale-95 shrink-0"
                    title={`Call ${equipment.ownerName} (${equipment.ownerPhone})`}
                  >
                    <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
                    <span>{t('detail.callNow') || 'Call Now'}</span>
                  </a>
                )}
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-1">
              <div className="text-xs text-emerald-800 font-semibold uppercase tracking-wider">{t('market.rentalRate')}</div>
              <div className="text-3xl font-black text-[#166534]">
                ₹{equipment.pricePerDay.toLocaleString('en-IN')}
                <span className="text-xs font-normal text-slate-600"> {t('market.perDay')}</span>
              </div>
              {equipment.operatorIncluded && (
                <div className="text-xs text-emerald-700 font-medium pt-1 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t('detail.operatorAvailable')} (+₹{equipment.operatorCostPerDay}{t('market.perDay')})</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              {isOwner ? (
                <button
                  type="button"
                  onClick={() => setIsEditOpen(true)}
                  className="w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-base font-bold shadow-md transition-all flex items-center justify-center gap-2 hover:shadow-lg active:scale-98"
                >
                  <Pencil className="w-5 h-5" />
                  <span>{t('detail.editEquipment') || 'Edit Equipment Details'}</span>
                </button>
              ) : (
                <button
                  onClick={handleRentClick}
                  disabled={!equipment.isAvailable}
                  className="w-full py-3.5 rounded-xl bg-[#166534] hover:bg-[#004C22] text-white text-base font-bold shadow-md transition-all hover:shadow-lg disabled:opacity-50"
                >
                  {equipment.isAvailable ? t('detail.rentThis') : t('detail.unavailable')}
                </button>
              )}

              {equipment.ownerPhone && (
                <a
                  href={`tel:${equipment.ownerPhone}`}
                  className="w-full py-3 rounded-xl bg-white hover:bg-emerald-50 text-[#166534] border-2 border-[#166534] text-sm font-bold shadow-xs transition-all flex items-center justify-center gap-2 hover:shadow-md active:scale-95"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>{t('detail.callNow') || 'Call Now'} ({equipment.ownerPhone})</span>
                </a>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* Reviews Section */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-6 shadow-xs max-w-4xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#166534]" />
            <h3 className="text-lg font-bold text-slate-900">{t('detail.reviews')} ({reviews.length})</h3>
          </div>
          <div className="flex items-center gap-2">
            <RatingStars rating={equipment.rating} showText={true} />
          </div>
        </div>

        {/* Write a Review Form */}
        {user && !isOwner && !alreadyReviewed && !reviewSuccess && (
          <div className="border border-slate-200 rounded-xl p-5 space-y-4 bg-slate-50/50">
            <h4 className="text-sm font-bold text-slate-800">Write a Review</h4>

            {/* Star Rating Selector */}
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-0.5 transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= (hoverRating || reviewRating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300 fill-slate-100'
                    }`}
                  />
                </button>
              ))}
              {reviewRating > 0 && (
                <span className="ml-2 text-xs font-semibold text-slate-600">{reviewRating}/5</span>
              )}
            </div>

            {/* Comment */}
            <textarea
              value={reviewComment}
              onChange={e => setReviewComment(e.target.value)}
              placeholder="Share your experience with this equipment..."
              rows={3}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#166534]/30 focus:border-[#166534] resize-none"
            />

            {/* Error */}
            {reviewError && (
              <p className="text-xs text-red-600 font-medium">{reviewError}</p>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmitReview}
              disabled={submittingReview}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#166534] hover:bg-[#004C22] text-white text-sm font-bold transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {submittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        )}

        {/* Already reviewed or owner message */}
        {user && isOwner && (
          <p className="text-xs text-slate-400 italic">You cannot review your own equipment.</p>
        )}
        {user && alreadyReviewed && !reviewSuccess && (
          <p className="text-xs text-emerald-600 font-medium">✓ You have already reviewed this equipment.</p>
        )}
        {reviewSuccess && (
          <p className="text-xs text-emerald-600 font-semibold">✓ {reviewSuccess}</p>
        )}
        {!user && (
          <p className="text-xs text-slate-500">
            <Link to="/login" className="text-[#166534] font-semibold hover:underline">Log in</Link> to write a review.
          </p>
        )}

        {reviews.length === 0 ? (
          <p className="text-xs text-slate-500 italic">{t('detail.noReviews')}</p>
        ) : (
          <div className="space-y-4 divide-y divide-slate-100">
            {reviews.map(rev => (
              <div key={rev.id} className="pt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-sm text-slate-900">{rev.farmerName}</div>
                  <div className="text-xs text-slate-400">{new Date(rev.createdAt).toLocaleDateString()}</div>
                </div>
                <RatingStars rating={rev.rating} showText={false} size={14} />
                <TranslatedText text={rev.comment} as="p" className="text-xs text-slate-600 leading-relaxed" />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Booking Modal */}
      {isBookingOpen && (
        <BookingModal
          equipment={equipment}
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
        />
      )}

      {/* Edit Equipment Modal */}
      {isEditOpen && (
        <EditEquipmentModal
          equipment={equipment}
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          onUpdated={(updated) => setEquipment(updated)}
        />
      )}

    </div>
  );
};
