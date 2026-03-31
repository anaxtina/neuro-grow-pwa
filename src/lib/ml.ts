/**
 * ML-Ready Module — NeuroGrow
 * 
 * WHY: This module isolates all machine learning logic so a real model
 * can replace the mock without touching UI code. The async pattern
 * mirrors a real API call to a Python backend or TensorFlow.js model.
 */

export interface UserData {
  name: string;
  birthDate: string;
  biologicalSex: 'male' | 'female' | 'other';
  weight?: number;
  goals: string[];
  sleepQuality: number; // 1-5
  dietQuality: number; // 1-5
  moodLevel: number; // 1-5
  energyLevel: number; // 1-5
  medications: string[];
  healthConditions: string[];
}

export interface DailyCheckIn {
  date: string;
  mood: number;
  sleepHours: number;
  sleepDelay: number; // minutes to fall asleep
  wakeUps: number;
  mealsCount: number;
  energyLevel: number;
  symptoms: string[];
}

export interface ProtocolRecommendation {
  category: string;
  title: string;
  description: string;
  icon: string;
  priority: 'high' | 'medium' | 'low';
  scientific_basis: string;
}

export interface WeeklyFeedback {
  sleepRecommendation: { bedtime: string; wakeTime: string };
  dietSuggestions: { eat: string[]; avoid: string[] };
  phytotherapics: string[];
  exercises: string[];
  supplements: string[];
  articles: { title: string; url: string }[];
}

/**
 * WHY async + setTimeout: Simulates network latency to a real ML endpoint.
 * In production, this would be fetch() to a Flask/FastAPI server
 * running a trained scikit-learn or TensorFlow model.
 * 
 * The function signature accepts UserData so the model can use
 * all biometric + behavioral features for prediction.
 */
export async function predictProtocol(
  userData: UserData
): Promise<ProtocolRecommendation[]> {
  return new Promise((resolve) => {
    // WHY setTimeout: Simulates ML inference time (~2-3 seconds)
    setTimeout(() => {
      const recommendations: ProtocolRecommendation[] = [];

      // WHY conditional logic: Mirrors decision-tree-style classification
      if (userData.sleepQuality <= 2) {
        recommendations.push({
          category: 'Sono',
          title: 'Protocolo de Higiene do Sono',
          description: 'Reduza exposição à luz azul 2h antes de dormir. Use chá de camomila + passiflora.',
          icon: '🌙',
          priority: 'high',
          scientific_basis: 'Melatonina suprimida pela luz azul (Harvard Medical School, 2020)'
        });
      }

      if (userData.moodLevel <= 2) {
        recommendations.push({
          category: 'Humor',
          title: 'Protocolo Serotonina Natural',
          description: 'Exposição solar matinal 15min + triptofano na dieta (banana, aveia, castanhas).',
          icon: '☀️',
          priority: 'high',
          scientific_basis: 'Serotonina via triptofano + luz solar (Journal of Psychiatry & Neuroscience, 2007)'
        });
      }

      if (userData.energyLevel <= 3) {
        recommendations.push({
          category: 'Energia',
          title: 'Dopamina Manhã',
          description: 'Cold exposure 30s + exercício leve em jejum. Ashwagandha adaptógeno.',
          icon: '⚡',
          priority: 'medium',
          scientific_basis: 'Dopamina via cold exposure (European Journal of Applied Physiology, 2000)'
        });
      }

      // Always suggest baseline
      recommendations.push(
        {
          category: 'Nutrição',
          title: 'Anti-inflamatório Natural',
          description: 'Cúrcuma + pimenta preta em refeições. Ômega-3 via linhaça ou peixe.',
          icon: '🥗',
          priority: 'medium',
          scientific_basis: 'Curcumina bioavailability (Journal of Medicinal Food, 2017)'
        },
        {
          category: 'Foco',
          title: 'Neuroplasticidade Ativa',
          description: 'Blocos de foco 25min (Pomodoro) + Lion\'s Mane (Juba-de-Leão).',
          icon: '🧠',
          priority: 'low',
          scientific_basis: 'NGF stimulation via Hericium erinaceus (Int J Med Mushrooms, 2013)'
        }
      );

      resolve(recommendations);
    }, 2500);
  });
}

/**
 * WHY separate function: Weekly feedback has different data requirements
 * and would use a different model endpoint in production.
 */
export async function generateWeeklyFeedback(
  checkIns: DailyCheckIn[],
  userData: UserData
): Promise<WeeklyFeedback> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const avgSleep = checkIns.reduce((s, c) => s + c.sleepHours, 0) / (checkIns.length || 1);
      const avgMood = checkIns.reduce((s, c) => s + c.mood, 0) / (checkIns.length || 1);

      resolve({
        sleepRecommendation: {
          bedtime: avgSleep < 7 ? '22:00' : '23:00',
          wakeTime: avgSleep < 7 ? '06:00' : '07:00',
        },
        dietSuggestions: {
          eat: ['Folhas verdes escuras', 'Castanhas e sementes', 'Frutas vermelhas', 'Peixes ricos em ômega-3'],
          avoid: ['Açúcar refinado após 16h', 'Cafeína após 14h', 'Ultraprocessados'],
        },
        phytotherapics: ['Camomila (ansiolítico)', 'Ashwagandha (adaptógeno)', 'Valeriana (sono)'],
        exercises: avgMood < 3
          ? ['Caminhada leve 20min', 'Yoga restaurativo', 'Respiração 4-7-8']
          : ['HIIT 15min', 'Musculação moderada', 'Corrida leve 30min'],
        supplements: ['Magnésio bisglicinato', 'Vitamina D3', 'Complexo B'],
        articles: [
          { title: 'Neurociência do Sono', url: '#' },
          { title: 'Fitoterapia Brasileira', url: '#' },
        ],
      });
    }, 2000);
  });
}

/**
 * WHY: Calculates plant growth percentage based on daily check-in consistency.
 * The gamification mechanic encourages daily engagement.
 */
export function calculatePlantGrowth(checkIns: DailyCheckIn[], daysInMonth: number): number {
  const completedDays = checkIns.length;
  return Math.min(100, Math.round((completedDays / daysInMonth) * 100));
}
