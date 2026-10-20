"""
EduGuard ML Prediction Service API
FastAPI backend serving the trained Random Forest Early Dropout Predictor.
"""

import os
import json
from typing import List, Optional
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import joblib

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = FastAPI(
    title="EduGuard AI Dropout Prediction Service",
    description="PS 03 AI-Powered School Dropout Prediction System API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model, scaler, features, and metrics
MODEL_PATH = os.path.join(BASE_DIR, 'model.joblib')
SCALER_PATH = os.path.join(BASE_DIR, 'scaler.joblib')
FEATURES_PATH = os.path.join(BASE_DIR, 'features.json')
METRICS_PATH = os.path.join(BASE_DIR, 'metrics.json')

model = None
scaler = None
feature_names = []
metrics_data = {}

try:
    if os.path.exists(MODEL_PATH) and os.path.exists(SCALER_PATH):
        model = joblib.load(MODEL_PATH)
        scaler = joblib.load(SCALER_PATH)
    if os.path.exists(FEATURES_PATH):
        with open(FEATURES_PATH, 'r') as f:
            feature_names = json.load(f)
    if os.path.exists(METRICS_PATH):
        with open(METRICS_PATH, 'r') as f:
            metrics_data = json.load(f)
except Exception as e:
    print(f"Warning loading model artifacts: {e}")

class StudentFeatureInput(BaseModel):
    student_id: Optional[str] = "student-1"
    student_name: Optional[str] = "Unknown"
    attendance_rate: float = Field(..., ge=0, le=100, description="Attendance % (0-100)")
    consecutive_absences: int = Field(0, ge=0, description="Max consecutive days absent")
    current_gpa: float = Field(..., ge=0, le=100, description="Current term GPA score % (0-100)")
    gpa_drop: float = Field(0.0, description="Grade drop compared to previous term (positive = dropped)")
    missed_assignments_ratio: float = Field(0.0, ge=0, le=100, description="% of assignments missed")
    past_failures: int = Field(0, ge=0, description="Number of past subject failures")
    parent_education_level: int = Field(2, ge=1, le=4, description="1: Basic, 2: Secondary, 3: College, 4: Advanced")
    commute_time_mins: float = Field(20.0, ge=0, description="Commute time in minutes")
    peer_study_hours_weekly: float = Field(2.0, ge=0, description="Weekly hours in peer learning")
    disciplinary_incidents: int = Field(0, ge=0, description="Count of disciplinary infractions")
    fee_arrears: int = Field(0, ge=0, le=1, description="1 if overdue fees, 0 otherwise")

class FactorExplanation(BaseModel):
    feature: str
    label: str
    impact: str  # 'high', 'medium', 'low'
    direction: str  # 'risk' or 'protective'
    description: str

class PredictionOutput(BaseModel):
    student_id: str
    student_name: str
    dropout_probability_pct: float
    risk_level: str  # 'High', 'Medium', 'Low'
    is_model_prediction: bool
    contributing_factors: List[FactorExplanation]
    recommended_interventions: List[str]
    disclaimer: str

@app.get("/health")
def health_check():
    return {
        "status": "online",
        "service": "EduGuard Dropout Prediction Engine",
        "model_loaded": model is not None,
        "model_version": metrics_data.get("model_version", "1.0.0")
    }

@app.get("/metrics")
def get_metrics():
    if not metrics_data:
        raise HTTPException(status_code=500, detail="Metrics not loaded")
    return metrics_data

@app.post("/predict", response_model=PredictionOutput)
def predict_student(student: StudentFeatureInput):
    if model is None or scaler is None:
        raise HTTPException(status_code=503, detail="Model is not initialized")

    input_vector = np.array([[
        student.attendance_rate,
        student.consecutive_absences,
        student.current_gpa,
        student.gpa_drop,
        student.missed_assignments_ratio,
        student.past_failures,
        student.parent_education_level,
        student.commute_time_mins,
        student.peer_study_hours_weekly,
        student.disciplinary_incidents,
        student.fee_arrears
    ]])

    scaled_vector = scaler.transform(input_vector)
    prob_dropout = float(model.predict_proba(scaled_vector)[0][1])
    prob_pct = round(prob_dropout * 100, 1)

    # Risk tiering
    if prob_pct >= 55.0:
        risk_level = "High"
    elif prob_pct >= 25.0:
        risk_level = "Medium"
    else:
        risk_level = "Low"

    # Explainable drivers
    factors: List[FactorExplanation] = []
    
    if student.attendance_rate < 75.0:
        factors.append(FactorExplanation(
            feature="attendance_rate",
            label="Low Attendance Rate",
            impact="high",
            direction="risk",
            description=f"Attendance at {student.attendance_rate}% is significantly below the 80% critical persistence threshold."
        ))

    if student.consecutive_absences >= 2:
        factors.append(FactorExplanation(
            feature="consecutive_absences",
            label="Consecutive Missed Classes",
            impact="high" if student.consecutive_absences >= 3 else "medium",
            direction="risk",
            description=f"{student.consecutive_absences} consecutive missed sessions indicate immediate curriculum disconnect."
        ))

    if student.current_gpa < 50.0:
        factors.append(FactorExplanation(
            feature="current_gpa",
            label="Academic Deficit",
            impact="high",
            direction="risk",
            description=f"Current average {student.current_gpa}% indicates foundational learning gaps in core subjects."
        ))

    if student.gpa_drop >= 10.0:
        factors.append(FactorExplanation(
            feature="gpa_drop",
            label="Steep Academic Decline",
            impact="medium",
            direction="risk",
            description=f"Term-over-term score declined by {student.gpa_drop} percentage points."
        ))

    if student.missed_assignments_ratio >= 30.0:
        factors.append(FactorExplanation(
            feature="missed_assignments_ratio",
            label="Incomplete Coursework",
            impact="medium",
            direction="risk",
            description=f"{student.missed_assignments_ratio}% of assigned practice tasks were left unsubmitted."
        ))

    if student.past_failures >= 1:
        factors.append(FactorExplanation(
            feature="past_failures",
            label="Historical Course Retakes",
            impact="high",
            direction="risk",
            description=f"Accumulated {student.past_failures} past failed modules elevates repetition and disengagement risk."
        ))

    if student.fee_arrears == 1:
        factors.append(FactorExplanation(
            feature="fee_arrears",
            label="Financial Hardship Indicator",
            impact="medium",
            direction="risk",
            description="Fee delay notice logged, correlating with domestic or commute distress."
        ))

    if student.peer_study_hours_weekly >= 3.0:
        factors.append(FactorExplanation(
            feature="peer_study_hours_weekly",
            label="Active Peer Study Support",
            impact="medium",
            direction="protective",
            description=f"Engages {student.peer_study_hours_weekly} hrs/week with classmate mentors, mitigating isolation."
        ))

    # Recommendations
    interventions = []
    if risk_level == "High":
        interventions.append("Schedule 1-on-1 teacher counseling session within 48 hours.")
        interventions.append("Deploy 4-Step Personalized Catch-Up Plan for weak subjects.")
        interventions.append("Send WhatsApp/SMS update to parent via Parent Assistant.")
        interventions.append("Pair with nearby peer mentor for collaborative homework support.")
    elif risk_level == "Medium":
        interventions.append("Assign targeted revision worksheets for missed foundational topics.")
        interventions.append("Enroll student in weekly Peer Doubt-Clearing Circle.")
        interventions.append("Monitor next 5 school days for attendance stability.")
    else:
        interventions.append("Maintain standard academic progression.")
        interventions.append("Encourage student to mentor classmates in their strong subjects.")

    return PredictionOutput(
        student_id=student.student_id or "student-1",
        student_name=student.student_name or "Student",
        dropout_probability_pct=prob_pct,
        risk_level=risk_level,
        is_model_prediction=True,
        contributing_factors=factors,
        recommended_interventions=interventions,
        disclaimer="Statistical estimate from validated Random Forest model. Intended for early supportive intervention, not punitive tracking."
    )

@app.post("/batch-predict")
def batch_predict(students: List[StudentFeatureInput]):
    return [predict_student(s) for s in students]

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
