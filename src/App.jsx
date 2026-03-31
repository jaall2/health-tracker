import { useState, useEffect } from 'react'
import './App.css'

const GRADES = ['1', '2', '3']

const emptyEntry = () => ({
  timestamp: new Date().toISOString(),
  food: '',
  drink: '',
  cgm: '',
  comment: '',
  mucus: '',
  coughing: '',
  vigor: '',
  footPain: '',
})

function formatTimestamp(iso) {
  const d = new Date(iso)
  return d.toLocaleString()
}

function GradeSelector({ label, value, onChange }) {
  return (
    <div className="grade-field">
      <label>{label}</label>
      <div className="grade-buttons">
        {GRADES.map(g => (
          <button
            key={g}
            className={`grade-btn ${value === g ? 'selected' : ''}`}
            onClick={() => onChange(g === value ? '' : g)}
            type="button"
          >
            {g}
          </button>
        ))}
      </div>
    </div>
  )
}

function EntryForm({ onSave }) {
  const [entry, setEntry] = useState(emptyEntry())
  const set = (field) => (e) =>
    setEntry(prev => ({ ...prev, [field]: e.target.value }))

  const setGrade = (field) => (val) =>
    setEntry(prev => ({ ...prev, [field]: val }))

  function handleSave() {
    onSave({ ...entry, timestamp: new Date().toISOString() })
    setEntry(emptyEntry())
  }

  return (
    <div className="form-card">
      <h2>New Entry</h2>
      <p className="timestamp">⏱ {formatTimestamp(entry.timestamp)}</p>

      <div className="fields">
        <label>Food</label>
        <input value={entry.food} onChange={set('food')} placeholder="What did you eat?" />

        <label>Drink</label>
        <input value={entry.drink} onChange={set('drink')} placeholder="What did you drink?" />

        <label>CGM (mg/dL)</label>
        <input value={entry.cgm} onChange={set('cgm')} placeholder="Glucose reading" type="number" />

        <label>Comment / Activity</label>
        <input value={entry.comment} onChange={set('comment')} placeholder="Exercise, stress, other notes..." />
      </div>

      <div className="grades-section">
        <h3>Symptom Grades <span className="grade-hint">(1 = good, 3 = poor)</span></h3>
        <GradeSelector label="Mucus (M)" value={entry.mucus} onChange={setGrade('mucus')} />
        <GradeSelector label="Coughing (C)" value={entry.coughing} onChange={setGrade('coughing')} />
        <GradeSelector label="Vigor (V)" value={entry.vigor} onChange={setGrade('vigor')} />
        <GradeSelector label="Foot Pain (F)" value={entry.footPain} onChange={setGrade('footPain')} />
      </div>

      <button className="btn-primary" onClick={handleSave}>Save Entry</button>
    </div>
  )
}

function EntryList({ entries }) {
  if (entries.length === 0) return <p className="empty">No entries yet. Log your first entry above.</p>

  return (
    <div className="entry-list">
      <h2>Recent Entries</h2>
      {[...entries].reverse().map((e, i) => (
        <div key={i} className="entry-card">
          <p className="entry-time">{formatTimestamp(e.timestamp)}</p>
          <div className="entry-row">
            {e.food && <span>🍽 {e.food}</span>}
            {e.drink && <span>🥤 {e.drink}</span>}
            {e.cgm && <span>📊 {e.cgm} mg/dL</span>}
            {e.comment && <span>💬 {e.comment}</span>}
          </div>
          <div className="entry-grades">
            {e.mucus && <span className={`grade grade-${e.mucus}`}>M:{e.mucus}</span>}
            {e.coughing && <span className={`grade grade-${e.coughing}`}>C:{e.coughing}</span>}
            {e.vigor && <span className={`grade grade-${e.vigor}`}>V:{e.vigor}</span>}
            {e.footPain && <span className={`grade grade-${e.footPain}`}>F:{e.footPain}</span>}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function App() {
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem('health-entries')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('health-entries', JSON.stringify(entries))
  }, [entries])

  function addEntry(entry) {
    setEntries(prev => [...prev, entry])
  }

  return (
    <div className="app">
      <header>
        <h1>Health Tracker</h1>
        <p className="subtitle">MCVF Daily Log</p>
      </header>
      <main>
        <EntryForm onSave={addEntry} />
        <EntryList entries={entries} />
      </main>
    </div>
  )
}
