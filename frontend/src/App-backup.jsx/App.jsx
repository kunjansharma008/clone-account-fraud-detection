import { useState } from "react";
import "./App.css";

const initialForm = {
  username: "",
  followers: "",
  following: "",
  posts: "",
  accountAge: "",
  profileCompleteness: "",
  usernameSimilarity: "",
  loginFrequency: "",
  newDeviceLogins: "",
  uniqueDevices: "",
  ipChanges: "",
  locationChanges: "",
  messagesPerDay: "",
  suspiciousLinks: "",
  transactionCount: "",
  transactionAmount: "",
};

const menuItems = [
  { id: "overview", icon: "⌂", label: "Overview" },
  { id: "profile", icon: "◉", label: "Account Profile" },
  { id: "identity", icon: "◇", label: "Clone Signals" },
  { id: "login", icon: "▣", label: "Login & Device" },
  { id: "communication", icon: "✉", label: "Communication" },
  { id: "transactions", icon: "₹", label: "Transactions" },
];

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [activeSection, setActiveSection] = useState("overview");

  const [formData, setFormData] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const analyzeAccount = async (e) => {
    e.preventDefault();

    setLoading(true);
    setResult(null);
    setError("");

    try {
      const requestData = {
        account_age_days: Number(formData.accountAge) * 30,
        followers_count: Number(formData.followers),
        following_count: Number(formData.following),
        profile_completeness: Number(formData.profileCompleteness),
        username_similarity: Number(formData.usernameSimilarity),
        login_frequency: Number(formData.loginFrequency),
        new_device_logins: Number(formData.newDeviceLogins),
        unique_devices: Number(formData.uniqueDevices),
        ip_changes: Number(formData.ipChanges),
        location_changes: Number(formData.locationChanges),
        messages_per_day: Number(formData.messagesPerDay),
        suspicious_links: Number(formData.suspiciousLinks),
        transaction_count: Number(formData.transactionCount),
        transaction_amount: Number(formData.transactionAmount),
      };

      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Prediction failed");
      }

      setResult(data);
      setActiveSection("result");
    } catch (err) {
      setError(err.message || "Unable to connect to the API.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(initialForm);
    setResult(null);
    setError("");
  };

  const renderField = (
    label,
    name,
    type = "number",
    placeholder = "",
    extraProps = {}
  ) => {
    return (
      <div className="input-group">
        <label>{label}</label>

        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={formData[name]}
          onChange={handleChange}
          required
          {...extraProps}
        />
      </div>
    );
  };

  const renderResult = () => {
    if (!result) return null;

    return (
      <section className="result-card">
        <div className="result-header">
          <div>
            <span className="eyebrow">ANALYSIS COMPLETE</span>

            <h2>Account Risk Assessment</h2>

            <p>
              Analysis result for{" "}
              <strong>@{formData.username}</strong>
            </p>
          </div>

          <div className="result-status">
            ✓ Analysis Complete
          </div>
        </div>

        <div className="result-layout">
          <div className="score-panel">
            <div className="score-circle">
              <div>
                <strong>{result.fraud_probability}%</strong>

                <span>Risk Score</span>
              </div>
            </div>

            <h3>Fraud Probability</h3>

            <p>
              Probability estimated by the trained machine learning model.
            </p>
          </div>

          <div className="result-details">
            <div className="result-box">
              <span>Prediction</span>

              <strong
                className={`prediction ${result.prediction.toLowerCase()}`}
              >
                {result.prediction === "GENUINE" ? "✓" : "⚠"}{" "}
                {result.prediction}
              </strong>
            </div>

            <div className="result-box">
              <span>Risk Level</span>

              <strong
                className={`risk ${result.risk_level.toLowerCase()}`}
              >
                {result.risk_level}
              </strong>
            </div>

            <div className="risk-meter">
              <div className="meter-heading">
                <span>Fraud Risk</span>

                <strong>{result.fraud_probability}%</strong>
              </div>

              <div className="meter">
                <div
                  className="meter-progress"
                  style={{
                    width: `${result.fraud_probability}%`,
                  }}
                ></div>
              </div>

              <div className="meter-labels">
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
              </div>
            </div>
          </div>
        </div>

        <div className="analysis-summary">
          <div className="summary-icon">
            {result.risk_level === "HIGH"
              ? "⚠️"
              : result.risk_level === "MEDIUM"
              ? "🔎"
              : "✓"}
          </div>

          <div>
            <h3>
              {result.risk_level === "HIGH"
                ? "High Risk Detected"
                : result.risk_level === "MEDIUM"
                ? "Potentially Suspicious"
                : "Low Risk Detected"}
            </h3>

            <p>
              {result.risk_level === "HIGH"
                ? "The provided account signals indicate a high level of fraud risk. Further verification is recommended."
                : result.risk_level === "MEDIUM"
                ? "The account shows some potentially suspicious behavioural characteristics. Additional verification may be useful."
                : "The provided signals indicate a relatively low fraud probability according to the trained ML model."}
            </p>
          </div>
        </div>
      </section>
    );
  };

  /* =========================
     SIGN IN
  ========================= */

  if (!isLoggedIn) {
    return (
      <div className="login-page">
        <div className="login-card">
          <div className="login-logo">🛡️</div>

          <p className="login-tag">AI-POWERED SECURITY</p>

          <h1>
            Clone Account &<br />
            Fraud Detection
          </h1>

          <p className="login-description">
            Secure access to your account risk analysis dashboard.
          </p>

          <form onSubmit={handleLogin}>
            <div className="login-input-group">
              <label>Email Address</label>

              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={loginData.email}
                onChange={handleLoginChange}
                required
              />
            </div>

            <div className="login-input-group">
              <label>Password</label>

              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={loginData.password}
                onChange={handleLoginChange}
                required
              />
            </div>

            <button type="submit" className="login-btn">
              Sign In
              <span>→</span>
            </button>
          </form>

          <div className="login-footer">
            <span>Protected workspace</span>
            <span>•</span>
            <span>Demo Access</span>
          </div>
        </div>
      </div>
    );
  }

  /* =========================
     MAIN DASHBOARD
  ========================= */

  return (
    <div className="dashboard-app">

      {/* SIDEBAR */}

      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">🛡️</div>

          <div>
            <strong>CloneGuard</strong>
            <span>Security Console</span>
          </div>
        </div>

        <div className="sidebar-divider"></div>

        <nav className="sidebar-nav">
          <p className="nav-label">ANALYSIS</p>

          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${
                activeSection === item.id ? "active" : ""
              }`}
              onClick={() => setActiveSection(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>

              <span>{item.label}</span>
            </button>
          ))}

          {result && (
            <>
              <p className="nav-label result-nav-label">RESULT</p>

              <button
                className={`nav-item ${
                  activeSection === "result" ? "active" : ""
                }`}
                onClick={() => setActiveSection("result")}
              >
                <span className="nav-icon">✓</span>

                <span>Risk Assessment</span>
              </button>
            </>
          )}
        </nav>

        <div className="sidebar-bottom">
          <div className="model-status">
            <span className="online-dot"></span>

            <div>
              <strong>ML Model Online</strong>
              <small>API Connected</small>
            </div>
          </div>

          <button
            className="signout-btn"
            onClick={() => {
              setIsLoggedIn(false);
              setActiveSection("overview");
            }}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN AREA */}

      <div className="main-area">

        {/* TOP BAR */}

        <header className="topbar">
          <div>
            <span className="topbar-label">SECURITY CONSOLE</span>

            <h1>
              {activeSection === "overview"
                ? "Overview"
                : activeSection === "profile"
                ? "Account Profile"
                : activeSection === "identity"
                ? "Identity & Clone Signals"
                : activeSection === "login"
                ? "Login & Device Behaviour"
                : activeSection === "communication"
                ? "Communication Behaviour"
                : activeSection === "transactions"
                ? "Transaction Behaviour"
                : "Risk Assessment"}
            </h1>
          </div>

          <div className="user-area">
            <div className="user-avatar">
              {loginData.email
                ? loginData.email.charAt(0).toUpperCase()
                : "U"}
            </div>

            <div>
              <strong>Security User</strong>
              <span>{loginData.email}</span>
            </div>
          </div>
        </header>

        <main className="content-area">

          {/* =========================
             OVERVIEW
          ========================= */}

          {activeSection === "overview" && (
            <>
              <div className="welcome-section">
                <div>
                  <span className="eyebrow">AI-POWERED SECURITY</span>

                  <h2>Account Risk Analysis Dashboard</h2>

                  <p>
                    Analyze account behaviour across profile, identity,
                    device, communication and transaction signals.
                  </p>
                </div>

                <div className="overview-shield">
                  🛡️
                </div>
              </div>

              <div className="overview-stats">

                <div className="overview-stat">
                  <span>🤖</span>
                  <div>
                    <strong>ML Powered</strong>
                    <small>Intelligent Analysis</small>
                  </div>
                </div>

                <div className="overview-stat">
                  <span>🔐</span>
                  <div>
                    <strong>14 Signals</strong>
                    <small>Security Features</small>
                  </div>
                </div>

                <div className="overview-stat">
                  <span>⚡</span>
                  <div>
                    <strong>Real-Time</strong>
                    <small>Risk Assessment</small>
                  </div>
                </div>

              </div>

              <section className="overview-card">
                <div>
                  <span className="eyebrow">GET STARTED</span>

                  <h3>Start a New Account Analysis</h3>

                  <p>
                    Enter account information and behavioural signals to
                    generate an ML-based fraud risk assessment.
                  </p>
                </div>

                <button
                  className="primary-action"
                  onClick={() => setActiveSection("profile")}
                >
                  Start Analysis
                  <span>→</span>
                </button>
              </section>

              <section className="signal-overview">

                <div className="section-heading">
                  <div className="section-number">01</div>

                  <div>
                    <h3>Analysis Modules</h3>

                    <p>
                      Navigate through individual risk signal categories.
                    </p>
                  </div>
                </div>

                <div className="module-grid">
                  {menuItems.slice(1).map((item, index) => (
                    <button
                      className="module-card"
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                    >
                      <span className="module-number">
                        0{index + 1}
                      </span>

                      <span className="module-icon">
                        {item.icon}
                      </span>

                      <strong>{item.label}</strong>

                      <small>
                        Open analysis module →
                      </small>
                    </button>
                  ))}
                </div>

              </section>
            </>
          )}

          {/* =========================
             ACCOUNT PROFILE
          ========================= */}

          {activeSection === "profile" && (
            <section className="analysis-page">
              <div className="page-intro">
                <span className="eyebrow">MODULE 01</span>

                <h2>Account Profile</h2>

                <p>
                  Enter the basic profile information associated with the
                  account being analyzed.
                </p>
              </div>

              <div className="analysis-card">
                <div className="card-header">
                  <div>
                    <h3>Basic Account Information</h3>

                    <p>
                      These details provide the basic context for the
                      account analysis.
                    </p>
                  </div>

                  <div className="module-badge">
                    PROFILE
                  </div>
                </div>

                <div className="form-grid">
                  <div className="input-group full-width">
                    <label>Username</label>

                    <input
                      type="text"
                      name="username"
                      placeholder="Enter account username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {renderField(
                    "Followers",
                    "followers",
                    "number",
                    "e.g. 120",
                    { min: "0" }
                  )}

                  {renderField(
                    "Following",
                    "following",
                    "number",
                    "e.g. 250",
                    { min: "0" }
                  )}

                  {renderField(
                    "Posts",
                    "posts",
                    "number",
                    "e.g. 15",
                    { min: "0" }
                  )}

                  {renderField(
                    "Account Age (months)",
                    "accountAge",
                    "number",
                    "e.g. 12",
                    { min: "1" }
                  )}

                  {renderField(
                    "Profile Completeness (%)",
                    "profileCompleteness",
                    "number",
                    "e.g. 85",
                    { min: "0", max: "100" }
                  )}
                </div>
              </div>

              <div className="section-actions">
                <button
                  className="next-btn"
                  onClick={() => setActiveSection("identity")}
                >
                  Continue to Clone Signals →
                </button>
              </div>
            </section>
          )}

          {/* =========================
             IDENTITY
          ========================= */}

          {activeSection === "identity" && (
            <section className="analysis-page">
              <div className="page-intro">
                <span className="eyebrow">MODULE 02</span>

                <h2>Identity & Clone Signals</h2>

                <p>
                  Analyze identity-related indicators that may suggest
                  impersonation or cloned account behaviour.
                </p>
              </div>

              <div className="analysis-card">
                <div className="card-header">
                  <div>
                    <h3>Identity Similarity</h3>

                    <p>
                      Compare identity characteristics to identify possible
                      cloning signals.
                    </p>
                  </div>

                  <div className="module-badge">
                    IDENTITY
                  </div>
                </div>

                <div className="form-grid">
                  <div className="input-group full-width">
                    <label>Username Similarity</label>

                    <input
                      type="number"
                      name="usernameSimilarity"
                      placeholder="0 - 1"
                      min="0"
                      max="1"
                      step="0.01"
                      value={formData.usernameSimilarity}
                      onChange={handleChange}
                      required
                    />

                    <small>
                      Higher values indicate greater username similarity.
                    </small>
                  </div>
                </div>
              </div>

              <div className="section-actions">
                <button
                  className="secondary-btn"
                  onClick={() => setActiveSection("profile")}
                >
                  ← Back
                </button>

                <button
                  className="next-btn"
                  onClick={() => setActiveSection("login")}
                >
                  Continue to Login & Device →
                </button>
              </div>
            </section>
          )}

          {/* =========================
             LOGIN & DEVICE
          ========================= */}

          {activeSection === "login" && (
            <section className="analysis-page">
              <div className="page-intro">
                <span className="eyebrow">MODULE 03</span>

                <h2>Login & Device Behaviour</h2>

                <p>
                  Identify unusual login patterns, device activity, IP
                  changes and location changes.
                </p>
              </div>

              <div className="analysis-card">
                <div className="card-header">
                  <div>
                    <h3>Access Behaviour</h3>

                    <p>
                      Provide recent access and device-related activity.
                    </p>
                  </div>

                  <div className="module-badge">
                    BEHAVIOUR
                  </div>
                </div>

                <div className="form-grid">

                  {renderField(
                    "Login Frequency / Day",
                    "loginFrequency",
                    "number",
                    "e.g. 5",
                    { min: "0" }
                  )}

                  {renderField(
                    "New Device Logins",
                    "newDeviceLogins",
                    "number",
                    "e.g. 1",
                    { min: "0" }
                  )}

                  {renderField(
                    "Unique Devices",
                    "uniqueDevices",
                    "number",
                    "1 - 5",
                    { min: "1", max: "5" }
                  )}

                  {renderField(
                    "IP Changes",
                    "ipChanges",
                    "number",
                    "e.g. 2",
                    { min: "0" }
                  )}

                  {renderField(
                    "Location Changes",
                    "locationChanges",
                    "number",
                    "e.g. 1",
                    { min: "0" }
                  )}

                </div>
              </div>

              <div className="section-actions">
                <button
                  className="secondary-btn"
                  onClick={() => setActiveSection("identity")}
                >
                  ← Back
                </button>

                <button
                  className="next-btn"
                  onClick={() => setActiveSection("communication")}
                >
                  Continue to Communication →
                </button>
              </div>
            </section>
          )}

          {/* =========================
             COMMUNICATION
          ========================= */}

          {activeSection === "communication" && (
            <section className="analysis-page">
              <div className="page-intro">
                <span className="eyebrow">MODULE 04</span>

                <h2>Communication Behaviour</h2>

                <p>
                  Analyze messaging volume and suspicious link activity.
                </p>
              </div>

              <div className="analysis-card">
                <div className="card-header">
                  <div>
                    <h3>Communication Signals</h3>

                    <p>
                      Enter messaging and suspicious-link activity
                      associated with the account.
                    </p>
                  </div>

                  <div className="module-badge">
                    COMMUNICATION
                  </div>
                </div>

                <div className="form-grid">

                  {renderField(
                    "Messages / Day",
                    "messagesPerDay",
                    "number",
                    "e.g. 20",
                    { min: "0" }
                  )}

                  {renderField(
                    "Suspicious Links",
                    "suspiciousLinks",
                    "number",
                    "e.g. 1",
                    { min: "0" }
                  )}

                </div>
              </div>

              <div className="section-actions">
                <button
                  className="secondary-btn"
                  onClick={() => setActiveSection("login")}
                >
                  ← Back
                </button>

                <button
                  className="next-btn"
                  onClick={() => setActiveSection("transactions")}
                >
                  Continue to Transactions →
                </button>
              </div>
            </section>
          )}

          {/* =========================
             TRANSACTIONS
          ========================= */}

          {activeSection === "transactions" && (
            <section className="analysis-page">
              <div className="page-intro">
                <span className="eyebrow">MODULE 05</span>

                <h2>Transaction Behaviour</h2>

                <p>
                  Review transaction activity associated with the account.
                </p>
              </div>

              <div className="analysis-card">
                <div className="card-header">
                  <div>
                    <h3>Transaction Signals</h3>

                    <p>
                      Provide transaction activity for the account.
                    </p>
                  </div>

                  <div className="module-badge">
                    TRANSACTIONS
                  </div>
                </div>

                <div className="form-grid">

                  {renderField(
                    "Transaction Count",
                    "transactionCount",
                    "number",
                    "e.g. 3",
                    { min: "0" }
                  )}

                  {renderField(
                    "Transaction Amount (₹)",
                    "transactionAmount",
                    "number",
                    "e.g. 2500",
                    { min: "0", step: "0.01" }
                  )}

                </div>
              </div>

              <div className="section-actions">
                <button
                  className="secondary-btn"
                  onClick={() => setActiveSection("communication")}
                >
                  ← Back
                </button>

                <button
                  className="analyze-btn"
                  onClick={analyzeAccount}
                  disabled={loading}
                >
                  {loading
                    ? "Analyzing Account..."
                    : "Analyze Account →"}
                </button>
              </div>

              {error && (
                <div className="error-box">
                  <strong>Prediction Error</strong>

                  <p>{error}</p>
                </div>
              )}
            </section>
          )}

          {/* =========================
             RESULT
          ========================= */}

          {activeSection === "result" && renderResult()}

        </main>
      </div>
    </div>
  );
}

export default App;