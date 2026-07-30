import styles from './OutputPanel.module.css'
import EmailCard from './EmailCard'
import { t } from '../i18n'

export default function OutputPanel({ lang, variants, profile, isLoading }) {
  if (isLoading) {
    return (
      <div className={styles.panel}>
        <div className={styles.loadingState}>
          <div className={styles.loadingRing} />
          <p className={styles.loadingText}>{t(lang, 'generating')}</p>
          <p className={styles.loadingSubtext}>
            AIが日本語ビジネスメールを2案生成しています…
          </p>
        </div>
      </div>
    )
  }

  if (!variants || variants.length === 0) {
    return (
      <div className={styles.panel}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>✉</div>
          <p className={styles.emptyText}>{t(lang, 'noResult')}</p>
          <p className={styles.emptySubtext}>
            左側のフォームに入力し「メールを生成」を押してください
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.panel}>
      <h2 className={styles.title}>{t(lang, 'generatedTitle')}</h2>
      <div className={styles.variantList}>
        {variants.map((v, i) => (
          <EmailCard
            key={`${v.label}-${i}`}
            lang={lang}
            variant={v}
            index={i}
            profile={profile}
          />
        ))}
      </div>
    </div>
  )
}
