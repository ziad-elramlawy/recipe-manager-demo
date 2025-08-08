import React, { useMemo, useState, useEffect } from 'react'
import RecipeList from './RecipeList.jsx'
import RecipeEditor from './RecipeEditor.jsx'
import translations from './i18n.js'

const initialRecipes = [
  {
    id: 'r1',
    name: { en: 'Chocolate Fudge Cake', ar: 'كيك شوكولاتة فادج' },
    category: 'bakery',
    yield: 24, unit: 'piece',
    tags: ['cake', 'chocolate'],
    allergens: ['gluten', 'egg', 'milk'],
    visibility: 'private',
    steps: { en: '1) Bake sponge. 2) Soak with milk. 3) Layer with ganache.', ar: '١) اخبز الاسبونش. ٢) اشرب بالحليب. ٣) طبّق مع الجناش.' },
    notes: { en: 'Use 22–24% cocoa.', ar: 'استخدم كاكاو بنسبة ٢٢–٢٤٪.' },
    cost: 1850,
    nutrition: { kcal: 380, protein: 6, fat: 18, carbs: 48 },
    author: 'QA Team',
    createdAt: '2025-03-10',
    updatedAt: '2025-07-01',
    ingredients: [
      { name: 'Chocolate sponge', qty: 1, unit: 'tray' },
      { name: 'Milk', qty: 2, unit: 'l' },
      { name: 'Chocolate ganache', qty: 3.5, unit: 'kg' },
    ],
    subrecipes: [
      { name: { en: 'Chocolate Ganache', ar: 'جناش الشوكولاتة' }, id: 's1' },
    ],
  },
  {
    id: 'r2',
    name: { en: 'Pesto Caesar Dressing', ar: 'صلصة بيستو سيزر' },
    category: 'savory',
    yield: 2, unit: 'kg',
    tags: ['sauce'],
    allergens: ['milk', 'fish'],
    visibility: 'public',
    steps: { en: 'Blend all ingredients until smooth.', ar: 'اخلط جميع المكونات حتى تصبح ناعمة.' },
    notes: { en: 'Keep chilled.', ar: 'يُحفظ مبردًا.' },
    cost: 220,
    nutrition: { kcal: 250, protein: 5, fat: 22, carbs: 6 },
    author: 'R&D',
    createdAt: '2025-05-22',
    updatedAt: '2025-06-15',
    ingredients: [
      { name: 'Parmesan', qty: 300, unit: 'g' },
      { name: 'Anchovies', qty: 40, unit: 'g' },
      { name: 'Basil pesto', qty: 400, unit: 'g' },
      { name: 'Oil', qty: 1, unit: 'l' },
    ],
    subrecipes: [],
  },
]

function useLocalStorage(key, defVal) {
  const [val, setVal] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) : defVal
    } catch { return defVal }
  })
  useEffect(() => { localStorage.setItem(key, JSON.stringify(val)) }, [key, val])
  return [val, setVal]
}

export default function App() {
  const [lang, setLang] = useLocalStorage('lang', 'en')
  const [role, setRole] = useLocalStorage('role', 'editor')
  const t = useMemo(() => translations[lang], [lang])
  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  const [recipes, setRecipes] = useLocalStorage('recipes', initialRecipes)
  const [q, setQ] = useState('')
  const [editing, setEditing] = useState(null)
  const filtered = useMemo(() => {
    const term = q.toLowerCase()
    return recipes.filter(r => (r.name.en + ' ' + r.name.ar + ' ' + r.tags.join(' ') + ' ' + r.allergens.join(' ')).toLowerCase().includes(term))
  }, [recipes, q])

  const canEdit = role === 'admin' || role === 'editor'

  function createRecipe(rec) { setRecipes([ { ...rec, id: crypto.randomUUID(), createdAt: new Date().toISOString().slice(0,10), updatedAt: new Date().toISOString().slice(0,10) }, ...recipes ]) }
  function updateRecipe(id, patch) { setRecipes(recipes.map(r => r.id === id ? { ...r, ...patch, updatedAt: new Date().toISOString().slice(0,10) } : r)) }
  function deleteRecipe(id) { setRecipes(recipes.filter(r => r.id !== id)) }

  return (
    <div style={{direction: dir}} className="app">
      <div className="container">
        <aside className="sidebar">
          <div className="stack">
            <div className="row"><div className="title">🍰 {t.appTitle}</div></div>
            <div className="card">
              <div className="muted" style={{marginBottom: 6}}>{t.language}</div>
              <select value={lang} onChange={e=>setLang(e.target.value)}>
                <option value="en">English</option>
                <option value="ar">العربية</option>
              </select>
            </div>
            <div className="card">
              <div className="muted" style={{marginBottom: 6}}>{t.role}</div>
              <select value={role} onChange={e=>setRole(e.target.value)}>
                <option value="admin">{t.roles.admin}</option>
                <option value="editor">{t.roles.editor}</option>
                <option value="viewer">{t.roles.viewer}</option>
              </select>
              <div className="muted" style={{marginTop: 8}}>🔒 {t.readOnlyNotice}</div>
            </div>
            <div className="card">
              <div className="stack">
                <button className="btn">{t.recipes}</button>
                <button className="btn">{t.settings}</button>
              </div>
            </div>
          </div>
        </aside>
        <main className="content">
          <div className="row" style={{gap: 12, justifyContent: 'space-between'}}>
            <input className="input" placeholder={t.searchPlaceholder} value={q} onChange={e=>setQ(e.target.value)} />
            <div className="row" style={{gap: 8}}>
              <span className="pill">{t.language}: {lang.toUpperCase()}</span>
              <span className="pill">{t.role}: {t.roles[role]}</span>
              {canEdit && <button className="btn primary" onClick={()=>setEditing({})}>＋ {t.newRecipe}</button>}
            </div>
          </div>

          <div className="grid" style={{marginTop: 16}}>
            {filtered.map(r => (
              <div key={r.id} className="card">
                <div className="row" style={{justifyContent: 'space-between'}}>
                  <div className="row" style={{gap: 8, fontWeight: 700}}>
                    <span>📚</span>
                    <span>{r.name[lang]}</span>
                    <span className="chip">{t.categoryOptions[r.category]}</span>
                    {r.visibility === 'private' ? <span className="chip">🔒 {t.private}</span> : <span className="chip">🔓 {t.public}</span>}
                  </div>
                  <div className="muted">{t.lastUpdated}: {r.updatedAt}</div>
                </div>
                <div style={{marginTop: 8}}>
                  {r.tags.map(tag => <span key={tag} className="tag">#{tag}</span>)}
                </div>
                <div style={{fontSize: 14, marginTop: 6}}>
                  <strong>{t.ingredients}:</strong> {r.ingredients.map(i => `${i.name} (${i.qty} ${i.unit})`).join(', ')}
                </div>
                <div className="row" style={{gap: 8, marginTop: 8}}>
                  <button className="btn" onClick={()=>setEditing({ ...r })}>👁️ {t.details}</button>
                  {canEdit && (<>
                    <button className="btn" onClick={()=>setEditing({ ...r })}>✏️ {t.editRecipe}</button>
                    <button className="btn" onClick={()=>{ if(confirm(t.confirmDelete)) deleteRecipe(r.id) }}>🗑️ {t.delete}</button>
                  </>)}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      <RecipeEditor
        open={!!editing}
        initial={editing}
        onClose={()=>setEditing(null)}
        onCreate={createRecipe}
        onUpdate={(id, patch)=>updateRecipe(id, patch)}
        t={t}
        lang={lang}
        canEdit={canEdit}
      />
    </div>
  )
}
