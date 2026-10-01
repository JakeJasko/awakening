// Storage utility for saving and retrieving episode quiz progress, scores, and reflections

const STORAGE_KEY = 'awakening_meaning_crisis_progress_v1';

export function getStoredProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        completedEpisodes: {}, // episodeId -> { score, total, percentage, answers, completedAt }
        reflections: {},       // episodeId -> text
        streak: 1,
        lastActive: new Date().toISOString()
      };
    }
    return JSON.parse(raw);
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
    current.completedEpisodes[episodeId] = {
      score: results.score,
      total: results.total,
      percentage: Math.round((results.score / results.total) * 100),
      answers: results.answers,
      completedAt: new Date().toISOString()
    };
    current.lastActive = new Date().toISOString();
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
