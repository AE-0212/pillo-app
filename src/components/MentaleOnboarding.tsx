import { useState } from 'react'

interface Props {
  onComplete: () => void
  onBack: () => void
}

type Answers = {
  q1: string
  q2: string[]
  q3: string
  q4: string[]
}

const BROWN = '#7F613D'
const BROWN_LIGHT = '#EDE3D6'

function ProgressBar({ step }: { step: number }) {
  const pct = (step / 4) * 100
  return (
    <div style={{ height: 3, backgroundColor: '#D4C4AD', borderRadius: 2 }}>
      <div
        style={{
          height: '100%',
          width: `${pct}%`,
          backgroundColor: BROWN,
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
        backgroundColor: BROWN_LIGHT,
        color: BROWN,
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: 0.3,
      }}
    >
      {step} / 4
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
        border: `1.5px solid ${selected ? BROWN : '#E8E0D8'}`,
        backgroundColor: selected ? BROWN_LIGHT : '#FFFFFF',
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
          backgroundColor: selected ? BROWN : '#F0EBE4',
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
      <span style={{ color: '#23283A', fontSize: 14, lineHeight: 1.45 }}>{label}</span>
    </button>
  )
}

// Summary helpers
function summaryTitle(answers: Answers): string {
  const map: Record<string, string> = {
    A: 'Erste Schritte zur Selbstkenntnis',
    B: 'Muster erkennen & verstehen',
    C: 'Neue Perspektiven entdecken',
    D: 'Tiefe Reflexion & inneres Wachstum',
  }
  return map[answers.q1] ?? 'Schnelle Unterstützung bei Stress'
}

function summaryRows(answers: Answers): { label: string; value: string }[] {
  const focusMap: Record<string, string> = {
    A: 'Selbstwahrnehmung aufbauen',
    B: 'Muster erkennen',
    C: 'Neue Perspektiven',
    D: 'Vertiefung & Integration',
  }
  const toolsMap: Record<string, string> = {
    A: 'Einfache Reflexionsübungen',
    B: 'Journaling & kurze Meditationen',
    C: 'IFS-Tools & Innere-Team-Übungen',
    D: 'Tiefenreflexion & Innere-Kind-Arbeit',
  }
  const ansatzMap: Record<string, string> = {
    A: 'Sanft & explorativ beginnen',
    B: 'Schrittweise tiefer gehen',
    C: 'Auf bestehendem Wissen aufbauen',
    D: 'Intensiv & methodisch arbeiten',
  }
  return [
    { label: 'Fokus', value: focusMap[answers.q1] ?? '—' },
    { label: 'Tools', value: toolsMap[answers.q3] ?? '—' },
    { label: 'Ansatz', value: ansatzMap[answers.q3] ?? '—' },
  ]
}

export default function MentaleOnboarding({ onComplete, onBack }: Props) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({ q1: '', q2: [], q3: '', q4: [] })

  function goBack() {
    if (step === 0) onBack()
    else setStep(s => s - 1)
  }

  function goNext() {
    setStep(s => s + 1)
  }

  function pickSingle(key: 'q1' | 'q3', value: string) {
    setAnswers(prev => ({ ...prev, [key]: value }))
  }

  function toggleMulti(key: 'q2' | 'q4', value: string, max: number) {
    setAnswers(prev => {
      const current = prev[key]
      if (current.includes(value)) return { ...prev, [key]: current.filter(v => v !== value) }
      if (current.length >= max) return prev
      return { ...prev, [key]: [...current, value] }
    })
  }

  function finish() {
    localStorage.setItem('mentale-onboarding-done', 'true')
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
    borderTop: '1px solid rgba(127,97,61,0.12)',
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
          backgroundColor: BROWN,
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
      <div style={{ ...container, backgroundColor: BROWN, justifyContent: 'space-between', padding: '60px 28px 48px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, justifyContent: 'center', gap: 24 }}>
          <div style={{ width: 88, height: 88, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 52, color: '#FFFFFF', fontFamily: 'serif', lineHeight: 1, marginTop: 6 }}>ॐ</span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <h1
              style={{
                color: '#FFFFFF',
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: 32,
                fontWeight: 500,
                marginBottom: 14,
                lineHeight: 1.2,
              }}
            >
              Mentale Gesundheit
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 15, lineHeight: 1.55, maxWidth: 285 }}>
              4 kurze Fragen — damit das Innere Team wirklich zu dir passt.
            </p>
          </div>
          {/* Hint box */}
          <div
            style={{
              backgroundColor: 'rgba(255,255,255,0.12)',
              borderRadius: 14,
              padding: '14px 18px',
              width: '100%',
              maxWidth: 320,
            }}
          >
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 5 }}>
              Keine Programme — Toolbox
            </p>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, lineHeight: 1.5 }}>
              Nicht ein weiterer Kurs, sondern Werkzeuge die du genau dann nutzt wenn du sie brauchst.
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
              color: BROWN,
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
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.65)', fontSize: 14 }}
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
      { k: 'A', v: 'Ich kenne meine Muster kaum — vieles ist mir unklar' },
      { k: 'B', v: 'Ich erkenne einige Muster, aber verstehe sie nicht tief' },
      { k: 'C', v: 'Ich kenne mich gut, suche aber neue Perspektiven' },
      { k: 'D', v: 'Ich reflektiere viel und bin neugierig auf mehr' },
    ]
    return (
      <div style={container}>
        <div style={{ flex: 1, paddingTop: 56, paddingBottom: 100, overflowY: 'auto' }}>
          <QuestionHeader step={1} onBack={goBack} title="Wie gut kennst du dich selbst?" />
          <div style={{ padding: '0 24px' }}>
            {opts.map(o => (
              <Option key={o.k} letter={o.k} label={o.v} selected={answers.q1 === o.k} onPress={() => pickSingle('q1', o.k)} />
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
      { k: 'A', v: 'Ich will Ruhe, treibe mich aber ständig an' },
      { k: 'B', v: 'Ich will Harmonie, sage aber nicht was ich brauche' },
      { k: 'C', v: 'Ich zweifle an mir, obwohl ich viel erreiche' },
      { k: 'D', v: 'Ich will Veränderung, tue aber das Gewohnte' },
      { k: 'E', v: 'Ich will Nähe, ziehe mich aber zurück' },
      { k: 'F', v: 'Ich spüre Widersprüche, kann sie nicht benennen' },
    ]
    return (
      <div style={container}>
        <div style={{ flex: 1, paddingTop: 56, paddingBottom: 100, overflowY: 'auto' }}>
          <QuestionHeader step={2} onBack={goBack} title="Welche inneren Konflikte kennst du?" hint="Bis zu 3 Antworten möglich" />
          <div style={{ padding: '0 24px' }}>
            {opts.map(o => (
              <Option key={o.k} letter={o.k} label={o.v} selected={answers.q2.includes(o.k)} onPress={() => toggleMulti('q2', o.k, 3)} />
            ))}
          </div>
        </div>
        <div style={footer}>
          <NextButton disabled={answers.q2.length === 0} />
        </div>
      </div>
    )
  }

  // ── QUESTION 3 ─────────────────────────────────────────────────────────────
  if (step === 3) {
    const opts = [
      { k: 'A', v: 'Kaum — das ist neu für mich' },
      { k: 'B', v: 'Etwas — ich kenne Journaling oder Meditation' },
      { k: 'C', v: 'Ja — ich bin in Therapie oder coachingserfahren' },
      { k: 'D', v: 'Viel — ich beschäftige mich intensiv mit mir' },
    ]
    return (
      <div style={container}>
        <div style={{ flex: 1, paddingTop: 56, paddingBottom: 100, overflowY: 'auto' }}>
          <QuestionHeader step={3} onBack={goBack} title="Hast du Erfahrung mit Selbstreflexion?" />
          <div style={{ padding: '0 24px' }}>
            {opts.map(o => (
              <Option key={o.k} letter={o.k} label={o.v} selected={answers.q3 === o.k} onPress={() => pickSingle('q3', o.k)} />
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
      { k: 'A', v: 'Mich selbst besser verstehen' },
      { k: 'B', v: 'Innere Konflikte lösen' },
      { k: 'C', v: 'Ruhiger und gelassener werden' },
      { k: 'D', v: 'Klarheit bei Entscheidungen' },
      { k: 'E', v: 'Mit mir selbst in Kontakt kommen' },
    ]
    return (
      <div style={container}>
        <div style={{ flex: 1, paddingTop: 56, paddingBottom: 100, overflowY: 'auto' }}>
          <QuestionHeader step={4} onBack={goBack} title="Was erhoffst du dir?" hint="Bis zu 2 Antworten möglich" />
          <div style={{ padding: '0 24px' }}>
            {opts.map(o => (
              <Option key={o.k} letter={o.k} label={o.v} selected={answers.q4.includes(o.k)} onPress={() => toggleMulti('q4', o.k, 2)} />
            ))}
          </div>
        </div>
        <div style={footer}>
          <NextButton disabled={answers.q4.length === 0} label="Auswertung anzeigen" />
        </div>
      </div>
    )
  }

  // ── SUMMARY ────────────────────────────────────────────────────────────────
  const title = summaryTitle(answers)
  const rows = summaryRows(answers)

  return (
    <div style={{ ...container, overflowY: 'auto', paddingBottom: 48 }}>
      {/* Brown header */}
      <div style={{ backgroundColor: BROWN, padding: '52px 24px 32px', borderRadius: '0 0 24px 24px' }}>
        <button
          onClick={goBack}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 16px', lineHeight: 1 }}
        >
          <i className="fa-solid fa-arrow-left" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }} />
        </button>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>
          Dein Mentales Profil
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
          backgroundColor: BROWN_LIGHT,
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
            backgroundColor: BROWN,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 22, color: '#FFFFFF', fontFamily: 'serif', lineHeight: 1, marginTop: 3 }}>ॐ</span>
        </div>
        <div>
          <p style={{ color: BROWN, fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 4 }}>
            Deine erste Aktion
          </p>
          <p style={{ color: '#23283A', fontSize: 15, fontWeight: 600, lineHeight: 1.3, marginBottom: 4 }}>
            2 Minuten Reset
          </p>
          <p style={{ color: '#6B5B4E', fontSize: 13, lineHeight: 1.4 }}>
            Augen zu — tief durchatmen
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
            backgroundColor: BROWN,
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: 0.3,
          }}
        >
          Mentale einrichten
        </button>
      </div>
    </div>
  )
}
