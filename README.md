# CloneGuard — Clone Account & Fraud Detection

CloneGuard is an AI/ML-powered web application designed to identify potentially cloned, impersonated, or fraudulent accounts using profile characteristics, login behavior, communication signals, and transaction-related activity.

The project combines a **Machine Learning model**, **Flask REST API**, and **React + Vite frontend** to provide an interactive account risk assessment.

---

## 🚀 Project Overview

CloneGuard analyzes multiple account-level signals and generates:

* Fraud / Genuine prediction
* Fraud probability
* Overall risk level
* Module-wise risk scores
* Individual suspicious signals
* Feature importance for model interpretability

The goal is to demonstrate how machine learning can support **early fraud screening and account verification workflows**.

> **Note:** CloneGuard is a portfolio/MVP project and is not intended to make real-world financial or identity decisions without additional verification.

---

## ✨ Features

### 🔍 Account Risk Detection

The system evaluates account information such as:

* Username similarity
* Account age
* Followers and following
* Profile completeness
* New device logins
* Unique devices
* IP changes
* Location changes
* Suspicious links
* Message activity
* Transaction activity

### 📊 Risk Assessment

The application provides:

* Fraud probability
* Overall risk level
* Clone risk
* Login risk
* Communication risk
* Transaction risk

### 🤖 Machine Learning

CloneGuard currently uses a **Random Forest Classifier** for fraud classification.

The model was evaluated on a held-out test set containing **1,000 previously unseen records**.

### 📈 Model Evaluation

| Metric    | Test Result |
| --------- | ----------: |
| Accuracy  |  **92.40%** |
| Precision |  **72.94%** |
| Recall    |  **80.52%** |
| F1-Score  |  **76.54%** |

### Confusion Matrix — Test Set

| Actual / Predicted | Genuine | Fraud |
| ------------------ | ------: | ----: |
| Genuine            |     800 |    46 |
| Fraud              |      30 |   124 |

The model correctly identified **124 of 154 fraudulent accounts** in the test set, while **30 fraudulent accounts were missed**.

---

## 🔎 Feature Importance

The model's feature-importance analysis showed the following major contributors:

| Feature              | Importance |
| -------------------- | ---------: |
| Username Similarity  |     30.71% |
| Unique Devices       |     13.05% |
| Transaction Amount   |     10.28% |
| Suspicious Links     |      8.52% |
| New Device Logins    |      6.07% |
| IP Changes           |      5.66% |
| Profile Completeness |      5.56% |

These values represent the Random Forest model's relative feature importance. They should **not** be interpreted as proof that an individual feature independently causes fraud.

---

## 🏗️ System Architecture

```text
User
  │
  ▼
React + Vite Frontend
  │
  │ POST /predict
  ▼
Flask REST API
  │
  ▼
Random Forest ML Model
  │
  ├── Fraud Probability
  ├── Prediction
  ├── Risk Level
  └── Module Risk Scores
  │
  ▼
Frontend Risk Dashboard
```

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* JavaScript
* CSS

### Backend

* Python
* Flask
* Flask-CORS
* Pandas
* Joblib

### Machine Learning

* Scikit-learn
* Random Forest Classifier

### Data & Analysis

* Pandas
* NumPy
* Matplotlib
* Jupyter Notebook

### Development

* Git
* GitHub
* VS Code

---

## 📁 Project Structure

```text
clone-account-fraud-detection/
│
├── backend/
│   └── app.py
│
├── data/
│   └── clone_fraud_dataset.csv
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── ml/
│       ├── App.jsx
│       ├── App.css
│       ├── index.css
│       └── main.jsx
│
├── models/
│   └── fraud_detection_model.pkl
│
├── notebooks/
│   ├── 01_eda.ipynb
│   └── 02_model_evaluation.ipynb
│
├── reports/
│
├── README.md
└── .gitignore
```

---

## 🔄 Application Workflow

```text
Enter Account Information
          ↓
Validate Input
          ↓
Send Data to Flask API
          ↓
Prepare ML Features
          ↓
Random Forest Prediction
          ↓
Calculate Fraud Probability
          ↓
Generate Risk Scores
          ↓
Display Risk Dashboard
```

---

## 📊 Dataset

The current dataset contains:

* **5,000 records**
* **14 input features**
* **1 target variable (`is_fraud`)**

Class distribution:

| Class   | Records | Percentage |
| ------- | ------: | ---------: |
| Genuine |   4,231 |     84.62% |
| Fraud   |     769 |     15.38% |

Because the dataset is imbalanced, evaluation does not rely on accuracy alone. Precision, recall, F1-score, and the confusion matrix are also considered.

---

## 🧪 Model Evaluation

The dataset was divided using an **80/20 stratified train-test split**:

```text
Training set → 4,000 records
Testing set  → 1,000 records
```

A fresh Random Forest model was trained using the training portion and evaluated on the unseen testing portion.

### Test Performance

```text
Accuracy  : 92.40%
Precision : 72.94%
Recall    : 80.52%
F1-Score  : 76.54%
```

### Important Evaluation Limitation

An earlier evaluation of the saved model on the complete 5,000-record dataset produced approximately **98.40% accuracy**. However, that evaluation used records that were also available during model development and therefore should **not** be treated as an unbiased estimate of real-world generalization.

For this reason, the **92.40% test accuracy** and corresponding test metrics above are reported as the more relevant evaluation results.

The current dataset is synthetic/portfolio-oriented and may not represent the complexity, distribution, or adversarial behavior of real-world fraudulent accounts. Therefore, these results should not be interpreted as production-level fraud-detection performance.

---

## ⚠️ Limitations

CloneGuard is currently an **MVP / portfolio project** and has several limitations:

* The current dataset is limited in size and scope.
* Dataset characteristics may not represent real-world social platforms.
* Some behavioral values are currently simplified or fixed in the API.
* The model has not been validated on real production account data.
* Fraud patterns can change over time.
* False positives and false negatives are possible.
* A machine learning prediction should not be treated as definitive proof of fraud.
* Real-world deployment would require additional privacy, security, fairness, monitoring, and compliance considerations.

---

## 🔮 Future Scope

Possible improvements include:

* Real-time behavioral analysis
* Graph-based account relationship detection
* NLP-based suspicious message analysis
* Image/profile similarity detection
* Device fingerprint analysis
* IP and geolocation anomaly detection
* Fake/spam report filtering
* Explainable AI for individual predictions
* Model monitoring and retraining
* Real-world fraud datasets
* Cloud deployment
* Authentication and role-based access
* Database integration
* Automated alerting system

---

## 🎯 Project Goal

The purpose of CloneGuard is to dem
