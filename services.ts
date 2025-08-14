import { Injectable, signal } from '@angular/core';

export type LocaleCode = 'en-us' | 'pt-br' | 'es-es';

const SUPPORTED: LocaleCode[] = ['en-us', 'pt-br', 'es-es'];
const STORAGE_KEY = 'app.lang';

@Injectable({ providedIn: 'root' })
export class LanguageClient {
  private readonly langSignal = signal<LocaleCode>(this.initLanguage());

  /** Get the current language code (e.g., 'en-us') */
  getLanguage(): LocaleCode {
    return this.langSignal();
  }

  /**
   * Set language. Accepts anything ('en', 'EN-US', 'pt_PT', etc.),
   * normalizes to one of: 'en-us' | 'pt-br' | 'es-es'.
   * Persists to localStorage and returns the normalized value.
   */
  setLanguage(input: string): LocaleCode {
    const normalized = this.normalize(input);
    this.langSignal.set(normalized);
    this.saveToStorage(normalized);
    return normalized;
  }

  // ---- internals ----------------------------------------------------------

  private initLanguage(): LocaleCode {
    // 1) stored preference
    const stored = this.readFromStorage();
    if (stored) return stored;

    // 2) browser preference
    const detected = this.detectFromBrowser();
    this.saveToStorage(detected);
    return detected;
  }

  private detectFromBrowser(): LocaleCode {
    try {
      if (typeof navigator === 'undefined') return 'en-us';
      const candidates: string[] = Array.isArray(navigator.languages) && navigator.languages.length
        ? navigator.languages
        : (navigator.language ? [navigator.language] : []);
      for (const c of candidates) {
        const normalized = this.normalize(c);
        if (SUPPORTED.includes(normalized)) return normalized;
      }
    } catch { /* ignore */ }
    return 'en-us';
  }

  private normalize(input?: string): LocaleCode {
    if (!input) return 'en-us';
    const lower = input.toLowerCase().replace('_', '-'); // e.g. EN_US -> en-us
    const primary = lower.split('-')[0];                 // 'en', 'pt', 'es', etc.

    switch (primary) {
      case 'pt': return 'pt-br';
      case 'es': return 'es-es';
      case 'en':
      default:   return 'en-us';
    }
  }

  private readFromStorage(): LocaleCode | null {
    try {
      if (typeof localStorage === 'undefined') return null;
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      // Validate stored value is supported; otherwise disregard.
      const val = raw.toLowerCase() as LocaleCode;
      return SUPPORTED.includes(val) ? val : null;
    } catch {
      return null;
    }
  }

  private saveToStorage(lang: LocaleCode): void {
    try {
      if (typeof localStorage === 'undefined') return;
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignore storage failures (private mode, quotas, etc.) */
    }
  }
}
