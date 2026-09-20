# Healthcare AI Chatbot — Semantic Search (Sentence-BERT + Cosine Similarity)

A complete, ready-to-run healthcare chatbot: a FastAPI backend that answers
health questions using semantic search over a real patient-question /
doctor-answer dataset, plus a built-in web chat UI. Supports English and
Tamil (via automatic translation).

## Folder contents

```
healthcare_chatbot_semantic/
├── data/                     <- put your dataset CSV here
├── train_embeddings.py       <- run once to build the knowledge base
├── main.py                   <- FastAPI backend (the chatbot API)
├── index.html                <- chat UI (served automatically by the API)
├── requirements.txt
├── setup.bat                 <- one-click: install + build embeddings
├── run.bat                   <- one-click: start the server
└── README.md                 <- this file
```

## Setup (first time only)

1. **Add your dataset.** Copy your CSV file (e.g. `ai-medical-chatbot.csv`,
   with columns like `Description`, `Patient`, `Doctor`) into the `data/`
   folder. If your column names are different, open `train_embeddings.py`
   and edit the `COLUMN_QUESTION` / `COLUMN_ANSWER` values near the top.

2. **Run setup.** Double-click `setup.bat` (or in a terminal inside this
   folder, run):
   ```
   pip install -r requirements.txt
   python train_embeddings.py
   ```
   This installs the required libraries and builds `question_embeddings.npy`
   + `qa_dataset.csv` — the chatbot's "knowledge base". This step can take
   a few minutes depending on dataset size and whether you have a GPU.

## Running the chatbot

Double-click `run.bat`, or run:
```
uvicorn main:app --reload
```
Then open your browser to: **http://127.0.0.1:8000/**

The chat UI (`index.html`) is served automatically at that address — no
separate frontend server needed.

## How it works

1. `train_embeddings.py` uses a pretrained Deep Learning model
   (Sentence-BERT, `all-MiniLM-L6-v2`) to convert every question in your
   dataset into a numeric vector (embedding), and saves them.
2. `main.py` loads those saved vectors at startup. When a user sends a
   message, it encodes their question the same way and uses **cosine
   similarity** (a Machine Learning technique) to find the closest matching
   question in the dataset.
3. If the best match's similarity score is above `CONFIDENCE_THRESHOLD`
   (default 0.40, in `main.py`), the real doctor's answer for that matched
   question is returned. Otherwise, the chatbot honestly says it isn't
   confident and gives a Google search link instead of guessing.
4. If the user selects Tamil in the language dropdown, their message is
   translated to English before searching, and the answer is translated
   back to Tamil before being shown.

## Notes

- No API key is required anywhere in this project.
- `sentence-transformers` will download the `all-MiniLM-L6-v2` model
  (~90MB) the first time it runs — this requires an internet connection
  once, then it's cached locally.
- To change the confidence threshold or swap in a different Sentence-BERT
  model, edit the `CONFIDENCE_THRESHOLD` / `MODEL_NAME` variables in
  `main.py` / `train_embeddings.py`.
- If you update your dataset later, re-run `python train_embeddings.py`
  to rebuild the knowledge base, then restart the server.
