// Storage utility for saving and retrieving episode quiz progress, scores, and reflections

const STORAGE_KEY = 'awakening_meaning_crisis_progress_v1';

function toLocalDateKey(dateInput) {
  try {
    const d = dateInput ? new Date(dateInput) : new Date();
    if (Number.isNaN(d.getTime())) return null;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch {
    return null;
  }
}

function updateStreak(current) {
  const now = new Date();
  const todayKey = toLocalDateKey(now);
  const lastKey = toLocalDateKey(current.lastActive);

  if (!lastKey || !todayKey) {
    current.streak = Math.max(1, current.streak || 1);
  } else if (todayKey === lastKey) {
    current.streak = Math.max(1, current.streak || 1);
  } else {
    const todayMidnight = new Date(`${todayKey}T00:00:00`);
    const lastMidnight = new Date(`${lastKey}T00:00:00`);
    const diffDays = Math.round((todayMidnight - lastMidnight) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      current.streak = (current.streak || 1) + 1;
    } else {
      current.streak = 1;
    }
  }
  current.lastActive = now.toISOString();
}

export function getStoredProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        completedEpisodes: {}, // episodeId -> { score, total, percentage, bestScore, bestPercentage, lastScore, lastPercentage, answers, completedAt }
        reflections: {},       // episodeId -> text
        streak: 1,
        lastActive: new Date().toISOString()
      };
    }
    const parsed = JSON.parse(raw);
    return {
      completedEpisodes: parsed.completedEpisodes || {},
      reflections: parsed.reflections || {},
      streak: typeof parsed.streak === 'number' && parsed.streak >= 1 ? parsed.streak : 1,
      lastActive: parsed.lastActive || new Date().toISOString()
    };
  } catch (e) {
    console.error('Failed to parse progress from localStorage', e);
    return {
      completedEpisodes: {},
      reflections: {},
      streak: 1,
      lastActive: new Date().toISOString()
    };
  }
}

export function saveEpisodeProgress(episodeId, results) {
  try {
    const current = getStoredProgress();
    const prev = current.completedEpisodes?.[episodeId];
    const newPercentage = typeof results.percentage === 'number'
      ? results.percentage
      : Math.round((results.score / results.total) * 100);

    const bestPercentage = prev && typeof prev.percentage === 'number'
      ? Math.max(prev.percentage, prev.bestPercentage || 0, newPercentage)
      : newPercentage;

    const bestScore = prev && typeof prev.score === 'number'
      ? Math.max(prev.score, prev.bestScore || 0, results.score)
      : results.score;

    current.completedEpisodes[episodeId] = {
      score: bestScore,
      total: results.total,
      percentage: bestPercentage,
      bestScore,
      bestPercentage,
      lastScore: results.score,
      lastPercentage: newPercentage,
      answers: results.answers,
      completedAt: new Date().toISOString()
    };
    updateStreak(current);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    return current;
  } catch (e) {
    console.error('Failed to save episode progress to localStorage', e);
  }
}

export function saveReflection(episodeId, reflectionText) {
  try {
    const current = getStoredProgress();
    current.reflections[episodeId] = reflectionText;
    updateStreak(current);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    return current;
  } catch (e) {
    console.error('Failed to save reflection', e);
  }
}

export function resetAllProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear progress', e);
  }
}
