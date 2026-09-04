import { INITIAL_USERS, INITIAL_EQUIPMENT, INITIAL_BOOKINGS, INITIAL_REVIEWS, INITIAL_NOTIFICATIONS, INITIAL_MAINTENANCE, INITIAL_USAGE_LOGS, INITIAL_FARM_PLANS, INITIAL_MANDI_PRICES, INITIAL_RECEIPTS } from '../data/seedData';

const KEYS = {
  USERS: 'krushi_users_v2',
  CURRENT_USER: 'krushi_current_user_v2',
  EQUIPMENT: 'krushi_equipment_v2',
  BOOKINGS: 'krushi_bookings_v2',
  REVIEWS: 'krushi_reviews_v2',
  NOTIFICATIONS: 'krushi_notifications_v2',
  MAINTENANCE: 'krushi_maintenance_v2',
  USAGE_LOGS: 'krushi_usage_logs_v2',
  FARM_PLANS: 'krushi_farm_plans_v2',
  MANDI_PRICES: 'krushi_mandi_prices_v2',
  RECEIPTS: 'krushi_receipts_v2',
  RETURN_INTENT: 'krushi_return_intent_v2',
  LANGUAGE: 'krushi_language_v2'
};

export const initializeStorage = () => {
  if (!localStorage.getItem(KEYS.USERS)) {
    localStorage.setItem(KEYS.USERS, JSON.stringify(INITIAL_USERS));
  }
  if (!localStorage.getItem(KEYS.EQUIPMENT)) {
    localStorage.setItem(KEYS.EQUIPMENT, JSON.stringify(INITIAL_EQUIPMENT));
  }
  if (!localStorage.getItem(KEYS.BOOKINGS)) {
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
  }
  if (!localStorage.getItem(KEYS.REVIEWS)) {
    localStorage.setItem(KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
  }
  if (!localStorage.getItem(KEYS.NOTIFICATIONS)) {
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
  }
  if (!localStorage.getItem(KEYS.MAINTENANCE)) {
    localStorage.setItem(KEYS.MAINTENANCE, JSON.stringify(INITIAL_MAINTENANCE));
  }
  if (!localStorage.getItem(KEYS.USAGE_LOGS)) {
    localStorage.setItem(KEYS.USAGE_LOGS, JSON.stringify(INITIAL_USAGE_LOGS));
  }
  if (!localStorage.getItem(KEYS.FARM_PLANS)) {
    localStorage.setItem(KEYS.FARM_PLANS, JSON.stringify(INITIAL_FARM_PLANS));
  }
  if (!localStorage.getItem(KEYS.MANDI_PRICES)) {
    localStorage.setItem(KEYS.MANDI_PRICES, JSON.stringify(INITIAL_MANDI_PRICES));
  }
  if (!localStorage.getItem(KEYS.RECEIPTS)) {
    localStorage.setItem(KEYS.RECEIPTS, JSON.stringify(INITIAL_RECEIPTS));
  }
  if (!localStorage.getItem(KEYS.LANGUAGE)) {
    localStorage.setItem(KEYS.LANGUAGE, 'en');
  }
};

export const getItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Error reading ${key} from storage`, e);
    return defaultValue;
  }
};

export const setItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to storage`, e);
  }
};

export { KEYS };
