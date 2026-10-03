import numpy as np
import pandas as pd

# Reproducible results
np.random.seed(42)

# Number of synthetic accounts
N = 5000

# -----------------------------
# Basic Profile Features
# -----------------------------

account_age_days = np.random.randint(30, 2500, N)
followers_count = np.random.randint(10, 10000, N)
following_count = np.random.randint(10, 5000, N)
profile_completeness = np.random.randint(30, 101, N)

# Higher value = username looks more similar to another account
username_similarity = np.round(np.random.uniform(0, 1, N), 2)

# ------------------------------
# Login & Device Behaviour
# ------------------------------

login_frequency = np.random.poisson(5, N)
new_device_logins = np.random.poisson(1, N)
unique_devices = np.random.randint(1, 6, N)
ip_changes = np.random.poisson(2, N)
location_changes = np.random.poisson(1, N)

# -----------------------------
# Messaging Behaviour
# -----------------------------

messages_per_day = np.random.poisson(20, N)
suspicious_links = np.random.poisson(1, N)

# -----------------------------
# Transaction Behaviour
# -----------------------------

transaction_count = np.random.poisson(3, N)
transaction_amount = np.round(
    np.random.exponential(2000, N), 2
)

# -----------------------------
# Create initial DataFrame
# -----------------------------

df = pd.DataFrame({
    "account_age_days": account_age_days,
    "followers_count": followers_count,
    "following_count": following_count,
    "profile_completeness": profile_completeness,
    "username_similarity": username_similarity,
    "login_frequency": login_frequency,
    "new_device_logins": new_device_logins,
    "unique_devices": unique_devices,
    "ip_changes": ip_changes,
    "location_changes": location_changes,
    "messages_per_day": messages_per_day,
    "suspicious_links": suspicious_links,
    "transaction_count": transaction_count,
    "transaction_amount": transaction_amount
})

# -----------------------------
# Generate fraud risk score
# -----------------------------

risk_score = (
    (username_similarity > 0.80) * 3
    + (new_device_logins >= 3) * 2
    + (unique_devices >= 4) * 2
    + (ip_changes >= 5) * 2
    + (location_changes >= 4) * 2
    + (suspicious_links >= 3) * 2
    + (transaction_amount > 5000) * 2
    + (transaction_count >= 8) * 1
    + (profile_completeness < 50) * 1
)

# Add small random noise
risk_score += np.random.randint(0, 3, N)

# -----------------------------
# Target variable
# -----------------------------

df["is_fraud"] = (risk_score >= 6).astype(int)

# -----------------------------
# Save dataset
# -----------------------------

output_path = "data/clone_fraud_dataset.csv"

df.to_csv(output_path, index=False)

print("Dataset generated successfully!")
print(f"Total accounts: {len(df)}")
print(f"Fraudulent accounts: {df['is_fraud'].sum()}")
print(f"Genuine accounts: {(df['is_fraud'] == 0).sum()}")
print(f"Saved to: {output_path}")
