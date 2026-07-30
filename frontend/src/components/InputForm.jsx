import { useState } from 'react'
import styles from './InputForm.module.css'
import { t } from '../i18n'

export default function InputForm({ lang, profile, onGenerate, isLoading }) {
  const [purpose, setPurpose] = useState('新規営業・提案')
  const [relationship, setRelationship] = useState('社外（新規顧客）')
  const [tone, setTone] = useState('可能な限り丁寧（季節の挨拶含む）')
  const [coreReqs, setCoreReqs] = useState('')

  const purposeOpts     = t(lang, 'purposeOpts')
  const relationshipOpts = t(lang, 'relationshipOpts')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!coreReqs.trim()) return
    onGenerate({
      purpose,
      relationship,
      tone,
      core_requirements: coreReqs,
      sender_name:        profile.yourName       || undefined,
      sender_company:     profile.companyName    || undefined,
      sender_department:  profile.department     || undefined,
      sender_title:       profile.jobTitle       || undefined,
      sender_signature:   profile.signature      || undefined,
    })
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {/* --- メールの目的 --- */}
      <div className={styles.field}>
        <label htmlFor="purpose" className={styles.label}>
          {t(lang, 'purpose')}
        </label>
        <div className={styles.selectWrapper}>
          <select
            id="purpose"
            className={styles.select}
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
          >
            {purposeOpts.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <span className={styles.selectArrow}>▾</span>
        </div>
      </div>

      {/* --- 相手との関係性 --- */}
      <div className={styles.field}>
        <label htmlFor="relationship" className={styles.label}>
          {t(lang, 'relationship')}
        </label>
        <div className={styles.selectWrapper}>
          <select
            id="relationship"
            className={styles.select}
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
          >
            {relationshipOpts.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <span className={styles.selectArrow}>▾</span>
        </div>
      </div>

      {/* --- トーン＆マナー --- */}
      <div className={styles.field}>
        <fieldset className={styles.fieldset}>
          <legend className={styles.label}>{t(lang, 'tone')}</legend>
          <div className={styles.radioGroup}>
            {[
              { val: '可能な限り丁寧（季節の挨拶含む）', key: 'tonePolite'  },
              { val: '簡潔・明確（本題中心）',            key: 'toneConcise' },
            ].map(({ val, key }) => (
              <label key={val} className={styles.radioLabel}>
                <input
                  type="radio"
                  name="tone"
                  value={val}
                  checked={tone === val}
                  onChange={() => setTone(val)}
                  className={styles.radioInput}
                />
                <span className={styles.radioCustom} />
                <span className={styles.radioText}>{t(lang, key)}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      {/* --- コア要件 --- */}
      <div className={styles.field}>
        <label htmlFor="core-reqs" className={styles.label}>
          {t(lang, 'coreReqs')}
          <span className={styles.required}>*</span>
        </label>
        <textarea
          id="core-reqs"
          className={styles.textarea}
          value={coreReqs}
          onChange={(e) => setCoreReqs(e.target.value)}
          placeholder={t(lang, 'coreReqsHint')}
          rows={6}
          required
        />
      </div>

      {/* --- プロフィール表示 (読み取り専用プレビュー) --- */}
      {(profile.yourName || profile.companyName) && (
        <div className={styles.profilePreview}>
          <span className={styles.profilePreviewIcon}>👤</span>
          <span>
            {[profile.companyName, profile.department, profile.yourName]
              .filter(Boolean).join(' / ')}
          </span>
        </div>
      )}

      {/* --- 生成ボタン --- */}
      <button
        id="generate-btn"
        type="submit"
        className={styles.generateBtn}
        disabled={isLoading || !coreReqs.trim()}
      >
        {isLoading ? (
          <>
            <span className={styles.spinner} />
            {t(lang, 'generating')}
          </>
        ) : (
          <>
            <span>✉</span>
            {t(lang, 'generate')}
          </>
        )}
      </button>
    </form>
  )
}
