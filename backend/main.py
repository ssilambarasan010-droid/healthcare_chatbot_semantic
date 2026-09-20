"""
main.py

FastAPI backend for the Semantic Search Healthcare Chatbot.

Before running this, you must run train_embeddings.py once to generate:
    - question_embeddings.npy
    - qa_dataset.csv
    - sbert_model_name.txt

Start the server with:
    uvicorn main:app --reload

Then open http://127.0.0.1:8000 in your browser.
"""

import os
import io
import base64
import textwrap
import urllib.parse

import numpy as np
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from PIL import Image, ImageDraw, ImageFont

try:
    from deep_translator import GoogleTranslator
    TRANSLATION_AVAILABLE = True
except ImportError:
    TRANSLATION_AVAILABLE = False

# ---- CONFIG ----
EMBEDDINGS_PATH = "question_embeddings.npy"
DATASET_PATH = "qa_dataset.csv"
MODEL_NAME_PATH = "sbert_model_name.txt"
COLUMN_QUESTION = "Patient"
COLUMN_ANSWER = "Doctor"
CONFIDENCE_THRESHOLD = 0.40

# ---- IMAGE / ROUTINE FEATURE ----
IMAGE_KEYWORDS = ["image", "picture", "photo", "poster", "chart", "infographic", "diagram"]

ROUTINE_TEMPLATES = {
    "weight gain": {
        "title": "Weight Gain Routine",
        "steps": [
            "Eat 300-500 extra calories per day",
            "Include protein with every meal (eggs, chicken, dal, paneer)",
            "Eat 5-6 smaller meals instead of 3 large ones",
            "Add healthy fats: nuts, peanut butter, ghee",
            "Strength training 3-4 times a week",
            "Get 7-8 hours of sleep for muscle recovery",
            "Track your weight weekly, not daily",
        ],
    },
    "weight loss": {
        "title": "Weight Loss Routine",
        "steps": [
            "Maintain a calorie deficit (eat slightly less than you burn)",
            "Prioritize protein and fiber to stay full longer",
            "Drink 2-3 liters of water daily",
            "30 minutes of cardio, 4-5 times a week",
            "Add strength training to preserve muscle",
            "Avoid sugary drinks and processed snacks",
            "Get consistent sleep (7-8 hours)",
        ],
    },
    "diet plan": {
        "title": "General Healthy Diet Plan",
        "steps": [
            "Morning: Fruits + soaked nuts + water",
            "Breakfast: Protein + whole grains (eggs/oats/idli)",
            "Lunch: Balanced plate - protein, veggies, carbs",
            "Evening: Light snack - nuts or fruit",
            "Dinner: Light, protein-rich, 2-3 hrs before sleep",
            "Stay hydrated throughout the day",
        ],
    },
}


def detect_routine_topic(text: str):
    text_lower = text.lower()
    for topic in ROUTINE_TEMPLATES:
        if topic in text_lower:
            return topic
    return None


def is_image_request(text: str) -> bool:
    text_lower = text.lower()
    return any(kw in text_lower for kw in IMAGE_KEYWORDS)


def generate_routine_image(topic_key: str) -> str:
    template = ROUTINE_TEMPLATES[topic_key]
    width, height = 800, 100 + len(template["steps"]) * 70 + 60

    bg_color = (16, 40, 34)
    accent_color = (20, 184, 166)
    text_color = (235, 245, 242)

    img = Image.new("RGB", (width, height), color=bg_color)
    draw = ImageDraw.Draw(img)

    try:
        title_font = ImageFont.truetype("arial.ttf", 34)
        step_font = ImageFont.truetype("arial.ttf", 22)
    except Exception:
        title_font = ImageFont.load_default()
        step_font = ImageFont.load_default()

    draw.rectangle([0, 0, width, 70], fill=accent_color)
    draw.text((30, 18), template["title"], font=title_font, fill=(4, 33, 29))

    y = 100
    for i, step in enumerate(template["steps"], start=1):
        wrapped = textwrap.wrap(step, width=55)
        draw.ellipse([30, y + 5, 55, y + 30], fill=accent_color)
        draw.text((38, y + 6), str(i), font=step_font, fill=(4, 33, 29))
        for j, line in enumerate(wrapped):
            draw.text((70, y + j * 26), line, font=step_font, fill=text_color)
        y += 26 * max(1, len(wrapped)) + 20

    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    return base64.b64encode(buffer.getvalue()).decode("utf-8")


# ---- LOAD EVERYTHING ONCE AT STARTUP ----
if not os.path.exists(EMBEDDINGS_PATH):
    raise SystemExit(
        "ERROR: question_embeddings.npy not found. "
        "Run 'python train_embeddings.py' first to build the knowledge base."
    )

print("Loading dataset and embeddings...")
df = pd.read_csv(DATASET_PATH)
embeddings = np.load(EMBEDDINGS_PATH)

with open(MODEL_NAME_PATH) as f:
    model_name = f.read().strip()

print(f"Loading Sentence-BERT model '{model_name}'...")
model = SentenceTransformer(model_name)
print(f"Ready. {len(df)} question-answer pairs loaded.")

app = FastAPI(title="Healthcare Chatbot API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    text: str
    lang: str = "en"  # e.g. "ta" for Tamil input; "en" for English


def google_search_link(query: str) -> str:
    return f"https://www.google.com/search?q={urllib.parse.quote(query)}"


def get_answer(user_question: str):
    user_vec = model.encode([user_question], convert_to_numpy=True)
    similarities = cosine_similarity(user_vec, embeddings)[0]
    best_idx = int(similarities.argmax())
    best_score = float(similarities[best_idx])

    if best_score < CONFIDENCE_THRESHOLD:
        link = google_search_link(user_question)
        return {
            "answer": f"I couldn't find a confident answer in my database. You can search here: {link}",
            "confidence": best_score,
            "matched_question": None,
            "source": "fallback",
            "is_image": False,
            "image_base64": None,
        }

    return {
        "answer": str(df.iloc[best_idx][COLUMN_ANSWER]),
        "confidence": best_score,
        "matched_question": str(df.iloc[best_idx][COLUMN_QUESTION]),
        "source": "dataset",
        "is_image": False,
        "image_base64": None,
    }


@app.get("/")
def serve_index():
    return FileResponse("index.html")


@app.get("/health")
def health_check():
    return {"status": "ok", "qa_pairs_loaded": len(df)}


@app.post("/predict")
def predict(request: ChatRequest):
    user_text = request.text
    original_text = user_text

    # 1. Check if the user is asking for a routine IMAGE
    if is_image_request(user_text):
        topic = detect_routine_topic(user_text)
        if topic:
            image_b64 = generate_routine_image(topic)
            return {
                "answer": f"Here is your {topic} routine:",
                "confidence": 1.0,
                "matched_question": None,
                "source": "image_template",
                "is_image": True,
                "image_base64": image_b64,
                "original_query": original_text,
            }

    # 2. Translate non-English input to English before searching
    if request.lang != "en" and TRANSLATION_AVAILABLE:
        try:
            user_text = GoogleTranslator(source="auto", target="en").translate(user_text)
        except Exception:
            pass  # if translation fails, just search with the original text

    # 3. Normal semantic search
    result = get_answer(user_text)

    # 4. Translate the answer back to the user's language
    if request.lang != "en" and TRANSLATION_AVAILABLE:
        try:
            result["answer"] = GoogleTranslator(source="en", target=request.lang).translate(result["answer"])
        except Exception:
            pass

    result["original_query"] = original_text
    return result


# Serve any other static assets (css/js/images) placed next to index.html
if os.path.isdir("static"):
    app.mount("/static", StaticFiles(directory="static"), name="static")