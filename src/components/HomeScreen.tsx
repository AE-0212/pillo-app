import { useState } from 'react'
import BewegungOnboarding from './BewegungOnboarding'
import EssenOnboarding from './EssenOnboarding'
import EssenScreen from './EssenScreen'
import ErholungOnboarding from './ErholungOnboarding'
import ErholungScreen from './ErholungScreen'
import MentaleOnboarding from './MentaleOnboarding'
import MentaleScreen from './MentaleScreen'

const AppleIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="52" height="52">
    {/* Stem */}
    <path d="M32 10 C32 10 33 4 38 3" stroke="#1E3A1C" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    {/* Leaf */}
    <path d="M33 8 C35 5 41 5 40 10 C38 10 33 10 33 8Z" fill="#3C6538"/>
    {/* Apple body */}
    <path d="M20 20 C12 20 8 28 8 35 C8 46 16 56 24 56 C27 56 29 54 32 54 C35 54 37 56 40 56 C48 56 56 46 56 35 C56 28 52 20 44 20 C41 20 38 22 32 22 C26 22 23 20 20 20Z" fill="#3C6538"/>
    {/* Highlight */}
    <ellipse cx="22" cy="30" rx="4" ry="6" fill="white" opacity="0.25" transform="rotate(-15 22 30)"/>
  </svg>
)

const WheelchairIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="52" height="52">
    {/* Head */}
    <circle cx="28" cy="10" r="5" fill="#C0202E"/>
    {/* Body leaning forward */}
    <path d="M28 15 L24 28 L34 28" stroke="#C0202E" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    {/* Arm reaching */}
    <path d="M30 20 L42 16" stroke="#C0202E" strokeWidth="3.5" strokeLinecap="round"/>
    {/* Seat */}
    <path d="M24 28 L24 40" stroke="#C0202E" strokeWidth="3.5" strokeLinecap="round"/>
    {/* Leg */}
    <path d="M24 38 L34 44" stroke="#C0202E" strokeWidth="3.5" strokeLinecap="round"/>
    {/* Wheel */}
    <circle cx="36" cy="48" r="10" stroke="#C0202E" strokeWidth="3" fill="none"/>
    <circle cx="36" cy="48" r="2" fill="#C0202E"/>
    {/* Wheel spokes */}
    <line x1="36" y1="38" x2="36" y2="58" stroke="#C0202E" strokeWidth="1.5"/>
    <line x1="26" y1="48" x2="46" y2="48" stroke="#C0202E" strokeWidth="1.5"/>
    <line x1="29" y1="41" x2="43" y2="55" stroke="#C0202E" strokeWidth="1.5"/>
    <line x1="43" y1="41" x2="29" y2="55" stroke="#C0202E" strokeWidth="1.5"/>
    {/* Small front wheel */}
    <circle cx="18" cy="42" r="4" stroke="#C0202E" strokeWidth="2.5" fill="none"/>
  </svg>
)

const LotusIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="52" height="52">
    {/* Center petal */}
    <path d="M32 20 C28 26 28 34 32 40 C36 34 36 26 32 20Z" fill="#5A6070"/>
    {/* Left inner petal */}
    <path d="M32 36 C24 30 18 30 18 38 C22 42 28 40 32 40Z" fill="#5A6070"/>
    {/* Right inner petal */}
    <path d="M32 36 C40 30 46 30 46 38 C42 42 36 40 32 40Z" fill="#5A6070"/>
    {/* Far left petal */}
    <path d="M26 34 C16 26 10 28 10 36 C14 42 22 40 26 38Z" fill="#8A8FA0" opacity="0.8"/>
    {/* Far right petal */}
    <path d="M38 34 C48 26 54 28 54 36 C50 42 42 40 38 38Z" fill="#8A8FA0" opacity="0.8"/>
    {/* Water line */}
    <path d="M12 44 Q32 40 52 44" stroke="#5A6070" strokeWidth="2" fill="none" strokeLinecap="round"/>
    {/* Stem */}
    <path d="M32 44 C32 50 30 54 28 56" stroke="#5A6070" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
  </svg>
)

const OmIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="52" height="52">
    <text
      x="32"
      y="46"
      textAnchor="middle"
      fontSize="44"
      fontFamily="serif"
      fill="#7A5C30"
    >
      ॐ
    </text>
  </svg>
)

const NavHomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
  </svg>
)

const NavTodayIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)

const NavProgressIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
)

const NavProfileIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)

const pillars = [
  {
    id: 'essen',
    label: 'Essen',
    bg: '#C8DEC7',
    iconCircle: '#E8F4E7',
    textColor: '#1E3A1C',
    icon: <i className="fa-solid fa-apple-whole" style={{ fontSize: '28px', color: '#1E3A1C' }} />,
  },
  {
    id: 'bewegung',
    label: 'Bewegung',
    bg: '#F5C8CC',
    iconCircle: '#FDEAEC',
    textColor: '#7A0F1B',
    icon: <i className="fa-solid fa-heart-pulse" style={{ fontSize: '28px', color: '#7A0F1B' }} />,
  },
  {
    id: 'erholung',
    label: 'Erholung',
    bg: '#D5D7DF',
    iconCircle: '#ECEDF4',
    textColor: '#0F1220',
    icon: <i className="fa-solid fa-spa" style={{ fontSize: '28px', color: '#0F1220' }} />,
  },
  {
    id: 'mental',
    label: 'Mentale',
    bg: '#E8DBCA',
    iconCircle: '#F5EFE6',
    textColor: '#4A3520',
    icon: <span style={{ fontSize: '32px', color: '#4A3520', fontFamily: 'serif', lineHeight: 1, fontWeight: 500, WebkitTextStroke: '1px #7F613D' }}>ॐ</span>,
  },
]

const navItems = [
  { label: 'Home', Icon: NavHomeIcon, active: true },
  { label: 'Heute', Icon: NavTodayIcon, active: false },
  { label: 'Fortschritt', Icon: NavProgressIcon, active: false },
  { label: 'Profil', Icon: NavProfileIcon, active: false },
]

export default function HomeScreen() {
  const [showBewegungOnboarding, setShowBewegungOnboarding] = useState(false)
  const [showEssenOnboarding, setShowEssenOnboarding] = useState(false)
  const [showEssenScreen, setShowEssenScreen] = useState(false)
  const [showErholungOnboarding, setShowErholungOnboarding] = useState(false)
  const [showErholungScreen, setShowErholungScreen] = useState(false)
  const [showMentaleOnboarding, setShowMentaleOnboarding] = useState(false)
  const [showMentaleScreen, setShowMentaleScreen] = useState(false)

  function handlePillarClick(id: string) {
    if (id === 'bewegung') {
      if (localStorage.getItem('bewegung-onboarding-done') !== 'true') {
        setShowBewegungOnboarding(true)
      }
    } else if (id === 'essen') {
      if (localStorage.getItem('essen-onboarding-done') !== 'true') {
        setShowEssenOnboarding(true)
      } else {
        setShowEssenScreen(true)
      }
    } else if (id === 'erholung') {
      if (localStorage.getItem('erholung-onboarding-done') !== 'true') {
        setShowErholungOnboarding(true)
      } else {
        setShowErholungScreen(true)
      }
    } else if (id === 'mental') {
      if (localStorage.getItem('mentale-onboarding-done') !== 'true') {
        setShowMentaleOnboarding(true)
      } else {
        setShowMentaleScreen(true)
      }
    }
  }

  if (showBewegungOnboarding) {
    return (
      <BewegungOnboarding
        onComplete={() => setShowBewegungOnboarding(false)}
        onBack={() => setShowBewegungOnboarding(false)}
      />
    )
  }

  if (showEssenOnboarding) {
    return (
      <EssenOnboarding
        onComplete={() => { setShowEssenOnboarding(false); setShowEssenScreen(true) }}
        onBack={() => setShowEssenOnboarding(false)}
      />
    )
  }

  if (showEssenScreen) {
    return <EssenScreen onBack={() => setShowEssenScreen(false)} />
  }

  if (showErholungOnboarding) {
    return (
      <ErholungOnboarding
        onComplete={() => { setShowErholungOnboarding(false); setShowErholungScreen(true) }}
        onBack={() => setShowErholungOnboarding(false)}
      />
    )
  }

  if (showErholungScreen) {
    return <ErholungScreen onBack={() => setShowErholungScreen(false)} />
  }

  if (showMentaleOnboarding) {
    return (
      <MentaleOnboarding
        onComplete={() => { setShowMentaleOnboarding(false); setShowMentaleScreen(true) }}
        onBack={() => setShowMentaleOnboarding(false)}
      />
    )
  }

  if (showMentaleScreen) {
    return <MentaleScreen onBack={() => setShowMentaleScreen(false)} />
  }

  return (
    <div
      className="min-h-svh flex flex-col pb-24"
      style={{ backgroundColor: '#F5EDE4', maxWidth: '390px', margin: '0 auto' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-14 pb-4">
        <span
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            color: '#23283A',
            fontSize: '24px',
            fontWeight: 400,
            lineHeight: 1,
          }}
        >
          <span style={{ verticalAlign: 'baseline' }}>pi</span>
          <span style={{ fontSize: '36px', fontWeight: 300, verticalAlign: 'baseline' }}>LL</span>
          <span style={{ verticalAlign: 'baseline' }}>o</span>
        </span>
        {/* Avatar */}
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-base"
          style={{ backgroundColor: '#CAAD82' }}
        >
          A
        </div>
      </div>

      {/* Quote Card */}
      <div className="mx-6 mb-6">
        <div
          className="rounded-2xl px-5 py-4"
          style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
        >
          {(() => {
            const quotes = [
              { text: "Nichts verschwindet, bevor es uns nicht das gelehrt hat, was wir wissen müssen.", author: "Pema Chödrön" },
              { text: "Freundlichkeit und Mitgefühl beginnen mit dem Verständnis, dass wir alle zu kämpfen haben.", author: "Charles F. Glassman" },
              { text: "Ich bin jemand, um den ich mich den Rest meines Lebens kümmern muss. Geduldig an manchen Tagen, ermutigend an anderen.", author: "Baek Sehee" },
              { text: "Einsamkeit entsteht nicht dadurch, dass man keine Menschen um sich hat, sondern dadurch, dass man ihnen die Dinge, die einem wichtig erscheinen, nicht mitteilen kann.", author: "Carl Gustav Jung" },
              { text: "Keiner unserer inneren Anteile ist schlecht. Alle Teile versuchen ihr Bestes, um sicher zu sein und Liebe zu finden.", author: "Loch Kelly" },
              { text: "Sich selbst zu vergeben macht die Welt besser. Du wirst kein besserer Mensch, wenn du denkst, du wärst schlecht.", author: "Matt Haig" },
              { text: "Wir warten oft auf Freundlichkeit, aber freundlich zu dir selbst zu sein, kann jetzt sofort beginnen.", author: "Charlie Mackesy" },
              { text: "Selbstfürsorge ist der Weg zur Rückgewinnung der eigenen Macht.", author: "Lalah Delia" },
              { text: "Wenn wir Misserfolg mit Minderwertigkeit assoziieren, wird es belastend, etwas Neues zu beginnen.", author: "Julie Smith" },
              { text: "Die Lösung für ein hektisches Leben ist nicht mehr Zeit, sondern langsamer zu werden.", author: "John Mark Comer" },
              { text: "Diese Mauern, die verhindern, dass deine Verletzlichkeit gesehen wird, verhindern auch, dass man dich kennenlernt.", author: "Kendra Adachi" },
              { text: "Die Person, nach der du Ausschau hältst, die dir sagt, dass es okay ist, sich auszuruhen, bist du selbst.", author: "Sarah Normandin" },
              { text: "Wenn du wartest, bis alles erledigt ist, um dich auszuruhen, wirst du dich nie ausruhen.", author: "KC Davis" },
              { text: "Ich bin von meiner Stärke erschöpft. Ich will Sanftheit und Leichtigkeit.", author: "Zandashé Brown" },
              { text: "Die pragmatischste Form der Selbstfürsorge ist die bewusste Abkehr von Perfektion.", author: "Ein guter Plan" },
              { text: "Sei geduldig mit dir. Deine negativen Glaubenssätze sind über Jahre entstanden.", author: "Holly Mosier" },
              { text: "Jeder Akt der Selbstfürsorge ist ein Manifest: dass ich auf meiner Seite stehe.", author: "Susan Weiss Berry" },
              { text: "Wofür auch immer du bestimmt bist, beginne jetzt damit. Die Umstände werden immer ungünstig sein.", author: "Doris Lessing" },
              { text: "Ich bin ein Ozean der Gefühle, aber ich habe mir das Schwimmen beigebracht.", author: "Louise Kaufmann" },
              { text: "Ich muss mein Leben so verändern, dass ich es leben kann und nicht nur darauf warte.", author: "Susan Sontag" },
              { text: "Glücklich zu sein ist nicht die Kunst. Die wirkliche Kunst ist zu wissen, was man tun kann, wenn man unglücklich ist.", author: "Jesper Juul" },
              { text: "Erlaube anderen zu sein, wie sie sind. Erlaube dir zu sein, wie du bist.", author: "Sue Fitzmaurice" },
              { text: "Selbstfürsorge ist keine Belohnung. Sie ist ein Teil des Prozesses.", author: "Robyn Conley Downs" },
              { text: "Selbstfürsorge ist nicht egoistisch, sondern ein verantwortungsvoller Umgang mit dem einzigen Gut, das ich habe.", author: "Parker Palmer" },
              { text: "Nicht alles ist eine Lebenslektion, die dich stärker macht. Manches ist einfach nur Mist.", author: "Nora McInerny" },
              { text: "Es fällt leicht, die schönen Dinge an uns zu lieben. Doch wahre Selbstliebe ist es, wenn wir unsere schwierigen Seiten annehmen.", author: "Rupi Kaur" },
              { text: "Stress und Umtriebigkeit bedeuten nicht automatisch Wichtigkeit.", author: "Lalah Delia" },
              { text: "Wenn wir über unsere Gefühle sprechen können, werden sie weniger überwältigend, weniger belastend und weniger furchterregend.", author: "Fred Rogers" },
              { text: "Du musst lernen, deine Zweifel zu ignorieren. Denn ohne Vertrauen in dich selbst wird nichts Gutes geschehen.", author: "Hilma af Klint" },
              { text: "Nur weil du einen Fehler gemacht hast, bist du keiner.", author: "Georgette Mosbacher" },
              { text: "Es gibt keine Notwendigkeit, dich zu hetzen oder zu glänzen. Es gibt keine Notwendigkeit, jemand anderes zu sein als du selbst.", author: "Virginia Woolf" },
            ];
            const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
            const todayQuote = quotes[dayOfYear % quotes.length];
            return (
              <>
                <p className="text-sm leading-relaxed italic" style={{ color: '#6B6B6B' }}>
                  „{todayQuote.text}"
                </p>
                <p className="text-xs mt-2 font-medium" style={{ color: '#CAAD82' }}>
                  — {todayQuote.author}
                </p>
              </>
            );
          })()}
        </div>
      </div>

      {/* Pillar Grid */}
      <div className="px-6">
        <div className="grid grid-cols-2 gap-4">
          {pillars.map(({ id, label, bg, iconCircle, textColor, icon }) => (
            <button
              key={id}
              onClick={() => handlePillarClick(id)}
              className="flex flex-col items-center justify-center py-7 px-4 active:scale-95 transition-transform"
              style={{
                backgroundColor: bg,
                borderRadius: '20px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <div style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                backgroundColor: iconCircle,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {icon}
              </div>
              <p
                className="text-sm font-semibold mt-3 text-center leading-tight"
                style={{ color: textColor }}
              >
                {label}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full flex items-end justify-around px-4 pt-3 pb-6"
        style={{ maxWidth: '390px', backgroundColor: '#F5EDE4', borderTop: '1px solid rgba(202, 173, 130, 0.25)' }}

      >
        {navItems.map(({ label, Icon, active }) => (
          <button
            key={label}
            className="flex flex-col items-center gap-1"
            style={{ color: active ? '#23283A' : '#B0A090' }}
          >
            <Icon />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
