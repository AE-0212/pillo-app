import { useState } from 'react'

interface Props {
  onComplete: () => void
  onBack: () => void
}

type Answers = {
  q1: string[]
  q2: string[]
  q3: string[]
  q4: string
  q5steps: string
  q5cardio: string
  q6kraft: string
  q6mobil: string
  q7: string[]
}

const RED = '#E52D40'
const RED_LIGHT = '#FAD8DB'

function ProgressBar({ step }: { step: number }) {
  const pct = (step / 7) * 100
  return (
    <div style={{ height: 3, backgroundColor: '#EDD8DA', borderRadius: 2 }}>
      <div
        style={{
          height: '100%',
          width: `${pct}%`,
          backgroundColor: RED,
          borderRadius: 2,
          transition: 'width 0.3s ease',
        }}
      />
    </div>
  )
}

function StepBadge({ step }: { step: number }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '3px 12px',
        borderRadius: 20,
        backgroundColor: RED_LIGHT,
        color: RED,
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: 0.3,
      }}
    >
      {step} / 7
    </span>
  )
}

function QuestionHeader({
  step,
  onBack,
  title,
  hint,
}: {
  step: number
  onBack: () => void
  title: string
  hint?: string
}) {
  return (
    <div style={{ padding: '0 24px 4px' }}>
      <ProgressBar step={step} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, marginBottom: 20 }}>
        <button
          onClick={onBack}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 4px 4px 0', lineHeight: 1 }}
        >
          <i className="fa-solid fa-arrow-left" style={{ color: '#23283A', fontSize: 18 }} />
        </button>
        <StepBadge step={step} />
        <div style={{ width: 26 }} />
      </div>
      <h2
        style={{
          color: '#23283A',
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontSize: 22,
          fontWeight: 500,
          lineHeight: 1.35,
          marginBottom: hint ? 6 : 20,
        }}
      >
        {title}
      </h2>
      {hint && (
        <p style={{ color: '#9E9E9E', fontSize: 13, marginBottom: 18 }}>{hint}</p>
      )}
    </div>
  )
}

interface OptionProps {
  letter: string
  label: string
  selected: boolean
  onPress: () => void
  compact?: boolean
}

function Option({ letter, label, selected, onPress, compact }: OptionProps) {
  return (
    <button
      onClick={onPress}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        width: '100%',
        padding: compact ? '11px 14px' : '13px 16px',
        borderRadius: 14,
        border: `1.5px solid ${selected ? RED : '#E8E0D8'}`,
        backgroundColor: selected ? RED_LIGHT : '#FFFFFF',
        cursor: 'pointer',
        transition: 'all 0.15s',
        marginBottom: compact ? 8 : 10,
        textAlign: 'left',
      }}
    >
      <span
        style={{
          minWidth: 26,
          height: 26,
          borderRadius: '50%',
          backgroundColor: selected ? RED : '#F0EBE4',
          color: selected ? '#FFFFFF' : '#6B5B4E',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 11,
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {letter}
      </span>
      <span style={{ color: '#23283A', fontSize: 14, lineHeight: 1.4 }}>{label}</span>
    </button>
  )
}

function GridOption({ letter, label, selected, onPress }: OptionProps) {
  return (
    <button
      onClick={onPress}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '11px 12px',
        borderRadius: 14,
        border: `1.5px solid ${selected ? RED : '#E8E0D8'}`,
        backgroundColor: selected ? RED_LIGHT : '#FFFFFF',
        cursor: 'pointer',
        transition: 'all 0.15s',
        textAlign: 'left',
        width: '100%',
      }}
    >
      <span
        style={{
          minWidth: 24,
          height: 24,
          borderRadius: '50%',
          backgroundColor: selected ? RED : '#F0EBE4',
          color: selected ? '#FFFFFF' : '#6B5B4E',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 11,
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {letter}
      </span>
      <span style={{ color: '#23283A', fontSize: 13, lineHeight: 1.35 }}>{label}</span>
    </button>
  )
}

function scoreToStatus(score: number): { label: string; color: string } {
  if (score >= 0.75) return { label: 'Gut', color: '#27AE60' }
  if (score >= 0.4) return { label: 'Aufbauen', color: '#E67E22' }
  return { label: 'Fehlt', color: RED }
}

function scoreToColor(score: number): string {
  if (score >= 0.75) return '#27AE60'
  if (score >= 0.4) return '#E67E22'
  return RED
}

const stepScoreMap: Record<string, number> = {
  A: 0,
  B: 0.33,
  C: 0.75,
  D: 1.0,
}

const stepsScoreMap: Record<string, number> = {
  A: 0,
  B: 0.4,
  C: 0.75,
  D: 1.0,
}

const activityLabels: Record<string, string> = {
  A: 'Yoga',
  B: 'Wandern',
  C: 'Radfahren',
  D: 'Tanzen',
  E: 'Schwimmen',
  F: 'Krafttraining',
  G: 'Laufen',
  H: 'Klettern',
  I: 'Wintersport',
  J: 'Teamsport',
  K: 'Calisthenics',
  L: 'Anderes',
}

export default function BewegungOnboarding({ onComplete, onBack }: Props) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({
    q1: [],
    q2: [],
    q3: [],
    q4: '',
    q5steps: '',
    q5cardio: '',
    q6kraft: '',
    q6mobil: '',
    q7: [],
  })

  function goBack() {
    if (step === 0) {
      onBack()
    } else {
      setStep(s => s - 1)
    }
  }

  function goNext() {
    setStep(s => s + 1)
  }

  function toggleMulti(key: 'q1' | 'q2' | 'q3' | 'q7', value: string, max?: number) {
    setAnswers(prev => {
      const current = prev[key] as string[]
      if (current.includes(value)) {
        return { ...prev, [key]: current.filter(v => v !== value) }
      }
      if (max && current.length >= max) return prev
      return { ...prev, [key]: [...current, value] }
    })
  }

  function setSingle(key: 'q4' | 'q5steps' | 'q5cardio' | 'q6kraft' | 'q6mobil', value: string) {
    setAnswers(prev => ({ ...prev, [key]: value }))
  }

  function finish() {
    localStorage.setItem('bewegung-onboarding-done', 'true')
    onComplete()
  }

  const container: React.CSSProperties = {
    minHeight: '100svh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#F5EDE4',
    maxWidth: 390,
    margin: '0 auto',
    position: 'relative',
    overflowX: 'hidden',
  }

  // ── SPLASH ─────────────────────────────────────────────────────────────────
  if (step === 0) {
    return (
      <div style={{ ...container, backgroundColor: RED, justifyContent: 'space-between', padding: '60px 28px 48px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, justifyContent: 'center', gap: 24 }}>
          <div style={{ width: 88, height: 88, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="fa-solid fa-heart-pulse" style={{ fontSize: 44, color: '#FFFFFF' }} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <h1
              style={{
                color: '#FFFFFF',
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: 36,
                fontWeight: 500,
                marginBottom: 14,
                lineHeight: 1.2,
              }}
            >
              Bewegung
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, lineHeight: 1.55, maxWidth: 280 }}>
              7 kurze Fragen — wir erstellen deinen persönlichen Longevity Movement Score.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <button
            onClick={goNext}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: 20,
              border: 'none',
              backgroundColor: '#FFFFFF',
              color: RED,
              fontSize: 16,
              fontWeight: 700,
              cursor: 'pointer',
              letterSpacing: 0.3,
            }}
          >
            Los geht's
          </button>
          <button
            onClick={onBack}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.75)', fontSize: 14 }}
          >
            Zurück
          </button>
        </div>
      </div>
    )
  }

  // ── QUESTION 1 ─────────────────────────────────────────────────────────────
  if (step === 1) {
    const opts = [
      { k: 'A', v: 'Gesundheit & gesund altern' },
      { k: 'B', v: 'Energie im Alltag' },
      { k: 'C', v: 'Stress abbauen / mentale Gesundheit' },
      { k: 'D', v: 'Spaß an Bewegung' },
      { k: 'E', v: 'Leistungsfähigkeit / Fitness' },
      { k: 'F', v: 'Körpergefühl / Beweglichkeit' },
      { k: 'G', v: 'Natur / draußen sein' },
      { k: 'H', v: 'Schmerzen vorbeugen' },
    ]
    const canNext = answers.q1.length > 0
    return (
      <div style={container}>
        <div style={{ flex: 1, paddingTop: 56, paddingBottom: 100, overflowY: 'auto' }}>
          <QuestionHeader step={1} onBack={goBack} title="Was motiviert dich am meisten?" hint="Bis zu 3 Antworten möglich" />
          <div style={{ padding: '0 24px' }}>
            {opts.map(o => (
              <Option key={o.k} letter={o.k} label={o.v} selected={answers.q1.includes(o.k)} onPress={() => toggleMulti('q1', o.k, 3)} />
            ))}
          </div>
        </div>
        <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 390, padding: '16px 24px 32px', backgroundColor: '#F5EDE4', borderTop: '1px solid rgba(202,173,130,0.2)' }}>
          <button
            onClick={goNext}
            disabled={!canNext}
            style={{ width: '100%', padding: '15px', borderRadius: 20, border: 'none', backgroundColor: RED, color: '#FFF', fontSize: 15, fontWeight: 700, cursor: canNext ? 'pointer' : 'not-allowed', opacity: canNext ? 1 : 0.35, transition: 'opacity 0.2s' }}
          >
            Weiter
          </button>
        </div>
      </div>
    )
  }

  // ── QUESTION 2 ─────────────────────────────────────────────────────────────
  if (step === 2) {
    const opts = [
      { k: 'A', v: 'Zeit / voller Alltag' },
      { k: 'B', v: 'Energie / Müdigkeit' },
      { k: 'C', v: 'Schmerzen oder körperliche Beschwerden' },
      { k: 'D', v: 'Fehlende Routine' },
      { k: 'E', v: 'Zu hohe Erwartungen an mich selbst' },
      { k: 'F', v: 'Motivation schwankt' },
      { k: 'G', v: 'Ich weiß nicht genau was ich machen soll' },
    ]
    const canNext = answers.q2.length > 0
    return (
      <div style={container}>
        <div style={{ flex: 1, paddingTop: 56, paddingBottom: 100, overflowY: 'auto' }}>
          <QuestionHeader step={2} onBack={goBack} title="Was hält dich davon ab?" hint="Bis zu 3 Antworten möglich" />
          <div style={{ padding: '0 24px' }}>
            {opts.map(o => (
              <Option key={o.k} letter={o.k} label={o.v} selected={answers.q2.includes(o.k)} onPress={() => toggleMulti('q2', o.k, 3)} />
            ))}
          </div>
        </div>
        <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 390, padding: '16px 24px 32px', backgroundColor: '#F5EDE4', borderTop: '1px solid rgba(202,173,130,0.2)' }}>
          <button
            onClick={goNext}
            disabled={!canNext}
            style={{ width: '100%', padding: '15px', borderRadius: 20, border: 'none', backgroundColor: RED, color: '#FFF', fontSize: 15, fontWeight: 700, cursor: canNext ? 'pointer' : 'not-allowed', opacity: canNext ? 1 : 0.35, transition: 'opacity 0.2s' }}
          >
            Weiter
          </button>
        </div>
      </div>
    )
  }

  // ── QUESTION 3 ─────────────────────────────────────────────────────────────
  if (step === 3) {
    const opts = [
      { k: 'A', v: 'Yoga' },
      { k: 'B', v: 'Wandern' },
      { k: 'C', v: 'Radfahren' },
      { k: 'D', v: 'Tanzen' },
      { k: 'E', v: 'Schwimmen' },
      { k: 'F', v: 'Krafttraining' },
      { k: 'G', v: 'Laufen' },
      { k: 'H', v: 'Klettern' },
      { k: 'I', v: 'Wintersport' },
      { k: 'J', v: 'Teamsport' },
      { k: 'K', v: 'Calisthenics' },
      { k: 'L', v: 'Anderes' },
    ]
    const canNext = answers.q3.length > 0
    return (
      <div style={container}>
        <div style={{ flex: 1, paddingTop: 56, paddingBottom: 100, overflowY: 'auto' }}>
          <QuestionHeader step={3} onBack={goBack} title="Was macht dir Spaß?" hint="Alles auswählen, was zutrifft" />
          <div style={{ padding: '0 24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {opts.map(o => (
                <GridOption key={o.k} letter={o.k} label={o.v} selected={answers.q3.includes(o.k)} onPress={() => toggleMulti('q3', o.k)} />
              ))}
            </div>
          </div>
        </div>
        <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 390, padding: '16px 24px 32px', backgroundColor: '#F5EDE4', borderTop: '1px solid rgba(202,173,130,0.2)' }}>
          <button
            onClick={goNext}
            disabled={!canNext}
            style={{ width: '100%', padding: '15px', borderRadius: 20, border: 'none', backgroundColor: RED, color: '#FFF', fontSize: 15, fontWeight: 700, cursor: canNext ? 'pointer' : 'not-allowed', opacity: canNext ? 1 : 0.35, transition: 'opacity 0.2s' }}
          >
            Weiter
          </button>
        </div>
      </div>
    )
  }

  // ── QUESTION 4 ─────────────────────────────────────────────────────────────
  if (step === 4) {
    const opts = [
      { k: 'A', v: 'Ich bewege mich zu wenig' },
      { k: 'B', v: 'Ich bewege mich regelmäßig, aber nicht optimal' },
      { k: 'C', v: 'Ich mache viel Sport, aber es fehlt Balance' },
      { k: 'D', v: 'Ich bin zufrieden, möchte aber gesünder trainieren' },
    ]
    const canNext = answers.q4 !== ''
    return (
      <div style={container}>
        <div style={{ flex: 1, paddingTop: 56, paddingBottom: 100, overflowY: 'auto' }}>
          <QuestionHeader step={4} onBack={goBack} title="Wo stehst du gerade?" />
          <div style={{ padding: '0 24px' }}>
            {opts.map(o => (
              <Option key={o.k} letter={o.k} label={o.v} selected={answers.q4 === o.k} onPress={() => setSingle('q4', o.k)} />
            ))}
          </div>
        </div>
        <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 390, padding: '16px 24px 32px', backgroundColor: '#F5EDE4', borderTop: '1px solid rgba(202,173,130,0.2)' }}>
          <button
            onClick={goNext}
            disabled={!canNext}
            style={{ width: '100%', padding: '15px', borderRadius: 20, border: 'none', backgroundColor: RED, color: '#FFF', fontSize: 15, fontWeight: 700, cursor: canNext ? 'pointer' : 'not-allowed', opacity: canNext ? 1 : 0.35, transition: 'opacity 0.2s' }}
          >
            Weiter
          </button>
        </div>
      </div>
    )
  }

  // ── QUESTION 5 ─────────────────────────────────────────────────────────────
  if (step === 5) {
    const stepsOpts = [
      { k: 'A', v: 'Unter 4.000' },
      { k: 'B', v: '4.000 – 7.000' },
      { k: 'C', v: '7.000 – 10.000' },
      { k: 'D', v: 'Über 10.000' },
    ]
    const cardioOpts = [
      { k: 'A', v: 'Fast nie' },
      { k: 'B', v: '1× pro Woche' },
      { k: 'C', v: '2–3× pro Woche' },
      { k: 'D', v: 'Mehr als 3× pro Woche' },
    ]
    const canNext = answers.q5steps !== '' && answers.q5cardio !== ''
    return (
      <div style={container}>
        <div style={{ flex: 1, paddingTop: 56, paddingBottom: 100, overflowY: 'auto' }}>
          <QuestionHeader step={5} onBack={goBack} title="Tägliche Bewegung & Ausdauer" />
          <div style={{ padding: '0 24px' }}>
            <p style={{ color: '#6B5B4E', fontSize: 13, fontWeight: 600, marginBottom: 10, letterSpacing: 0.2 }}>
              Wie viele Schritte täglich?
            </p>
            {stepsOpts.map(o => (
              <Option key={o.k} letter={o.k} label={o.v} selected={answers.q5steps === o.k} onPress={() => setSingle('q5steps', o.k)} compact />
            ))}
            <div style={{ height: 20 }} />
            <p style={{ color: '#6B5B4E', fontSize: 13, fontWeight: 600, marginBottom: 10, letterSpacing: 0.2 }}>
              Wie oft moderate Ausdauer?
            </p>
            {cardioOpts.map(o => (
              <Option key={o.k} letter={o.k} label={o.v} selected={answers.q5cardio === o.k} onPress={() => setSingle('q5cardio', o.k)} compact />
            ))}
          </div>
        </div>
        <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 390, padding: '16px 24px 32px', backgroundColor: '#F5EDE4', borderTop: '1px solid rgba(202,173,130,0.2)' }}>
          <button
            onClick={goNext}
            disabled={!canNext}
            style={{ width: '100%', padding: '15px', borderRadius: 20, border: 'none', backgroundColor: RED, color: '#FFF', fontSize: 15, fontWeight: 700, cursor: canNext ? 'pointer' : 'not-allowed', opacity: canNext ? 1 : 0.35, transition: 'opacity 0.2s' }}
          >
            Weiter
          </button>
        </div>
      </div>
    )
  }

  // ── QUESTION 6 ─────────────────────────────────────────────────────────────
  if (step === 6) {
    const kraftOpts = [
      { k: 'A', v: 'Fast nie' },
      { k: 'B', v: '1× pro Woche' },
      { k: 'C', v: '2× pro Woche' },
      { k: 'D', v: 'Mehr als 2×' },
    ]
    const mobilOpts = [
      { k: 'A', v: 'Selten' },
      { k: 'B', v: '1× pro Woche' },
      { k: 'C', v: '2–3× pro Woche' },
      { k: 'D', v: 'Fast täglich' },
    ]
    const canNext = answers.q6kraft !== '' && answers.q6mobil !== ''
    return (
      <div style={container}>
        <div style={{ flex: 1, paddingTop: 56, paddingBottom: 100, overflowY: 'auto' }}>
          <QuestionHeader step={6} onBack={goBack} title="Kraft & Mobilität" />
          <div style={{ padding: '0 24px' }}>
            <p style={{ color: '#6B5B4E', fontSize: 13, fontWeight: 600, marginBottom: 10, letterSpacing: 0.2 }}>
              Wie oft Krafttraining?
            </p>
            {kraftOpts.map(o => (
              <Option key={o.k} letter={o.k} label={o.v} selected={answers.q6kraft === o.k} onPress={() => setSingle('q6kraft', o.k)} compact />
            ))}
            <div style={{ height: 20 }} />
            <p style={{ color: '#6B5B4E', fontSize: 13, fontWeight: 600, marginBottom: 10, letterSpacing: 0.2 }}>
              Wie oft Mobilität / Dehnen?
            </p>
            {mobilOpts.map(o => (
              <Option key={o.k} letter={o.k} label={o.v} selected={answers.q6mobil === o.k} onPress={() => setSingle('q6mobil', o.k)} compact />
            ))}
          </div>
        </div>
        <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 390, padding: '16px 24px 32px', backgroundColor: '#F5EDE4', borderTop: '1px solid rgba(202,173,130,0.2)' }}>
          <button
            onClick={goNext}
            disabled={!canNext}
            style={{ width: '100%', padding: '15px', borderRadius: 20, border: 'none', backgroundColor: RED, color: '#FFF', fontSize: 15, fontWeight: 700, cursor: canNext ? 'pointer' : 'not-allowed', opacity: canNext ? 1 : 0.35, transition: 'opacity 0.2s' }}
          >
            Weiter
          </button>
        </div>
      </div>
    )
  }

  // ── QUESTION 7 ─────────────────────────────────────────────────────────────
  if (step === 7) {
    const opts = [
      { k: 'A', v: 'Knie' },
      { k: 'B', v: 'Rücken' },
      { k: 'C', v: 'Hüfte' },
      { k: 'D', v: 'Schultern / Nacken' },
      { k: 'E', v: 'Keine größeren Beschwerden' },
    ]
    const canNext = answers.q7.length > 0
    return (
      <div style={container}>
        <div style={{ flex: 1, paddingTop: 56, paddingBottom: 100, overflowY: 'auto' }}>
          <QuestionHeader step={7} onBack={goBack} title="Körperliche Beschwerden?" hint="Alles auswählen, was zutrifft" />
          <div style={{ padding: '0 24px' }}>
            {opts.map(o => (
              <Option key={o.k} letter={o.k} label={o.v} selected={answers.q7.includes(o.k)} onPress={() => toggleMulti('q7', o.k)} />
            ))}
          </div>
        </div>
        <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 390, padding: '16px 24px 32px', backgroundColor: '#F5EDE4', borderTop: '1px solid rgba(202,173,130,0.2)' }}>
          <button
            onClick={goNext}
            disabled={!canNext}
            style={{ width: '100%', padding: '15px', borderRadius: 20, border: 'none', backgroundColor: RED, color: '#FFF', fontSize: 15, fontWeight: 700, cursor: canNext ? 'pointer' : 'not-allowed', opacity: canNext ? 1 : 0.35, transition: 'opacity 0.2s' }}
          >
            Auswertung anzeigen
          </button>
        </div>
      </div>
    )
  }

  // ── SUMMARY ────────────────────────────────────────────────────────────────
  const bewegungScore = stepsScoreMap[answers.q5steps] ?? 0
  const cardioScore = stepScoreMap[answers.q5cardio] ?? 0
  const kraftScore = stepScoreMap[answers.q6kraft] ?? 0
  const mobilScore = stepScoreMap[answers.q6mobil] ?? 0
  const varietyCount = answers.q3.length
  const varietyScore = varietyCount === 0 ? 0 : varietyCount === 1 ? 0.2 : varietyCount === 2 ? 0.4 : varietyCount === 3 ? 0.6 : varietyCount >= 4 ? 1.0 : 0

  const metrics = [
    {
      icon: 'fa-solid fa-shoe-prints',
      label: 'Tägliche Bewegung',
      score: bewegungScore,
    },
    {
      icon: 'fa-solid fa-heart-pulse',
      label: 'Zone 2 Cardio',
      score: cardioScore,
    },
    {
      icon: 'fa-solid fa-dumbbell',
      label: 'Kraft',
      score: kraftScore,
    },
    {
      icon: 'fa-solid fa-person-stretching',
      label: 'Mobilität',
      score: mobilScore,
    },
    {
      icon: 'fa-solid fa-layer-group',
      label: 'Bewegungsvielfalt',
      score: varietyScore,
    },
  ]

  const selectedActivities = answers.q3.map(k => activityLabels[k]).filter(Boolean)

  return (
    <div style={{ ...container, overflowY: 'auto', paddingBottom: 100 }}>
      {/* Dark header */}
      <div
        style={{
          backgroundColor: '#23283A',
          padding: '52px 24px 28px',
          borderRadius: '0 0 24px 24px',
        }}
      >
        <button
          onClick={goBack}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 16px', lineHeight: 1 }}
        >
          <i className="fa-solid fa-arrow-left" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }} />
        </button>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>
          Dein Ergebnis
        </p>
        <h1
          style={{
            color: '#FFFFFF',
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 26,
            fontWeight: 500,
            lineHeight: 1.25,
            marginBottom: 0,
          }}
        >
          Longevity Movement Score
        </h1>
      </div>

      {/* Metrics card */}
      <div style={{ margin: '20px 20px 0', backgroundColor: '#FFFFFF', borderRadius: 20, padding: '20px 18px', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
        {metrics.map((m, i) => {
          const { label: statusLabel, color: statusColor } = scoreToStatus(m.score)
          const barColor = scoreToColor(m.score)
          return (
            <div
              key={m.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: i < metrics.length - 1 ? 16 : 0,
              }}
            >
              {/* Icon */}
              <i className={m.icon} style={{ color: '#9E9E9E', fontSize: 14, width: 16, textAlign: 'center', flexShrink: 0 }} />
              {/* Label */}
              <span style={{ color: '#23283A', fontSize: 13, fontWeight: 500, flexShrink: 0, width: 110 }}>{m.label}</span>
              {/* Progress bar */}
              <div style={{ flex: 1, height: 6, backgroundColor: '#F0EBE4', borderRadius: 3 }}>
                <div
                  style={{
                    height: '100%',
                    width: `${m.score * 100}%`,
                    backgroundColor: barColor,
                    borderRadius: 3,
                    transition: 'width 0.6s ease',
                  }}
                />
              </div>
              {/* Badge */}
              <span
                style={{
                  flexShrink: 0,
                  fontSize: 11,
                  fontWeight: 700,
                  color: statusColor,
                  backgroundColor: statusColor + '18',
                  padding: '3px 9px',
                  borderRadius: 10,
                  minWidth: 58,
                  textAlign: 'center',
                }}
              >
                {statusLabel}
              </span>
            </div>
          )
        })}
      </div>

      {/* Activities chips */}
      {selectedActivities.length > 0 && (
        <div style={{ margin: '20px 20px 0' }}>
          <p style={{ color: '#6B5B4E', fontSize: 13, fontWeight: 600, marginBottom: 12, letterSpacing: 0.2 }}>
            Passende Aktivitäten für dich
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {selectedActivities.map(act => (
              <span
                key={act}
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  backgroundColor: RED_LIGHT,
                  color: RED,
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {act}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div style={{ margin: '24px 20px 0' }}>
        <button
          onClick={finish}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: 20,
            border: 'none',
            backgroundColor: RED,
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: 0.3,
          }}
        >
          Bewegung einrichten
        </button>
      </div>
    </div>
  )
}
