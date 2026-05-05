function SearchCard({ form, onChange, onSearch, isLoading, error, onClearError }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch()
  }

  const handleChange = (field) => (e) => {
    onChange({ ...form, [field]: e.target.value })
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch()
    }
  }

  return (
    <>
      <section className="card search-card">
        <p className="step-label">Step 1 — Search</p>
        <h2 className="card-title">Find outlets in your city</h2>

        <form onSubmit={handleSubmit}>
          <div className="field-row">
            <div className="field">
              <label>Business / Place</label>
              <input
                type="text"
                placeholder="Pizza Hut, best cafe, PG…"
                value={form.query}
                onChange={handleChange('query')}
                onKeyDown={handleKeyDown}
                autoComplete="off"
              />
            </div>
            <div className="field">
              <label>City</label>
              <input
                type="text"
                placeholder="Hyderabad, Chennai…"
                value={form.location}
                onChange={handleChange('location')}
                onKeyDown={handleKeyDown}
                autoComplete="off"
              />
            </div>
          </div>

          <div className="field">
            <label>Your Question <em>(ask only pros, only cons, or both)</em></label>
            <input
              type="text"
              placeholder="e.g. only cons about service, or pros and cons about food quality"
              value={form.question}
              onChange={handleChange('question')}
              onKeyDown={handleKeyDown}
              autoComplete="off"
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
          >
            <span>{isLoading ? 'Searching…' : 'Search Outlets'}</span>
            <span style={{ display: isLoading ? 'none' : 'inline' }}>→</span>
            <span className={`spin ${isLoading ? '' : 'hidden'}`}></span>
          </button>
        </form>
      </section>

      {error && (
        <div className="err-box">
          ⚠ {error}
        </div>
      )}
    </>
  )
}

export default SearchCard