function ResultsView({ place, analysis, question, onBack }) {
  if (!analysis) return null

  const detectQuestionMode = (q) => {
    if (!q) return "both"
    const asksPros = /(\bpros?\b|\badvantages?\b|\bpositive\b|\bgood\b)/i.test(q)
    const asksCons = /(\bcons?\b|\bdisadvantages?\b|\bnegative\b|\bbad\b|\bdrawbacks?\b)/i.test(q)
    if (asksCons && !asksPros) return "cons_only"
    if (asksPros && !asksCons) return "pros_only"
    return "both"
  }

  const mode = analysis.analysis_mode || detectQuestionMode(question || analysis.question_used || "")

  const formatNumber = (n) => (n != null && n !== "") ? Number(n).toLocaleString() : "—"

  return (
    <section>
      <div className="section-hdr">
        <div>
          <p className="step-label">Step 3 — Analysis</p>
          <h2 className="section-title">{analysis.name}</h2>
          <p className="section-sub">{analysis.address}</p>
        </div>
        <button className="btn-ghost" onClick={onBack}>← Back to outlets</button>
      </div>

      {/* STATS */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-n">{formatNumber(analysis.total_chunks)}</div>
          <div className="stat-l">Chunks indexed</div>
        </div>
        <div className="stat-card">
          <div className="stat-n">{formatNumber(analysis.chunks_retrieved)}</div>
          <div className="stat-l">Chunks used by AI</div>
        </div>
        <div className="stat-card">
          <div className="stat-n">{place.review_count ? Number(place.review_count).toLocaleString() : "N/A"}</div>
          <div className="stat-l">Total on Google</div>
        </div>
      </div>

      {/* PROS & CONS */}
      <div className="pc-grid">
        {(mode === "both" || mode === "pros_only") && (
          <div className="pc-card pros">
            <div className="pc-head">
              <div className="dot dot-green"></div>
              <h3>5 Pros</h3>
            </div>
            <ul className="pc-list pros-list">
              {(analysis.pros || []).slice(0, 5).map((pro, i) => (
                <li key={i}>{pro}</li>
              ))}
            </ul>
          </div>
        )}
        {(mode === "both" || mode === "cons_only") && (
          <div className="pc-card cons">
            <div className="pc-head">
              <div className="dot dot-red"></div>
              <h3>5 Cons</h3>
            </div>
            <ul className="pc-list cons-list">
              {(analysis.cons || []).slice(0, 5).map((con, i) => (
                <li key={i}>{con}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* SUMMARY */}
      <div className="summary-card">
        <p className="summary-label">AI Summary</p>
        <p>{analysis.summary || "—"}</p>
      </div>

      {/* SOURCE EXCERPTS */}
      <div className="card excerpts-card">
        <div className="excerpts-hdr">
          <h3>Source review excerpts</h3>
          <span className="badge">{(analysis.source_excerpts || []).length} chunks</span>
        </div>
        <p className="hint">Exact chunks retrieved by RAG and fed to the AI</p>
        <div>
          {(analysis.source_excerpts || []).map((excerpt, i) => (
            <div key={i} className="excerpt">{excerpt}</div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ResultsView