import { useState, useEffect, useRef } from 'react'

const DARK = '#23283A'
const BG = '#F5EDE4'
const CAAD = '#CAAD82'

interface Props { onBack: () => void }

// ─── Data ───────────────────────────────────────────────────────────────────────

const ACTIVITIES = [
  { id: 'meditation',  icon: 'fa-solid fa-spa',           label: 'Meditation',          minutes: 10 },
  { id: 'spaziergang', icon: 'fa-solid fa-person-walking', label: 'Spaziergang in Natur', minutes: 15 },
  { id: 'baum',        icon: 'fa-solid fa-tree',           label: 'Baum umarmen',         minutes: 5  },
  { id: 'atem',        icon: 'fa-solid fa-wind',           label: 'Atemübung',            minutes: 5  },
  { id: 'coffee',      icon: 'fa-solid fa-mug-hot',        label: 'Coffee/Tea Break',     minutes: 10 },
  { id: 'wasser',      icon: 'fa-solid fa-glass-water',    label: 'Genug getrunken?',     minutes: 1  },
  { id: 'freunde',     icon: 'fa-solid fa-people-group',   label: 'Freunde/Familie',      minutes: 30 },
  { id: 'haustier',    icon: 'fa-solid fa-paw',            label: 'Zeit mit Haustier',    minutes: 15 },
]

const CHECKLIST = [
  { id: 'dunkel',      icon: 'fa-solid fa-moon',            label: 'Dunkles Schlafzimmer'          },
  { id: 'ruhig',       icon: 'fa-solid fa-volume-xmark',    label: 'Ruhige Umgebung'               },
  { id: 'kuehl',       icon: 'fa-solid fa-temperature-low', label: 'Kühle Temperatur (16–18°C)'    },
  { id: 'alkohol',     icon: 'fa-solid fa-wine-glass-empty',label: 'Kein Alkohol'                  },
  { id: 'koffein',     icon: 'fa-solid fa-mug-saucer',      label: 'Koffein nur bis 12:00'         },
  { id: 'mahlzeit',    icon: 'fa-solid fa-utensils',        label: '3h vor Schlaf nichts essen'    },
  { id: 'screens',     icon: 'fa-solid fa-mobile-screen',   label: '1h vor Schlaf keine Screens'   },
  { id: 'bett',        icon: 'fa-solid fa-bed',             label: 'Bett nur zum Schlafen'         },
  { id: 'gleiche',     icon: 'fa-solid fa-clock',           label: 'Gleiche Schlafenszeit'         },
]

const WISSEN = [
  { icon: 'fa-solid fa-brain',           title: 'Schlaf & Gehirn',          text: 'Im Schlaf verarbeitet das Gehirn Erlebnisse und festigt Erinnerungen. 7–9 Stunden sind optimal für kognitive Leistung.' },
  { icon: 'fa-solid fa-heart-pulse',     title: 'Recovery & Herzgesundheit', text: 'Regelmäßige Erholung senkt Blutdruck und Herzfrequenz nachhaltig und schützt das Herz langfristig.' },
  { icon: 'fa-solid fa-dumbbell',        title: 'Muskelregeneration',        text: 'Muskeln wachsen nicht beim Training, sondern in der Ruhephase. Tiefschlaf ist essenziell für Regeneration.' },
  { icon: 'fa-solid fa-leaf',            title: 'Natur & Stressabbau',       text: 'Schon 10 Minuten in der Natur senken den Cortisolspiegel messbar und verbessern die Stimmung spürbar.' },
  { icon: 'fa-solid fa-mobile-screen',   title: 'Blaulicht-Effekt',          text: 'Blaues Licht von Screens hemmt die Melatonin-Ausschüttung und verzögert das Einschlafen um bis zu 1,5h.' },
  { icon: 'fa-solid fa-temperature-low', title: 'Optimale Temperatur',       text: '16–18°C im Schlafzimmer fördern den Tiefschlaf durch die natürliche Absenkung der Körpertemperatur.' },
]

// ─── Helpers ────────────────────────────────────────────────────────────────────

function parseTime(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + (m || 0)
}

function formatTime(mins: number): string {
  const total = ((mins % 1440) + 1440) % 1440
  const h = Math.floor(total / 60)
  const m = total % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function fmtCountdown(secs: number): string {
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function ls<T>(key: string, fallback: T): T {
  try { const v = localStorage.getItem(key); return v !== null ? JSON.parse(v) : fallback }
  catch { return fallback }
}

// ─── Toggle Switch ───────────────────────────────────────────────────────────────
function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      style={{
        width: 44, height: 24, borderRadius: 12,
        backgroundColor: on ? DARK : '#C8BDB0',
        border: 'none', cursor: 'pointer',
        position: 'relative', flexShrink: 0, transition: 'background 0.2s',
      }}
    >
      <div style={{
        position: 'absolute', top: 3,
        left: on ? 23 : 3,
        width: 18, height: 18, borderRadius: '50%',
        backgroundColor: '#FFF',
        transition: 'left 0.2s',
      }} />
    </button>
  )
}

// ─── CircleTimer ─────────────────────────────────────────────────────────────────
function CircleTimer({ seconds, total }: { seconds: number; total: number }) {
  const r = 48
  const circ = 2 * Math.PI * r
  const progress = total > 0 ? seconds / total : 1
  const offset = circ * (1 - progress)
  return (
    <svg width={120} height={120} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={60} cy={60} r={r} fill="none" stroke="#E8DDD4" strokeWidth={8} />
      <circle
        cx={60} cy={60} r={r} fill="none"
        stroke={DARK} strokeWidth={8}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s linear' }}
      />
    </svg>
  )
}

// ─── ScoreRing ───────────────────────────────────────────────────────────────────
function ScoreRing({ score, total }: { score: number; total: number }) {
  const r = 32
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - score / total)
  return (
    <svg width={80} height={80} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={40} cy={40} r={r} fill="none" stroke="#E8DDD4" strokeWidth={7} />
      <circle
        cx={40} cy={40} r={r} fill="none"
        stroke={DARK} strokeWidth={7}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
    </svg>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────────
export default function ErholungScreen({ onBack }: Props) {
  const [activeTab, setActiveTab] = useState<'pausen' | 'tipps'>('pausen')

  // Timer
  const [timerActive, setTimerActive]   = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [timerTotal, setTimerTotal]     = useState(0)
  const [timerName, setTimerName]       = useState('')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Pausen settings (from localStorage)
  const [bedtime,            setBedtime]           = useState<string>(() => ls('erholung-bedtime', '22:30'))
  const [lastMealOn,         setLastMealOn]         = useState<boolean>(() => ls('erholung-last-meal', false))
  const [sleepRoutineOn,     setSleepRoutineOn]     = useState<boolean>(() => ls('erholung-sleep-routine', false))
  const [breakReminderOn,    setBreakReminderOn]    = useState<boolean>(() => ls('erholung-break-reminder', false))
  const [naturOn,            setNaturOn]            = useState<boolean>(() => ls('erholung-natur', false))

  // Checklist
  const [checked, setChecked] = useState<Set<string>>(
    () => new Set<string>(ls<string[]>('erholung-checklist', []))
  )

  // Persist toggles
  useEffect(() => { localStorage.setItem('erholung-bedtime', JSON.stringify(bedtime)) }, [bedtime])
  useEffect(() => { localStorage.setItem('erholung-last-meal', JSON.stringify(lastMealOn)) }, [lastMealOn])
  useEffect(() => { localStorage.setItem('erholung-sleep-routine', JSON.stringify(sleepRoutineOn)) }, [sleepRoutineOn])
  useEffect(() => { localStorage.setItem('erholung-break-reminder', JSON.stringify(breakReminderOn)) }, [breakReminderOn])
  useEffect(() => { localStorage.setItem('erholung-natur', JSON.stringify(naturOn)) }, [naturOn])
  useEffect(() => { localStorage.setItem('erholung-checklist', JSON.stringify([...checked])) }, [checked])

  // Timer interval
  useEffect(() => {
    if (timerActive) {
      intervalRef.current = setInterval(() => {
        setTimerSeconds(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current!)
            setTimerActive(false)
            return 0
          }
          return s - 1
        })
      }, 1000)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [timerActive])

  function startTimer(name: string, minutes: number) {
    if (intervalRef.current) clearInterval(intervalRef.current)
    const secs = minutes * 60
    setTimerName(name)
    setTimerTotal(secs)
    setTimerSeconds(secs)
    setTimerActive(true)
  }

  function cancelTimer() {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setTimerActive(false)
    setTimerSeconds(0)
  }

  function toggleChecked(id: string) {
    setChecked(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  // Derived times
  const bedMins       = parseTime(bedtime)
  const lastMealTime  = formatTime(bedMins - 180)
  const routineTime   = formatTime(bedMins - 30)

  const checkScore = checked.size

  // ─── Tab: Pausen ──────────────────────────────────────────────────────────────
  const PausenTab = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Active Timer */}
      {timerActive && (
        <div style={{ backgroundColor: '#FFF', borderRadius: 20, padding: '20px 16px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', textAlign: 'center' }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#9E9E9E', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Aktiver Timer</p>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <CircleTimer seconds={timerSeconds} total={timerTotal} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
              <span style={{ fontSize: 22, fontWeight: 700, color: DARK }}>{fmtCountdown(timerSeconds)}</span>
            </div>
          </div>
          <p style={{ fontSize: 14, fontWeight: 600, color: DARK, marginTop: 8 }}>{timerName}</p>
          <button onClick={cancelTimer} style={{ marginTop: 10, background: 'none', border: 'none', color: '#9E9E9E', fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}>
            Abbrechen
          </button>
        </div>
      )}

      {/* Abend-Erinnerungen */}
      <div style={{ backgroundColor: '#FFF', borderRadius: 20, padding: '20px 16px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: DARK, marginBottom: 14 }}>Abend-Erinnerungen</p>

        {/* Bedtime input */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <i className="fa-solid fa-moon" style={{ color: DARK, fontSize: 14, width: 18, textAlign: 'center' }} />
            <span style={{ fontSize: 13, color: DARK, fontWeight: 600 }}>Schlafenszeit</span>
          </div>
          <input
            type="time"
            value={bedtime}
            onChange={e => setBedtime(e.target.value)}
            style={{ fontSize: 15, fontWeight: 700, color: DARK, border: 'none', background: 'none', outline: 'none', cursor: 'pointer', textAlign: 'right' }}
          />
        </div>

        {/* Timeline */}
        <div style={{ position: 'relative', paddingLeft: 28 }}>
          {/* Vertical line */}
          <div style={{ position: 'absolute', left: 8, top: 10, bottom: 10, width: 2, backgroundColor: '#E8DDD4' }} />

          {/* Letzte Mahlzeit */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, position: 'relative' }}>
            <div style={{ position: 'absolute', left: -24, width: 16, height: 16, borderRadius: '50%', backgroundColor: lastMealOn ? DARK : '#C8BDB0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fa-solid fa-utensils" style={{ color: '#FFF', fontSize: 7 }} />
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: DARK }}>Letzte Mahlzeit</p>
              <p style={{ fontSize: 11, color: '#9E9E9E' }}>{lastMealTime} Uhr · 3h vor Schlaf</p>
            </div>
            <Toggle on={lastMealOn} onChange={setLastMealOn} />
          </div>

          {/* Sleep Routine */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, position: 'relative' }}>
            <div style={{ position: 'absolute', left: -24, width: 16, height: 16, borderRadius: '50%', backgroundColor: sleepRoutineOn ? DARK : '#C8BDB0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fa-solid fa-bed" style={{ color: '#FFF', fontSize: 7 }} />
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: DARK }}>Sleep Routine starten</p>
              <p style={{ fontSize: 11, color: '#9E9E9E' }}>{routineTime} Uhr · 30 Min vor Schlaf</p>
            </div>
            <Toggle on={sleepRoutineOn} onChange={setSleepRoutineOn} />
          </div>

          {/* Schlafenszeit marker */}
          <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            <div style={{ position: 'absolute', left: -24, width: 16, height: 16, borderRadius: '50%', backgroundColor: DARK, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fa-solid fa-moon" style={{ color: '#FFF', fontSize: 7 }} />
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: DARK }}>Schlafenszeit</p>
              <p style={{ fontSize: 11, color: '#9E9E9E' }}>{bedtime} Uhr</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pausen-Erinnerung */}
      <div style={{ backgroundColor: '#FFF', borderRadius: 20, padding: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#F5F0EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="fa-solid fa-bell" style={{ color: DARK, fontSize: 16 }} />
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: DARK }}>Pausen-Erinnerung</p>
            <p style={{ fontSize: 11, color: '#9E9E9E' }}>Alle 2h Pause machen</p>
          </div>
        </div>
        <Toggle on={breakReminderOn} onChange={setBreakReminderOn} />
      </div>

      {/* Natur-Zeit */}
      <div style={{ backgroundColor: '#FFF', borderRadius: 20, padding: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: naturOn ? 12 : 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fa-solid fa-leaf" style={{ color: '#2E7D32', fontSize: 16 }} />
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: DARK }}>Natur-Zeit</p>
              <p style={{ fontSize: 11, color: '#9E9E9E' }}>Täglich 10 Min in der Natur</p>
            </div>
          </div>
          <Toggle on={naturOn} onChange={setNaturOn} />
        </div>
        {naturOn && (
          <button
            onClick={() => startTimer('Natur-Zeit', 10)}
            style={{ width: '100%', padding: '10px', borderRadius: 14, border: 'none', backgroundColor: '#2E7D32', color: '#FFF', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
          >
            <i className="fa-solid fa-play" style={{ marginRight: 6 }} />
            10 Min Timer starten
          </button>
        )}
      </div>

      {/* Pausen-Vorschläge */}
      <div>
        <p style={{ fontSize: 13, fontWeight: 700, color: DARK, marginBottom: 12 }}>Pausen-Vorschläge</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {ACTIVITIES.map(a => {
            const isActive = timerActive && timerName === a.label
            return (
              <button
                key={a.id}
                onClick={() => startTimer(a.label, a.minutes)}
                style={{
                  backgroundColor: isActive ? '#D5D7DF' : '#FFF',
                  border: `1.5px solid ${isActive ? DARK : '#E8DDD4'}`,
                  borderRadius: 16, padding: '14px 10px',
                  cursor: 'pointer', textAlign: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  transition: 'all 0.15s',
                }}
              >
                <i className={a.icon} style={{ color: isActive ? DARK : CAAD, fontSize: 22, marginBottom: 6, display: 'block' }} />
                <p style={{ fontSize: 11, fontWeight: 700, color: DARK, marginBottom: 2, lineHeight: 1.3 }}>{a.label}</p>
                <p style={{ fontSize: 10, color: '#9E9E9E' }}>{a.minutes} Min</p>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )

  // ─── Tab: Tipps ───────────────────────────────────────────────────────────────
  const TippsTab = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Schlaf-Checkliste */}
      <div style={{ backgroundColor: '#FFF', borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
        {/* Score header */}
        <div style={{ backgroundColor: '#F5F0EB', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <ScoreRing score={checkScore} total={CHECKLIST.length} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: DARK }}>{checkScore}</span>
            </div>
          </div>
          <div>
            <p style={{ fontSize: 16, fontWeight: 700, color: DARK }}>{checkScore}/{CHECKLIST.length} Punkte</p>
            <p style={{ fontSize: 12, color: '#9E9E9E' }}>
              {checkScore === CHECKLIST.length ? '🌟 Perfekter Schlaf-Setup!' : checkScore >= 6 ? 'Sehr gut! Noch ein paar Punkte.' : 'Hake mehr ab für besseren Schlaf.'}
            </p>
          </div>
        </div>
        {/* Checklist items */}
        <div style={{ padding: '8px 0' }}>
          {CHECKLIST.map((item, i) => {
            const done = checked.has(item.id)
            return (
              <button
                key={item.id}
                onClick={() => toggleChecked(item.id)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 20px', textAlign: 'left', border: 'none', cursor: 'pointer',
                  backgroundColor: done ? '#F0F1F5' : '#FFF',
                  borderBottom: i < CHECKLIST.length - 1 ? '1px solid #F5F0EB' : 'none',
                  transition: 'background 0.15s',
                }}
              >
                <i className={item.icon} style={{ color: done ? DARK : CAAD, fontSize: 14, width: 18, textAlign: 'center', flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: 13, color: done ? DARK : '#7A6E64', fontWeight: done ? 600 : 400, textDecoration: done ? 'none' : 'none' }}>
                  {item.label}
                </span>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                  backgroundColor: done ? DARK : 'transparent',
                  border: `2px solid ${done ? DARK : '#C8BDB0'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {done && <i className="fa-solid fa-check" style={{ color: '#FFF', fontSize: 10 }} />}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Wissenswertes */}
      <div>
        <p style={{ fontSize: 13, fontWeight: 700, color: DARK, marginBottom: 12 }}>Wissenswertes</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {WISSEN.map((w, i) => (
            <div key={i} style={{ backgroundColor: '#FFF', borderRadius: 16, padding: '14px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: '#F5F0EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <i className={w.icon} style={{ color: DARK, fontSize: 14 }} />
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: DARK, marginBottom: 4 }}>{w.title}</p>
                <p style={{ fontSize: 12, color: '#7A6E64', lineHeight: 1.5 }}>{w.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100svh', backgroundColor: BG, maxWidth: 390, margin: '0 auto', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '52px 24px 16px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 4px 4px 0', lineHeight: 1 }}>
          <i className="fa-solid fa-arrow-left" style={{ color: DARK, fontSize: 18 }} />
        </button>
        <h1 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 22, fontWeight: 500, color: DARK, margin: 0 }}>
          Erholung
        </h1>
      </div>

      {/* Tab pills */}
      <div style={{ display: 'flex', gap: 8, padding: '0 24px 20px' }}>
        {([
          { id: 'pausen', label: 'Pausen',  icon: 'fa-solid fa-mug-hot'    },
          { id: 'tipps',  label: 'Tipps',   icon: 'fa-solid fa-lightbulb'  },
        ] as const).map(tab => {
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1, padding: '10px 0', borderRadius: 20,
                border: `1.5px solid ${active ? DARK : CAAD}`,
                backgroundColor: active ? DARK : '#FFF',
                color: active ? '#FFF' : '#7F613D',
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                transition: 'all 0.15s',
              }}
            >
              <i className={tab.icon} style={{ fontSize: 13 }} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 32px' }}>
        {activeTab === 'pausen' ? PausenTab : TippsTab}
      </div>
    </div>
  )
}
