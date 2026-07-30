import { useState, useEffect } from 'react'
import styles from './ProfileModal.module.css'
import { t } from '../i18n'

export default function ProfileModal({ lang, profile, onSave, onClose }) {
  const [form, setForm] = useState({ ...profile })

  // ESCキーで閉じる
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(form)
    onClose()
  }

  const fields = [
    { key: 'companyName', id: 'profile-company',    label: t(lang, 'companyName'), type: 'text' },
    { key: 'department',  id: 'profile-department', label: t(lang, 'department'),  type: 'text' },
    { key: 'jobTitle',    id: 'profile-jobtitle',   label: t(lang, 'jobTitle'),    type: 'text' },
    { key: 'yourName',    id: 'profile-name',       label: t(lang, 'yourName'),    type: 'text' },
  ]

  return (
    <div
      className={styles.overlay}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
    >
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 id="profile-modal-title" className={styles.modalTitle}>
            👤 {t(lang, 'profileTitle')}
          </h2>
          <button
            id="close-profile"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label={t(lang, 'close')}
          >
            ✕
          </button>
        </div>

        <p className={styles.hint}>{t(lang, 'profileHint')}</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.fieldGrid}>
            {fields.map(({ key, id, label }) => (
              <div key={key} className={styles.field}>
                <label htmlFor={id} className={styles.label}>{label}</label>
                <input
                  id={id}
                  type="text"
                  className={styles.input}
                  value={form[key] || ''}
                  onChange={handleChange(key)}
                  placeholder={label}
                />
              </div>
            ))}
          </div>

          {/* 署名 */}
          <div className={styles.field}>
            <label htmlFor="profile-signature" className={styles.label}>
              {t(lang, 'signature')}
            </label>
            <textarea
              id="profile-signature"
              className={styles.textarea}
              value={form.signature || ''}
              onChange={handleChange('signature')}
              placeholder={t(lang, 'signatureHint')}
              rows={4}
            />
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
            >
              {t(lang, 'close')}
            </button>
            <button
              id="save-profile"
              type="submit"
              className={styles.saveBtn}
            >
              💾 {t(lang, 'save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
