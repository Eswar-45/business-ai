import { useState, useEffect } from 'react'
import Header from './components/Header'
import SearchCard from './components/SearchCard'
import OutletsList from './components/OutletsList'
import ResultsView from './components/ResultsView'
import HistoryPanel from './components/HistoryPanel'
import LoadingOverlay from './components/LoadingOverlay'

const API = ""
const HISTORY_KEY = "revio.chatHistory.v1"
const HISTORY_LIMIT = 30

function App() {
  const [allPlaces, setAllPlaces] = useState([])
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [chatHistory, setChatHistory] = useState([])
  const [activeHistoryId, setActiveHistoryId] = useState(null)
  const [currentView, setCurrentView] = useState('search') // 'search', 'outlets', 'results'
  const [isLoading, setIsLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [error, setError] = useState('')
  const [searchForm, setSearchForm] = useState({
    query: '',
    location: '',
    question: ''
  })

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = () => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY)
      const history = raw ? JSON.parse(raw) : []
      setChatHistory(history.slice(0, HISTORY_LIMIT))
    } catch {
      setChatHistory([])
    }
  }

  const persistHistory = (history) => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, HISTORY_LIMIT)))
  }

  const makeHistoryId = () => `h_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

  const saveSearchHistory = ({ query, location, question, places, searchTerm }) => {
    const id = makeHistoryId()
    const entry = {
      id,
      createdAt: Date.now(),
      query,
      location,
      question,
      searchTerm,
      places: places || [],
      selectedPlace: null,
      analysis: null,
    }
    const newHistory = [entry, ...chatHistory.slice(0, HISTORY_LIMIT - 1)]
    setChatHistory(newHistory)
    persistHistory(newHistory)
    return id
  }

  const saveAnalysisHistory = ({ id, question, place, analysis }) => {
    const newHistory = [...chatHistory]
    const idx = newHistory.findIndex(x => x.id === id)
    if (idx === -1) return

    newHistory[idx].question = question
    newHistory[idx].selectedPlace = place
    newHistory[idx].analysis = analysis
    newHistory[idx].updatedAt = Date.now()

    const [entry] = newHistory.splice(idx, 1)
    newHistory.unshift(entry)
    setChatHistory(newHistory)
    persistHistory(newHistory)
  }

  const doSearch = async () => {
    const { query, location, question } = searchForm
    if (!query || !location) {
      setError("Please enter both a business name and a city.")
      return
    }

    setIsLoading(true)
    setError('')
    setCurrentView('search')

    try {
      const data = await post("/api/search", { query, location })
      const places = data.places || []
      if (!places.length) throw new Error("No outlets found. Try a different search.")
      const historyId = saveSearchHistory({
        query,
        location,
        question,
        places,
        searchTerm: data.search_term,
      })
      setActiveHistoryId(historyId)
      setAllPlaces(places)
      setCurrentView('outlets')
      loadHistory()
    } catch (e) {
      setError(e.message)
    } finally {
      setIsLoading(false)
    }
  }

  const analyzePlace = async (place) => {
    setSelectedPlace(place)
    const question = searchForm.question || `What are the pros and cons of ${place.name}?`

    setIsLoading(true)
    setLoadingStep(1)

    try {
      setLoadingStep(1)
      const data = await post("/api/analyze", {
        cid: place.cid || "",
        location: searchForm.location,
        name: place.name,
        address: place.address,
        snippet: place.snippet || "",
        question,
      })

      setLoadingStep(2)
      await wait(350)
      setLoadingStep(3)
      await wait(350)
      setLoadingStep(4)
      await wait(450)

      setIsLoading(false)
      saveAnalysisHistory({
        id: activeHistoryId,
        question,
        place,
        analysis: data,
      })
      loadHistory()
      setCurrentView('results')
    } catch (e) {
      setIsLoading(false)
      setError(e.message)
    }
  }

  const restoreHistoryItem = (historyId) => {
    const entry = chatHistory.find(x => x.id === historyId)
    if (!entry) return

    setActiveHistoryId(historyId)
    setSearchForm({
      query: entry.query || '',
      location: entry.location || '',
      question: entry.question || ''
    })
    setAllPlaces(entry.places || [])

    setError('')
    if (entry.analysis && entry.selectedPlace) {
      setSelectedPlace(entry.selectedPlace)
      setCurrentView('results')
    } else if (entry.places?.length) {
      setCurrentView('outlets')
    } else {
      setCurrentView('search')
    }
  }

  const clearHistory = () => {
    setChatHistory([])
    setActiveHistoryId(null)
    localStorage.removeItem(HISTORY_KEY)
  }

  const resetToSearch = () => {
    setCurrentView('search')
    setError('')
  }

  const backToOutlets = () => {
    setCurrentView('outlets')
  }

  return (
    <>
      <div className="noise"></div>
      <div className="app-shell">
        <Header />
        <div className="main-content">
          {currentView === 'search' && (
            <SearchCard
              form={searchForm}
              onChange={setSearchForm}
              onSearch={doSearch}
              isLoading={isLoading}
              error={error}
              onClearError={() => setError('')}
            />
          )}
          {currentView === 'outlets' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '1200px', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-purple) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Search Results</h2>
                <button onClick={resetToSearch} className="btn-ghost" style={{ alignSelf: 'auto' }}>← Back</button>
              </div>
              <div className="outlet-cards-grid">
                {allPlaces.map((place, idx) => (
                  <OutletsList
                    key={place.name}
                    places={[place]}
                    index={idx + 1}
                    searchTerm={chatHistory.find(h => h.id === activeHistoryId)?.searchTerm}
                    onSelect={() => analyzePlace(place)}
                  />
                ))}
              </div>
            </>
          )}
          {currentView === 'results' && selectedPlace && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '600px', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-blue) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Analysis Results</h2>
                <button onClick={backToOutlets} className="btn-ghost" style={{ alignSelf: 'auto' }}>← Back</button>
              </div>
              <ResultsView
                place={selectedPlace}
                analysis={chatHistory.find(h => h.id === activeHistoryId)?.analysis}
                question={searchForm.question}
                onBack={backToOutlets}
              />
            </>
          )}
        </div>
        <HistoryPanel
          history={chatHistory}
          activeId={activeHistoryId}
          onSelect={restoreHistoryItem}
          onClear={clearHistory}
        />
      </div>
      {isLoading && <LoadingOverlay step={loadingStep} />}
    </>
  )
}

async function post(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.detail || `Server error ${res.status}`)
  return data
}

function wait(ms) { return new Promise(r => setTimeout(r, ms)) }

export default App
