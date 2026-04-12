import { useState } from 'react'

const BROWN = '#7F613D'
const SAND = '#EDE3D6'
const BG = '#F5EDE4'
const DARK = '#23283A'
const TOTAL_STEPS = 9

export interface Stimme {
  id: string
  emoji: string
  name: string
  quote: string
  isCustom?: boolean
}

const DEFAULT_STIMMEN: Stimme[] = [
  { id: 'kritiker', emoji: '😤', name: 'Innerer Kritiker', quote: 'Du hättest das besser machen sollen.' },
  { id: 'chiller', emoji: '😌', name: 'Der Chiller', quote: 'Lass es einfach mal gut sein.' },
  { id: 'harmonie', emoji: '🤝', name: 'Harmoniesüchtiger', quote: 'Hauptsache alle sind zufrieden.' },
  { id: 'angst', emoji: '😰', name: 'Der Angstmacher', quote: 'Was ist wenn alles schiefgeht?' },
  { id: 'mut', emoji: '🌟', name: 'Der Mutmacher', quote: 'Du schaffst das!' },
  { id: 'rebell', emoji: '🔥', name: 'Der Rebell', quote: 'Ich will das gar nicht.' },
  { id: 'beschuetzer', emoji: '🛡️', name: 'Der Beschützer', quote: 'Ich pass auf dich auf.' },
  { id: 'gruebler', emoji: '💭', name: 'Der Grübler', quote: 'Ich muss das nochmal durchdenken.' },
]

const THEMEN_CHIPS = [
  'Ärger mit Partner/in', 'Stress auf der Arbeit', 'Familienkonflikt',
  'Entscheidung treffen', 'Erschöpfung / Burnout', 'Angst vor Veränderung',
  'Selbstzweifel', 'Einsamkeit', 'Trauer / Verlust',
]

const EMOTIONS_GROUPS = [
  { label: 'Wut',          emoji: '😠', subs: ['Ärger', 'Frustration', 'Ungeduld', 'Eifersucht'] },
  { label: 'Trauer',       emoji: '😢', subs: ['Enttäuschung', 'Einsamkeit', 'Hilflosigkeit', 'Traurigkeit'] },
  { label: 'Angst',        emoji: '😨', subs: ['Sorge', 'Nervosität', 'Panik', 'Unsicherheit'] },
  { label: 'Freude',       emoji: '😊', subs: ['Dankbarkeit', 'Stolz', 'Begeisterung', 'Zufriedenheit'] },
  { label: 'Ekel',         emoji: '😣', subs: ['Ablehnung', 'Scham', 'Schuld', 'Unbehagen'] },
  { label: 'Überraschung', emoji: '😲', subs: ['Verwirrung', 'Neugier', 'Staunen', 'Hoffnung'] },
]

const BEDUERFNISSE = [
  'Schutz', 'Anerkennung', 'Sicherheit', 'Bindung', 'Kontrolle',
  'Nähe', 'Ruhe', 'Selbstverwirklichung', 'Gesehen werden',
  'Freiheit', 'Verständnis', 'Wertschätzung', 'Zugehörigkeit',
  'Autonomie', 'Vertrauen', 'Stabilität',
]

const EMOJI_PICKER_LIST = [
  '😤','😌','🤝','😰','🌟','🔥','🛡️','💭','😊','😢',
  '😠','😨','🦁','🐯','🦊','🌈','💫','🎯','🌺','🧠',
  '💪','🌙','⚡','🕊️','🌊','🎭','👁️','🌿','💎','🐉',
]

const AKTIONEN = [
  '5 Min durchatmen', 'Eine Person anrufen', 'Spaziergang machen',
  'Tagebuch schreiben', 'Etwas Schönes essen', 'Musik hören',
]

export interface ConferenceState {
  selectedThemen: string[]
  themaText: string
  selectedStimmen: string[]
  stimmenNames: Record<string, string>
  customStimmen: Stimme[]
  conferenceStatus: Record<string, 'neutral' | 'dominant'>
  emotionen: Record<string, string[]>
  beduerfnisse: Record<string, string[]>
  konfliktSeiteA: string[]
  konfliktSeiteB: string[]
  konfliktText: string
  kompromiss: string
  selectedAktion: string
  freundText: string
}

interface Props {
  onBack: () => void
}

// ─── Shared helpers ────────────────────────────────────────────────────────────

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="w-full h-1 rounded-full" style={{ backgroundColor: '#E8DDD4' }}>
      <div
        className="h-1 rounded-full transition-all duration-300"
        style={{ backgroundColor: BROWN, width: `${(step / TOTAL_STEPS) * 100}%` }}
      />
    </div>
  )
}

function StepHeader({ step, onBack }: { step: number; onBack: () => void }) {
  return (
    <div className="px-6 pt-12 pb-4">
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-9 h-9 rounded-full"
          style={{ backgroundColor: SAND }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={DARK} strokeWidth="2.5" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: SAND, color: BROWN }}>
          Schritt {step} / {TOTAL_STEPS}
        </span>
      </div>
      <ProgressBar step={step} />
    </div>
  )
}

function getAllStimmen(state: ConferenceState) {
  return [...DEFAULT_STIMMEN, ...state.customStimmen]
}

function getSelected(state: ConferenceState) {
  return getAllStimmen(state).filter(s => state.selectedStimmen.includes(s.id))
}

function displayName(state: ConferenceState, s: Stimme) {
  return state.stimmenNames[s.id] ?? s.name
}

// ─── Schritt 1 ─────────────────────────────────────────────────────────────────
function Schritt1({ state, update, onNext }: { state: ConferenceState; update: (s: Partial<ConferenceState>) => void; onNext: () => void }) {
  function toggle(t: string) {
    const cur = state.selectedThemen
    update({ selectedThemen: cur.includes(t) ? cur.filter(x => x !== t) : [...cur, t] })
  }
  const canContinue = state.selectedThemen.length > 0 || state.themaText.trim().length > 0

  return (
    <div className="flex-1 px-6 pb-6">
      <h2 className="text-2xl mb-1" style={{ fontFamily: 'Georgia, serif', color: DARK, fontWeight: 500 }}>
        Was beschäftigt dich gerade?
      </h2>
      <p className="text-sm mb-5" style={{ color: '#9E9E9E' }}>Wähle ein oder mehrere Themen.</p>
      <div className="flex flex-wrap gap-2 mb-5">
        {THEMEN_CHIPS.map(t => {
          const sel = state.selectedThemen.includes(t)
          return (
            <button
              key={t}
              onClick={() => toggle(t)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all"
              style={{
                backgroundColor: sel ? SAND : '#FFFFFF',
                border: `1.5px solid ${sel ? BROWN : '#DDD5C8'}`,
                color: sel ? BROWN : DARK,
              }}
            >
              {t}
            </button>
          )
        })}
      </div>
      <textarea
        value={state.themaText}
        onChange={e => update({ themaText: e.target.value })}
        placeholder="Oder in eigenen Worten..."
        rows={3}
        className="w-full rounded-2xl px-4 py-3 text-sm resize-none"
        style={{ backgroundColor: SAND, border: `1.5px solid ${BROWN}20`, color: DARK, outline: 'none' }}
      />
      <button
        onClick={onNext}
        disabled={!canContinue}
        className="w-full py-4 rounded-2xl font-semibold mt-6 transition-all"
        style={{ backgroundColor: canContinue ? BROWN : '#C9B9A7', color: '#FFF' }}
      >
        Weiter
      </button>
    </div>
  )
}

// ─── Schritt 2 ─────────────────────────────────────────────────────────────────
function Schritt2({ state, update, onNext }: { state: ConferenceState; update: (s: Partial<ConferenceState>) => void; onNext: () => void }) {
  const [customInput, setCustomInput] = useState('')
  const [pickedEmoji, setPickedEmoji] = useState('💬')
  const [showPicker, setShowPicker] = useState(false)
  const allStimmen = getAllStimmen(state)

  function toggleStimme(id: string) {
    const cur = state.selectedStimmen
    update({ selectedStimmen: cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id] })
  }

  function addCustom() {
    if (!customInput.trim()) return
    const id = 'custom_' + Date.now()
    const newS: Stimme = { id, emoji: pickedEmoji, name: customInput.trim(), quote: '...', isCustom: true }
    const nextCustom = [...state.customStimmen, newS]
    update({ customStimmen: nextCustom, selectedStimmen: [...state.selectedStimmen, id] })
    localStorage.setItem('manna_custom_stimmen', JSON.stringify(nextCustom))
    setCustomInput('')
    setPickedEmoji('💬')
    setShowPicker(false)
  }

  return (
    <div className="flex-1 px-6 pb-6">
      <h2 className="text-2xl mb-1" style={{ fontFamily: 'Georgia, serif', color: DARK, fontWeight: 500 }}>
        Mein inneres Team
      </h2>
      <p className="text-sm mb-5" style={{ color: '#9E9E9E' }}>
        Wähle die Teile die du gerade in dir hörst. Du kannst sie auch umbenennen.
      </p>
      <div className="flex flex-col gap-3 mb-4">
        {allStimmen.map(s => {
          const sel = state.selectedStimmen.includes(s.id)
          return (
            <div
              key={s.id}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 cursor-pointer transition-all"
              style={{
                backgroundColor: sel ? SAND : '#FFFFFF',
                border: `1.5px solid ${sel ? BROWN : '#E8DDD4'}`,
              }}
              onClick={() => toggleStimme(s.id)}
            >
              <span style={{ fontSize: 28 }}>{s.emoji}</span>
              <div className="flex-1 min-w-0">
                {sel ? (
                  <input
                    value={state.stimmenNames[s.id] ?? s.name}
                    onChange={e => {
                      e.stopPropagation()
                      update({ stimmenNames: { ...state.stimmenNames, [s.id]: e.target.value } })
                    }}
                    onClick={e => e.stopPropagation()}
                    className="text-sm font-semibold w-full bg-transparent border-b"
                    style={{ color: BROWN, borderColor: BROWN + '60', outline: 'none' }}
                  />
                ) : (
                  <p className="text-sm font-semibold" style={{ color: DARK }}>{s.name}</p>
                )}
                <p className="text-xs italic mt-0.5" style={{ color: '#9E9E9E' }}>"{s.quote}"</p>
              </div>
              <div
                className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                style={{ borderColor: sel ? BROWN : '#C8BDB0', backgroundColor: sel ? BROWN : 'transparent' }}
              >
                {sel && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4l3 3 5-6" stroke="#FFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Emoji picker */}
      <div className="mb-3">
        <button
          onClick={() => setShowPicker(p => !p)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm"
          style={{ backgroundColor: SAND, border: `1.5px solid ${BROWN}30`, color: BROWN }}
        >
          <span style={{ fontSize: 20 }}>{pickedEmoji}</span>
          <span>Emoji wählen</span>
          <i className={`fa-solid fa-chevron-${showPicker ? 'up' : 'down'}`} style={{ fontSize: 10 }} />
        </button>
        {showPicker && (
          <div
            className="mt-2 p-3 rounded-2xl"
            style={{ backgroundColor: '#FFF', border: `1.5px solid ${BROWN}20` }}
          >
            <div className="flex flex-wrap gap-2">
              {EMOJI_PICKER_LIST.map(em => (
                <button
                  key={em}
                  onClick={() => { setPickedEmoji(em); setShowPicker(false) }}
                  style={{
                    fontSize: 24,
                    width: 40, height: 40,
                    borderRadius: 10,
                    border: `2px solid ${em === pickedEmoji ? BROWN : 'transparent'}`,
                    backgroundColor: em === pickedEmoji ? SAND : 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2 mb-6">
        <input
          value={customInput}
          onChange={e => setCustomInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addCustom()}
          placeholder="Eigene Stimme hinzufügen"
          className="flex-1 rounded-xl px-4 py-2.5 text-sm"
          style={{ backgroundColor: SAND, border: `1.5px solid ${BROWN}30`, color: DARK, outline: 'none' }}
        />
        <button
          onClick={addCustom}
          className="px-4 py-2.5 rounded-xl text-sm font-semibold"
          style={{ backgroundColor: BROWN, color: '#FFF' }}
        >
          +
        </button>
      </div>
      <button
        onClick={onNext}
        disabled={state.selectedStimmen.length === 0}
        className="w-full py-4 rounded-2xl font-semibold transition-all"
        style={{ backgroundColor: state.selectedStimmen.length > 0 ? BROWN : '#C9B9A7', color: '#FFF' }}
      >
        Weiter ({state.selectedStimmen.length} gewählt)
      </button>
    </div>
  )
}

// ─── Schritt 3 — Konferenztisch (neutral ↔ dominant only) ──────────────────────
function Schritt3({ state, update, onNext }: { state: ConferenceState; update: (s: Partial<ConferenceState>) => void; onNext: () => void }) {
  const selected = getSelected(state)

  function toggleDominant(id: string) {
    const cur = state.conferenceStatus[id] ?? 'neutral'
    update({ conferenceStatus: { ...state.conferenceStatus, [id]: cur === 'dominant' ? 'neutral' : 'dominant' } })
  }

  function circleStyle(id: string) {
    return state.conferenceStatus[id] === 'dominant'
      ? { border: `3px solid ${BROWN}`, backgroundColor: SAND }
      : { border: `3px solid #CAAD82`, backgroundColor: '#FFF' }
  }

  const cx = 150
  const cy = 115
  const rx = 108
  const ry = 76

  return (
    <div className="flex-1 px-6 pb-6">
      <h2 className="text-2xl mb-1" style={{ fontFamily: 'Georgia, serif', color: DARK, fontWeight: 500 }}>
        Deine innere Konferenz
      </h2>
      <p className="text-sm mb-5" style={{ color: '#9E9E9E' }}>
        Tippe auf eine Stimme um sie als dominant (braun) zu markieren.
      </p>

      <div className="relative mx-auto mb-6" style={{ width: 300, height: 230 }}>
        {/* Table oval */}
        <div
          className="absolute rounded-full"
          style={{
            left: cx - 80, top: cy - 55, width: 160, height: 110,
            backgroundColor: SAND, border: `2px solid ${BROWN}40`,
          }}
        />
        <span
          className="absolute text-xs font-medium"
          style={{ left: cx - 24, top: cy + 12, color: BROWN + '90' }}
        >
          Inneres Team
        </span>

        {selected.map((s, i) => {
          const angle = (2 * Math.PI * i) / selected.length - Math.PI / 2
          const x = cx + rx * Math.cos(angle) - 28
          const y = cy + ry * Math.sin(angle) - 28
          const name = displayName(state, s)
          return (
            <button
              key={s.id}
              onClick={() => toggleDominant(s.id)}
              className="absolute flex flex-col items-center"
              style={{ left: x, top: y, width: 56 }}
            >
              <div
                className="rounded-full flex items-center justify-center"
                style={{ ...circleStyle(s.id), width: 56, height: 56, fontSize: 24 }}
              >
                {s.emoji}
              </div>
              <span className="text-center mt-1 leading-tight" style={{ fontSize: 10, color: DARK, maxWidth: 56 }}>
                {name.length > 10 ? name.slice(0, 9) + '…' : name}
              </span>
            </button>
          )
        })}
      </div>

      {/* Legend — only 2 states */}
      <div className="flex gap-4 justify-center mb-6">
        {[
          { color: BROWN, label: 'Dominant' },
          { color: '#CAAD82', label: 'Neutral' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-xs" style={{ color: '#9E9E9E' }}>{label}</span>
          </div>
        ))}
      </div>

      <button onClick={onNext} className="w-full py-4 rounded-2xl font-semibold" style={{ backgroundColor: BROWN, color: '#FFF' }}>
        Weiter
      </button>
    </div>
  )
}

// ─── Schritt 4 — Emotionen ─────────────────────────────────────────────────────
function Schritt4({ state, update, onNext }: { state: ConferenceState; update: (s: Partial<ConferenceState>) => void; onNext: () => void }) {
  const selected = getSelected(state)
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({})
  const [customInputs, setCustomInputs] = useState<Record<string, string>>({})

  function toggleEmotion(stimmeId: string, emotion: string) {
    const cur = state.emotionen[stimmeId] ?? []
    update({ emotionen: { ...state.emotionen, [stimmeId]: cur.includes(emotion) ? cur.filter(x => x !== emotion) : [...cur, emotion] } })
  }

  function toggleGroup(key: string) {
    setOpenGroups(prev => ({ ...prev, [key]: !prev[key] }))
  }

  function addCustomEmotion(stimmeId: string) {
    const val = (customInputs[stimmeId] ?? '').trim()
    if (!val) return
    const cur = state.emotionen[stimmeId] ?? []
    if (!cur.includes(val)) update({ emotionen: { ...state.emotionen, [stimmeId]: [...cur, val] } })
    setCustomInputs(prev => ({ ...prev, [stimmeId]: '' }))
  }

  return (
    <div className="flex-1 px-6 pb-6">
      <h2 className="text-2xl mb-1" style={{ fontFamily: 'Georgia, serif', color: DARK, fontWeight: 500 }}>
        Welche Emotionen spürst du?
      </h2>
      <p className="text-sm mb-5" style={{ color: '#9E9E9E' }}>
        Ordne jeder Stimme die passenden Emotionen zu.
      </p>
      <div className="flex flex-col gap-4 mb-6">
        {selected.map(s => {
          const emotions = state.emotionen[s.id] ?? []
          const name = displayName(state, s)
          return (
            <div key={s.id} className="rounded-2xl p-4" style={{ backgroundColor: '#FFF', border: '1.5px solid #E8DDD4' }}>
              <div className="flex items-center gap-2 mb-3">
                <span style={{ fontSize: 22 }}>{s.emoji}</span>
                <span className="font-semibold text-sm" style={{ color: DARK }}>{name}</span>
              </div>

              {/* Selected emotion chips */}
              {emotions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {emotions.map(em => (
                    <button
                      key={em}
                      onClick={() => toggleEmotion(s.id, em)}
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: SAND, border: `1.5px solid ${BROWN}`, color: BROWN }}
                    >
                      {em} ×
                    </button>
                  ))}
                </div>
              )}

              {/* Collapsible emotion groups */}
              <div className="flex flex-col gap-1.5">
                {EMOTIONS_GROUPS.map(group => {
                  const key = `${s.id}__${group.label}`
                  const isOpen = openGroups[key]
                  return (
                    <div key={group.label}>
                      <button
                        onClick={() => toggleGroup(key)}
                        className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-semibold"
                        style={{ backgroundColor: '#F5F0EB', color: DARK }}
                      >
                        <span>{group.emoji} {group.label}</span>
                        <i className={`fa-solid fa-chevron-${isOpen ? 'up' : 'down'}`} style={{ fontSize: 9, color: '#9E9E9E' }} />
                      </button>
                      {isOpen && (
                        <div className="flex flex-wrap gap-1.5 mt-1.5 px-1">
                          {group.subs.map(sub => {
                            const sel = emotions.includes(sub)
                            return (
                              <button
                                key={sub}
                                onClick={() => toggleEmotion(s.id, sub)}
                                className="px-3 py-1 rounded-full text-xs font-medium"
                                style={{
                                  backgroundColor: sel ? SAND : '#FDFAF6',
                                  border: `1.5px solid ${sel ? BROWN : '#E8DDD4'}`,
                                  color: sel ? BROWN : '#7A6E64',
                                }}
                              >
                                {sub}
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Custom emotion input */}
              <div className="flex gap-2 mt-3">
                <input
                  value={customInputs[s.id] ?? ''}
                  onChange={e => setCustomInputs(prev => ({ ...prev, [s.id]: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && addCustomEmotion(s.id)}
                  placeholder="Eigene Emotion..."
                  className="flex-1 rounded-xl px-3 py-1.5 text-xs"
                  style={{ backgroundColor: SAND, border: `1.5px solid ${BROWN}30`, color: DARK, outline: 'none' }}
                />
                <button
                  onClick={() => addCustomEmotion(s.id)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold"
                  style={{ backgroundColor: BROWN, color: '#FFF' }}
                >+</button>
              </div>
            </div>
          )
        })}
      </div>
      <button onClick={onNext} className="w-full py-4 rounded-2xl font-semibold" style={{ backgroundColor: BROWN, color: '#FFF' }}>
        Weiter
      </button>
    </div>
  )
}

// ─── Schritt 5 — Bedürfnisse ───────────────────────────────────────────────────
function Schritt5({ state, update, onNext }: { state: ConferenceState; update: (s: Partial<ConferenceState>) => void; onNext: () => void }) {
  const selected = getSelected(state)
  const [customInputs, setCustomInputs] = useState<Record<string, string>>({})

  function toggleBed(stimmeId: string, bed: string) {
    const cur = state.beduerfnisse[stimmeId] ?? []
    update({ beduerfnisse: { ...state.beduerfnisse, [stimmeId]: cur.includes(bed) ? cur.filter(x => x !== bed) : [...cur, bed] } })
  }

  function addCustomBed(stimmeId: string) {
    const val = (customInputs[stimmeId] ?? '').trim()
    if (!val) return
    const cur = state.beduerfnisse[stimmeId] ?? []
    if (!cur.includes(val)) update({ beduerfnisse: { ...state.beduerfnisse, [stimmeId]: [...cur, val] } })
    setCustomInputs(prev => ({ ...prev, [stimmeId]: '' }))
  }

  return (
    <div className="flex-1 px-6 pb-6">
      <h2 className="text-2xl mb-1" style={{ fontFamily: 'Georgia, serif', color: DARK, fontWeight: 500 }}>
        Was braucht jede Stimme wirklich?
      </h2>
      <p className="text-sm mb-5" style={{ color: '#9E9E9E' }}>Wähle Bedürfnisse für jede Stimme.</p>
      <div className="flex flex-col gap-4 mb-6">
        {selected.map(s => {
          const beds = state.beduerfnisse[s.id] ?? []
          const name = displayName(state, s)
          return (
            <div key={s.id} className="rounded-2xl p-4" style={{ backgroundColor: '#FFF', border: '1.5px solid #E8DDD4' }}>
              <div className="flex items-center gap-2 mb-3">
                <span style={{ fontSize: 22 }}>{s.emoji}</span>
                <span className="font-semibold text-sm" style={{ color: DARK }}>{name}</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {BEDUERFNISSE.map(bed => {
                  const sel = beds.includes(bed)
                  return (
                    <button
                      key={bed}
                      onClick={() => toggleBed(s.id, bed)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                      style={{
                        backgroundColor: sel ? SAND : '#F5F0EB',
                        border: `1.5px solid ${sel ? BROWN : 'transparent'}`,
                        color: sel ? BROWN : '#7A6E64',
                      }}
                    >
                      {bed}
                    </button>
                  )
                })}
              </div>
              {/* Custom need input */}
              <div className="flex gap-2">
                <input
                  value={customInputs[s.id] ?? ''}
                  onChange={e => setCustomInputs(prev => ({ ...prev, [s.id]: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && addCustomBed(s.id)}
                  placeholder="Eigenes Bedürfnis..."
                  className="flex-1 rounded-xl px-3 py-1.5 text-xs"
                  style={{ backgroundColor: SAND, border: `1.5px solid ${BROWN}30`, color: DARK, outline: 'none' }}
                />
                <button
                  onClick={() => addCustomBed(s.id)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold"
                  style={{ backgroundColor: BROWN, color: '#FFF' }}
                >+</button>
              </div>
            </div>
          )
        })}
      </div>
      <button onClick={onNext} className="w-full py-4 rounded-2xl font-semibold" style={{ backgroundColor: BROWN, color: '#FFF' }}>
        Weiter
      </button>
    </div>
  )
}

// ─── Schritt 6 — Zielkonflikte (multi-side) ────────────────────────────────────
function Schritt6({ state, update, onNext }: { state: ConferenceState; update: (s: Partial<ConferenceState>) => void; onNext: () => void }) {
  const selected = getSelected(state)

  function toggleSide(side: 'A' | 'B', id: string) {
    const fieldA = state.konfliktSeiteA
    const fieldB = state.konfliktSeiteB
    if (side === 'A') {
      // Remove from B if present, toggle in A
      const inA = fieldA.includes(id)
      update({
        konfliktSeiteA: inA ? fieldA.filter(x => x !== id) : [...fieldA, id],
        konfliktSeiteB: fieldB.filter(x => x !== id),
      })
    } else {
      const inB = fieldB.includes(id)
      update({
        konfliktSeiteB: inB ? fieldB.filter(x => x !== id) : [...fieldB, id],
        konfliktSeiteA: fieldA.filter(x => x !== id),
      })
    }
  }

  function SideBox({ side, label }: { side: 'A' | 'B'; label: string }) {
    const ids = side === 'A' ? state.konfliktSeiteA : state.konfliktSeiteB
    const stimmen = ids.map(id => selected.find(s => s.id === id)).filter(Boolean) as Stimme[]
    return (
      <div
        className="flex-1 rounded-2xl p-3 min-h-[90px] flex flex-col gap-1.5"
        style={{ backgroundColor: SAND, border: `1.5px dashed ${BROWN}60` }}
      >
        <p className="text-xs font-semibold" style={{ color: BROWN }}>{label}</p>
        {stimmen.length === 0 ? (
          <p className="text-xs" style={{ color: '#C9B9A7' }}>Stimmen tippen →</p>
        ) : (
          stimmen.map(s => (
            <div key={s.id} className="flex items-center gap-1">
              <span style={{ fontSize: 16 }}>{s.emoji}</span>
              <span className="text-xs font-medium" style={{ color: BROWN }}>
                {displayName(state, s)}
              </span>
            </div>
          ))
        )}
      </div>
    )
  }

  return (
    <div className="flex-1 px-6 pb-6">
      <h2 className="text-2xl mb-1" style={{ fontFamily: 'Georgia, serif', color: DARK, fontWeight: 500 }}>
        Welche Stimmen stehen sich gegenüber?
      </h2>
      <p className="text-sm mb-4" style={{ color: '#9E9E9E' }}>
        Tippe auf eine Stimme um sie Seite A oder B zuzuordnen. Nochmaliges Tippen entfernt sie.
      </p>

      {/* Side boxes */}
      <div className="flex gap-3 mb-4">
        <SideBox side="A" label="Seite A" />
        <div className="flex items-center justify-center px-1">
          <span className="text-base font-bold" style={{ color: '#C9B9A7' }}>VS</span>
        </div>
        <SideBox side="B" label="Seite B" />
      </div>

      {/* Chips to assign */}
      <div className="flex flex-col gap-2 mb-5">
        {selected.map(s => {
          const inA = state.konfliktSeiteA.includes(s.id)
          const inB = state.konfliktSeiteB.includes(s.id)
          const name = displayName(state, s)
          return (
            <div key={s.id} className="flex gap-2 items-center">
              <div className="flex items-center gap-2 w-28">
                <span style={{ fontSize: 18 }}>{s.emoji}</span>
                <span className="text-xs font-medium truncate" style={{ color: DARK }}>{name}</span>
              </div>
              <button
                onClick={() => toggleSide('A', s.id)}
                className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
                style={{
                  backgroundColor: inA ? SAND : '#F5F0EB',
                  border: `1.5px solid ${inA ? BROWN : 'transparent'}`,
                  color: inA ? BROWN : '#9E9E9E',
                }}
              >
                Seite A
              </button>
              <button
                onClick={() => toggleSide('B', s.id)}
                className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
                style={{
                  backgroundColor: inB ? SAND : '#F5F0EB',
                  border: `1.5px solid ${inB ? BROWN : 'transparent'}`,
                  color: inB ? BROWN : '#9E9E9E',
                }}
              >
                Seite B
              </button>
            </div>
          )
        })}
      </div>

      <textarea
        value={state.konfliktText}
        onChange={e => update({ konfliktText: e.target.value })}
        placeholder="Was ist der Kernkonflikt?"
        rows={3}
        className="w-full rounded-2xl px-4 py-3 text-sm resize-none mb-5"
        style={{ backgroundColor: SAND, border: `1.5px solid ${BROWN}20`, color: DARK, outline: 'none' }}
      />

      <button onClick={onNext} className="w-full py-4 rounded-2xl font-semibold" style={{ backgroundColor: BROWN, color: '#FFF' }}>
        Weiter
      </button>
    </div>
  )
}

// ─── Schritt 7 — Integration ───────────────────────────────────────────────────
function Schritt7({ state, update, onNext }: { state: ConferenceState; update: (s: Partial<ConferenceState>) => void; onNext: () => void }) {
  const selected = getSelected(state)

  return (
    <div className="flex-1 px-6 pb-6">
      <h2 className="text-2xl mb-1" style={{ fontFamily: 'Georgia, serif', color: DARK, fontWeight: 500 }}>
        Integration
      </h2>
      <p className="text-sm mb-5" style={{ color: '#9E9E9E' }}>
        Was braucht jede Stimme damit sie sich gehört fühlt?
      </p>

      <div className="flex flex-col gap-2 mb-5">
        {selected.map(s => {
          const name = displayName(state, s)
          const beds = state.beduerfnisse[s.id] ?? []
          return (
            <div key={s.id} className="flex items-center gap-3 rounded-xl px-4 py-3"
              style={{ backgroundColor: '#FFF', border: '1.5px solid #E8DDD4' }}>
              <span style={{ fontSize: 22 }}>{s.emoji}</span>
              <div>
                <p className="text-sm font-semibold" style={{ color: DARK }}>{name}</p>
                {beds.length > 0 && (
                  <p className="text-xs mt-0.5" style={{ color: '#9E9E9E' }}>{beds.join(' · ')}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <label className="block text-sm font-semibold mb-2" style={{ color: DARK }}>
        Mein Kompromiss / meine Idee
      </label>
      <textarea
        value={state.kompromiss}
        onChange={e => update({ kompromiss: e.target.value })}
        placeholder="z.B. Ich arbeite 2 Stunden konzentriert, dann mache ich bewusst Pause ohne schlechtes Gewissen."
        rows={4}
        className="w-full rounded-2xl px-4 py-3 text-sm resize-none mb-6"
        style={{ backgroundColor: SAND, border: `1.5px solid ${BROWN}20`, color: DARK, outline: 'none' }}
      />

      <button onClick={onNext} className="w-full py-4 rounded-2xl font-semibold" style={{ backgroundColor: BROWN, color: '#FFF' }}>
        Weiter
      </button>
    </div>
  )
}

// ─── Schritt 8 — Nächster Schritt & Freundes-Perspektive ──────────────────────
function Schritt8({ state, update, onNext }: { state: ConferenceState; update: (s: Partial<ConferenceState>) => void; onNext: () => void }) {
  return (
    <div className="flex-1 px-6 pb-6">
      <h2 className="text-2xl mb-5" style={{ fontFamily: 'Georgia, serif', color: DARK, fontWeight: 500 }}>
        Nächster Schritt & Freundes-Perspektive
      </h2>

      <div className="rounded-2xl p-4 mb-5" style={{ backgroundColor: '#FFF', border: '1.5px solid #E8DDD4' }}>
        <h3 className="font-semibold text-sm mb-3" style={{ color: DARK }}>Was kannst du jetzt sofort tun?</h3>
        <div className="flex flex-wrap gap-2">
          {AKTIONEN.map(a => {
            const sel = state.selectedAktion === a
            return (
              <button
                key={a}
                onClick={() => update({ selectedAktion: sel ? '' : a })}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                style={{
                  backgroundColor: sel ? SAND : '#F5F0EB',
                  border: `1.5px solid ${sel ? BROWN : 'transparent'}`,
                  color: sel ? BROWN : '#7A6E64',
                }}
              >
                {a}
              </button>
            )
          })}
        </div>
      </div>

      <div className="rounded-2xl p-4 mb-6" style={{ backgroundColor: '#FFF', border: '1.5px solid #E8DDD4' }}>
        <h3 className="font-semibold text-sm mb-1" style={{ color: DARK }}>Die Freundes-Perspektive</h3>
        <p className="text-xs mb-3" style={{ color: '#9E9E9E' }}>
          Stell dir vor, ein guter Freund oder eine gute Freundin erzählt dir genau diese Situation.
          Was würdest du ihm oder ihr raten?
        </p>
        <textarea
          value={state.freundText}
          onChange={e => update({ freundText: e.target.value })}
          placeholder="Ich würde sagen..."
          rows={4}
          className="w-full rounded-xl px-3 py-2.5 text-sm resize-none"
          style={{ backgroundColor: SAND, border: `1.5px solid ${BROWN}20`, color: DARK, outline: 'none' }}
        />
      </div>

      <button onClick={onNext} className="w-full py-4 rounded-2xl font-semibold" style={{ backgroundColor: BROWN, color: '#FFF' }}>
        Zusammenfassung anzeigen
      </button>
    </div>
  )
}

// ─── Schritt 9 — Zusammenfassung ───────────────────────────────────────────────
export function KonferenzZusammenfassung({
  state,
  onSave,
  onBack,
  readOnly = false,
}: {
  state: ConferenceState
  onSave?: () => void
  onBack: () => void
  readOnly?: boolean
}) {
  const allStimmen = getAllStimmen(state)
  const selected = allStimmen.filter(s => state.selectedStimmen.includes(s.id))

  const seiteAStimmen = state.konfliktSeiteA
    .map(id => selected.find(s => s.id === id))
    .filter(Boolean) as Stimme[]
  const seiteBStimmen = state.konfliktSeiteB
    .map(id => selected.find(s => s.id === id))
    .filter(Boolean) as Stimme[]

  const themaLabel = state.selectedThemen.length > 0
    ? state.selectedThemen.join(', ')
    : state.themaText || '—'

  const cardStyle = {
    backgroundColor: BG,
    border: '1.5px solid #D4B896',
    borderRadius: 16,
    padding: '12px 16px',
  }

  return (
    <div className="flex-1 px-6 pb-6">
      <h2 className="text-2xl mb-1" style={{ fontFamily: 'Georgia, serif', color: DARK, fontWeight: 500 }}>
        Deine innere Konferenz
      </h2>
      <p className="text-sm mb-5" style={{ color: '#9E9E9E' }}>ist abgeschlossen ✓</p>

      {/* Thema */}
      <div className="mb-4" style={cardStyle}>
        <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#9E9E9E' }}>Thema</p>
        <p className="text-sm font-medium" style={{ color: DARK }}>{themaLabel}</p>
        {state.themaText && state.selectedThemen.length > 0 && (
          <p className="text-sm mt-1 italic" style={{ color: '#7A6E64' }}>{state.themaText}</p>
        )}
      </div>

      {/* Stimmen */}
      <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#9E9E9E' }}>
        Stimmen & Bedürfnisse
      </p>
      <div className="flex flex-col gap-2 mb-4">
        {selected.map(s => {
          const name = displayName(state, s)
          const beds = state.beduerfnisse[s.id] ?? []
          const emos = state.emotionen[s.id] ?? []
          const isDominant = state.conferenceStatus[s.id] === 'dominant'
          return (
            <div
              key={s.id}
              className="flex items-start gap-3 rounded-2xl px-4 py-3"
              style={{
                backgroundColor: BG,
                border: `1.5px solid ${isDominant ? BROWN : '#D4B896'}`,
              }}
            >
              <span style={{ fontSize: 22, marginTop: 1 }}>{s.emoji}</span>
              <div>
                <p className="text-sm font-bold" style={{ color: DARK }}>{name}</p>
                {beds.length > 0 && (
                  <p className="text-xs mt-0.5 font-medium" style={{ color: BROWN }}>{beds.join(' · ')}</p>
                )}
                {emos.length > 0 && (
                  <p className="text-xs mt-0.5" style={{ color: '#9E9E9E' }}>{emos.join(' · ')}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Konflikt */}
      {(seiteAStimmen.length > 0 || seiteBStimmen.length > 0) && (
        <div className="mb-4" style={cardStyle}>
          <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#9E9E9E' }}>Zielkonflikt</p>
          <div className="flex gap-3 mb-2">
            <div className="flex-1">
              <p className="text-xs font-semibold mb-1" style={{ color: BROWN }}>Seite A</p>
              {seiteAStimmen.map(s => (
                <p key={s.id} className="text-xs" style={{ color: DARK }}>{s.emoji} {displayName(state, s)}</p>
              ))}
            </div>
            <div className="flex items-center justify-center px-1">
              <span className="text-xs font-bold" style={{ color: '#C9B9A7' }}>VS</span>
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold mb-1" style={{ color: BROWN }}>Seite B</p>
              {seiteBStimmen.map(s => (
                <p key={s.id} className="text-xs" style={{ color: DARK }}>{s.emoji} {displayName(state, s)}</p>
              ))}
            </div>
          </div>
          {state.konfliktText && (
            <p className="text-sm italic" style={{ color: '#7A6E64' }}>{state.konfliktText}</p>
          )}
        </div>
      )}

      {/* Kompromiss */}
      {state.kompromiss && (
        <div className="mb-4" style={cardStyle}>
          <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#9E9E9E' }}>Mein Kompromiss</p>
          <p className="text-sm" style={{ color: DARK }}>{state.kompromiss}</p>
        </div>
      )}

      {/* Nächster Schritt */}
      {(state.selectedAktion || state.freundText) && (
        <div className="mb-6" style={cardStyle}>
          <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#9E9E9E' }}>Nächster Schritt</p>
          {state.selectedAktion && (
            <p className="text-sm font-medium mb-1" style={{ color: DARK }}>→ {state.selectedAktion}</p>
          )}
          {state.freundText && (
            <p className="text-sm italic" style={{ color: '#7A6E64' }}>"{state.freundText}"</p>
          )}
        </div>
      )}

      {readOnly ? (
        <button
          onClick={onBack}
          className="w-full py-4 rounded-2xl font-semibold"
          style={{ backgroundColor: BROWN, color: '#FFF' }}
        >
          Schließen
        </button>
      ) : (
        <>
          <button
            onClick={onSave}
            className="w-full py-4 rounded-2xl font-semibold mb-3"
            style={{ backgroundColor: BROWN, color: '#FFF' }}
          >
            Konferenz speichern
          </button>
          <button
            onClick={onBack}
            className="w-full py-3 rounded-2xl font-medium text-sm"
            style={{ backgroundColor: SAND, color: BROWN }}
          >
            Zurück zur Übersicht
          </button>
        </>
      )}
    </div>
  )
}

// ─── Main export ───────────────────────────────────────────────────────────────
export default function InnereKonferenz({ onBack }: Props) {
  const [step, setStep] = useState(1)
  const [saved, setSaved] = useState(false)
  const [state, setState] = useState<ConferenceState>({
    selectedThemen: [],
    themaText: '',
    selectedStimmen: [],
    stimmenNames: {},
    customStimmen: (() => { try { return JSON.parse(localStorage.getItem('manna_custom_stimmen') ?? '[]') } catch { return [] } })(),
    conferenceStatus: {},
    emotionen: {},
    beduerfnisse: {},
    konfliktSeiteA: [],
    konfliktSeiteB: [],
    konfliktText: '',
    kompromiss: '',
    selectedAktion: '',
    freundText: '',
  })

  function update(partial: Partial<ConferenceState>) {
    setState(prev => ({ ...prev, ...partial }))
  }

  function goBack() {
    if (step === 1) onBack()
    else setStep(s => s - 1)
  }

  function saveConference() {
    const key = 'manna_innere_konferenzen'
    const existing = JSON.parse(localStorage.getItem(key) ?? '[]')
    const themaLabel = state.selectedThemen.length > 0 ? state.selectedThemen.join(', ') : state.themaText || 'Innere Konferenz'
    const entry = {
      id: Date.now(),
      date: new Date().toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      thema: themaLabel,
      stimmenCount: state.selectedStimmen.length,
      data: state,
    }
    localStorage.setItem(key, JSON.stringify([entry, ...existing]))
    setSaved(true)
  }

  if (saved) {
    return (
      <div
        className="min-h-svh flex flex-col items-center justify-center px-6"
        style={{ backgroundColor: BG, maxWidth: '390px', margin: '0 auto' }}
      >
        <div className="text-5xl mb-4">🌿</div>
        <h2 className="text-2xl mb-2 text-center" style={{ fontFamily: 'Georgia, serif', color: DARK, fontWeight: 500 }}>
          Gespeichert!
        </h2>
        <p className="text-sm text-center mb-8" style={{ color: '#9E9E9E' }}>
          Deine innere Konferenz wurde erfolgreich gespeichert.
        </p>
        <button
          onClick={onBack}
          className="w-full py-4 rounded-2xl font-semibold"
          style={{ backgroundColor: BROWN, color: '#FFF' }}
        >
          Zurück zur Übersicht
        </button>
      </div>
    )
  }

  const stepContent = () => {
    switch (step) {
      case 1: return <Schritt1 state={state} update={update} onNext={() => setStep(2)} />
      case 2: return <Schritt2 state={state} update={update} onNext={() => setStep(3)} />
      case 3: return <Schritt3 state={state} update={update} onNext={() => setStep(4)} />
      case 4: return <Schritt4 state={state} update={update} onNext={() => setStep(5)} />
      case 5: return <Schritt5 state={state} update={update} onNext={() => setStep(6)} />
      case 6: return <Schritt6 state={state} update={update} onNext={() => setStep(7)} />
      case 7: return <Schritt7 state={state} update={update} onNext={() => setStep(8)} />
      case 8: return <Schritt8 state={state} update={update} onNext={() => setStep(9)} />
      case 9: return (
        <KonferenzZusammenfassung
          state={state}
          onSave={saveConference}
          onBack={onBack}
        />
      )
      default: return null
    }
  }

  return (
    <div
      className="min-h-svh flex flex-col overflow-y-auto"
      style={{ backgroundColor: BG, maxWidth: '390px', margin: '0 auto' }}
    >
      <StepHeader step={step} onBack={goBack} />
      {stepContent()}
    </div>
  )
}
