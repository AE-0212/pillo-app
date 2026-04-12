import { useState } from 'react'
import type { ShoppingItem } from './shoppingListUtils'
import {
  CATEGORIES_ORDER,
  categorize,
  loadShoppingList,
  saveShoppingList,
} from './shoppingListUtils'

const GREEN = '#3C6538'

interface Props {
  onBack: () => void
}

export default function EinkaufslisteScreen({ onBack }: Props) {
  const [items, setItems] = useState<ShoppingItem[]>(loadShoppingList)
  const [input, setInput] = useState('')

  function persist(updated: ShoppingItem[]) {
    setItems(updated)
    saveShoppingList(updated)
  }

  function toggleItem(id: string) {
    persist(items.map(i => (i.id === id ? { ...i, checked: !i.checked } : i)))
  }

  function deleteItem(id: string) {
    persist(items.filter(i => i.id !== id))
  }

  function addItem() {
    const name = input.trim()
    if (!name) return
    const newItem: ShoppingItem = {
      id: `item-${Date.now()}`,
      name,
      checked: false,
      category: categorize(name),
    }
    persist([...items, newItem])
    setInput('')
  }

  function checkAll() {
    persist(items.map(i => ({ ...i, checked: true })))
  }

  function clearAll() {
    persist([])
  }

  const unchecked = items.filter(i => !i.checked)
  const checked = items.filter(i => i.checked)

  // Group unchecked by category
  const grouped: Partial<Record<string, ShoppingItem[]>> = {}
  for (const cat of CATEGORIES_ORDER) {
    const catItems = unchecked.filter(i => i.category === cat)
    if (catItems.length > 0) grouped[cat] = catItems
  }

  return (
    <div style={{ minHeight: '100svh', display: 'flex', flexDirection: 'column', backgroundColor: '#F5EDE4', maxWidth: 390, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '56px 24px 20px', gap: 12 }}>
        <button
          onClick={onBack}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 4px 4px 0', lineHeight: 1, flexShrink: 0 }}
        >
          <i className="fa-solid fa-arrow-left" style={{ color: '#23283A', fontSize: 18 }} />
        </button>
        <h1 style={{ color: '#23283A', fontFamily: 'Georgia, serif', fontSize: 26, fontWeight: 500, margin: 0, flex: 1 }}>
          Einkaufsliste
        </h1>
        {items.length > 0 && (
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={checkAll}
              style={{ fontSize: 12, fontWeight: 600, color: GREEN, background: 'none', border: `1.5px solid ${GREEN}`, borderRadius: 10, padding: '5px 10px', cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              Alle abhaken
            </button>
            <button
              onClick={clearAll}
              style={{ fontSize: 12, fontWeight: 600, color: '#C62828', background: 'none', border: '1.5px solid #C62828', borderRadius: 10, padding: '5px 10px', cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              Leeren
            </button>
          </div>
        )}
      </div>

      {/* List */}
      <div style={{ flex: 1, padding: '0 24px', overflowY: 'auto', paddingBottom: 110 }}>
        {items.length === 0 && (
          <div style={{ textAlign: 'center', paddingTop: 64 }}>
            <i className="fa-solid fa-cart-shopping" style={{ fontSize: 42, color: '#D4B896', display: 'block', marginBottom: 16 }} />
            <p style={{ color: '#9E9E9E', fontSize: 15, fontWeight: 500 }}>Noch keine Einträge</p>
            <p style={{ color: '#C9B9A7', fontSize: 13, marginTop: 6, lineHeight: 1.5 }}>
              Füge Zutaten aus einem Rezept hinzu<br />oder trage sie unten manuell ein.
            </p>
          </div>
        )}

        {/* Unchecked, grouped by category */}
        {CATEGORIES_ORDER.map(cat => {
          const catItems = grouped[cat]
          if (!catItems) return null
          return (
            <div key={cat}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#9E9E9E', letterSpacing: 0.9, textTransform: 'uppercase', marginTop: 22, marginBottom: 6 }}>
                {cat}
              </p>
              {catItems.map(item => (
                <ItemRow key={item.id} item={item} onToggle={toggleItem} onDelete={deleteItem} />
              ))}
            </div>
          )
        })}

        {/* Checked items at bottom */}
        {checked.length > 0 && (
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#C9B9A7', letterSpacing: 0.9, textTransform: 'uppercase', marginTop: 22, marginBottom: 6 }}>
              Erledigt ({checked.length})
            </p>
            {checked.map(item => (
              <ItemRow key={item.id} item={item} onToggle={toggleItem} onDelete={deleteItem} />
            ))}
          </div>
        )}
      </div>

      {/* Input bar */}
      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 390, padding: '12px 24px 32px', backgroundColor: '#F5EDE4', borderTop: '1px solid rgba(60,101,56,0.12)' }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addItem()}
            placeholder="Zutat hinzufügen..."
            style={{ flex: 1, padding: '12px 14px', borderRadius: 14, border: '1.5px solid #D4B896', backgroundColor: '#FFFFFF', color: '#23283A', fontSize: 14, outline: 'none' }}
          />
          <button
            onClick={addItem}
            style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: GREEN, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
          >
            <i className="fa-solid fa-plus" style={{ color: '#FFFFFF', fontSize: 18 }} />
          </button>
        </div>
      </div>
    </div>
  )
}

function ItemRow({ item, onToggle, onDelete }: { item: ShoppingItem; onToggle: (id: string) => void; onDelete: (id: string) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #EDE3D6' }}>
      <button
        onClick={() => onToggle(item.id)}
        style={{
          width: 22,
          height: 22,
          borderRadius: 6,
          border: `2px solid ${item.checked ? GREEN : '#C9B9A7'}`,
          backgroundColor: item.checked ? GREEN : 'transparent',
          flexShrink: 0,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {item.checked && <i className="fa-solid fa-check" style={{ color: '#FFFFFF', fontSize: 11 }} />}
      </button>
      <span style={{ flex: 1, color: item.checked ? '#9A8A72' : '#23283A', fontSize: 14, lineHeight: 1.4, textDecoration: item.checked ? 'line-through' : 'none' }}>
        {item.name}
      </span>
      <button
        onClick={() => onDelete(item.id)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', lineHeight: 1, flexShrink: 0 }}
      >
        <i className="fa-solid fa-xmark" style={{ color: '#C9B9A7', fontSize: 15 }} />
      </button>
    </div>
  )
}
