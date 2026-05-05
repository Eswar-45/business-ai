function OutletsList({ places, searchTerm, onSelect, onBack }) {
  return (
    <section>
      <div className="section-hdr">
        <div>
          <p className="step-label">Step 2 — Select outlet</p>
          <h2 className="section-title">{places.length} outlet{places.length > 1 ? "s" : ""} found</h2>
          <p className="section-sub">Results for "{searchTerm}" — click one to analyze</p>
        </div>
        <button className="btn-ghost" onClick={onBack}>← New search</button>
      </div>
      <div id="outletsList">
        {places.map((place, i) => (
          <div
            key={i}
            className="outlet-card fade-up"
            style={{ animationDelay: `${i * 55}ms` }}
            onClick={() => onSelect(place)}
          >
            <div>
              <div className="outlet-num"># {i + 1}</div>
              <div className="outlet-name">{place.name}</div>
              <div className="outlet-addr">{place.address}</div>
            </div>
            <div className="outlet-right">
              <div className="review-pill">
                {(place.review_count ? Number(place.review_count).toLocaleString() : 0)}<small>Google reviews</small>
              </div>
              {place.rating && (
                <div className="rating-line">
                  <span className="star">★</span> {place.rating}
                </div>
              )}
            </div>
            <div className="outlet-chevron">›</div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default OutletsList