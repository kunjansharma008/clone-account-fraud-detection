from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import os

app = Flask(__name__)
CORS(app)


# ============================================================
# LOAD TRAINED ML MODEL
# ============================================================

MODEL_PATH = os.path.join(
    os.path.dirname(os.path.dirname(__file__)),
    "models",
    "fraud_detection_model.pkl"
)

try:
    model = joblib.load(MODEL_PATH)
    print("✅ Fraud detection model loaded successfully.")
except Exception as e:
    model = None
    print("❌ Error loading model:", e)


# ============================================================
# HELPER FUNCTIONS
# ============================================================

def get_risk_level(score):
    """
    Convert probability into LOW / MEDIUM / HIGH.
    Score is between 0 and 1.
    """

    if score >= 0.70:
        return "HIGH"

    elif score >= 0.40:
        return "MEDIUM"

    else:
        return "LOW"


def risk_from_score(score):
    """
    Convert module score into LOW / MEDIUM / HIGH.
    Score is between 0 and 100.
    """

    if score >= 70:
        return "HIGH"

    elif score >= 40:
        return "MEDIUM"

    else:
        return "LOW"


def clamp(value, minimum=0, maximum=100):
    """
    Keep score between 0 and 100.
    """

    return max(
        minimum,
        min(maximum, value)
    )


# ============================================================
# HEALTH CHECK
# ============================================================

@app.route("/", methods=["GET"])
def home():

    return jsonify({
        "status": "online",
        "message": "Clone Account Fraud Detection API is running!"
    })


# ============================================================
# PREDICTION API
# ============================================================

@app.route("/predict", methods=["POST"])
def predict():

    try:

        # ----------------------------------------------------
        # CHECK MODEL
        # ----------------------------------------------------

        if model is None:

            return jsonify({
                "error": "Fraud detection model is not loaded."
            }), 500


        # ----------------------------------------------------
        # GET FRONTEND DATA
        # ----------------------------------------------------

        data = request.get_json()

        if not data:

            return jsonify({
                "error": "No input data received."
            }), 400


        # ----------------------------------------------------
        # BASIC ACCOUNT INFORMATION
        # ----------------------------------------------------

        username = str(
            data.get("username", "")
        ).strip()

        platform = str(
            data.get("platform", "Instagram")
        )


        # ----------------------------------------------------
        # BASIC INPUT VALIDATION
        # ----------------------------------------------------

        if not username:

            return jsonify({
                "error": "Username is required."
            }), 400


        account_age_months = float(
            data.get("accountAge", 0)
        )

        followers = float(
            data.get("followers", 0)
        )

        following = float(
            data.get("following", 0)
        )


        # ----------------------------------------------------
        # CREATE DERIVED FEATURES
        # ----------------------------------------------------

        account_age_days = account_age_months * 30


        # ----------------------------------------------------
        # PROFILE COMPLETENESS
        # ----------------------------------------------------
        #
        # Current MVP uses a fixed value because the frontend
        # does not collect detailed profile fields.
        #

        profile_completeness = 80.0


        # ====================================================
        # BEHAVIOURAL FEATURES
        # ====================================================
        #
        # IMPORTANT:
        # These values now come from the frontend.
        #


        # ----------------------------------------------------
        # 1. CLONE SIGNAL
        # ----------------------------------------------------

        username_similarity = float(
            data.get("usernameSimilarity", 0)
        )


        # ----------------------------------------------------
        # 2. LOGIN & DEVICE SIGNALS
        # ----------------------------------------------------

        login_frequency = 1.0

        new_device_logins = float(
            data.get("newDeviceLogins", 0)
        )

        unique_devices = float(
            data.get("uniqueDevices", 1)
        )

        ip_changes = float(
            data.get("ipChanges", 0)
        )

        location_changes = float(
            data.get("locationChanges", 0)
        )


        # ----------------------------------------------------
        # 3. COMMUNICATION SIGNALS
        # ----------------------------------------------------

        messages_per_day = 5.0

        suspicious_links = float(
            data.get("suspiciousLinks", 0)
        )


        # ----------------------------------------------------
        # 4. TRANSACTION SIGNALS
        # ----------------------------------------------------

        transaction_count = 0.0

        transaction_amount = float(
            data.get("transactionAmount", 0)
        )


        # ====================================================
        # CREATE MODEL INPUT
        # ====================================================

        account = pd.DataFrame([{

            "account_age_days":
                account_age_days,

            "followers_count":
                followers,

            "following_count":
                following,

            "profile_completeness":
                profile_completeness,

            "username_similarity":
                username_similarity,

            "login_frequency":
                login_frequency,

            "new_device_logins":
                new_device_logins,

            "unique_devices":
                unique_devices,

            "ip_changes":
                ip_changes,

            "location_changes":
                location_changes,

            "messages_per_day":
                messages_per_day,

            "suspicious_links":
                suspicious_links,

            "transaction_count":
                transaction_count,

            "transaction_amount":
                transaction_amount

        }])


        # ====================================================
        # ML PREDICTION
        # ====================================================

        prediction_value = model.predict(account)[0]

        probability = model.predict_proba(account)[0][1]


        # ----------------------------------------------------
        # FRAUD PROBABILITY
        # ----------------------------------------------------

        fraud_probability = round(
            probability * 100,
            2
        )


        # ----------------------------------------------------
        # PREDICTION LABEL
        # ----------------------------------------------------

        if prediction_value == 1:

            prediction = "FRAUD"

        else:

            prediction = "GENUINE"


        # ----------------------------------------------------
        # OVERALL RISK LEVEL
        # ----------------------------------------------------

        risk_level = get_risk_level(
            probability
        )


        # ====================================================
        # INDIVIDUAL MODULE SCORES
        # ====================================================


        # ----------------------------------------------------
        # 1. CLONE SIGNALS
        # ----------------------------------------------------

        clone_score = clamp(
            username_similarity
        )


        # ----------------------------------------------------
        # 2. LOGIN & DEVICE
        # ----------------------------------------------------

        login_score = clamp(
            (
                (new_device_logins * 15)
                +
                (unique_devices * 5)
                +
                (ip_changes * 10)
                +
                (location_changes * 10)
            )
        )


        # ----------------------------------------------------
        # 3. COMMUNICATION
        # ----------------------------------------------------

        communication_score = clamp(
            (
                suspicious_links * 25
                +
                messages_per_day * 1
            )
        )


        # ----------------------------------------------------
        # 4. TRANSACTIONS
        # ----------------------------------------------------

        transaction_score = clamp(
            (
                transaction_count * 5
                +
                transaction_amount / 1000
            )
        )


        # ====================================================
        # MODULE RESULTS
        # ====================================================

        modules = {

            "clone": {

                "score": round(
                    clone_score,
                    2
                ),

                "risk": risk_from_score(
                    clone_score
                )
            },


            "login": {

                "score": round(
                    login_score,
                    2
                ),

                "risk": risk_from_score(
                    login_score
                )
            },


            "communication": {

                "score": round(
                    communication_score,
                    2
                ),

                "risk": risk_from_score(
                    communication_score
                )
            },


            "transactions": {

                "score": round(
                    transaction_score,
                    2
                ),

                "risk": risk_from_score(
                    transaction_score
                )
            }

        }


        # ====================================================
        # SIGNAL DATA FOR FRONTEND
        # ====================================================

        signals = {

            "username_similarity":
                round(
                    username_similarity,
                    2
                ),


            "new_device_logins":
                round(
                    new_device_logins,
                    2
                ),


            "unique_devices":
                round(
                    unique_devices,
                    2
                ),


            "ip_changes":
                round(
                    ip_changes,
                    2
                ),


            "location_changes":
                round(
                    location_changes,
                    2
                ),


            "suspicious_links":
                round(
                    suspicious_links,
                    2
                ),


            "transaction_amount":
                round(
                    transaction_amount,
                    2
                )

        }


        # ====================================================
        # FINAL API RESPONSE
        # ====================================================

        return jsonify({

            "prediction":
                prediction,


            "fraud_probability":
                fraud_probability,


            "risk_level":
                risk_level,


            "modules":
                modules,


            "signals":
                signals,


            "account": {

                "username":
                    username,

                "platform":
                    platform,

                "account_age_months":
                    account_age_months,

                "followers":
                    followers,

                "following":
                    following

            }

        })


    # ========================================================
    # ERROR HANDLING
    # ========================================================

    except Exception as e:

        print(
            "Prediction error:",
            str(e)
        )

        return jsonify({

            "error":
                "Prediction failed.",

            "details":
                str(e)

        }), 500


# ============================================================
# RUN APPLICATION
# ============================================================

if __name__ == "__main__":

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )