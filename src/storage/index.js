import { localStorageAdapter } from './localStorageAdapter.js';

let syncEnabled = false;
let flushTimer = null;
const DEBOUNCE_MS = 2000;

let _supabaseAdapter = null;
async function getAdapter() {
  if (!_supabaseAdapter) {
    const mod = await import('./supabaseAdapter.js');
    _supabaseAdapter = mod.supabaseAdapter;
  }
  return _supabaseAdapter;
}

export function enableSync() {
  syncEnabled = true;
  getAdapter().catch(() => {});
}

export function disableSync() {
  syncEnabled = false;
  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }
}

export function isSyncEnabled() {
  return syncEnabled;
}

function scheduleFlush() {
  if (!syncEnabled) return;
  if (flushTimer) clearTimeout(flushTimer);
  flushTimer = setTimeout(() => {
    flushTimer = null;
    flushToCloud();
  }, DEBOUNCE_MS);
}

async function flushToCloud() {
  if (!syncEnabled) return;
  try {
    const projects = localStorageAdapter.getProjects();
    const tasks = localStorageAdapter.getTasks();
    const adapter = await getAdapter();
    await adapter.saveFullState(projects, tasks);
    localStorage.setItem('projecthub_sync_ts', new Date().toISOString());
  } catch (err) {
    console.warn('[sync] flush failed:', err.message);
  }
}

export const storage = {
  getProjects() {
    return localStorageAdapter.getProjects();
  },

  saveProjects(projects) {
    localStorageAdapter.saveProjects(projects);
    scheduleFlush();
  },

  getTasks() {
    return localStorageAdapter.getTasks();
  },

  saveTasks(tasks) {
    localStorageAdapter.saveTasks(tasks);
    scheduleFlush();
  },
};

export async function pullFromCloud() {
  if (!syncEnabled) return null;
  const adapter = await getAdapter();

  const remoteUpdatedAt = await adapter.getUpdatedAt();
  if (!remoteUpdatedAt) return null;

  const localTimestamp = localStorage.getItem('projecthub_sync_ts');
  if (localTimestamp && new Date(localTimestamp) >= new Date(remoteUpdatedAt)) {
    return null;
  }

  const state = await adapter.getFullState();
  const projects = state.projects || [];
  const tasks = state.tasks || [];

  localStorageAdapter.saveProjects(projects);
  localStorageAdapter.saveTasks(tasks);
  localStorage.setItem('projecthub_sync_ts', remoteUpdatedAt);

  return { projects, tasks };
}

export async function pushToCloud(projects, tasks) {
  if (!syncEnabled) return;
  const adapter = await getAdapter();
  await adapter.saveFullState(projects, tasks);
  localStorage.setItem('projecthub_sync_ts', new Date().toISOString());
}

export function flushNow() {
  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }
  flushToCloud();
}

if (typeof window !== 'undefined') {
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && flushTimer) {
      clearTimeout(flushTimer);
      flushTimer = null;
      flushToCloud();
    }
  });
  window.addEventListener('beforeunload', () => {
    if (flushTimer) {
      clearTimeout(flushTimer);
      flushTimer = null;
      flushToCloud();
    }
  });
}
