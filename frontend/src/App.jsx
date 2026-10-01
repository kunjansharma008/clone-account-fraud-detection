import { useState } from "react";
import "./App.css";

const initialForm = {
  username: "",
  platform: "Instagram",
  followers: "",
  following: "",
  accountAge: "",
  usernameSimilarity: "",
  newDeviceLogins: "",
  uniqueDevices: "",
  ipChanges: "",
  locationChanges: "",
  suspiciousLinks: "",
  transactionAmount: "",
};

const demoProfiles = {
  normal: {
    username: "@normal_user",
    platform: "Instagram",
    followers: "1850",
    following: "620",
    accountAge: "36",
    usernameSimilarity: "5",
    newDeviceLogins: "0",
    uniqueDevices: "1",
    ipChanges: "0",
    locationChanges: "0",
    suspiciousLinks: "0",
    transactionAmount: "500",
  },

  suspicious: {
    username: "@kunjan_support",
    platform: "Instagram",
    followers: "420",
    following: "980",
    accountAge: "8",
    usernameSimilarity: "62",
    newDeviceLogins: "3",
    uniqueDevices: "3",
    ipChanges: "2",
    locationChanges: "1",
    suspiciousLinks: "1",
    transactionAmount: "3500",
  },

  highRisk: {
    username: "@kunjan_official_support",
    platform: "Instagram",
    followers: "95",
    following: "1450",
    accountAge: "2",
    usernameSimilarity: "91",
    newDeviceLogins: "7",
    uniqueDevices: "6",
    ipChanges: "5",
    locationChanges: "4",
    suspiciousLinks: "4",
    transactionAmount: "25000",
  },
};

const menuItems = [
  { id: "overview", icon: "⌂", label: "Overview" },
  { id: "analysis", icon: "◉", label: "Quick Analysis" },
];

const moduleInfo = {
  clone: {
    id: "clone",
    icon: "🧬",
    title: "Clone Signals",
    description:
      "Identity and impersonation indicators used to detect potential cloned accounts.",
    signals: [["Username Similarity", "username_similarity"]],
  },

  login: {
    id: "login",
    icon: "🔐",
    title: "Login & Device",
    description:
      "Device, IP and access behaviour associated with the account.",
    signals: [
      ["New Device Logins", "new_device_logins"],
      ["Unique Devices", "unique_devices"],
      ["IP Changes", "ip_changes"],
      ["Location Changes", "location_changes"],
    ],
  },

  communication: {
    id: "communication",
    icon: "💬",
    title: "Communication",
    description:
      "Messaging activity and suspicious-link behaviour.",
    signals: [["Suspicious Links", "suspicious_links"]],
  },

  transactions: {
    id: "transactions",
    icon: "💳",
    title: "Transactions",
    description:
      "Transaction activity and financial behaviour.",
    signals: [["Transaction Amount", "transaction_amount"]],
  },
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");

  const [formData, setFormData] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openFormCard, setOpenFormCard] = useState(null);
  const [completedCards, setCompletedCards] = useState({});

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  /* LOGIN */

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setActiveSection("overview");
  };

  /* FORM */

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* DEMO PROFILE */

  const loadDemoProfile = (profileName) => {
    setFormData({
      ...demoProfiles[profileName],
    });

    setError("");
    setResult(null);
    setOpenFormCard(null);
    setCompletedCards({
      account: true,
      clone: true,
      login: true,
      communication: true,
      transactions: true,
    });
    setActiveSection("analysis");
  };

  /* STEP-BY-STEP ANALYSIS CARDS */

  const analysisCards = [
    {
      id: "account",
      icon: "👤",
      title: "Account Information",
      description: "Username, platform and basic profile details.",
      fields: ["username", "platform", "accountAge", "followers", "following"],
    },
    {
      id: "clone",
      icon: "🧬",
      title: "Clone Signals",
      description: "Identity and impersonation indicators.",
      fields: ["usernameSimilarity"],
    },
    {
      id: "login",
      icon: "🔐",
      title: "Login & Device",
      description: "Device, IP and location behaviour.",
      fields: [
        "newDeviceLogins",
        "uniqueDevices",
        "ipChanges",
        "locationChanges",
      ],
    },
    {
      id: "communication",
      icon: "💬",
      title: "Communication",
      description: "Messaging and suspicious-link behaviour.",
      fields: ["suspiciousLinks"],
    },
    {
      id: "transactions",
      icon: "💳",
      title: "Transactions",
      description: "Transaction activity and amount signals.",
      fields: ["transactionAmount"],
    },
  ];

  const markCardComplete = (cardId) => {
    setCompletedCards((current) => ({
      ...current,
      [cardId]: true,
    }));
  };

  const openAnalysisCard = (cardId) => {
    setOpenFormCard(cardId);
    setError("");
  };

  const closeAnalysisCard = () => {
    setOpenFormCard(null);
    setError("");
  };

  const renderAnalysisField = (field) => {
    const labels = {
      username: "Username",
      platform: "Platform",
      accountAge: "Account Age (months)",
      followers: "Followers",
      following: "Following",
      usernameSimilarity: "Username Similarity (%)",
      newDeviceLogins: "New Device Logins",
      uniqueDevices: "Unique Devices",
      ipChanges: "IP Changes",
      locationChanges: "Location Changes",
      suspiciousLinks: "Suspicious Links",
      transactionAmount: "Transaction Amount",
    };

    const placeholders = {
      username: "@username",
      accountAge: "e.g. 18",
      followers: "e.g. 1240",
      following: "e.g. 830",
      usernameSimilarity: "e.g. 75",
      newDeviceLogins: "e.g. 2",
      uniqueDevices: "e.g. 3",
      ipChanges: "e.g. 2",
      locationChanges: "e.g. 1",
      suspiciousLinks: "e.g. 1",
      transactionAmount: "e.g. 5000",
    };

    if (field === "platform") {
      return (
        <div className="input-group" key={field}>
          <label>{labels[field]}</label>
          <select
            name={field}
            value={formData[field]}
            onChange={handleChange}
          >
            <option>Instagram</option>
            <option>Facebook</option>
            <option>X / Twitter</option>
            <option>Telegram</option>
            <option>Other</option>
          </select>
        </div>
      );
    }

    return (
      <div className="input-group" key={field}>
        <label>{labels[field]}</label>
        <input
          type={field === "username" ? "text" : "number"}
          name={field}
          placeholder={placeholders[field]}
          min={field === "uniqueDevices" ? "1" : "0"}
          max={field === "usernameSimilarity" ? "100" : undefined}
          value={formData[field]}
          onChange={handleChange}
          required={["username", "accountAge", "followers", "following"].includes(field)}
        />
      </div>
    );
  };

  const renderAnalysisCardForm = () => {
    if (!openFormCard) return null;

    const card = analysisCards.find((item) => item.id === openFormCard);
    if (!card) return null;

    const isAccount = card.id === "account";

    return (
      <div className="analysis-card step-form-card">
        <div className="card-header">
          <div>
            <h3>
              {card.icon} {card.title}
            </h3>
            <p>{card.description}</p>
          </div>
          <div className="module-badge">
            {isAccount ? "BASIC PROFILE" : "OPTIONAL SIGNALS"}
          </div>
        </div>

        <div className="form-grid">
          {card.fields.map((field) => renderAnalysisField(field))}
        </div>

        <div className="section-actions step-form-actions">
          <button
            type="button"
            className="secondary-btn"
            onClick={closeAnalysisCard}
          >
            Cancel
          </button>

          <button
            type="button"
            className="analyze-btn"
            onClick={() => {
              markCardComplete(card.id);
              closeAnalysisCard();
            }}
          >
            Save Details ✓
          </button>
        </div>
      </div>
    );
  };

  /* ANALYSE ACCOUNT */

  const analyzeAccount = async (e) => {
    e.preventDefault();

    setLoading(true);
    setResult(null);
    setError("");

    try {
      const requestData = {
        username: formData.username,
        platform: formData.platform,

        accountAge: Number(formData.accountAge),
        followers: Number(formData.followers),
        following: Number(formData.following),

        usernameSimilarity: Number(
          formData.usernameSimilarity || 0
        ),

        newDeviceLogins: Number(
          formData.newDeviceLogins || 0
        ),

        uniqueDevices: Number(
          formData.uniqueDevices || 1
        ),

        ipChanges: Number(formData.ipChanges || 0),

        locationChanges: Number(
          formData.locationChanges || 0
        ),

        suspiciousLinks: Number(
          formData.suspiciousLinks || 0
        ),

        transactionAmount: Number(
          formData.transactionAmount || 0
        ),
      };

      const response = await fetch(
        "http://127.0.0.1:5000/predict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(
          data.error || "Prediction failed"
        );
      }

      data.analysis_time = new Date().toLocaleString(
        "en-IN",
        {
          dateStyle: "medium",
          timeStyle: "short",
        }
      );

      setResult(data);
      setActiveSection("result");
    } catch (err) {
      setError(
        err.message ||
          "Unable to connect to the prediction API."
      );
    } finally {
      setLoading(false);
    }
  };

  /* RISK HELPERS */

  const getRiskClass = (risk) => {
    return risk ? risk.toLowerCase() : "";
  };

  const getRiskExplanation = () => {
    if (!result?.signals) return [];

    const signals = result.signals;
    const explanation = [];

    if (Number(signals.username_similarity || 0) > 0) {
      explanation.push({
        label: "Username Similarity",
        value: `${signals.username_similarity}%`,
        type: "clone",
      });
    }

    if (Number(signals.new_device_logins || 0) > 0) {
      explanation.push({
        label: "New Device Logins",
        value: signals.new_device_logins,
        type: "login",
      });
    }

    if (Number(signals.unique_devices || 0) > 1) {
      explanation.push({
        label: "Unique Devices",
        value: signals.unique_devices,
        type: "login",
      });
    }

    if (Number(signals.ip_changes || 0) > 0) {
      explanation.push({
        label: "IP Changes",
        value: signals.ip_changes,
        type: "login",
      });
    }

    if (Number(signals.location_changes || 0) > 0) {
      explanation.push({
        label: "Location Changes",
        value: signals.location_changes,
        type: "login",
      });
    }

    if (Number(signals.suspicious_links || 0) > 0) {
      explanation.push({
        label: "Suspicious Links",
        value: signals.suspicious_links,
        type: "communication",
      });
    }

    if (Number(signals.transaction_amount || 0) > 0) {
      explanation.push({
        label: "Transaction Amount",
        value: `₹${Number(
          signals.transaction_amount
        ).toLocaleString("en-IN")}`,
        type: "transactions",
      });
    }

    return explanation;
  };

  const getPrimaryRiskArea = () => {
    if (!result?.modules) return null;

    const modules = Object.entries(result.modules);

    if (!modules.length) return null;

    const [moduleId, moduleData] = modules.reduce(
      (highest, current) => {
        return Number(current[1]?.score || 0) >
          Number(highest[1]?.score || 0)
          ? current
          : highest;
      }
    );

    return {
      id: moduleId,
      title: moduleInfo[moduleId]?.title || moduleId,
      icon: moduleInfo[moduleId]?.icon || "⚠️",
      score: Number(moduleData?.score || 0),
      risk: moduleData?.risk || "LOW",
    };
  };

  const openModule = (moduleId) => {
    setActiveSection(moduleId);
  };

  const getRiskDescription = (risk) => {
    if (risk === "HIGH") {
      return "Elevated signals detected";
    }

    if (risk === "MEDIUM") {
      return "Some suspicious signals";
    }

    return "No major elevated signals";
  };

  /* MODULE RESULT CARD */

  const renderModuleCard = (
    icon,
    title,
    module,
    description
  ) => {
    if (!result?.modules?.[module]) return null;

    const data = result.modules[module];
    const score = Number(data.score || 0);

    return (
      <div
        className="module-result-card polished-module-card"
        onClick={() => openModule(module)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openModule(module);
          }
        }}
      >
        <div className="module-result-top">
          <div className="module-result-icon">
            {icon}
          </div>

          <div className="module-title-area">
            <h3>{title}</h3>
            <p>{description}</p>
          </div>

          <span
            className={`risk-pill ${getRiskClass(
              data.risk
            )}`}
          >
            {data.risk}
          </span>
        </div>

        <div className="module-score-row">
          <div>
            <span className="score-caption">
              Risk Score
            </span>

            <strong className="module-big-score">
              {score}%
            </strong>
          </div>

          <span className="module-arrow">
            →
          </span>
        </div>

        <div className="module-meter">
          <div
            className={`module-meter-progress ${getRiskClass(
              data.risk
            )}`}
            style={{
              width: `${Math.min(score, 100)}%`,
            }}
          />
        </div>

        <div className="module-card-footer">
          <span>
            {getRiskDescription(data.risk)}
          </span>

          <span>
            View details →
          </span>
        </div>
      </div>
    );
  };

  /* DASHBOARD MODULE CARDS */

  const renderDashboardModuleCards = () => {
    const modules = [
      {
        id: "clone",
        number: "01",
        icon: "🧬",
        title: "Clone Signals",
        description: "Identity & impersonation",
      },
      {
        id: "login",
        number: "02",
        icon: "🔐",
        title: "Login & Device",
        description: "Access behaviour",
      },
      {
        id: "communication",
        number: "03",
        icon: "💬",
        title: "Communication",
        description: "Messaging behaviour",
      },
      {
        id: "transactions",
        number: "04",
        icon: "💳",
        title: "Transactions",
        description: "Financial behaviour",
      },
    ];

    return (
      <section className="signal-overview">
        <div className="section-heading">
          <div className="section-number">
            01
          </div>

          <div>
            <h3>Risk Analysis Modules</h3>

            <p>
              The system evaluates multiple categories
              of account behaviour.
            </p>
          </div>
        </div>

        <div className="module-grid">
          {modules.map((module) => (
            <div
              className="module-card"
              key={module.id}
              role="button"
              tabIndex={0}
              onClick={() =>
                openModule(module.id)
              }
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" ||
                  e.key === " "
                ) {
                  e.preventDefault();
                  openModule(module.id);
                }
              }}
            >
              <span className="module-number">
                {module.number}
              </span>

              <span className="module-icon">
                {module.icon}
              </span>

              <strong>{module.title}</strong>

              <small>{module.description}</small>

              <span className="module-open">
                Open module →
              </span>
            </div>
          ))}
        </div>
      </section>
    );
  };

  /* MODULE PAGE */

  const renderModulePage = (moduleId) => {
    const module = moduleInfo[moduleId];

    if (!module) return null;

    const moduleResult =
      result?.modules?.[moduleId];

    return (
      <section className="analysis-page">
        <div className="page-intro">
          <span className="eyebrow">
            RISK ANALYSIS MODULE
          </span>

          <h2>
            {module.icon} {module.title}
          </h2>

          <p>{module.description}</p>
        </div>

        {!result ? (
          <div className="overview-card">
            <div>
              <span className="eyebrow">
                ANALYSIS REQUIRED
              </span>

              <h3>
                No account analysis available
              </h3>

              <p>
                Run an account analysis first to
                generate signals for this module.
              </p>
            </div>

            <button
              className="primary-action"
              onClick={() =>
                setActiveSection("analysis")
              }
            >
              Start Analysis →
            </button>
          </div>
        ) : (
          <>
            <div className="result-card">
              <div className="result-header">
                <div>
                  <span className="eyebrow">
                    MODULE RESULT
                  </span>

                  <h2>{module.title}</h2>

                  <p>
                    Analysis for{" "}
                    <strong>
                      {formData.username}
                    </strong>
                  </p>
                </div>

                <div className="result-status">
                  ✓ Analysed
                </div>
              </div>

              <div className="result-layout">
                <div className="score-panel">
                  <div
                    className={`score-circle risk-ring-${getRiskClass(
                      moduleResult?.risk
                    )}`}
                  >
                    <div>
                      <strong>
                        {moduleResult?.score ?? 0}%
                      </strong>

                      <span>
                        Module Risk
                      </span>
                    </div>
                  </div>

                  <h3>{module.title}</h3>

                  <p>
                    Module-specific risk score based
                    on the signals available to the
                    current MVP.
                  </p>
                </div>

                <div className="result-details">
                  <div className="result-box">
                    <span>Risk Level</span>

                    <strong
                      className={`risk ${getRiskClass(
                        moduleResult?.risk
                      )}`}
                    >
                      {moduleResult?.risk}
                    </strong>
                  </div>

                  <div className="risk-meter">
                    <div className="meter-heading">
                      <span>Module Risk</span>

                      <strong>
                        {moduleResult?.score ?? 0}%
                      </strong>
                    </div>

                    <div className="meter">
                      <div
                        className={`meter-progress ${getRiskClass(
                          moduleResult?.risk
                        )}`}
                        style={{
                          width: `${
                            moduleResult?.score ?? 0
                          }%`,
                        }}
                      />
                    </div>

                    <div className="meter-labels">
                      <span>Low</span>
                      <span>Medium</span>
                      <span>High</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="overview-card">
              <div>
                <span className="eyebrow">
                  BEHAVIOURAL SIGNALS
                </span>

                <h3>Signals Used</h3>

                <p>
                  These are the signals returned by the
                  current fraud-detection prototype.
                </p>
              </div>
            </div>

            <div className="module-result-grid">
              {module.signals.map(
                ([label, key]) => (
                  <div
                    className="module-result-card signal-detail-card"
                    key={key}
                  >
                    <div className="module-result-top">
                      <div className="module-result-icon">
                        {module.icon}
                      </div>

                      <div>
                        <h3>{label}</h3>

                        <p>
                          User-provided signal
                        </p>
                      </div>
                    </div>

                    <div className="module-result-score">
                      <strong>
                        {key === "transaction_amount"
                          ? `₹${Number(
                              result.signals?.[
                                key
                              ] || 0
                            ).toLocaleString("en-IN")}`
                          : result.signals?.[key] ??
                            "Not available"}
                      </strong>
                    </div>
                  </div>
                )
              )}
            </div>

            <button
              className="primary-action"
              onClick={() =>
                setActiveSection("result")
              }
            >
              ← Back to Risk Assessment
            </button>
          </>
        )}
      </section>
    );
  };

  /* RESULT PAGE */

  const renderResult = () => {
    if (!result) return null;

    const explanationSignals =
      getRiskExplanation();

    const primaryRisk =
      getPrimaryRiskArea();

    const fraudProbability = Number(
      result.fraud_probability || 0
    );

    const moduleEntries = result.modules
      ? Object.entries(result.modules)
      : [];

    return (
      <section className="result-card result-card-polished">
        <div className="result-header">
          <div>
            <span className="eyebrow">
              ANALYSIS COMPLETE
            </span>

            <h2>Account Risk Assessment</h2>

            <p>
              Analysis result for{" "}
              <strong>
                {formData.username}
              </strong>
            </p>

            {result.analysis_time && (
              <div className="analysis-timestamp">
                🕒 {result.analysis_time}
              </div>
            )}
          </div>

          <div className="result-status">
            ✓ Analysis Complete
          </div>
        </div>

        <div className="account-summary-card">
          <div className="summary-heading">
            <div>
              <span className="eyebrow">
                ACCOUNT SUMMARY
              </span>

              <h3>Analyzed Account</h3>
            </div>

            <span className="summary-platform">
              {formData.platform}
            </span>
          </div>

          <div className="account-summary-grid">
            <div className="summary-item">
              <span>Username</span>
              <strong>
                {formData.username || "—"}
              </strong>
            </div>

            <div className="summary-item">
              <span>Platform</span>
              <strong>
                {formData.platform || "—"}
              </strong>
            </div>

            <div className="summary-item">
              <span>Followers</span>
              <strong>
                {Number(
                  formData.followers || 0
                ).toLocaleString("en-IN")}
              </strong>
            </div>

            <div className="summary-item">
              <span>Following</span>
              <strong>
                {Number(
                  formData.following || 0
                ).toLocaleString("en-IN")}
              </strong>
            </div>

            <div className="summary-item">
              <span>Account Age</span>
              <strong>
                {formData.accountAge || 0} months
              </strong>
            </div>

            <div className="summary-item">
              <span>Profile Completeness</span>
              <strong>80%</strong>
            </div>
          </div>
        </div>

        <div className="result-layout">
          <div className="score-panel">
            <div
              className={`score-circle risk-ring-${getRiskClass(
                result.risk_level
              )}`}
            >
              <div>
                <strong>
                  {fraudProbability}%
                </strong>

                <span>Risk Score</span>
              </div>
            </div>

            <h3>Overall Fraud Probability</h3>

            <p>
              Estimated using the trained machine
              learning model.
            </p>
          </div>

          <div className="result-details">
            <div className="result-box result-box-highlight">
              <div>
                <span>Prediction</span>

                <small>
                  Model classification
                </small>
              </div>

              <strong
                className={`prediction ${String(
                  result.prediction || ""
                ).toLowerCase()}`}
              >
                {result.prediction === "GENUINE"
                  ? "✓"
                  : "⚠"}{" "}
                {result.prediction}
              </strong>
            </div>

            <div className="result-box result-box-highlight">
              <div>
                <span>Overall Risk Level</span>

                <small>
                  Current assessment
                </small>
              </div>

              <strong
                className={`risk ${getRiskClass(
                  result.risk_level
                )}`}
              >
                {result.risk_level}
              </strong>
            </div>

            <div className="risk-meter">
              <div className="meter-heading">
                <span>Overall Fraud Risk</span>

                <strong>
                  {fraudProbability}%
                </strong>
              </div>

              <div className="meter meter-large">
                <div
                  className={`meter-progress ${getRiskClass(
                    result.risk_level
                  )}`}
                  style={{
                    width: `${Math.min(
                      fraudProbability,
                      100
                    )}%`,
                  }}
                />
              </div>

              <div className="meter-labels">
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
              </div>
            </div>
          </div>
        </div>

        <div className="quick-metrics">
          <div className="quick-metric">
            <span className="metric-icon">
              🧬
            </span>

            <div>
              <span>Primary Risk</span>

              <strong>
                {primaryRisk?.title || "—"}
              </strong>
            </div>
          </div>

          <div className="quick-metric">
            <span className="metric-icon">
              📊
            </span>

            <div>
              <span>Signals Detected</span>

              <strong>
                {explanationSignals.length}
              </strong>
            </div>
          </div>

          <div className="quick-metric">
            <span className="metric-icon">
              🧩
            </span>

            <div>
              <span>Modules Analyzed</span>

              <strong>
                {moduleEntries.length}
              </strong>
            </div>
          </div>

          <div className="quick-metric">
            <span className="metric-icon">
              ⚡
            </span>

            <div>
              <span>Analysis Type</span>

              <strong>ML Scan</strong>
            </div>
          </div>
        </div>

        <div className="risk-charts-section">
          <div className="section-heading">
            <div className="section-number">04</div>

            <div>
              <h3>Risk Signal Overview</h3>
              <p>
                Visual breakdown of the module scores returned by the model.
              </p>
            </div>
          </div>

          <div className="risk-charts-grid">
            <div className="chart-card risk-donut-card">
              <div className="chart-card-header">
                <div>
                  <span className="eyebrow">OVERALL RISK</span>
                  <h3>Fraud Probability</h3>
                </div>
                <span className="chart-icon">◔</span>
              </div>

              <div
                className="risk-donut"
                style={{
                  background: `conic-gradient(#101828 ${Math.min(
                    fraudProbability,
                    100
                  )}%, #eaecf0 0)`,
                }}
              >
                <div className="risk-donut-inner">
                  <strong>{fraudProbability}%</strong>
                  <span>Risk</span>
                </div>
              </div>
            </div>

            <div className="chart-card module-chart-card">
              <div className="chart-card-header">
                <div>
                  <span className="eyebrow">MODULE BREAKDOWN</span>
                  <h3>Risk by Category</h3>
                </div>
                <span className="chart-icon">▥</span>
              </div>

              <div className="module-chart-list">
                {moduleEntries.map(([moduleId, moduleData]) => {
                  const score = Math.min(
                    Number(moduleData?.score || 0),
                    100
                  );

                  return (
                    <div className="module-chart-row" key={moduleId}>
                      <div className="module-chart-label">
                        <span>
                          {moduleInfo[moduleId]?.icon || "•"}{" "}
                          {moduleInfo[moduleId]?.title || moduleId}
                        </span>
                        <strong>{score}%</strong>
                      </div>

                      <div className="module-chart-track">
                        <div
                          className={`module-chart-fill ${getRiskClass(
                            moduleData?.risk
                          )}`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
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
                ? "The analysed signals indicate a higher level of potential fraud risk. Further verification is recommended."
                : result.risk_level === "MEDIUM"
                ? "Some potentially suspicious characteristics were identified. Additional verification may be useful."
                : "The analysed signals indicate a relatively low fraud probability according to the current model."}
            </p>
          </div>
        </div>

        <div className="risk-explanation">
          <div className="section-heading">
            <div className="section-number">
              02
            </div>

            <div>
              <h3>
                Why Was This Account Flagged?
              </h3>

              <p>
                Key signals observed during the
                current account analysis.
              </p>
            </div>
          </div>

          <div className="explanation-grid">
            <div className="explanation-card">
              <div className="explanation-card-header">
                <div>
                  <span className="eyebrow">
                    OBSERVED SIGNALS
                  </span>

                  <h3>Risk Indicators</h3>
                </div>

                <span className="explanation-icon">
                  🔎
                </span>
              </div>

              {explanationSignals.length > 0 ? (
                <div className="signal-list">
                  {explanationSignals.map(
                    (signal, index) => (
                      <div
                        className="signal-row"
                        key={`${signal.label}-${index}`}
                      >
                        <div className="signal-row-left">
                          <span className="signal-dot"></span>

                          <span>
                            {signal.label}
                          </span>
                        </div>

                        <strong>
                          {signal.value}
                        </strong>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="no-signals">
                  <span>✓</span>

                  <p>
                    No elevated behavioural signals
                    were entered for this analysis.
                  </p>
                </div>
              )}
            </div>

            <div className="explanation-card primary-risk-card">
              <span className="eyebrow">
                PRIMARY RISK AREA
              </span>

              {primaryRisk ? (
                <>
                  <div className="primary-risk-top">
                    <div className="primary-risk-icon">
                      {primaryRisk.icon}
                    </div>

                    <div>
                      <h3>
                        {primaryRisk.title}
                      </h3>

                      <span
                        className={`risk ${getRiskClass(
                          primaryRisk.risk
                        )}`}
                      >
                        {primaryRisk.risk} RISK
                      </span>
                    </div>
                  </div>

                  <div className="primary-risk-score">
                    <strong>
                      {primaryRisk.score}%
                    </strong>

                    <span>
                      Module Risk Score
                    </span>
                  </div>

                  <div className="meter">
                    <div
                      className={`meter-progress ${getRiskClass(
                        primaryRisk.risk
                      )}`}
                      style={{
                        width: `${Math.min(
                          primaryRisk.score,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </>
              ) : (
                <p>
                  Module risk information is not
                  available.
                </p>
              )}
            </div>
          </div>

          <div className="explanation-note">
            <span>ⓘ</span>

            <p>
              These indicators represent signals
              observed by the current prototype.
              They should be treated as risk indicators
              rather than proof of fraudulent activity.
            </p>
          </div>
        </div>

        <div className="individual-results">
          <div className="section-heading">
            <div className="section-number">
              03
            </div>

            <div>
              <h3>Individual Risk Analysis</h3>

              <p>
                Click any module to view its detailed
                signals and risk assessment.
              </p>
            </div>
          </div>

          <div className="module-result-grid">
            {renderModuleCard(
              "🧬",
              "Clone Signals",
              "clone",
              "Identity and impersonation indicators."
            )}

            {renderModuleCard(
              "🔐",
              "Login & Device",
              "login",
              "Device, IP and access behaviour."
            )}

            {renderModuleCard(
              "💬",
              "Communication",
              "communication",
              "Messaging and suspicious-link activity."
            )}

            {renderModuleCard(
              "💳",
              "Transactions",
              "transactions",
              "Transaction activity and amount signals."
            )}
          </div>
        </div>

        <div className="result-actions">
          <button
            className="primary-action"
            onClick={() => {
              setResult(null);
              setOpenFormCard(null);
              setCompletedCards({});
              setActiveSection("analysis");
            }}
          >
            Analyze Another Account →
          </button>

          <button
            className="secondary-btn"
            onClick={() =>
              setActiveSection("overview")
            }
          >
            Back to Dashboard
          </button>
        </div>
      </section>
    );
  };

  /* LOGIN SCREEN */

  if (!isLoggedIn) {
    return (
      <div className="login-page">
        <div className="login-card">
          <div className="login-logo">
            🛡️
          </div>

          <p className="login-tag">
            AI-POWERED SECURITY
          </p>

          <h1>
            Clone Account &<br />
            Fraud Detection
          </h1>

          <p className="login-description">
            Secure access to your account risk analysis
            dashboard.
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

            <button
              type="submit"
              className="login-btn"
            >
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

  /* DASHBOARD */

  return (
    <div className="dashboard-app">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">
            🛡️
          </div>

          <div>
            <strong>CloneGuard</strong>
            <span>Security Console</span>
          </div>
        </div>

        <div className="sidebar-divider"></div>

        <nav className="sidebar-nav">
          <p className="nav-label">
            ANALYSIS
          </p>

          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${
                activeSection === item.id
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setActiveSection(item.id)
              }
            >
              <span className="nav-icon">
                {item.icon}
              </span>

              <span>{item.label}</span>
            </button>
          ))}

          {result && (
            <>
              <p className="nav-label result-nav-label">
                RESULT
              </p>

              <button
                className={`nav-item ${
                  activeSection === "result"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setActiveSection("result")
                }
              >
                <span className="nav-icon">
                  ✓
                </span>

                <span>Risk Assessment</span>
              </button>

              <p className="nav-label result-nav-label">
                MODULES
              </p>

              {Object.values(moduleInfo).map(
                (module) => (
                  <button
                    key={module.id}
                    className={`nav-item ${
                      activeSection === module.id
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      openModule(module.id)
                    }
                  >
                    <span className="nav-icon">
                      {module.icon}
                    </span>

                    <span>
                      {module.title}
                    </span>
                  </button>
                )
              )}
            </>
          )}
        </nav>

        <div className="sidebar-bottom">
          <div className="model-status">
            <span className="online-dot"></span>

            <div>
              <strong>
                ML Model Online
              </strong>

              <small>API Connected</small>
            </div>
          </div>

          <button
            className="signout-btn"
            onClick={() => {
              setIsLoggedIn(false);
              setActiveSection("overview");
              setResult(null);
              setOpenFormCard(null);
              setCompletedCards({});
            }}
          >
            Sign Out
          </button>
        </div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div>
            <span className="topbar-label">
              SECURITY CONSOLE
            </span>

            <h1>
              {activeSection === "overview"
                ? "Overview"
                : activeSection === "analysis"
                ? "Quick Account Analysis"
                : activeSection === "result"
                ? "Risk Assessment"
                : moduleInfo[activeSection]
                ? moduleInfo[activeSection].title
                : "Security Console"}
            </h1>
          </div>

          <div className="user-area">
            <div className="user-avatar">
              {loginData.email
                ? loginData.email
                    .charAt(0)
                    .toUpperCase()
                : "U"}
            </div>

            <div>
              <strong>Security User</strong>
              <span>{loginData.email}</span>
            </div>
          </div>
        </header>

        <main className="content-area">

          {/* OVERVIEW */}

          {activeSection === "overview" && (
            <>
              <div className="welcome-section">
                <div>
                  <span className="eyebrow">
                    AI-POWERED SECURITY
                  </span>

                  <h2>
                    Account Risk Analysis Dashboard
                  </h2>

                  <p>
                    Analyse account behaviour and
                    identify potential clone and fraud
                    signals using machine learning.
                  </p>

                  <div className="welcome-badges">
                    <span>ML Detection</span>
                    <span>Multi-Signal</span>
                    <span>Risk Scoring</span>
                  </div>
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

                    <small>
                      Intelligent Analysis
                    </small>
                  </div>
                </div>

                <div className="overview-stat">
                  <span>🔐</span>

                  <div>
                    <strong>Multi-Signal</strong>

                    <small>
                      Behaviour Analysis
                    </small>
                  </div>
                </div>

                <div className="overview-stat">
                  <span>⚡</span>

                  <div>
                    <strong>Real-Time</strong>

                    <small>
                      Risk Assessment
                    </small>
                  </div>
                </div>
              </div>

              <section className="overview-card get-started-card">
                <div>
                  <span className="eyebrow">
                    GET STARTED
                  </span>

                  <h3>
                    Start a New Account Analysis
                  </h3>

                  <p>
                    Enter account details and behavioural
                    signals to generate a risk assessment.
                  </p>
                </div>

                <button
                  className="primary-action"
                  onClick={() =>
                    setActiveSection("analysis")
                  }
                >
                  Start Analysis
                  <span>→</span>
                </button>
              </section>

              {renderDashboardModuleCards()}
            </>
          )}

          {/* QUICK ANALYSIS */}

          {activeSection === "analysis" && (
            <section className="analysis-page">
              <div className="page-intro">
                <span className="eyebrow">QUICK ANALYSIS</span>

                <h2>Analyse an Account</h2>

                <p>
                  Add information step by step instead of filling one long
                  form. Open a card, enter the available details, save it,
                  and continue when ready.
                </p>
              </div>

              <div className="overview-card demo-profile-card">
                <div>
                  <span className="eyebrow">DEMO PROFILES</span>

                  <h3>Try a Sample Account</h3>

                  <p>
                    Load predefined profiles to test different fraud-risk
                    scenarios.
                  </p>
                </div>

                <div className="demo-profile-actions">
                  <button
                    type="button"
                    className="demo-btn normal-demo"
                    onClick={() => loadDemoProfile("normal")}
                  >
                    🟢 Normal
                  </button>

                  <button
                    type="button"
                    className="demo-btn suspicious-demo"
                    onClick={() => loadDemoProfile("suspicious")}
                  >
                    🟡 Suspicious
                  </button>

                  <button
                    type="button"
                    className="demo-btn high-demo"
                    onClick={() => loadDemoProfile("highRisk")}
                  >
                    🔴 High Risk
                  </button>
                </div>
              </div>

              <div className="analysis-progress-card">
                <div>
                  <span className="eyebrow">ANALYSIS SETUP</span>
                  <h3>Complete the details you have</h3>
                  <p>
                    Basic account information is required. Other signal
                    categories can be skipped if the information is not
                    available.
                  </p>
                </div>

                <div className="analysis-progress-value">
                  <strong>
                    {Object.values(completedCards).filter(Boolean).length}/5
                  </strong>
                  <span>sections</span>
                </div>
              </div>

              <div className="analysis-card-grid">
                {analysisCards.map((card, index) => {
                  const completed = Boolean(completedCards[card.id]);

                  return (
                    <button
                      type="button"
                      className={`analysis-choice-card ${
                        completed ? "completed" : ""
                      }`}
                      key={card.id}
                      onClick={() => openAnalysisCard(card.id)}
                    >
                      <div className="analysis-choice-top">
                        <span className="analysis-choice-number">
                          0{index + 1}
                        </span>

                        {completed && (
                          <span className="analysis-complete-badge">
                            ✓ Saved
                          </span>
                        )}
                      </div>

                      <span className="analysis-choice-icon">
                        {card.icon}
                      </span>

                      <strong>{card.title}</strong>

                      <small>{card.description}</small>

                      <span className="analysis-choice-open">
                        {completed ? "Edit details →" : "Add details →"}
                      </span>
                    </button>
                  );
                })}
              </div>

              {renderAnalysisCardForm()}

              <div className="analysis-submit-card">
                <div>
                  <span className="eyebrow">READY TO SCAN?</span>
                  <h3>Run the account risk analysis</h3>
                  <p>
                    The available information will be sent to the existing
                    machine-learning API for prediction.
                  </p>
                </div>

                <button
                  type="button"
                  className="analyze-btn"
                  disabled={
                    loading ||
                    !formData.username ||
                    !formData.accountAge ||
                    !formData.followers ||
                    !formData.following
                  }
                  onClick={analyzeAccount}
                >
                  {loading ? "Analysing Account..." : "Analyse Account →"}
                </button>
              </div>

              {error && (
                <div className="error-box">
                  <strong>Prediction Error</strong>
                  <p>{error}</p>
                </div>
              )}

              <div className="overview-card">
                <div>
                  <span className="eyebrow">HOW IT WORKS</span>

                  <h3>Multi-Signal Risk Analysis</h3>

                  <p>
                    Account information and available behavioural signals are
                    processed by the current machine-learning prototype to
                    produce an overall risk assessment and module-level
                    analysis.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* RESULT */}

          {activeSection === "result" &&
            renderResult()}

          {/* MODULES */}

          {activeSection === "clone" &&
            renderModulePage("clone")}

          {activeSection === "login" &&
            renderModulePage("login")}

          {activeSection === "communication" &&
            renderModulePage("communication")}

          {activeSection === "transactions" &&
            renderModulePage("transactions")}
        </main>
      </div>
    </div>
  );
}
 
export default App;