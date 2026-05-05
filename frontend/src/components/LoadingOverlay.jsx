function LoadingOverlay({ step }) {
  return (
    <div className="overlay">
      <div className="overlay-card">
        <div className="overlay-ring"></div>
        <p className="overlay-msg">
          {step === 1 && "Scraping 100+ reviews…"}
          {step === 2 && "Chunking & embedding…"}
          {step === 3 && "RAG retrieval…"}
          {step === 4 && "Generating analysis…"}
        </p>
        <div className="overlay-steps">
          <div className={`ls ${step > 1 ? 'done' : step === 1 ? 'active' : ''}`}>
            ① Scraping 100+ reviews
          </div>
          <div className={`ls ${step > 2 ? 'done' : step === 2 ? 'active' : ''}`}>
            ② Chunking & embedding
          </div>
          <div className={`ls ${step > 3 ? 'done' : step === 3 ? 'active' : ''}`}>
            ③ RAG retrieval
          </div>
          <div className={`ls ${step > 4 ? 'done' : step === 4 ? 'active' : ''}`}>
            ④ Generating analysis
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoadingOverlay