import { useState, useEffect } from 'react'

const STORAGE_KEY = 'jmail_profile'

const defaultProfile = {
  companyName: '',
  department: '',
  jobTitle: '',
  yourName: '',
  signature: '',
}

export function useProfile() {
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? { ...defaultProfile, ...JSON.parse(saved) } : defaultProfile
    } catch {
      return defaultProfile
    }
  })

  const saveProfile = (data) => {
    const updated = { ...defaultProfile, ...data }
    setProfile(updated)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch {
      // LocalStorage 不可時は無視
    }
  }

  return { profile, saveProfile }
}
