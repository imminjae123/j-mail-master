import styles from './Header.module.css'
import { LANGUAGES, t } from '../i18n'

export default function Header({ lang, onLangChange, onProfileOpen }) {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <span className={styles.logo}>✉</span>
        <div>
          <h1 className={styles.title}>{t(lang, 'appTitle')}</h1>
          <p className={styles.subtitle}>{t(lang, 'appSubtitle')}</p>
        </div>
      </div>

      <div className={styles.controls}>
        {/* 言語切り替え */}
        <div className={styles.langWrapper}>
          <select
            id="lang-select"
            className={styles.langSelect}
            value={lang}
            onChange={(e) => onLangChange(e.target.value)}
            aria-label="Language / 言語 / 언어"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>
          <span className={styles.langIcon}>🌐</span>
        </div>

        {/* プロフィールボタン */}
        <button
          id="open-profile"
          className={styles.profileBtn}
          onClick={onProfileOpen}
          title={t(lang, 'profile')}
        >
          <span className={styles.profileIcon}>👤</span>
          <span className={styles.profileLabel}>{t(lang, 'profile')}</span>
        </button>
      </div>
    </header>
  )
}
