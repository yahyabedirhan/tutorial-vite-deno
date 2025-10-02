import { useState } from 'react'
import './App.css'

interface ApiResponse {
  message: string;
  timestamp: string;
  deno: string;
  randomNumber: number;
  requestCount: number;
}

function App() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApiData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/hello');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="container">
        <div className="header">
          <div className="emoji">🦕</div>
          <h1>Hello Deno!</h1>
          <p className="subtitle">Full-stack app deployed on Deno Deploy</p>
        </div>

        <div className="info-card">
          <h2>✨ Tech Stack</h2>
          <div className="tech-grid">
            <div className="tech-item">
              <span className="tech-icon">⚡</span>
              <span>Vite</span>
            </div>
            <div className="tech-item">
              <span className="tech-icon">⚛️</span>
              <span>React</span>
            </div>
            <div className="tech-item">
              <span className="tech-icon">🦕</span>
              <span>Deno</span>
            </div>
            <div className="tech-item">
              <span className="tech-icon">🚀</span>
              <span>Deploy</span>
            </div>
          </div>
        </div>

        <div className="action-section">
          <button 
            onClick={fetchApiData} 
            disabled={loading}
            className="fetch-button"
          >
            {loading ? '⏳ Loading...' : '🚀 Fetch API Data'}
          </button>
        </div>

        {error && (
          <div className="error-card">
            <h3>❌ Error</h3>
            <p>{error}</p>
          </div>
        )}

        {data && (
          <div className="data-card">
            <h3 className="success">✓ API Response Received!</h3>
            <div className="data-content">
              <div className="data-item">
                <strong>Message:</strong>
                <span>{data.message}</span>
              </div>
              <div className="data-item">
                <strong>Deno Version:</strong>
                <code>{data.deno}</code>
              </div>
              <div className="data-item">
                <strong>Random Number:</strong>
                <span className="highlight">{data.randomNumber}</span>
              </div>
              <div className="data-item">
                <strong>Request Count:</strong>
                <span className="highlight">{data.requestCount}</span>
              </div>
              <div className="data-item timestamp">
                <strong>Timestamp:</strong>
                <span>{new Date(data.timestamp).toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        <footer className="footer">
          <p>Built with ❤️ using modern web technologies</p>
          <p className="small">Serverless • Edge Computing • Zero Config</p>
        </footer>
      </div>
    </div>
  )
}

export default App
