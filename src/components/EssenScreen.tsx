import { useState, useEffect } from 'react'
import EinkaufslisteScreen from './EinkaufslisteScreen'
import { addIngredientsToShoppingList } from './shoppingListUtils'
import { supabase } from '../lib/supabase'

const GREEN = '#3C6538'
const GREEN_LIGHT = '#D8E8D7'
const CATEGORIES = ['Alle', 'Favoriten', 'Frühstück', 'Hauptgericht', 'Kleine Gerichte & Beilagen', 'Snacks', 'Fermentation', 'Süßes']

interface Recipe {
  id: string
  name: string
  category: string
  time: number
  emoji: string
  bg: string
  macros: { gemuse: number; carbs: number; protein: number }
  ingredients: string[]
  steps: string[]
  tip?: string
  isCustom?: boolean
}

// Supabase row shape (DB column names)
interface DbRow {
  id: string
  name: string
  category: string
  cook_time: number
  emoji: string
  ingredients: string       // newline-separated text
  instructions: string      // newline-separated text
  tip?: string | null
  vegetable_percent: number
  carbs_percent: number
  protein_percent: number
  is_custom?: boolean | null
  created_by?: string | null
}

function getBgForCategory(category: string): string {
  const map: Record<string, string> = {
    'Frühstück':                   'linear-gradient(135deg, #F5C842 0%, #E8A020 100%)',
    'Hauptgericht':                'linear-gradient(135deg, #56A14E 0%, #2D7A26 100%)',
    'Kleine Gerichte & Beilagen':  'linear-gradient(135deg, #42A5C8 0%, #1A7A9E 100%)',
    'Snacks':                      'linear-gradient(135deg, #F5A742 0%, #E07820 100%)',
    'Fermentation':                'linear-gradient(135deg, #8E6BBF 0%, #5E3D8F 100%)',
    'Süßes':                       'linear-gradient(135deg, #F472B6 0%, #DB2777 100%)',
  }
  return map[category] ?? 'linear-gradient(135deg, #CAAD82 0%, #A08060 100%)'
}

function dbToRecipe(row: DbRow): Recipe {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    time: row.cook_time,
    emoji: row.emoji ?? '🍽️',
    bg: getBgForCategory(row.category),
    macros: {
      gemuse: row.vegetable_percent ?? 34,
      carbs:  row.carbs_percent ?? 33,
      protein: row.protein_percent ?? 33,
    },
    ingredients: row.ingredients ? row.ingredients.split('\n').filter(Boolean) : [],
    steps:       row.instructions ? row.instructions.split('\n').filter(Boolean) : [],
    tip:         row.tip ?? undefined,
    isCustom:    row.is_custom ?? false,
  }
}

function recipeToDb(r: Recipe): Omit<DbRow, 'created_by'> {
  return {
    id:                r.id,
    name:              r.name,
    category:          r.category,
    cook_time:         r.time,
    emoji:             r.emoji,
    ingredients:       r.ingredients.join('\n'),
    instructions:      r.steps.join('\n'),
    tip:               r.tip ?? null,
    vegetable_percent: r.macros.gemuse,
    carbs_percent:     r.macros.carbs,
    protein_percent:   r.macros.protein,
    is_custom:         r.isCustom ?? false,
  }
}

const SAMPLE_DEFAULTS: Recipe[] = [
  {
    id: 'r1',
    name: 'Beeren-Hafer-Bowl',
    category: 'Frühstück',
    time: 10,
    emoji: '🥣',
    bg: 'linear-gradient(135deg, #F5C842 0%, #E8A020 100%)',
    macros: { gemuse: 50, carbs: 25, protein: 25 },
    ingredients: [
      '80g Haferflocken',
      '200ml Hafermilch',
      '100g gemischte Beeren (frisch oder TK)',
      '1 EL Chiasamen',
      '1 EL Mandelmus',
      '1 TL Honig',
      'Prise Zimt',
    ],
    steps: [
      'Haferflocken mit Hafermilch in eine Schüssel geben und 5 Minuten quellen lassen.',
      'Beeren waschen und ggf. auftauen lassen.',
      'Porridge mit Chiasamen und Zimt verrühren.',
      'Mit Beeren, Mandelmus und Honig toppen.',
      'Sofort servieren oder über Nacht im Kühlschrank ziehen lassen.',
    ],
  },
  {
    id: 'r2',
    name: 'Griechischer Quinoa-Salat',
    category: 'Hauptgericht',
    time: 20,
    emoji: '🥗',
    bg: 'linear-gradient(135deg, #56A14E 0%, #2D7A26 100%)',
    macros: { gemuse: 50, carbs: 25, protein: 25 },
    ingredients: [
      '200g Quinoa (ungekocht)',
      '200g Kirschtomaten',
      '1 Salatgurke',
      '100g Feta',
      '50g schwarze Oliven',
      '1 rote Zwiebel',
      'Frische Petersilie',
      '3 EL Olivenöl',
      '2 EL Zitronensaft',
      'Salz & Pfeffer',
    ],
    steps: [
      'Quinoa nach Packungsanleitung kochen und abkühlen lassen.',
      'Tomaten halbieren, Gurke würfeln, Zwiebel in Ringe schneiden.',
      'Feta zerbröckeln, Petersilie grob hacken.',
      'Alles mit dem abgekühlten Quinoa vermengen.',
      'Dressing aus Olivenöl, Zitronensaft, Salz und Pfeffer anrühren und unterheben.',
      '10 Minuten ziehen lassen und servieren.',
    ],
  },
  {
    id: 'r3',
    name: 'Lachs mit Ofengemüse',
    category: 'Hauptgericht',
    time: 30,
    emoji: '🐟',
    bg: 'linear-gradient(135deg, #F5A742 0%, #E07820 100%)',
    macros: { gemuse: 50, carbs: 25, protein: 25 },
    ingredients: [
      '2 Lachsfilets (à ca. 150g)',
      '1 Zucchini',
      '1 rote Paprika',
      '1 rote Zwiebel',
      '200g Kirschtomaten',
      '2 EL Olivenöl',
      '1 Zitrone',
      'Rosmarin & Thymian',
      'Salz & Pfeffer',
    ],
    steps: [
      'Ofen auf 200 °C Umluft vorheizen.',
      'Gemüse grob würfeln, auf einem Backblech verteilen.',
      'Mit Olivenöl, Kräutern, Salz und Pfeffer würzen.',
      '15 Minuten im Ofen vorrösten.',
      'Lachsfilets mit Zitronensaft beträufeln, aufs Gemüse legen.',
      'Weitere 12–15 Minuten backen bis der Lachs gar ist.',
      'Mit Zitronenscheiben servieren.',
    ],
  },
]

const STORAGE_KEY = 'essen-all-recipes'

function persistRecipesLocally(recipes: Recipe[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes))
}

const RAINBOW = [
  { color: '#E53935', label: 'Rot' },
  { color: '#FB8C00', label: 'Orange' },
  { color: '#FDD835', label: 'Gelb' },
  { color: '#43A047', label: 'Grün' },
  { color: '#1E88E5', label: 'Blau' },
  { color: '#8E24AA', label: 'Lila' },
]

type View = 'list' | 'detail' | 'add' | 'edit' | 'shopping'

interface Props {
  onBack: () => void
}

export default function EssenScreen({ onBack }: Props) {
  const [view, setView] = useState<View>('list')
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('Alle')
  const [saved, setSaved] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem('essen-saved-recipes') ?? '[]')) }
    catch { return new Set() }
  })
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [cartToast, setCartToast] = useState(false)

  // Form state (shared between add and edit)
  const [fName, setFName] = useState('')
  const [fTime, setFTime] = useState('')
  const [fCategory, setFCategory] = useState('Frühstück')
  const [fIngredients, setFIngredients] = useState('')
  const [fSteps, setFSteps] = useState('')
  const [fGemuse, setFGemuse] = useState('')
  const [fCarbs, setFCarbs] = useState('')
  const [fProtein, setFProtein] = useState('')
  const [fTip, setFTip] = useState('')

  // Load recipes from Supabase on mount
  useEffect(() => {
    async function loadFromSupabase() {
      setLoading(true)
      try {
        const { data, error } = await supabase.from('recipes').select('*')
        if (error) throw error

        if (!data || data.length === 0) {
          // Table is empty — seed with defaults
          const { data: inserted, error: insertError } = await supabase
            .from('recipes')
            .insert(SAMPLE_DEFAULTS.map(recipeToDb))
            .select()
          if (insertError) throw insertError
          const seeded = inserted ? (inserted as DbRow[]).map(dbToRecipe) : SAMPLE_DEFAULTS
          setAllRecipes(seeded)
          persistRecipesLocally(seeded)
        } else {
          const recipes = (data as DbRow[]).map(dbToRecipe)
          setAllRecipes(recipes)
          persistRecipesLocally(recipes)
        }
      } catch {
        // Offline fallback: load from localStorage
        try {
          const stored = localStorage.getItem(STORAGE_KEY)
          if (stored) {
            setAllRecipes(JSON.parse(stored))
          } else {
            setAllRecipes([...SAMPLE_DEFAULTS])
          }
        } catch {
          setAllRecipes([...SAMPLE_DEFAULTS])
        }
      } finally {
        setLoading(false)
      }
    }
    loadFromSupabase()
  }, [])

  const filtered = allRecipes.filter(r => {
    const matchCat = filter === 'Alle' || (filter === 'Favoriten' ? saved.has(r.id) : r.category === filter)
    const q = search.toLowerCase()
    const matchQ = !q || r.name.toLowerCase().includes(q) || r.ingredients.some(i => i.toLowerCase().includes(q))
    return matchCat && matchQ
  })

  function toggleSaved(id: string, e: React.MouseEvent) {
    e.stopPropagation()
    setSaved(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      localStorage.setItem('essen-saved-recipes', JSON.stringify([...next]))
      return next
    })
  }

  function openEdit(r: Recipe, e: React.MouseEvent) {
    e.stopPropagation()
    setEditingId(r.id)
    setFName(r.name)
    setFTime(String(r.time))
    setFCategory(r.category)
    setFIngredients(r.ingredients.join('\n'))
    setFSteps(r.steps.join('\n'))
    setFGemuse(String(r.macros.gemuse))
    setFCarbs(String(r.macros.carbs))
    setFProtein(String(r.macros.protein))
    setFTip(r.tip ?? '')
    setDeleteConfirm(false)
    setView('edit')
  }

  async function saveRecipe() {
    const r: Recipe = {
      id: `custom-${Date.now()}`,
      name: fName || 'Unbenanntes Rezept',
      category: fCategory,
      time: Math.max(1, parseInt(fTime) || 20),
      emoji: '🍽️',
      bg: 'linear-gradient(135deg, #CAAD82 0%, #A08060 100%)',
      macros: {
        gemuse: Math.min(100, Math.max(0, parseInt(fGemuse) || 34)),
        carbs:  Math.min(100, Math.max(0, parseInt(fCarbs)  || 33)),
        protein: Math.min(100, Math.max(0, parseInt(fProtein) || 33)),
      },
      ingredients: fIngredients.split('\n').map(s => s.trim()).filter(Boolean),
      steps: fSteps.split('\n').map(s => s.trim()).filter(Boolean),
      tip: fTip.trim() || undefined,
      isCustom: true,
    }

    // Save to Supabase
    try {
      await supabase.from('recipes').insert([recipeToDb(r)])
    } catch {
      // Continue even if Supabase fails — local save below
    }

    const updated = [...allRecipes, r]
    setAllRecipes(updated)
    persistRecipesLocally(updated)
    resetForm()
    setView('list')
  }

  async function updateRecipe() {
    const updated = allRecipes.map(r => {
      if (r.id !== editingId) return r
      return {
        ...r,
        name: fName || 'Unbenanntes Rezept',
        category: fCategory,
        time: Math.max(1, parseInt(fTime) || 20),
        macros: {
          gemuse: Math.min(100, Math.max(0, parseInt(fGemuse) || 34)),
          carbs:  Math.min(100, Math.max(0, parseInt(fCarbs)  || 33)),
          protein: Math.min(100, Math.max(0, parseInt(fProtein) || 33)),
        },
        ingredients: fIngredients.split('\n').map(s => s.trim()).filter(Boolean),
        steps: fSteps.split('\n').map(s => s.trim()).filter(Boolean),
        tip: fTip.trim() || undefined,
      }
    })
    const updatedRecipe = updated.find(r => r.id === editingId)

    // Update in Supabase
    if (updatedRecipe) {
      try {
        await supabase.from('recipes').update(recipeToDb(updatedRecipe)).eq('id', editingId)
      } catch {
        // Continue even if Supabase fails
      }
    }

    setAllRecipes(updated)
    persistRecipesLocally(updated)
    resetForm()
    setView('list')
  }

  async function deleteRecipe() {
    // Delete from Supabase
    try {
      await supabase.from('recipes').delete().eq('id', editingId)
    } catch {
      // Continue even if Supabase fails
    }

    const updated = allRecipes.filter(r => r.id !== editingId)
    setAllRecipes(updated)
    persistRecipesLocally(updated)
    resetForm()
    setDeleteConfirm(false)
    setView('list')
  }

  function addToCart() {
    if (!selectedRecipe) return
    addIngredientsToShoppingList(selectedRecipe.ingredients)
    setCartToast(true)
    setTimeout(() => setCartToast(false), 2200)
  }

  function resetForm() {
    setFName(''); setFTime(''); setFCategory('Frühstück'); setFIngredients(''); setFSteps('')
    setFGemuse(''); setFCarbs(''); setFProtein(''); setFTip('')
    setEditingId(null)
  }

  const screen: React.CSSProperties = {
    minHeight: '100svh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#F5EDE4',
    maxWidth: 390,
    margin: '0 auto',
    position: 'relative',
  }

  // ── SHOPPING LIST ────────────────────────────────────────────────────────────
  if (view === 'shopping') {
    return <EinkaufslisteScreen onBack={() => setView('list')} />
  }

  // ── DETAIL ──────────────────────────────────────────────────────────────────
  if (view === 'detail' && selectedRecipe) {
    const r = selectedRecipe
    return (
      <div style={{ ...screen, overflowY: 'auto', paddingBottom: 48 }}>
        {/* Toast */}
        {cartToast && (
          <div style={{ position: 'fixed', top: 56, left: '50%', transform: 'translateX(-50%)', backgroundColor: '#3C6538', color: '#FFFFFF', fontSize: 14, fontWeight: 600, padding: '10px 22px', borderRadius: 20, zIndex: 200, whiteSpace: 'nowrap', boxShadow: '0 4px 16px rgba(60,101,56,0.35)' }}>
            Zutaten hinzugefügt ✓
          </div>
        )}
        {/* Hero */}
        <div style={{ background: r.bg, height: 220, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: 80 }}>{r.emoji}</span>
          <button
            onClick={() => setView('list')}
            style={{ position: 'absolute', top: 52, left: 20, width: 36, height: 36, borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.25)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <i className="fa-solid fa-arrow-left" style={{ color: '#FFF', fontSize: 16 }} />
          </button>
          <button
            onClick={(e) => toggleSaved(r.id, e)}
            style={{ position: 'absolute', top: 52, right: 20, width: 36, height: 36, borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.25)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <i className={saved.has(r.id) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'} style={{ color: saved.has(r.id) ? '#FF6B6B' : '#FFF', fontSize: 16 }} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px 24px 0' }}>
          {r.isCustom && (
            <span style={{ fontSize: 11, fontWeight: 700, color: GREEN, backgroundColor: GREEN_LIGHT, padding: '3px 10px', borderRadius: 10, marginBottom: 8, display: 'inline-block' }}>
              Eigenes Rezept
            </span>
          )}
          <h1 style={{ color: '#23283A', fontFamily: 'Georgia, serif', fontSize: 26, fontWeight: 500, lineHeight: 1.25, marginBottom: 10, marginTop: r.isCustom ? 8 : 0 }}>
            {r.name}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#9E9E9E', fontSize: 13 }}>
              <i className="fa-regular fa-clock" style={{ fontSize: 13 }} /> {r.time} Min
            </span>
            <span style={{ fontSize: 12, fontWeight: 600, color: GREEN, backgroundColor: GREEN_LIGHT, padding: '3px 10px', borderRadius: 10 }}>
              {r.category}
            </span>
          </div>

          {/* Macro cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
            {[
              { label: 'Gemüse', value: r.macros.gemuse, bg: '#E8F5E9', color: '#2E7D32' },
              { label: 'Carbs', value: r.macros.carbs, bg: '#FFF8E1', color: '#F57F17' },
              { label: 'Protein', value: r.macros.protein, bg: '#FCE4EC', color: '#C62828' },
            ].map(m => (
              <div key={m.label} style={{ backgroundColor: m.bg, borderRadius: 14, padding: '12px 8px', textAlign: 'center' }}>
                <p style={{ color: m.color, fontSize: 20, fontWeight: 700, marginBottom: 2 }}>{m.value}%</p>
                <p style={{ color: m.color, fontSize: 11, fontWeight: 600, opacity: 0.8 }}>{m.label}</p>
              </div>
            ))}
          </div>

          {/* Custom tip */}
          {r.tip && (
            <div style={{ backgroundColor: '#FFF3D0', borderRadius: 14, padding: '12px 14px', marginBottom: 28, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <i className="fa-solid fa-lightbulb" style={{ color: '#7F4E00', fontSize: 15, marginTop: 2, flexShrink: 0 }} />
              <p style={{ color: '#7F4E00', fontSize: 13, lineHeight: 1.5, margin: 0 }}>{r.tip}</p>
            </div>
          )}

          {/* Ingredients */}
          <h2 style={{ color: '#23283A', fontSize: 17, fontWeight: 700, marginBottom: 12 }}>Zutaten</h2>
          <div style={{ marginBottom: 28 }}>
            {r.ingredients.map((ing, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: GREEN, marginTop: 5, flexShrink: 0 }} />
                <span style={{ color: '#23283A', fontSize: 14, lineHeight: 1.5 }}>{ing}</span>
              </div>
            ))}
          </div>

          {/* Add to shopping list */}
          <button
            onClick={addToCart}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, width: '100%', padding: '14px', borderRadius: 16, backgroundColor: '#3C6538', border: 'none', cursor: 'pointer', marginBottom: 28 }}
          >
            <i className="fa-solid fa-cart-shopping" style={{ color: '#FFFFFF', fontSize: 15 }} />
            <span style={{ color: '#FFFFFF', fontSize: 15, fontWeight: 700 }}>Zutaten zur Einkaufsliste hinzufügen</span>
          </button>

          {/* Steps */}
          <h2 style={{ color: '#23283A', fontSize: 17, fontWeight: 700, marginBottom: 12 }}>Zubereitung</h2>
          <div style={{ marginBottom: 32 }}>
            {r.steps.map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', backgroundColor: GREEN, color: '#FFF', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                  {i + 1}
                </div>
                <span style={{ color: '#23283A', fontSize: 14, lineHeight: 1.55 }}>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── ADD / EDIT RECIPE ────────────────────────────────────────────────────────
  if (view === 'add' || view === 'edit') {
    const isEdit = view === 'edit'
    const canSave = fName.trim().length > 0
    return (
      <div style={{ ...screen, overflowY: 'auto', paddingBottom: 240 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '56px 24px 20px' }}>
          <button
            onClick={() => { resetForm(); setView('list') }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 4px 4px 0', lineHeight: 1, flexShrink: 0 }}
          >
            <i className="fa-solid fa-arrow-left" style={{ color: '#23283A', fontSize: 18 }} />
          </button>
          <h1 style={{ color: '#23283A', fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 500, margin: 0 }}>
            {isEdit ? 'Rezept bearbeiten' : 'Eigenes Rezept'}
          </h1>
        </div>

        <div style={{ padding: '0 24px' }}>
          {/* Name */}
          <label style={labelStyle}>Rezeptname</label>
          <input
            value={fName}
            onChange={e => setFName(e.target.value)}
            placeholder="z.B. Mama's Linsensuppe"
            style={inputStyle}
          />

          {/* Time */}
          <label style={labelStyle}>Kochzeit (Minuten)</label>
          <input
            type="number"
            min="1"
            value={fTime}
            onChange={e => setFTime(e.target.value)}
            placeholder="z.B. 20"
            style={inputStyle}
          />

          {/* Category */}
          <label style={labelStyle}>Kategorie</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
            {CATEGORIES.filter(c => c !== 'Alle').map(cat => (
              <button
                key={cat}
                onClick={() => setFCategory(cat)}
                style={{
                  padding: '7px 14px',
                  borderRadius: 20,
                  border: `1.5px solid ${fCategory === cat ? GREEN : '#CAAD82'}`,
                  backgroundColor: fCategory === cat ? GREEN : '#FFFFFF',
                  color: fCategory === cat ? '#FFFFFF' : '#7F613D',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Photo placeholder */}
          <label style={labelStyle}>Foto hinzufügen</label>
          <div
            style={{
              border: '2px dashed #CAAD82',
              borderRadius: 16,
              height: 120,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              marginBottom: 20,
              cursor: 'pointer',
              backgroundColor: '#FDFAF6',
            }}
          >
            <i className="fa-solid fa-camera" style={{ color: '#CAAD82', fontSize: 28 }} />
            <span style={{ color: '#CAAD82', fontSize: 13 }}>Tippe um ein Foto hinzuzufügen</span>
          </div>

          {/* Ingredients */}
          <label style={labelStyle}>Zutaten</label>
          <textarea
            value={fIngredients}
            onChange={e => setFIngredients(e.target.value)}
            placeholder={'Eine Zutat pro Zeile...\nz.B. 200g Quinoa\n1 Avocado'}
            rows={5}
            style={{ ...inputStyle, resize: 'none', fontFamily: 'inherit', lineHeight: 1.6 }}
          />

          {/* Steps */}
          <label style={labelStyle}>Zubereitung</label>
          <textarea
            value={fSteps}
            onChange={e => setFSteps(e.target.value)}
            placeholder={'Kurze Schritte...\nz.B. Quinoa kochen\nGemüse würfeln und anbraten'}
            rows={5}
            style={{ ...inputStyle, resize: 'none', fontFamily: 'inherit', lineHeight: 1.6 }}
          />

          {/* Macros */}
          <label style={labelStyle}>Makros (in %)</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 8 }}>
            {[
              { label: 'Gemüse %', value: fGemuse, set: setFGemuse, color: '#2E7D32', bg: '#E8F5E9', placeholder: '50' },
              { label: 'Carbs %',  value: fCarbs,  set: setFCarbs,  color: '#F57F17', bg: '#FFF8E1', placeholder: '25' },
              { label: 'Protein %',value: fProtein,set: setFProtein,color: '#C62828', bg: '#FCE4EC', placeholder: '25' },
            ].map(m => (
              <div key={m.label}>
                <p style={{ color: m.color, fontSize: 12, fontWeight: 600, marginBottom: 6, textAlign: 'center' }}>{m.label}</p>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={m.value}
                  onChange={e => m.set(e.target.value)}
                  placeholder={m.placeholder}
                  style={{
                    width: '100%',
                    padding: '10px 8px',
                    borderRadius: 12,
                    border: `1.5px solid ${m.color}40`,
                    backgroundColor: m.bg,
                    color: m.color,
                    fontSize: 16,
                    fontWeight: 700,
                    textAlign: 'center',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            ))}
          </div>
          {(() => {
            const sum = (parseInt(fGemuse) || 0) + (parseInt(fCarbs) || 0) + (parseInt(fProtein) || 0)
            const allFilled = fGemuse !== '' || fCarbs !== '' || fProtein !== ''
            if (!allFilled) return <div style={{ marginBottom: 20 }} />
            const ok = sum === 100
            return (
              <p style={{ fontSize: 12, fontWeight: 600, color: ok ? '#2E7D32' : '#E65100', marginBottom: 20, textAlign: 'center' }}>
                {ok ? `✓ Summe: 100% – perfekt!` : `Summe: ${sum}% (sollte 100% ergeben)`}
              </p>
            )
          })()}

          {/* Custom tip */}
          <label style={labelStyle}>Tipp zur Aufwertung <span style={{ fontWeight: 400, color: '#9E9E9E' }}>(optional)</span></label>
          <textarea
            value={fTip}
            onChange={e => setFTip(e.target.value)}
            placeholder="z.B. Füge einen grünen Salat dazu um den Gemüseanteil zu erhöhen..."
            rows={3}
            style={{ ...inputStyle, resize: 'none', fontFamily: 'inherit', lineHeight: 1.6, height: 80 }}
          />
        </div>

        {/* Footer */}
        <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 390, padding: '16px 24px 32px', backgroundColor: '#F5EDE4', borderTop: '1px solid rgba(60,101,56,0.12)' }}>
          <button
            onClick={isEdit ? updateRecipe : saveRecipe}
            disabled={!canSave}
            style={{ width: '100%', padding: '15px', borderRadius: 20, border: 'none', backgroundColor: GREEN, color: '#FFF', fontSize: 15, fontWeight: 700, cursor: canSave ? 'pointer' : 'not-allowed', opacity: canSave ? 1 : 0.35, transition: 'opacity 0.2s' }}
          >
            {isEdit ? 'Änderungen speichern' : 'Rezept speichern'}
          </button>

          {isEdit && !deleteConfirm && (
            <button
              onClick={() => setDeleteConfirm(true)}
              style={{ width: '100%', marginTop: 10, padding: '15px', borderRadius: 20, border: 'none', backgroundColor: 'transparent', color: '#C62828', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              <i className="fa-solid fa-trash" style={{ fontSize: 14 }} />
              Rezept löschen
            </button>
          )}

          {isEdit && deleteConfirm && (
            <div style={{ marginTop: 12, backgroundColor: '#FFF0F0', borderRadius: 16, padding: '14px 16px' }}>
              <p style={{ color: '#C62828', fontSize: 14, fontWeight: 600, textAlign: 'center', marginBottom: 12 }}>
                Rezept wirklich löschen?
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => setDeleteConfirm(false)}
                  style={{ flex: 1, padding: '12px', borderRadius: 14, border: '1.5px solid #CAAD82', backgroundColor: '#FFFFFF', color: '#7F613D', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
                >
                  Abbrechen
                </button>
                <button
                  onClick={deleteRecipe}
                  style={{ flex: 1, padding: '12px', borderRadius: 14, border: 'none', backgroundColor: '#C62828', color: '#FFFFFF', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
                >
                  Ja, löschen
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── LIST ────────────────────────────────────────────────────────────────────
  return (
    <div style={{ ...screen, overflowY: 'auto', paddingBottom: 96 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '56px 24px 16px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 4px 4px 0', lineHeight: 1, flexShrink: 0 }}>
          <i className="fa-solid fa-arrow-left" style={{ color: '#23283A', fontSize: 18 }} />
        </button>
        <h1 style={{ color: '#23283A', fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 500, margin: 0 }}>Essen</h1>
      </div>

      {/* Search */}
      <div style={{ padding: '0 24px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, backgroundColor: '#FFFFFF', border: '1.5px solid #D4B896', borderRadius: 16, padding: '10px 14px' }}>
          <i className="fa-solid fa-magnifying-glass" style={{ color: '#CAAD82', fontSize: 15, flexShrink: 0 }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rezepte, Zutaten, Lebensmittelgruppen..."
            style={{ flex: 1, border: 'none', outline: 'none', backgroundColor: 'transparent', color: '#23283A', fontSize: 14 }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 1 }}>
              <i className="fa-solid fa-xmark" style={{ color: '#CAAD82', fontSize: 14 }} />
            </button>
          )}
        </div>
      </div>

      {/* Filter pills */}
      <div style={{ paddingBottom: 16, overflowX: 'auto', scrollbarWidth: 'none' }}>
        <div style={{ display: 'flex', gap: 8, padding: '0 24px', width: 'max-content' }}>
          {CATEGORIES.map(cat => {
            const active = filter === cat
            return (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                style={{
                  padding: '7px 16px',
                  borderRadius: 20,
                  border: `1.5px solid ${active ? GREEN : '#CAAD82'}`,
                  backgroundColor: active ? GREEN : '#FFFFFF',
                  color: active ? '#FFFFFF' : '#7F613D',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s',
                }}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </div>

      {/* Rainbow banner */}
      <div style={{ margin: '0 24px 20px', backgroundColor: '#FFFFFF', borderRadius: 18, padding: '14px 16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', height: 36, flex: 1 }}>
          {RAINBOW.map(seg => (
            <div key={seg.color} style={{ flex: 1, backgroundColor: seg.color }} />
          ))}
        </div>
        <div style={{ flexShrink: 0 }}>
          <p style={{ color: '#23283A', fontSize: 13, fontWeight: 700, marginBottom: 2 }}>Eat the Rainbow</p>
          <p style={{ color: '#9E9E9E', fontSize: 11 }}>50% Gemüse · 25% Carbs · 25% Protein</p>
        </div>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', gap: 16 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            border: `3px solid ${GREEN_LIGHT}`,
            borderTopColor: GREEN,
            animation: 'spin 0.8s linear infinite',
          }} />
          <p style={{ color: '#9E9E9E', fontSize: 14 }}>Rezepte werden geladen…</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Recipe cards */}
      {!loading && (
        <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#9E9E9E', fontSize: 14 }}>
              Keine Rezepte gefunden
            </div>
          )}
          {filtered.map(r => (
            <button
              key={r.id}
              onClick={() => { setSelectedRecipe(r); setView('detail') }}
              style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
            >
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
                {/* Image area */}
                <div style={{ background: r.bg, height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <span style={{ fontSize: 64 }}>{r.emoji}</span>
                  {/* Edit + Heart */}
                  <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 8 }}>
                    <button
                      onClick={(e) => openEdit(r, e)}
                      style={{ width: 34, height: 34, borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.22)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <i className="fa-solid fa-pen" style={{ color: '#FFF', fontSize: 13 }} />
                    </button>
                    <button
                      onClick={(e) => toggleSaved(r.id, e)}
                      style={{ width: 34, height: 34, borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.22)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <i className={saved.has(r.id) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'} style={{ color: saved.has(r.id) ? '#FF6B6B' : '#FFF', fontSize: 14 }} />
                    </button>
                  </div>
                  {r.isCustom && (
                    <span style={{ position: 'absolute', top: 12, left: 12, fontSize: 11, fontWeight: 700, color: GREEN, backgroundColor: 'rgba(255,255,255,0.9)', padding: '3px 9px', borderRadius: 10 }}>
                      Eigenes Rezept
                    </span>
                  )}
                </div>
                {/* Content */}
                <div style={{ padding: '14px 16px 16px' }}>
                  <p style={{ color: '#23283A', fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{r.name}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#9E9E9E', fontSize: 12 }}>
                      <i className="fa-regular fa-clock" style={{ fontSize: 12 }} /> {r.time} Min
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: GREEN, backgroundColor: GREEN_LIGHT, padding: '3px 9px', borderRadius: 10 }}>
                      {r.category}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#2E7D32', backgroundColor: '#E8F5E9', padding: '4px 9px', borderRadius: 10 }}>
                      {r.macros.gemuse}% Gemüse
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#F57F17', backgroundColor: '#FFF8E1', padding: '4px 9px', borderRadius: 10 }}>
                      {r.macros.carbs}% Carbs
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#C62828', backgroundColor: '#FCE4EC', padding: '4px 9px', borderRadius: 10 }}>
                      {r.macros.protein}% Protein
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* FAB — Cart */}
      <button
        onClick={() => setView('shopping')}
        style={{
          position: 'fixed',
          bottom: 28,
          right: 'max(92px, calc(50% - 195px + 92px))',
          width: 56,
          height: 56,
          borderRadius: '50%',
          backgroundColor: GREEN,
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(60,101,56,0.4)',
        }}
      >
        <i className="fa-solid fa-cart-shopping" style={{ color: '#FFFFFF', fontSize: 20 }} />
      </button>

      {/* FAB — Add Recipe */}
      <button
        onClick={() => setView('add')}
        style={{
          position: 'fixed',
          bottom: 28,
          right: 'max(28px, calc(50% - 195px + 28px))',
          width: 56,
          height: 56,
          borderRadius: '50%',
          backgroundColor: GREEN,
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(60,101,56,0.4)',
        }}
      >
        <i className="fa-solid fa-plus" style={{ color: '#FFFFFF', fontSize: 22 }} />
      </button>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  color: '#6B5B4E',
  fontSize: 13,
  fontWeight: 600,
  marginBottom: 8,
  letterSpacing: 0.2,
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: 14,
  border: '1.5px solid #D4B896',
  backgroundColor: '#FFFFFF',
  color: '#23283A',
  fontSize: 14,
  outline: 'none',
  marginBottom: 20,
  boxSizing: 'border-box',
}
