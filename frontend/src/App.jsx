import { useState, useEffect } from 'react'
import styles from './App.module.css'
import Header from './components/Header'
import InputForm from './components/InputForm'
import OutputPanel from './components/OutputPanel'
import ProfileModal from './components/ProfileModal'
import { useProfile } from './hooks/useProfile'

const LANG_KEY = 'jmail_lang'

export default function App() {
  // --- 言語状態（localStorage で永続化） ---
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem(LANG_KEY) || 'ja' }
    catch { return 'ja' }
  })

  // --- プロフィール ---
  const { profile, saveProfile } = useProfile()

  // --- 生成状態 ---
  const [variants, setVariants]   = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError]         = useState(null)

  // --- モーダル ---
  const [profileOpen, setProfileOpen] = useState(false)

  // 言語変更時に localStorage に保存
  const handleLangChange = (newLang) => {
    setLang(newLang)
    try { localStorage.setItem(LANG_KEY, newLang) } catch {}
  }

  // --- メール生成 ---
  const handleGenerate = async (params) => {
    setIsLoading(true)
    setError(null)
    setVariants(null)
    try {
      const res = await fetch('/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setVariants(data)
    } catch (err) {
      setError('生成に失敗しました。バックエンドが起動しているか確認してください。')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.app}>
      <Header
        lang={lang}
        onLangChange={handleLangChange}
        onProfileOpen={() => setProfileOpen(true)}
      />

      <main className={styles.main}>
        {/* 左ペイン: 入力フォーム */}
        <section className={styles.leftPane} aria-label="入力フォーム">
          <div className={styles.paneInner}>
            <InputForm
              lang={lang}
              profile={profile}
              onGenerate={handleGenerate}
              isLoading={isLoading}
            />
          </div>
        </section>

        {/* 区切り線 */}
        <div className={styles.divider} />

        {/* 右ペイン: 生成結果 */}
        <section className={styles.rightPane} aria-label="生成結果">
          <div className={styles.paneInner}>
            {error ? (
              <div className={styles.errorBanner}>
                ⚠️ {error}
              </div>
            ) : (
              <OutputPanel
                lang={lang}
                variants={variants}
                profile={profile}
                isLoading={isLoading}
              />
            )}
          </div>
        </section>
      </main>

      {/* プロフィールモーダル */}
      {profileOpen && (
        <ProfileModal
          lang={lang}
          profile={profile}
          onSave={saveProfile}
          onClose={() => setProfileOpen(false)}
        />
      )}
    </div>
  )
}
