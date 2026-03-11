"""
TeamPulse ML Engine
====================
3 real ML models:
1. Task Delay Predictor     — will this task be completed late? (RandomForest)
2. Productivity Scorer      — predict user productivity 0-100 (GradientBoosting)
3. Workload Balancer        — who should this task be assigned to?

Place this file at: backend/services/ml_engine.py
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, GradientBoostingRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, r2_score
from datetime import datetime

# ─────────────────────────────────────────────
# FEATURE COLUMNS
# ─────────────────────────────────────────────

FEATURES = [
    "complexity", "days_allocated", "assignee_level",
    "assignee_streak", "assignee_points", "team_size",
    "current_workload", "hour_of_day", "day_of_week"
]

# ─────────────────────────────────────────────
# GENERATE TRAINING DATA
# ─────────────────────────────────────────────

def _generate_data(n=2000):
    np.random.seed(42)
    rows = []
    for _ in range(n):
        complexity       = np.random.randint(1, 6)
        days_allocated   = np.random.randint(1, 15)
        assignee_level   = np.random.randint(1, 6)
        assignee_streak  = np.random.randint(0, 30)
        assignee_points  = np.random.randint(0, 1000)
        team_size        = np.random.randint(2, 12)
        current_workload = np.random.randint(0, 10)
        hour_of_day      = np.random.randint(0, 24)
        day_of_week      = np.random.randint(0, 7)

        # Delay probability: high complexity + low level + high workload = delayed
        delay_score = (
            (complexity * 0.3)
            - (assignee_level * 0.25)
            - (assignee_streak * 0.01)
            + (current_workload * 0.15)
            - (days_allocated * 0.05)
            + np.random.normal(0, 0.3)
        )
        is_delayed = int(delay_score > 0.2)

        # Productivity: level + streak + points - workload - complexity
        productivity = max(0, min(100,
            (assignee_level * 10)
            + (assignee_streak * 0.8)
            + (assignee_points * 0.02)
            - (current_workload * 4)
            - (complexity * 3)
            + np.random.normal(0, 8)
        ))

        rows.append([
            complexity, days_allocated, assignee_level,
            assignee_streak, assignee_points, team_size,
            current_workload, hour_of_day, day_of_week,
            is_delayed, productivity
        ])

    df = pd.DataFrame(rows, columns=FEATURES + ["is_delayed", "productivity"])
    return df

# ─────────────────────────────────────────────
# TRAIN MODELS (runs once at import)
# ─────────────────────────────────────────────

def _train():
    df = _generate_data()
    X  = df[FEATURES]

    # Model 1 — Delay Predictor
    y1 = df["is_delayed"]
    X_tr, X_te, y_tr, y_te = train_test_split(X, y1, test_size=0.2, random_state=42)
    delay_model = RandomForestClassifier(
        n_estimators=100, max_depth=8,
        min_samples_split=10, random_state=42, n_jobs=-1
    )
    delay_model.fit(X_tr, y_tr)
    delay_acc = accuracy_score(y_te, delay_model.predict(X_te))

    # Model 2 — Productivity Scorer
    y2 = df["productivity"]
    X_tr2, X_te2, y_tr2, y_te2 = train_test_split(X, y2, test_size=0.2, random_state=42)
    prod_model = GradientBoostingRegressor(
        n_estimators=100, max_depth=4,
        learning_rate=0.1, random_state=42
    )
    prod_model.fit(X_tr2, y_tr2)
    prod_r2 = r2_score(y_te2, prod_model.predict(X_te2))

    return delay_model, prod_model, delay_acc, prod_r2, df[FEATURES]

print("🚀 TeamPulse ML Engine: training models...")
_delay_model, _prod_model, _delay_acc, _prod_r2, _sample_X = _train()
print(f"✅ Delay Predictor accuracy : {_delay_acc:.2%}")
print(f"✅ Productivity Scorer  R²  : {_prod_r2:.3f}")

# ─────────────────────────────────────────────
# PUBLIC PREDICT FUNCTIONS
# ─────────────────────────────────────────────

def predict_task_delay(
    complexity:       int,
    days_allocated:   int,
    assignee_level:   int,
    assignee_streak:  int,
    assignee_points:  int,
    team_size:        int,
    current_workload: int,
) -> dict:
    """
    Predict whether a task will be delayed.
    Called by: POST /ml/predict-delay
    """
    now = datetime.now()
    X = pd.DataFrame([[
        complexity, days_allocated, assignee_level,
        assignee_streak, assignee_points, team_size,
        current_workload, now.hour, now.weekday()
    ]], columns=FEATURES)

    prob       = float(_delay_model.predict_proba(X)[0][1])
    will_delay = prob > 0.5

    if prob >= 0.75:
        risk          = "High Risk"
        recommendation = (
            f"⚠️ {prob:.0%} chance of delay. "
            "Reduce task complexity, extend the deadline, or reassign to a less loaded member."
        )
    elif prob >= 0.5:
        risk          = "Moderate Risk"
        recommendation = (
            f"🟡 {prob:.0%} delay risk. "
            "Check in after 2 days and ensure the assignee has enough time."
        )
    elif prob >= 0.25:
        risk          = "Low Risk"
        recommendation = (
            f"🟢 Only {prob:.0%} chance of delay. "
            "Task looks manageable — keep going!"
        )
    else:
        risk          = "On Track"
        recommendation = (
            f"✅ Only {prob:.0%} delay risk. "
            "This task is well-scoped and the assignee is capable."
        )

    return {
        "will_be_delayed":   will_delay,
        "delay_probability": round(prob, 3),
        "delay_percent":     round(prob * 100, 1),
        "risk_level":        risk,
        "recommendation":    recommendation,
    }


def predict_productivity(
    assignee_level:   int,
    assignee_streak:  int,
    assignee_points:  int,
    current_workload: int,
    complexity:       int,
    team_size:        int = 5,
    days_allocated:   int = 7,
) -> dict:
    """
    Predict productivity score (0-100) for a user on a given task.
    Called by: GET /ml/productivity/{user_id}
    """
    now = datetime.now()
    X = pd.DataFrame([[
        complexity, days_allocated, assignee_level,
        assignee_streak, assignee_points, team_size,
        current_workload, now.hour, now.weekday()
    ]], columns=FEATURES)

    score = float(_prod_model.predict(X)[0])
    score = max(0.0, min(100.0, score))

    if score >= 80:
        band    = "Excellent"
        insight = f"🌟 Score {score:.0f}/100 — performing exceptionally. Keep the streak going!"
    elif score >= 60:
        band    = "Good"
        insight = f"👍 Score {score:.0f}/100 — solid performance. Maintaining streak will push this higher."
    elif score >= 40:
        band    = "Average"
        insight = f"🔶 Score {score:.0f}/100 — consider reducing workload or breaking tasks into smaller pieces."
    else:
        band    = "Needs Support"
        insight = f"🔴 Score {score:.0f}/100 — this member may be overloaded. Consider reassigning some tasks."

    return {
        "productivity_score": round(score, 1),
        "performance_band":   band,
        "insight":            insight,
    }


def recommend_assignee(
    members:    list,   # [{ user_id, name, level, streak, points, current_workload }]
    complexity: int,
    team_size:  int,
) -> dict:
    """
    Recommend the best team member to assign a task to.
    Called by: POST /ml/recommend-assignee
    """
    if not members:
        return {
            "recommended_user_id": None,
            "recommended_name":    "No members",
            "reason":              "No team members available.",
            "scores":              []
        }

    scored = []
    for m in members:
        result = predict_productivity(
            assignee_level   = m.get("level",            1),
            assignee_streak  = m.get("streak",           0),
            assignee_points  = m.get("points",           0),
            current_workload = m.get("current_workload", 0),
            complexity       = complexity,
            team_size        = team_size,
        )
        scored.append({
            "user_id":            m["user_id"],
            "name":               m["name"],
            "productivity_score": result["productivity_score"],
            "performance_band":   result["performance_band"],
            "current_workload":   m.get("current_workload", 0),
        })

    scored.sort(key=lambda x: x["productivity_score"], reverse=True)
    best = scored[0]

    reason = (
        f"{best['name']} has the highest predicted productivity "
        f"({best['productivity_score']:.0f}/100) with only "
        f"{best['current_workload']} active tasks — "
        f"ideal for a complexity-{complexity} task."
    )

    return {
        "recommended_user_id": best["user_id"],
        "recommended_name":    best["name"],
        "reason":              reason,
        "scores":              scored,
    }


def get_model_info() -> dict:
    """Return model metadata — shown in Analytics page."""
    importances  = dict(zip(FEATURES, _delay_model.feature_importances_))
    top_features = sorted(importances.items(), key=lambda x: x[1], reverse=True)[:5]
    return {
        "delay_model_accuracy":  round(_delay_acc * 100, 1),
        "productivity_model_r2": round(_prod_r2, 3),
        "training_samples":      2000,
        "algorithm":             "RandomForest + GradientBoosting",
        "top_delay_factors":     [
            {"feature": k, "importance": round(float(v), 3)}
            for k, v in top_features
        ],
    }