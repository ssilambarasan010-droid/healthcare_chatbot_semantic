"""
train_embeddings.py

Run this ONCE (locally, in VS Code terminal) to build the chatbot's "knowledge base".
It reads your dataset CSV, converts every patient question into a vector using
Sentence-BERT, and saves the vectors + cleaned dataset for the API to use later.

Usage:
    python train_embeddings.py

Requirements:
    Put your dataset CSV inside the data/ folder, named "ai-medical-chatbot.csv"
    with at least these columns: Description, Patient, Doctor
    (If your column names are different, edit COLUMN_* below.)
"""

import os
import pickle
import numpy as np
import pandas as pd
from sentence_transformers import SentenceTransformer

# ---- CONFIG: change these if your CSV has different column names ----
DATA_PATH = os.path.join("data", "ai-medical-chatbot.csv")
COLUMN_QUESTION = "Patient"     # column containing the patient's question
COLUMN_ANSWER = "Doctor"        # column containing the doctor's answer
MODEL_NAME = "all-MiniLM-L6-v2" # small, fast, good-quality pretrained Sentence-BERT model

OUT_EMBEDDINGS = "question_embeddings.npy"
OUT_DATASET = "qa_dataset.csv"
OUT_MODEL_NAME_FILE = "sbert_model_name.txt"


def main():
    print(f"Loading dataset from {DATA_PATH} ...")
    df = pd.read_csv(DATA_PATH)
    print(f"Raw shape: {df.shape}")
    print(f"Columns found: {df.columns.tolist()}")

    missing = [c for c in [COLUMN_QUESTION, COLUMN_ANSWER] if c not in df.columns]
    if missing:
        raise SystemExit(
            f"ERROR: Could not find column(s) {missing} in your CSV. "
            f"Edit COLUMN_QUESTION / COLUMN_ANSWER at the top of this script "
            f"to match your actual column names: {df.columns.tolist()}"
        )

    df = df.dropna(subset=[COLUMN_QUESTION, COLUMN_ANSWER]).reset_index(drop=True)
    df = df.drop_duplicates(subset=[COLUMN_QUESTION]).reset_index(drop=True)
    print(f"Cleaned shape: {df.shape}")

    print(f"Loading Sentence-BERT model '{MODEL_NAME}' (first run downloads it, ~90MB)...")
    model = SentenceTransformer(MODEL_NAME)

    questions = df[COLUMN_QUESTION].astype(str).tolist()
    print(f"Encoding {len(questions)} questions into vectors. This may take a while on CPU...")
    embeddings = model.encode(
        questions,
        batch_size=64,
        show_progress_bar=True,
        convert_to_numpy=True,
    )
    print(f"Embeddings shape: {embeddings.shape}")

    np.save(OUT_EMBEDDINGS, embeddings)
    df.to_csv(OUT_DATASET, index=False)
    with open(OUT_MODEL_NAME_FILE, "w") as f:
        f.write(MODEL_NAME)

    print("\nDone. Saved files:")
    print(f"  - {OUT_EMBEDDINGS}")
    print(f"  - {OUT_DATASET}")
    print(f"  - {OUT_MODEL_NAME_FILE}")
    print("\nYou can now start the API with: uvicorn main:app --reload")


if __name__ == "__main__":
    main()
