import { useState, useEffect } from 'react'
import InnereKonferenz, { KonferenzZusammenfassung } from './InnereKonferenz'
import type { ConferenceState } from './InnereKonferenz'

const BROWN = '#7F613D'
const SAND = '#EDE3D6'
const BG = '#F5EDE4'
const DARK = '#23283A'

interface SavedConference {
  id: number
  date: string
  thema: string
  stimmenCount: number
  data: ConferenceState
}

interface Props {
  onBack: () => void
}

export default function MentaleScreen({ onBack }: Props) {
  const [showKonferenz, setShowKonferenz] = useState(false)
  const [readOnlyConference, setReadOnlyConference] = useState<SavedConference | null>(null)
  const [conferences, setConferences] = useState<SavedConference[]>([])

  useEffect(() => {
    loadConferences()
  }, [])

  function loadConferences() {
    const raw = localStorage.getItem('manna_innere_konferenzen')
    if (raw) {
      try {
        setConferences(JSON.parse(raw) as SavedConference[])
      } catch {
        setConferences([])
      }
    }
  }

  // ── Read-only view ──────────────────────────────────────────────────────────
  if (readOnlyConference) {
    return (
      <div
        className="min-h-svh flex flex-col overflow-y-auto"
        style={{ backgroundColor: BG, maxWidth: '390px', margin: '0 auto' }}
      >
        {/* Header */}
        <div className="px-6 pt-12 pb-4">
          <div className="flex items-center gap-3 mb-1">
            <button
              onClick={() => setReadOnlyConference(null)}
              className="flex items-center justify-center w-9 h-9 rounded-full flex-shrink-0"
              style={{ backgroundColor: SAND }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={DARK} strokeWidth="2.5" strokeLinecap="round">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
            </button>
            <div>
              <p className="text-xs font-semibold" style={{ color: '#9E9E9E' }}>{readOnlyConference.date}</p>
              <p className="text-sm font-semibold truncate" style={{ color: DARK, maxWidth: 220 }}>
                {readOnlyConference.thema}
              </p>
            </div>
          </div>
        </div>
        <KonferenzZusammenfassung
          state={readOnlyConference.data}
          onBack={() => setReadOnlyConference(null)}
          readOnly
        />
      </div>
    )
  }

  // ── New conference flow ─────────────────────────────────────────────────────
  if (showKonferenz) {
    return (
      <InnereKonferenz
        onBack={() => {
          setShowKonferenz(false)
          loadConferences()
        }}
      />
    )
  }

  // ── Main screen ─────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-svh flex flex-col pb-10"
      style={{ backgroundColor: BG, maxWidth: '390px', margin: '0 auto' }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-6 pt-12 pb-5">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-9 h-9 rounded-full flex-shrink-0"
          style={{ backgroundColor: SAND }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={DARK} strokeWidth="2.5" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <h1
          className="text-2xl"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif', color: DARK, fontWeight: 500 }}
        >
          Mentale Gesundheit
        </h1>
      </div>

      {/* Hero Box */}
      <div
        className="mx-6 mb-6 rounded-3xl px-6 py-7 flex flex-col items-center text-center"
        style={{ backgroundColor: SAND }}
      >
        <span style={{ fontSize: 56, lineHeight: 1, fontFamily: 'serif', color: BROWN }}>ॐ</span>
        <h2
          className="text-2xl mt-3 mb-2"
          style={{ fontFamily: 'Georgia, serif', color: DARK, fontWeight: 500 }}
        >
          Dein Inneres Team
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: '#7A6E64' }}>
          Verstehe deine inneren Stimmen —<br />keine ist falsch.
        </p>
      </div>

      {/* Start Button */}
      <div className="px-6 mb-6">
        <button
          onClick={() => setShowKonferenz(true)}
          className="w-full flex items-center justify-between px-5 py-4 rounded-2xl active:scale-98 transition-transform"
          style={{
            backgroundColor: '#FFF',
            border: `1.5px solid ${BROWN}30`,
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          }}
        >
          <div className="text-left">
            <p className="font-semibold text-base" style={{ color: DARK }}>
              Neue Innere Konferenz starten
            </p>
            <p className="text-xs mt-0.5" style={{ color: '#9E9E9E' }}>
              9 Schritte · ca. 10–15 Minuten
            </p>
          </div>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: SAND }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={BROWN} strokeWidth="2.5" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      </div>

      {/* Past conferences */}
      {conferences.length > 0 ? (
        <div className="px-6">
          <h3 className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: '#9E9E9E' }}>
            Vergangene Konferenzen
          </h3>
          <div className="flex flex-col gap-3">
            {conferences.map(c => (
              <button
                key={c.id}
                onClick={() => setReadOnlyConference(c)}
                className="w-full flex items-center gap-4 rounded-2xl px-5 py-4 text-left active:scale-98 transition-transform"
                style={{ backgroundColor: '#FFF', border: '1.5px solid #E8DDD4' }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: SAND }}
                >
                  <span style={{ fontSize: 18 }}>🌿</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: DARK }}>{c.thema}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#9E9E9E' }}>
                    {c.date}
                    {c.stimmenCount ? ` · ${c.stimmenCount} Stimmen` : ''}
                  </p>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9B9A7" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="px-6">
          <div
            className="rounded-2xl px-5 py-6 flex flex-col items-center text-center"
            style={{ backgroundColor: '#FFF', border: '1.5px solid #E8DDD4' }}
          >
            <span style={{ fontSize: 32, marginBottom: 8 }}>💭</span>
            <p className="text-sm font-medium mb-1" style={{ color: DARK }}>Noch keine Konferenzen</p>
            <p className="text-xs" style={{ color: '#9E9E9E' }}>
              Starte deine erste innere Konferenz und lerne deine inneren Stimmen kennen.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
