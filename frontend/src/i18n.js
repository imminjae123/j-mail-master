/**
 * i18n.js — 多言語対応 (日本語 / English / 한국어)
 * 出力メール本文は常に日本語
 */

export const LANGUAGES = [
  { code: 'ja', label: '日本語' },
  { code: 'en', label: 'English' },
  { code: 'ko', label: '한국어' },
]

export const translations = {
  ja: {
    appTitle:     'J-Mail Master',
    appSubtitle:  '日本語ビジネスメール自動生成',
    profile:      'プロフィール設定',
    generate:     'メールを生成',
    generating:   '生成中...',

    // Form labels
    purpose:      'メールの目的',
    relationship: '相手との関係性',
    tone:         'トーン＆マナー',
    coreReqs:     'コア要件',
    coreReqsHint: '送りたい内容を箇条書きで入力してください（日時、金額などの事実は正確に）',

    // Purpose options
    purposeOpts: [
      { value: '新規営業・提案',    label: '新規営業・提案' },
      { value: '日程調整',          label: '日程調整' },
      { value: '謝罪・クレーム対応',label: '謝罪・クレーム対応' },
      { value: '社内報告',          label: '社内報告' },
      { value: 'お礼',              label: 'お礼' },
    ],

    // Relationship options
    relationshipOpts: [
      { value: '社外（新規顧客）',      label: '社外（新規顧客）' },
      { value: '社外（既存パートナー）', label: '社外（既存パートナー）' },
      { value: '社内（上司）',           label: '社内（上司）' },
      { value: '社内（同僚・他部署）',   label: '社内（同僚・他部署）' },
    ],

    // Tone options
    tonePolite:   '可能な限り丁寧（季節の挨拶含む）',
    toneConcise:  '簡潔・明確（本題中心）',

    // Output
    generatedTitle: '生成結果',
    subject:        '件名',
    copyAll:        'コピー',
    copied:         'コピー済み!',
    noResult:       'ここに生成結果が表示されます',

    // Refine chips
    refineLabel:   '修正チップ',
    morePolite:    '✨ もっと丁寧に修正',
    shorter:       '✂️ もっと短く簡潔に要約',
    softenUrgency: '🤝 催促のニュアンスを柔らかく緩和',
    addSeasonal:   '🌸 季節の挨拶を追加',
    refining:      '修正中...',

    // Profile
    profileTitle:   'プロフィール設定',
    profileHint:    '入力した情報はブラウザ（LocalStorage）に保存されます',
    companyName:    '会社名',
    department:     '部署',
    jobTitle:       '役職',
    yourName:       '氏名',
    signature:      '署名（シグネチャー）',
    signatureHint:  '空の場合は会社名・部署・役職・氏名から自動生成します',
    save:           '保存',
    close:          '閉じる',

    // Variant labels
    variantPolite:  '非常に丁寧',
    variantConcise: '簡潔・明確',
  },

  en: {
    appTitle:     'J-Mail Master',
    appSubtitle:  'Japanese Business Email Generator',
    profile:      'Profile Settings',
    generate:     'Generate Email',
    generating:   'Generating...',

    purpose:      'Email Purpose',
    relationship: 'Recipient Relationship',
    tone:         'Tone & Style',
    coreReqs:     'Core Requirements',
    coreReqsHint: 'Describe what you want to convey (include exact dates, amounts, names)',

    purposeOpts: [
      { value: '新規営業・提案',    label: 'New Sales / Proposal' },
      { value: '日程調整',          label: 'Schedule Coordination' },
      { value: '謝罪・クレーム対応',label: 'Apology / Complaint Response' },
      { value: '社内報告',          label: 'Internal Report' },
      { value: 'お礼',              label: 'Thank You' },
    ],

    relationshipOpts: [
      { value: '社外（新規顧客）',      label: 'External (New Client)' },
      { value: '社外（既存パートナー）', label: 'External (Existing Partner)' },
      { value: '社内（上司）',           label: 'Internal (Supervisor)' },
      { value: '社内（同僚・他部署）',   label: 'Internal (Colleague / Other Dept.)' },
    ],

    tonePolite:   'As Polite as Possible (incl. seasonal greetings)',
    toneConcise:  'Concise & Clear (focus on key points)',

    generatedTitle: 'Generated Result',
    subject:        'Subject',
    copyAll:        'Copy',
    copied:         'Copied!',
    noResult:       'Your generated emails will appear here',

    refineLabel:   'Refine Chips',
    morePolite:    '✨ Make More Polite',
    shorter:       '✂️ Make Shorter & Concise',
    softenUrgency: '🤝 Soften Urgency Tone',
    addSeasonal:   '🌸 Add Seasonal Greeting',
    refining:      'Refining...',

    profileTitle:  'Profile Settings',
    profileHint:   'Your information is saved in your browser (LocalStorage)',
    companyName:   'Company Name',
    department:    'Department',
    jobTitle:      'Job Title',
    yourName:      'Your Name',
    signature:     'Email Signature',
    signatureHint: 'If empty, auto-generated from company/dept/title/name',
    save:          'Save',
    close:         'Close',

    variantPolite:  'Very Polite',
    variantConcise: 'Concise & Clear',
  },

  ko: {
    appTitle:     'J-Mail Master',
    appSubtitle:  '일본어 비즈니스 이메일 자동 생성',
    profile:      '프로필 설정',
    generate:     '이메일 생성',
    generating:   '생성 중...',

    purpose:      '이메일 목적',
    relationship: '상대방과의 관계',
    tone:         '톤 & 매너',
    coreReqs:     '핵심 요구사항',
    coreReqsHint: '전달하고 싶은 내용을 입력하세요 (날짜, 금액 등 사실 정보 정확히)',

    purposeOpts: [
      { value: '新規営業・提案',    label: '신규 영업 / 제안' },
      { value: '日程調整',          label: '일정 조정' },
      { value: '謝罪・クレーム対応',label: '사과 / 클레임 대응' },
      { value: '社内報告',          label: '사내 보고' },
      { value: 'お礼',              label: '감사 인사' },
    ],

    relationshipOpts: [
      { value: '社外（新規顧客）',      label: '사외 (신규 고객)' },
      { value: '社外（既存パートナー）', label: '사외 (기존 파트너)' },
      { value: '社内（上司）',           label: '사내 (상사)' },
      { value: '社内（同僚・他部署）',   label: '사내 (동료 / 타부서)' },
    ],

    tonePolite:   '최대한 정중하게 (계절 인사 포함)',
    toneConcise:  '간결하고 명확하게 (본론 중심)',

    generatedTitle: '생성 결과',
    subject:        '제목',
    copyAll:        '복사',
    copied:         '복사됨!',
    noResult:       '생성된 이메일이 여기에 표시됩니다',

    refineLabel:   '수정 칩',
    morePolite:    '✨ 더 정중하게 수정',
    shorter:       '✂️ 더 짧고 간결하게 요약',
    softenUrgency: '🤝 催促 뉘앙스 완화',
    addSeasonal:   '🌸 계절 인사 추가',
    refining:      '수정 중...',

    profileTitle:  '프로필 설정',
    profileHint:   '입력한 정보는 브라우저(LocalStorage)에 저장됩니다',
    companyName:   '회사명',
    department:    '부서',
    jobTitle:      '직함',
    yourName:      '이름',
    signature:     '서명',
    signatureHint: '비어있으면 회사명/부서/직함/이름으로 자동 생성',
    save:          '저장',
    close:         '닫기',

    variantPolite:  '매우 정중',
    variantConcise: '간결·명확',
  },
}

export function t(lang, key) {
  return translations[lang]?.[key] ?? translations.ja[key] ?? key
}
