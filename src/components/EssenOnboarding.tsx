import { useState } from 'react'

interface Props {
  onComplete: () => void
  onBack: () => void
}

type Answers = {
  q1: string
  q2: string
  q3: string
  q4: string
  q5: string
}

const GREEN = '#3C6538'
const GREEN_LIGHT = '#D8E8D7'

function ProgressBar({ step }: { step: number }) {
  const pct = (step / 5) * 100
  return (
    <div style={{ height: 3, backgroundColor: '#C8DEC7', borderRadius: 2 }}>
      <div
        style={{
          height: '100%',
          width: `${pct}%`,
          backgroundColor: GREEN,
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
        backgroundColor: GREEN_LIGHT,
        color: GREEN,
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: 0.3,
      }}
    >
      {step} / 5
    </span>
  )
}

function QuestionHeader({
  step,
  onBack,
  title,
}: {
  step: number
  onBack: () => void
  title: string
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
          marginBottom: 20,
        }}
      >
        {title}
      </h2>
    </div>
  )
}

function Option({
  letter,
  label,
  selected,
  onPress,
}: {
  letter: string
  label: string
  selected: boolean
  onPress: () => void
}) {
  return (
    <button
      onClick={onPress}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        width: '100%',
        padding: '13px 16px',
        borderRadius: 14,
        border: `1.5px solid ${selected ? GREEN : '#E8E0D8'}`,
        backgroundColor: selected ? GREEN_LIGHT : '#FFFFFF',
        cursor: 'pointer',
        transition: 'all 0.15s',
        marginBottom: 10,
        textAlign: 'left',
      }}
    >
      <span
        style={{
          minWidth: 26,
          height: 26,
          borderRadius: '50%',
          backgroundColor: selected ? GREEN : '#F0EBE4',
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

// Summary helpers
function profileTitle(answers: Answers): string {
  const goalMap: Record<string, string> = {
    A: 'Energie + stabile Essstruktur',
    B: 'Gesündere Gewohnheiten',
    C: 'Körpergefühl + Balance',
    D: 'Gewicht + Wohlbefinden',
    E: 'Langfristige Gesundheit',
  }
  return goalMap[answers.q1] ?? 'Dein Ernährungsprofil'
}

function profileRows(answers: Answers): { label: string; value: string }[] {
  const focusMap: Record<string, string> = {
    A: 'Mehr Energie & Vitalität',
    B: 'Gesündere Mahlzeiten',
    C: 'Körperbewusstsein stärken',
    D: 'Gewicht & Wohlbefinden',
    E: 'Longevity-Ernährung',
  }
  const hebelMap: Record<string, string> = {
    A: 'Mahlzeiten planen',
    B: 'Feste Essenszeiten',
    C: 'Heißhunger reduzieren',
    D: 'Schnelle gesunde Optionen',
    E: 'Emotionale Auslöser erkennen',
  }
  const ansatzMap: Record<string, string> = {
    A: 'Unterwegs-tauglich',
    B: 'Zu Hause kochen',
    C: 'Flexibler Mix',
    D: 'Angepasst an deinen Rhythmus',
  }
  return [
    { label: 'Fokus', value: focusMap[answers.q1] ?? '—' },
    { label: 'Hebel', value: hebelMap[answers.q3] ?? '—' },
    { label: 'Ansatz', value: ansatzMap[answers.q5] ?? '—' },
  ]
}

function firstAction(answers: Answers): string {
  const map: Record<string, string> = {
    A: 'Starte mit einem energiereichen Frühstück',
    B: 'Plane heute deine drei Hauptmahlzeiten',
    C: 'Reduziere Snacking zwischen den Mahlzeiten',
    D: 'Bereite morgen früh eine schnelle Mahlzeit vor',
    E: 'Achte heute auf deine Stimmung beim Essen',
  }
  return map[answers.q3] ?? 'Heute eine kleine Anpassung'
}

export default function EssenOnboarding({ onComplete, onBack }: Props) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({ q1: '', q2: '', q3: '', q4: '', q5: '' })

  function goBack() {
    if (step === 0) onBack()
    else setStep(s => s - 1)
  }

  function goNext() {
    setStep(s => s + 1)
  }

  function pick(key: keyof Answers, value: string) {
    setAnswers(prev => ({ ...prev, [key]: value }))
  }

  function finish() {
    localStorage.setItem('essen-onboarding-done', 'true')
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
  }

  const footer: React.CSSProperties = {
    position: 'fixed',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: 390,
    padding: '16px 24px 32px',
    backgroundColor: '#F5EDE4',
    borderTop: '1px solid rgba(60,101,56,0.12)',
  }

  function NextButton({ disabled, label = 'Weiter' }: { disabled: boolean; label?: string }) {
    return (
      <button
        onClick={goNext}
        disabled={disabled}
        style={{
          width: '100%',
          padding: '15px',
          borderRadius: 20,
          border: 'none',
          backgroundColor: GREEN,
          color: '#FFF',
          fontSize: 15,
          fontWeight: 700,
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.35 : 1,
          transition: 'opacity 0.2s',
        }}
      >
        {label}
      </button>
    )
  }

  // ── SPLASH ─────────────────────────────────────────────────────────────────
  if (step === 0) {
    return (
      <div style={{ ...container, backgroundColor: GREEN, justifyContent: 'space-between', padding: '60px 28px 48px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, justifyContent: 'center', gap: 24 }}>
          <div style={{ width: 88, height: 88, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="fa-solid fa-apple-whole" style={{ fontSize: 44, color: '#FFFFFF' }} />
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
              Essen
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, lineHeight: 1.55, maxWidth: 280 }}>
              5 kurze Fragen — wir finden die Rezepte die wirklich zu dir passen.
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
              color: GREEN,
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
      { k: 'A', v: 'Mehr Energie im Alltag' },
      { k: 'B', v: 'Gesünder essen' },
      { k: 'C', v: 'Besseres Körpergefühl' },
      { k: 'D', v: 'Gewicht regulieren' },
      { k: 'E', v: 'Langfristige Gesundheit' },
    ]
    return (
      <div style={container}>
        <div style={{ flex: 1, paddingTop: 56, paddingBottom: 100, overflowY: 'auto' }}>
          <QuestionHeader step={1} onBack={goBack} title="Was ist dein Ernährungsziel?" />
          <div style={{ padding: '0 24px' }}>
            {opts.map(o => (
              <Option key={o.k} letter={o.k} label={o.v} selected={answers.q1 === o.k} onPress={() => pick('q1', o.k)} />
            ))}
          </div>
        </div>
        <div style={footer}>
          <NextButton disabled={!answers.q1} />
        </div>
      </div>
    )
  }

  // ── QUESTION 2 ─────────────────────────────────────────────────────────────
  if (step === 2) {
    const opts = [
      { k: 'A', v: 'Unregelmäßig' },
      { k: 'B', v: 'Oft spontan / ungeplant' },
      { k: 'C', v: 'Relativ strukturiert' },
      { k: 'D', v: 'Sehr bewusst' },
    ]
    return (
      <div style={container}>
        <div style={{ flex: 1, paddingTop: 56, paddingBottom: 100, overflowY: 'auto' }}>
          <QuestionHeader step={2} onBack={goBack} title="Wie würdest du dein Essverhalten beschreiben?" />
          <div style={{ padding: '0 24px' }}>
            {opts.map(o => (
              <Option key={o.k} letter={o.k} label={o.v} selected={answers.q2 === o.k} onPress={() => pick('q2', o.k)} />
            ))}
          </div>
        </div>
        <div style={footer}>
          <NextButton disabled={!answers.q2} />
        </div>
      </div>
    )
  }

  // ── QUESTION 3 ─────────────────────────────────────────────────────────────
  if (step === 3) {
    const opts = [
      { k: 'A', v: 'Gesunde Entscheidungen treffen' },
      { k: 'B', v: 'Regelmäßig essen' },
      { k: 'C', v: 'Heißhunger / Snacking' },
      { k: 'D', v: 'Zeit für Essen / Vorbereitung' },
      { k: 'E', v: 'Emotionales Essen' },
    ]
    return (
      <div style={container}>
        <div style={{ flex: 1, paddingTop: 56, paddingBottom: 100, overflowY: 'auto' }}>
          <QuestionHeader step={3} onBack={goBack} title="Was fällt dir am schwersten?" />
          <div style={{ padding: '0 24px' }}>
            {opts.map(o => (
              <Option key={o.k} letter={o.k} label={o.v} selected={answers.q3 === o.k} onPress={() => pick('q3', o.k)} />
            ))}
          </div>
        </div>
        <div style={footer}>
          <NextButton disabled={!answers.q3} />
        </div>
      </div>
    )
  }

  // ── QUESTION 4 ─────────────────────────────────────────────────────────────
  if (step === 4) {
    const opts = [
      { k: 'A', v: 'Energiereich' },
      { k: 'B', v: 'Eher müde' },
      { k: 'C', v: 'Schwankt stark' },
      { k: 'D', v: 'Habe nie darauf geachtet' },
    ]
    return (
      <div style={container}>
        <div style={{ flex: 1, paddingTop: 56, paddingBottom: 100, overflowY: 'auto' }}>
          <QuestionHeader step={4} onBack={goBack} title="Wie fühlst du dich meist nach dem Essen?" />
          <div style={{ padding: '0 24px' }}>
            {opts.map(o => (
              <Option key={o.k} letter={o.k} label={o.v} selected={answers.q4 === o.k} onPress={() => pick('q4', o.k)} />
            ))}
          </div>
        </div>
        <div style={footer}>
          <NextButton disabled={!answers.q4} />
        </div>
      </div>
    )
  }

  // ── QUESTION 5 ─────────────────────────────────────────────────────────────
  if (step === 5) {
    const opts = [
      { k: 'A', v: 'Viel unterwegs' },
      { k: 'B', v: 'Viel zuhause' },
      { k: 'C', v: 'Gemischt' },
      { k: 'D', v: 'Unregelmäßig' },
    ]
    return (
      <div style={container}>
        <div style={{ flex: 1, paddingTop: 56, paddingBottom: 100, overflowY: 'auto' }}>
          <QuestionHeader step={5} onBack={goBack} title="Wie sieht dein Alltag aus?" />
          <div style={{ padding: '0 24px' }}>
            {opts.map(o => (
              <Option key={o.k} letter={o.k} label={o.v} selected={answers.q5 === o.k} onPress={() => pick('q5', o.k)} />
            ))}
          </div>
        </div>
        <div style={footer}>
          <NextButton disabled={!answers.q5} label="Auswertung anzeigen" />
        </div>
      </div>
    )
  }

  // ── SUMMARY ────────────────────────────────────────────────────────────────
  const title = profileTitle(answers)
  const rows = profileRows(answers)
  const action = firstAction(answers)

  return (
    <div style={{ ...container, overflowY: 'auto', paddingBottom: 48 }}>
      {/* Dark green header */}
      <div style={{ backgroundColor: GREEN, padding: '52px 24px 32px', borderRadius: '0 0 24px 24px' }}>
        <button
          onClick={goBack}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 16px', lineHeight: 1 }}
        >
          <i className="fa-solid fa-arrow-left" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }} />
        </button>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>
          Dein Ernährungsprofil
        </p>
        <h1
          style={{
            color: '#FFFFFF',
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 24,
            fontWeight: 500,
            lineHeight: 1.3,
            marginBottom: 0,
          }}
        >
          {title}
        </h1>
      </div>

      {/* Profile rows card */}
      <div style={{ margin: '20px 20px 0', backgroundColor: '#FFFFFF', borderRadius: 20, padding: '6px 0', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
        {rows.map((row, i) => (
          <div
            key={row.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 20px',
              borderBottom: i < rows.length - 1 ? '1px solid #F0EBE4' : 'none',
            }}
          >
            <span style={{ color: '#9E9E9E', fontSize: 13, fontWeight: 500 }}>{row.label}</span>
            <span style={{ color: '#23283A', fontSize: 14, fontWeight: 600, textAlign: 'right', maxWidth: 200 }}>{row.value}</span>
          </div>
        ))}
      </div>

      {/* First action box */}
      <div
        style={{
          margin: '16px 20px 0',
          backgroundColor: GREEN_LIGHT,
          borderRadius: 20,
          padding: '20px 20px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 16,
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            backgroundColor: GREEN,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <i className="fa-solid fa-apple-whole" style={{ fontSize: 20, color: '#FFFFFF' }} />
        </div>
        <div>
          <p style={{ color: GREEN, fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 4 }}>
            Deine erste Aktion
          </p>
          <p style={{ color: '#23283A', fontSize: 15, fontWeight: 600, lineHeight: 1.3, marginBottom: 4 }}>
            Heute eine kleine Anpassung
          </p>
          <p style={{ color: '#6B5B4E', fontSize: 13, lineHeight: 1.4 }}>
            z.B. {action.toLowerCase().replace(/^./, c => c)}
          </p>
        </div>
      </div>

      {/* CTA */}
      <div style={{ margin: '24px 20px 0' }}>
        <button
          onClick={finish}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: 20,
            border: 'none',
            backgroundColor: GREEN,
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: 0.3,
          }}
        >
          Essen einrichten
        </button>
      </div>
    </div>
  )
}
