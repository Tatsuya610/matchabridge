/**
 * MatchaBack Shared Utilities
 * Common i18n and helper functions used across pages
 */

/**
 * Get URL search parameters as URLSearchParams object
 */
function getParams() {
  return new URLSearchParams(location.search);
}

/**
 * Get the current language setting from URL params (defaults to 'en')
 * Usage: setCurrentLang('ja') or getCurrentLang() -> 'en' or 'ja'
 */
let currentLang = 'en';

function setCurrentLang(lang) {
  currentLang = (lang || 'en').toLowerCase();
}

function getCurrentLang() {
  return currentLang;
}

/**
 * Initialize language from URL params
 */
function initLanguageFromParams() {
  const lang = (getParams().get('lang') || 'en').toLowerCase();
  setCurrentLang(lang);
  return lang;
}

/**
 * Translation helper: returns the appropriate text based on current language
 * Usage: t('English text', '日本語テキスト')
 */
function t(enText, jaText) {
  return currentLang === 'ja' ? (jaText || enText) : (enText || jaText);
}

/**
 * Get translated value from an i18n object
 * Usage: getTrans({ en: 'text', ja: 'テキスト' }) -> 'text' or 'テキスト'
 */
function getTrans(obj, fallback = '—') {
  if (!obj) return fallback;
  const translated = obj[currentLang] || obj['en'];
  return translated || fallback;
}

/**
 * Get translated array (joins with locale-appropriate separator)
 * Usage: getTransArray(['item1', 'item2'], [' and ', ' と '])
 */
function getTransArray(items, lang = currentLang) {
  if (!Array.isArray(items) || items.length === 0) return '—';
  const separator = lang === 'ja' ? '、' : ', ';
  return items.join(separator);
}

/**
 * Normalize text for comparison (lowercase)
 */
function normalize(s) {
  return (s || '').toLowerCase();
}

/**
 * Build language toggle link
 * Updates href to switch between 'en' and 'ja'
 */
function buildLangToggleLink(linkId, path = location.pathname) {
  const p = getParams();
  const newLang = currentLang === 'ja' ? 'en' : 'ja';
  p.set('lang', newLang);
  
  const link = document.getElementById(linkId);
  if (link) {
    link.href = `${path}?${p.toString()}`;
    link.textContent = t('日本語', 'English');
  }
  
  return link;
}

/**
 * Fetch farms data from data/farms.json
 */
async function fetchFarmsData() {
  try {
    const res = await fetch('data/farms.json');
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching farms data:', error);
    return [];
  }
}

/**
 * Get a single farm by ID
 */
async function getFarmById(farmId) {
  const farms = await fetchFarmsData();
  return farms.find(f => f.id === farmId);
}

/**
 * Get all active farms
 */
async function getActiveFarms() {
  const farms = await fetchFarmsData();
  return farms.filter(f => f.status === 'active');
}

/**
 * Error handling helper
 */
function showError(elementId, message) {
  const el = document.getElementById(elementId);
  if (el) {
    el.textContent = message;
    el.style.display = 'block';
  }
}

function clearError(elementId) {
  const el = document.getElementById(elementId);
  if (el) {
    el.textContent = '';
    el.style.display = 'none';
  }
}

/**
 * Export for use in other scripts
 * Make functions globally available
 */
window.MatchaUtils = {
  getParams,
  setCurrentLang,
  getCurrentLang,
  initLanguageFromParams,
  t,
  getTrans,
  getTransArray,
  normalize,
  buildLangToggleLink,
  fetchFarmsData,
  getFarmById,
  getActiveFarms,
  showError,
  clearError
};
