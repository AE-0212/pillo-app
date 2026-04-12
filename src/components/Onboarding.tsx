import { useState } from 'react'

// ─── Data ────────────────────────────────────────────────────────────────────

const questions = [
  {
    id: 1,
    title: 'Was ist dein Hauptziel?',
    subtitle: null,
    multi: false,
    options: [
      { key: 'A', text: 'Gesünder leben' },
      { key: 'B', text: 'Mehr Energie im Alltag' },
      { key: 'C', text: 'Körperlich fitter werden' },
      { key: 'D', text: 'Stress reduzieren' },
      { key: 'E', text: 'Langfristig gesund altern' },
      { key: 'F', text: 'Bessere Routinen aufbauen' },
    ],
  },
  {
    id: 2,
    title: 'Was fällt dir aktuell am schwersten?',
    subtitle: null,
    multi: false,
    options: [
      { key: 'A', text: 'Regelmäßig Bewegung' },
      { key: 'B', text: 'Gesunde Ernährung' },
      { key: 'C', text: 'Genug Erholung' },
      { key: 'D', text: 'Stress im Alltag' },
      { key: 'E', text: 'Fehlende Routine' },
    ],
  },
  {
    id: 3,
    title: 'Wo stehst du gerade?',
    subtitle: null,
    multi: false,
    options: [
      { key: 'A', text: 'Ich starte gerade erst' },
      { key: 'B', text: 'Ich bin unregelmäßig dabei' },
      { key: 'C', text: 'Ich mache schon einiges, aber nicht konsequent' },
      { key: 'D', text: 'Ich bin ziemlich gut unterwegs' },
    ],
  },
  {
    id: 4,
    title: 'Was hält dich am häufigsten davon ab?',
    subtitle: 'Wähle bis zu 3 Antworten',
    multi: true,
    maxSelect: 3,
    options: [
      { key: 'A', text: 'Zeitmangel' },
      { key: 'B', text: 'Wenig Energie' },
      { key: 'C', text: 'Fehlende Motivation' },
      { key: 'D', text: 'Ich weiß nicht genau wie' },
      { key: 'E', text: 'Mein Alltag ist zu unregelmäßig' },
    ],
  },
  {
    id: 5,
    title: 'Wie möchtest du unterstützt werden?',
    subtitle: null,
    multi: false,
    options: [
      { key: 'A', text: 'Klare Empfehlungen' },
      { key: 'B', text: 'Flexible Vorschläge' },
      { key: 'C', text: 'Kleine tägliche Impulse' },
      { key: 'D', text: 'Nur wenn ich es brauche' },
    ],
  },
  {
    id: 6,
    title: 'Wie viel Zeit möchtest du täglich investieren?',
    subtitle: null,
    multi: false,
    options: [
      { key: 'A', text: '5–10 Min' },
      { key: 'B', text: '10–20 Min' },
      { key: 'C', text: '20–40 Min' },
      { key: 'D', text: 'Flexibel' },
    ],
  },
]

const pillars = [
  { label: 'Essen', bg: '#C8DEC7', textColor: '#1E3A1C', icon: 'fa-apple-whole' },
  { label: 'Bewegung', bg: '#F5C8CC', textColor: '#7A0F1B', icon: 'fa-heart-pulse' },
  { label: 'Erholung', bg: '#D5D7DF', textColor: '#0F1220', icon: 'fa-spa' },
  { label: 'Mental', bg: '#E8DBCA', textColor: '#4A3520', icon: null },
]

// ─── Types ───────────────────────────────────────────────────────────────────

type Answers = Record<number, string | string[]>

// ─── Sub-components ──────────────────────────────────────────────────────────

function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="w-full h-1 rounded-full" style={{ backgroundColor: '#E8DDD3' }}>
      <div
        className="h-1 rounded-full transition-all duration-300"
        style={{ width: `${(current / total) * 100}%`, backgroundColor: '#7F613D' }}
      />
    </div>
  )
}

function OptionCard({
  letter,
  text,
  selected,
  onSelect,
}: {
  letter: string
  text: string
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      onClick={onSelect}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all"
      style={{
        backgroundColor: selected ? '#EDE3D6' : '#FFFFFF',
        border: `1.5px solid ${selected ? '#7F613D' : '#E8DDD3'}`,
        boxShadow: selected ? 'none' : '0 1px 4px rgba(0,0,0,0.04)',
      }}
    >
      <span
        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
        style={{
          backgroundColor: selected ? '#7F613D' : '#F5EDE4',
          color: selected ? '#FFFFFF' : '#7F613D',
        }}
      >
        {letter}
      </span>
      <span className="text-sm font-medium" style={{ color: '#23283A' }}>
        {text}
      </span>
    </button>
  )
}

// ─── Screens ─────────────────────────────────────────────────────────────────

function WelcomeScreen({ onStart, onSkip }: { onStart: () => void; onSkip: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-svh px-8 text-center" style={{ backgroundColor: '#F5EDE4' }}>
      <div className="flex flex-col items-center gap-6 mb-12">
        <img src="/Manna-App-logo.png" alt="piLLo" style={{ height: '120px', width: 'auto' }} />
        <div>
          <p className="text-base leading-relaxed" style={{ color: '#7F613D' }}>
            Dein persönlicher Begleiter für ein gesünderes Leben
          </p>
        </div>
      </div>

      <div className="w-full flex flex-col items-center gap-4">
        <button
          onClick={onStart}
          className="w-full py-4 rounded-2xl text-white font-semibold text-base"
          style={{ backgroundColor: '#23283A' }}
        >
          Jetzt starten
        </button>
        <button
          onClick={onSkip}
          className="text-sm"
          style={{ color: '#CAAD82' }}
        >
          Überspringen
        </button>
      </div>
    </div>
  )
}

function QuestionScreen({
  question,
  current,
  total,
  answer,
  onAnswer,
  onBack,
  onNext,
}: {
  question: typeof questions[0]
  current: number
  total: number
  answer: string | string[]
  onAnswer: (key: string) => void
  onBack: () => void
  onNext: () => void
}) {
  const selected = Array.isArray(answer) ? answer : answer ? [answer] : []
  const canContinue = selected.length > 0

  return (
    <div className="flex flex-col min-h-svh" style={{ backgroundColor: '#F5EDE4' }}>
      {/* Top bar */}
      <div className="px-6 pt-14 pb-6">
        <div className="flex items-center gap-4 mb-5">
          <button onClick={onBack} className="flex items-center justify-center w-9 h-9 rounded-full" style={{ backgroundColor: '#FFFFFF' }}>
            <i className="fa-solid fa-arrow-left text-sm" style={{ color: '#23283A' }} />
          </button>
          <div className="flex-1">
            <ProgressBar current={current} total={total} />
          </div>
          <span className="text-xs font-medium whitespace-nowrap" style={{ color: '#CAAD82' }}>
            {current} / {total}
          </span>
        </div>
        <h2
          className="text-2xl leading-snug mb-1"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 500, color: '#23283A' }}
        >
          {question.title}
        </h2>
        {question.subtitle && (
          <p className="text-sm" style={{ color: '#9E9E9E' }}>{question.subtitle}</p>
        )}
      </div>

      {/* Options */}
      <div className="flex-1 overflow-y-auto px-6 flex flex-col gap-3">
        {question.options.map((opt) => (
          <OptionCard
            key={opt.key}
            letter={opt.key}
            text={opt.text}
            selected={selected.includes(opt.key)}
            onSelect={() => onAnswer(opt.key)}
          />
        ))}
      </div>

      {/* Continue */}
      <div className="px-6 py-6">
        <button
          onClick={onNext}
          disabled={!canContinue}
          className="w-full py-4 rounded-2xl text-white font-semibold text-base transition-opacity"
          style={{
            backgroundColor: '#23283A',
            opacity: canContinue ? 1 : 0.35,
          }}
        >
          Weiter
        </button>
      </div>
    </div>
  )
}

function SummaryScreen({ answers, onFinish }: { answers: Answers; onFinish: () => void }) {
  const goal = questions[0].options.find((o) => o.key === answers[1])?.text ?? '–'
  const hurdle = questions[1].options.find((o) => o.key === answers[2])?.text ?? '–'
  const approach = questions[4].options.find((o) => o.key === answers[5])?.text ?? '–'
  const time = questions[5].options.find((o) => o.key === answers[6])?.text ?? '–'

  const rows = [
    { label: 'Dein Ziel', value: goal },
    { label: 'Größte Hürde', value: hurdle },
    { label: 'Dein Ansatz', value: approach },
    { label: 'Tägliche Zeit', value: time },
  ]

  return (
    <div className="flex flex-col min-h-svh" style={{ backgroundColor: '#F5EDE4' }}>
      {/* Dark header */}
      <div className="px-6 pt-14 pb-8" style={{ backgroundColor: '#23283A' }}>
        <p className="text-xs font-medium tracking-widest uppercase mb-2" style={{ color: '#CAAD82' }}>
          Bereit für den Start
        </p>
        <h2
          className="text-3xl text-white"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
        >
          Dein persönliches Profil
        </h2>
      </div>

      <div className="flex-1 px-6 pt-6 flex flex-col gap-5 overflow-y-auto">
        {/* Profile card */}
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          {rows.map((row, i) => (
            <div
              key={row.label}
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: i < rows.length - 1 ? '1px solid #F0EAE2' : 'none' }}
            >
              <span className="text-sm" style={{ color: '#9E9E9E' }}>{row.label}</span>
              <span className="text-sm font-semibold text-right max-w-[55%]" style={{ color: '#23283A' }}>
                {row.value}
              </span>
            </div>
          ))}
        </div>

        {/* Pillar grid */}
        <p className="text-sm font-medium" style={{ color: '#7F613D' }}>Deine vier Bereiche</p>
        <div className="grid grid-cols-2 gap-3">
          {pillars.map((p) => (
            <div
              key={p.label}
              className="flex flex-col items-center justify-center py-5 px-3 relative"
              style={{ backgroundColor: p.bg, borderRadius: '20px' }}
            >
              {/* Recommendation badge */}
              <span
                className="absolute top-2 right-2 text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: '#CAAD82', color: '#23283A' }}
              >
                ★
              </span>
              {p.icon ? (
                <i className={`fa-solid ${p.icon}`} style={{ fontSize: '28px', color: p.textColor }} />
              ) : (
                <span style={{ fontSize: '28px', color: p.textColor, fontFamily: 'serif', lineHeight: 1 }}>ॐ</span>
              )}
              <p className="text-xs font-semibold mt-2 text-center" style={{ color: p.textColor }}>
                {p.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="px-6 py-6">
        <button
          onClick={onFinish}
          className="w-full py-4 rounded-2xl text-white font-semibold text-base"
          style={{ backgroundColor: '#23283A' }}
        >
          piLLo starten
        </button>
      </div>
    </div>
  )
}

// ─── Main Onboarding ──────────────────────────────────────────────────────────

export default function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0) // 0=welcome, 1-6=questions, 7=summary
  const [answers, setAnswers] = useState<Answers>({})

  const totalQuestions = questions.length

  function handleAnswer(questionId: number, key: string) {
    const q = questions[questionId - 1]
    if (q.multi) {
      const prev = (answers[questionId] as string[]) ?? []
      const already = prev.includes(key)
      if (already) {
        setAnswers({ ...answers, [questionId]: prev.filter((k) => k !== key) })
      } else if (prev.length < (q.maxSelect ?? 3)) {
        setAnswers({ ...answers, [questionId]: [...prev, key] })
      }
    } else {
      setAnswers({ ...answers, [questionId]: key })
    }
  }

  function finish() {
    localStorage.setItem('manna_onboarding_done', 'true')
    onComplete()
  }

  // Welcome
  if (step === 0) {
    return <WelcomeScreen onStart={() => setStep(1)} onSkip={finish} />
  }

  // Summary
  if (step === totalQuestions + 1) {
    return <SummaryScreen answers={answers} onFinish={finish} />
  }

  // Questions 1–6
  const q = questions[step - 1]
  const answer = answers[q.id] ?? (q.multi ? [] : '')

  return (
    <div style={{ maxWidth: '390px', margin: '0 auto' }}>
      <QuestionScreen
        question={q}
        current={step}
        total={totalQuestions}
        answer={answer}
        onAnswer={(key) => handleAnswer(q.id, key)}
        onBack={() => setStep(step - 1)}
        onNext={() => setStep(step + 1)}
      />
    </div>
  )
}
