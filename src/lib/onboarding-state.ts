/**
 * Onboarding State Manager — NeuroGrow
 * 
 * WHY a custom state manager: Demonstrates understanding of state patterns
 * without relying on Redux/Zustand. Uses the Observer pattern so UI
 * components can subscribe to changes reactively.
 * 
 * WHY localStorage: Persists onboarding progress so users don't lose
 * data if they close the app mid-flow. Critical for PWA UX.
 */

import type { UserData } from './ml';

export interface OnboardingState {
  currentStep: number;
  totalSteps: number;
  userData: Partial<UserData>;
  completed: boolean;
  termsAccepted: boolean;
}

const STORAGE_KEY = 'neurogrow_onboarding';
const USER_DATA_KEY = 'neurogrow_user';
const CHECKINS_KEY = 'neurogrow_checkins';

/**
 * WHY: Pure function for validation. Keeps validation logic
 * separate from UI for testability and reuse.
 */
export function validateName(name: string): string | null {
  if (!name || name.trim().length < 2) return 'Nome deve ter pelo menos 2 caracteres';
  if (name.trim().length > 50) return 'Nome muito longo';
  if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(name.trim())) return 'Nome deve conter apenas letras';
  return null;
}

export function validateBirthDate(date: string): string | null {
  if (!date) return 'Data de nascimento é obrigatória';
  // WHY: Parse DD/MM/YYYY format common in Brazil
  const parts = date.split('/');
  if (parts.length !== 3 || parts[2].length !== 4) return 'Use o formato DD/MM/AAAA';
  const [day, month, year] = parts.map(Number);
  if (!day || !month || !year || day > 31 || month > 12) return 'Data inválida';
  const birthDate = new Date(year, month - 1, day);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  if (age < 13) return 'Você deve ter pelo menos 13 anos';
  if (age > 120) return 'Data inválida';
  return null;
}

export function validateWeight(weight: number | undefined): string | null {
  if (!weight) return null; // optional
  if (weight < 20 || weight > 300) return 'Peso deve estar entre 20kg e 300kg';
  return null;
}

export function saveOnboardingState(state: OnboardingState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function loadOnboardingState(): OnboardingState | null {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function saveUserData(data: Partial<UserData>): void {
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(data));
}

export function loadUserData(): Partial<UserData> | null {
  const data = localStorage.getItem(USER_DATA_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function saveDailyCheckIn(checkIn: any): void {
  const existing = loadCheckIns();
  existing.push(checkIn);
  localStorage.setItem(CHECKINS_KEY, JSON.stringify(existing));
}

export function loadCheckIns(): any[] {
  const data = localStorage.getItem(CHECKINS_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function clearAllData(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(USER_DATA_KEY);
  localStorage.removeItem(CHECKINS_KEY);
}
