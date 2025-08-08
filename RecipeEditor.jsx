import React, { useEffect, useState } from 'react'

export default function RecipeEditor({ open, onClose, initial, onCreate, onUpdate, t, lang, canEdit }) {
  const [form, setForm] = useState(() => initial || {})
  useEffect(() => setForm(initial || {}), [initial])

  if (!open) return null

  const isNew = !form?.id
  const save = () => {
    if (!form.name?.en || !form.name?.ar) return alert(`${t.name} (${t.required})`)
    if (isNew) onCreate(form)
    else onUpdate(form.id, form)
    onClose()
  }

  function update(path, value) {
    setForm(prev => {
      const copy = JSON.parse(JSON.stringify(prev || {}))
      const seg = path.split('.')
      let o = copy
      for (let i=0;i<seg.length-1;i++) o = o[seg[i]] = o[seg[i]] ?? {}
      o[seg[seg.length-1]] = value
      return copy
    })
  }

  const units = ['piece','tray','kg','g','l','ml']

  return (
    <div className={"modal open"} onClick={onClose}>
      <div className="card" style={{width: 900, maxWidth: '100%'}} onClick={e=>e.stopPropagation()}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div style={{fontWeight:700, fontSize:18}}>{isNew ? t.newRecipe : t.editRecipe}</div>
          <button className="btn" onClick={onClose}>✖ {t.cancel}</button>
        </div>

        {!canEdit && <div className="muted" style={{marginTop: 6}}>🔒 {t.readOnlyNotice}</div>}

        <div style={{display:'grid', gap:10, gridTemplateColumns:'1fr 1fr', marginTop: 10}}>
          <div>
            <div className="muted">EN {t.name}</div>
            <input className="input" value={form.name?.en || ''} onChange={e=>update('name.en', e.target.value)} />
          </div>
          <div>
            <div className="muted">AR {t.name}</div>
            <input className="input" dir="rtl" value={form.name?.ar || ''} onChange={e=>update('name.ar', e.target.value)} />
          </div>

          <div>
            <div className="muted">{t.category}</div>
            <select className="input" value={form.category || 'bakery'} onChange={e=>update('category', e.target.value)}>
              <option value="bakery">{t.categoryOptions.bakery}</option>
              <option value="pastry">{t.categoryOptions.pastry}</option>
              <option value="savory">{t.categoryOptions.savory}</option>
              <option value="beverage">{t.categoryOptions.beverage}</option>
            </select>
          </div>

          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10}}>
            <div>
              <div className="muted">{t.yield}</div>
              <input type="number" className="input" value={form.yield ?? 1} onChange={e=>update('yield', Number(e.target.value))} />
            </div>
            <div>
              <div className="muted">{t.unit}</div>
              <select className="input" value={form.unit || 'piece'} onChange={e=>update('unit', e.target.value)}>
                {units.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>

          <div style={{gridColumn:'1 / -1'}}>
            <div className="muted">{t.ingredients}</div>
            <div style={{display:'grid', gap:8}}>
              {(form.ingredients || []).map((ing, idx) => (
                <div key={idx} style={{display:'grid', gridTemplateColumns:'1fr 120px 120px 80px', gap:8}}>
                  <input className="input" placeholder={t.name} value={ing.name} onChange={e=>{
                    const v=e.target.value
                    setForm(prev => { const c=JSON.parse(JSON.stringify(prev)); c.ingredients[idx].name=v; return c })
                  }}/>
                  <input type="number" className="input" placeholder={t.quantity} value={ing.qty} onChange={e=>{
                    const v=Number(e.target.value)
                    setForm(prev => { const c=JSON.parse(JSON.stringify(prev)); c.ingredients[idx].qty=v; return c })
                  }}/>
                  <select className="input" value={ing.unit} onChange={e=>{
                    const v=e.target.value
                    setForm(prev => { const c=JSON.parse(JSON.stringify(prev)); c.ingredients[idx].unit=v; return c })
                  }}>{units.map(u => <option key={u} value={u}>{u}</option>)}</select>
                  <button className="btn" onClick={()=>{
                    setForm(prev => { const c=JSON.parse(JSON.stringify(prev)); c.ingredients.splice(idx,1); return c })
                  }}>🗑️</button>
                </div>
              ))}
              <button className="btn" onClick={()=>{
                setForm(prev => { const c=JSON.parse(JSON.stringify(prev||{})); c.ingredients = c.ingredients || []; c.ingredients.push({ name:'', qty:0, unit:'g' }); return c })
              }}>＋ {t.addIngredient}</button>
            </div>
          </div>

          <div>
            <div className="muted">{t.steps}</div>
            <textarea rows={6} className="input" value={(form.steps?.[lang]) || ''} onChange={e=>update(`steps.${lang}`, e.target.value)} />
          </div>
          <div>
            <div className="muted">{t.notes}</div>
            <textarea rows={6} className="input" value={(form.notes?.[lang]) || ''} onChange={e=>update(`notes.${lang}`, e.target.value)} />
          </div>

          <div style={{display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap: 10}}>
            <div>
              <div className="muted">Kcal/100g</div>
              <input type="number" className="input" value={form.nutrition?.kcal ?? 0} onChange={e=>update('nutrition.kcal', Number(e.target.value))} />
            </div>
            <div>
              <div className="muted">Protein/100g</div>
              <input type="number" className="input" value={form.nutrition?.protein ?? 0} onChange={e=>update('nutrition.protein', Number(e.target.value))} />
            </div>
            <div>
              <div className="muted">Fat/100g</div>
              <input type="number" className="input" value={form.nutrition?.fat ?? 0} onChange={e=>update('nutrition.fat', Number(e.target.value))} />
            </div>
            <div>
              <div className="muted">Carbs/100g</div>
              <input type="number" className="input" value={form.nutrition?.carbs ?? 0} onChange={e=>update('nutrition.carbs', Number(e.target.value))} />
            </div>
            <div>
              <div className="muted">{t.visibility}</div>
              <select className="input" value={form.visibility || 'private'} onChange={e=>update('visibility', e.target.value)}>
                <option value="private">{t.private}</option>
                <option value="public">{t.public}</option>
              </select>
            </div>
          </div>

          <div>
            <div className="muted">{t.author}</div>
            <input className="input" value={form.author || ''} onChange={e=>update('author', e.target.value)} />
          </div>
        </div>

        <div style={{display:'flex', gap:8, justifyContent:'flex-end', marginTop: 12}}>
          <button className="btn" onClick={onClose}>✖ {t.cancel}</button>
          {canEdit && <button className="btn primary" onClick={save}>💾 {t.save}</button>}
        </div>
      </div>
    </div>
  )
}
