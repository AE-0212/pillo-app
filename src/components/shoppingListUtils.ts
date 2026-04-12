export const SHOPPING_KEY = 'essen-einkaufsliste'

export const CATEGORIES_ORDER = [
  'Gemüse & Obst',
  'Proteine',
  'Körner & Carbs',
  'Milchprodukte',
  'Gewürze & Sonstiges',
] as const

export interface ShoppingItem {
  id: string
  name: string
  checked: boolean
  category: string
}

export function categorize(name: string): string {
  const n = name.toLowerCase()

  const GEMUSE = ['tomat', 'gurke', 'paprika', 'zucchini', 'zwiebel', 'knoblauch', 'karotte', 'spinat', 'salat', 'brokkoli', 'beere', 'apfel', 'zitrone', 'avocado', 'mais', 'erbse', 'petersilie', 'basilikum', 'thymian', 'rosmarin', 'koriander', 'lauch', 'sellerie', 'fenchel', 'pilz', 'champignon', 'aubergine', 'kürbis', 'kartoffel', 'gemüse', 'obst', 'mango', 'banane', 'erdbeere', 'himbeere', 'heidelbeere', 'kirsche', 'orange', 'limette', 'ingwer', 'chili', 'minze', 'rucola', 'kohl', 'blumenkohl', 'feldsalat', 'rote bete', 'radiesc', 'kräuter', 'blattspinat']
  const PROTEIN = ['lachs', 'huhn', 'hähnchen', 'fleisch', 'rind', 'steak', 'thunfisch', 'garnele', 'eier', ' ei ', 'bohne', 'linse', 'kichererbse', 'tofu', 'tempeh', 'fisch', 'pute', 'schwein', 'wurst', 'hackfleisch', 'putenbrust', 'forelle', 'sardine', 'makrele', 'seelachs', 'edamame', 'mandel', 'nuss', 'walnuss', 'cashew', 'erdnuss']
  const KOERNER = ['haferflocken', 'hafer', 'quinoa', 'reis', 'nudel', 'pasta', 'brot', 'mehl', 'couscous', 'polenta', 'bulgur', 'grieß', 'müsli', 'knäckebrot', 'wrap', 'tortilla', 'vollkorn', 'dinkel', 'roggen', 'semmel', 'brötchen', 'toast', 'bagel', 'chiasamen', 'chia', 'hafermilch']
  const MILCH = ['milch', 'mandelmilch', 'sojamilch', 'joghurt', 'käse', 'feta', 'mozzarella', 'butter', 'sahne', 'quark', 'creme fraiche', 'parmesan', 'ricotta', 'mascarpone', 'skyr', 'kefir', 'frischkäse']

  if (GEMUSE.some(k => n.includes(k))) return 'Gemüse & Obst'
  if (PROTEIN.some(k => n.includes(k))) return 'Proteine'
  if (KOERNER.some(k => n.includes(k))) return 'Körner & Carbs'
  if (MILCH.some(k => n.includes(k))) return 'Milchprodukte'
  return 'Gewürze & Sonstiges'
}

export function loadShoppingList(): ShoppingItem[] {
  try {
    return JSON.parse(localStorage.getItem(SHOPPING_KEY) ?? '[]')
  } catch {
    return []
  }
}

export function saveShoppingList(items: ShoppingItem[]): void {
  localStorage.setItem(SHOPPING_KEY, JSON.stringify(items))
}

export function addIngredientsToShoppingList(ingredients: string[]): number {
  const current = loadShoppingList()
  const existingNames = new Set(current.map(i => i.name.toLowerCase()))
  const newItems: ShoppingItem[] = []

  for (const ing of ingredients) {
    const trimmed = ing.trim()
    if (trimmed && !existingNames.has(trimmed.toLowerCase())) {
      newItems.push({
        id: `item-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: trimmed,
        checked: false,
        category: categorize(trimmed),
      })
      existingNames.add(trimmed.toLowerCase())
    }
  }

  saveShoppingList([...current, ...newItems])
  return newItems.length
}
