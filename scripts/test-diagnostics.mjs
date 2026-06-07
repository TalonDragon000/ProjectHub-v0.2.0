// ============================================================
// Test: Connection Count & Memory Leak Detector
// ============================================================
//
// PURPOSE:
// Manual browser-console diagnostics to detect:
// 1. Excessive Supabase connections / API calls
// 2. Memory leaks from uncleared timers or detached DOM nodes
// 3. Service Worker caching API responses incorrectly
//
// HOW TO USE:
// Open your deployed app in Chrome, then open DevTools (F12).
// Paste the sections below into the Console tab one at a time.
//
// ============================================================

// -----------------------------------------------------------
// TEST 1: Count network requests to Supabase over 30 seconds
// -----------------------------------------------------------
// Paste this into the Console and interact with the app normally.
// After 30 seconds it prints a summary of API call frequency.
//
// Expected (after fix): 0-2 calls per save action (debounced)
// Problem indicator: >5 calls per action, or continuous polling
//
/*

(() => {
  const calls = [];
  const origFetch = window.fetch;
  window.fetch = function(...args) {
    const url = typeof args[0] === 'string' ? args[0] : args[0]?.url || '';
    if (url.includes('supabase')) {
      calls.push({ url: url.split('?')[0], time: Date.now() });
    }
    return origFetch.apply(this, args);
  };

  console.log('[monitor] Tracking Supabase calls for 30s...');
  setTimeout(() => {
    window.fetch = origFetch;
    console.log(`[monitor] Total Supabase calls: ${calls.length}`);
    const grouped = {};
    calls.forEach(c => {
      const path = new URL(c.url).pathname;
      grouped[path] = (grouped[path] || 0) + 1;
    });
    console.table(grouped);
    if (calls.length > 10) {
      console.warn('[monitor] HIGH CALL COUNT — possible loop or missing debounce');
    } else {
      console.log('[monitor] Call count looks healthy');
    }
  }, 30000);
})();

*/


// -----------------------------------------------------------
// TEST 2: Detect memory leaks via heap growth
// -----------------------------------------------------------
// Paste this, then create and delete 10 projects rapidly.
// After 10 seconds it checks if heap grew significantly.
//
// Expected: <5MB growth for 10 project CRUD operations
// Problem indicator: >20MB growth, or growth that never stabilizes
//
/*

(() => {
  const before = performance.memory?.usedJSHeapSize;
  if (!before) {
    console.error('[memory] performance.memory not available — use Chrome with --enable-precise-memory-info');
    return;
  }
  console.log(`[memory] Heap before: ${(before / 1024 / 1024).toFixed(2)} MB`);
  console.log('[memory] Now create/delete 10 projects rapidly, then wait...');

  setTimeout(() => {
    const after = performance.memory.usedJSHeapSize;
    const diff = (after - before) / 1024 / 1024;
    console.log(`[memory] Heap after: ${(after / 1024 / 1024).toFixed(2)} MB`);
    console.log(`[memory] Growth: ${diff.toFixed(2)} MB`);
    if (diff > 20) {
      console.warn('[memory] POSSIBLE LEAK — heap grew >20MB');
    } else {
      console.log('[memory] Heap growth looks normal');
    }
  }, 10000);
})();

*/


// -----------------------------------------------------------
// TEST 3: Check if Service Worker is caching API responses
// -----------------------------------------------------------
// Paste this to inspect what the SW has cached.
//
// Expected: Only static assets (JS, CSS, HTML, images)
// Problem indicator: Any URL containing "supabase" in the cache
//
/*

(async () => {
  const keys = await caches.keys();
  console.log('[sw-cache] Cache names:', keys);
  for (const name of keys) {
    const cache = await caches.open(name);
    const entries = await cache.keys();
    const apiCached = entries.filter(r => r.url.includes('supabase'));
    console.log(`[sw-cache] "${name}": ${entries.length} entries, ${apiCached.length} are Supabase API`);
    if (apiCached.length > 0) {
      console.warn('[sw-cache] PROBLEM: Supabase API responses are cached!');
      apiCached.forEach(r => console.log('  -', r.url));
    }
  }
})();

*/


// -----------------------------------------------------------
// TEST 4: Detect detached DOM nodes (Chrome only)
// -----------------------------------------------------------
// In DevTools: Memory tab > Take Heap Snapshot > Filter by "Detached"
// If you see growing numbers of "Detached HTMLDivElement" or
// "Detached InternalNode" after navigating between tabs, there
// is a component not properly unmounting.
//
// Automated alternative (paste in Console):
//
/*

(() => {
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'measure' && entry.duration > 16) {
        console.warn('[perf] Long task:', entry.name, entry.duration.toFixed(1) + 'ms');
      }
    }
  });
  observer.observe({ entryTypes: ['measure', 'longtask'] });
  console.log('[perf] Monitoring long tasks... interact with the app.');
})();

*/


// -----------------------------------------------------------
// TEST 5: Multi-tab conflict detection
// -----------------------------------------------------------
// Open the app in two tabs. In Tab 1, create a project.
// In Tab 2 (within 2 seconds), create a different project.
// Wait 5 seconds, then refresh both tabs.
//
// Expected: Both projects visible in both tabs after refresh.
// Problem indicator: One project disappears.
//
// To test programmatically, paste in BOTH tabs:
//
/*

window.addEventListener('storage', (e) => {
  if (e.key === 'projecthub_projects') {
    console.log('[multi-tab] Projects changed from another tab:', JSON.parse(e.newValue).length, 'projects');
  }
});
console.log('[multi-tab] Listening for cross-tab storage events...');

*/
