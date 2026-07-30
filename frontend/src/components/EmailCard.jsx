import { useState } from 'react'
import styles from './EmailCard.module.css'
import { t } from '../i18n'

const REFINE_ACTIONS = [
  { key: 'morePolite',    action: 'more_polite'    },
  { key: 'shorter',       action: 'shorter'        },
  { key: 'softenUrgency', action: 'soften_urgency' },
  { key: 'addSeasonal',   action: 'add_seasonal'   },
]

export default function EmailCard({ lang, variant, index, profile }) {
  const [subject, setSubject] = useState(variant.subject)
  const [body, setBody]       = useState(variant.body)
  const [copied, setCopied]   = useState(false)
  const [refiningKey, setRefiningKey] = useState(null)
  const [error, setError] = useState(null)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`件名: ${subject}\n\n${body}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
      const el = document.createElement('textarea')
      el.value = `件名: ${subject}\n\n${body}`
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleRefine = async (action, chipKey) => {
    setRefiningKey(chipKey)
    setError(null)
    try {
      const res = await fetch('/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          body,
          action,
          sender_name:    profile?.yourName    || undefined,
          sender_company: profile?.companyName || undefined,
        }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setSubject(data.subject)
      setBody(data.body)
    } catch {
      setError('修正に失敗しました。再度お試しください。')
    } finally {
      setRefiningKey(null)
    }
  }

  const labelClass = index === 0 ? styles.labelPolite : styles.labelConcise

  return (
    <article className={styles.card}>
      {/* --- ヘッダー --- */}
      <div className={styles.cardHeader}>
        <span className={`${styles.variantBadge} ${labelClass}`}>
          {index === 0 ? '🌸' : '⚡'} {variant.label}
        </span>
        <button
          id={`copy-btn-${index}`}
          className={`${styles.copyBtn} ${copied ? styles.copiedBtn : ''}`}
          onClick={handleCopy}
          title={t(lang, copied ? 'copied' : 'copyAll')}
        >
          {copied ? `✓ ${t(lang, 'copied')}` : `📋 ${t(lang, 'copyAll')}`}
        </button>
      </div>

      {/* --- 件名 --- */}
      <div className={styles.subjectBlock}>
        <span className={styles.subjectLabel}>{t(lang, 'subject')}</span>
        <p className={styles.subjectText}>{subject}</p>
      </div>

      {/* --- 本文 --- */}
      <pre className={styles.body}>{body}</pre>

      {/* --- 修正チップ --- */}
      <div className={styles.refineSection}>
        <p className={styles.refineLabel}>{t(lang, 'refineLabel')}</p>
        <div className={styles.chips}>
          {REFINE_ACTIONS.map(({ key, action }) => (
            <button
              key={key}
              id={`refine-${action}-${index}`}
              className={styles.chip}
              onClick={() => handleRefine(action, key)}
              disabled={refiningKey !== null}
            >
              {refiningKey === key ? (
                <>
                  <span className={styles.chipSpinner} />
                  {t(lang, 'refining')}
                </>
              ) : (
                t(lang, key)
              )}
            </button>
          ))}
        </div>
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </article>
  )
}
