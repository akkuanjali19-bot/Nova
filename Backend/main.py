from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import io

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory "vector store" placeholder
vector_store = []

class ChatRequest(BaseModel):
    text: str
    session_id: str | None = None

SYSTEM_PROMPT = """
You are Nova, a friendly, platonic virtual companion. You must not role-play a romantic partner or girlfriend.
Be factual, cite sources when available, and if unsure admit uncertainty.
Always be polite, concise, and avoid medical/legal advice. For such topics, recommend professionals.
"""

async def call_llm(prompt: str) -> str:
    # TODO: integrate OpenAI / local LLM / Llama + adapter
    # For now, return an echo and a small safety check
    # This mock helps you run the app locally without API keys.
    return "[mock response] I understood: " + prompt[:300]

@app.post("/chat")
async def chat(req: ChatRequest):
    full_prompt = SYSTEM_PROMPT + "\nUser: " + req.text + "\nAssistant:"
    resp = await call_llm(full_prompt)
    return {"text": resp}

@app.post("/upload_image")
async def upload_image(file: UploadFile = File(...)):
    contents = await file.read()
    # TODO: run image encoder -> embedding -> similarity search
    return {"description": "[mock] I see an image. Replace with vision model output."}

@app.post("/upload_audio")
async def upload_audio(file: UploadFile = File(...)):
    audio_bytes = await file.read()
    # TODO: run speech-to-text (Whisper or provider)
    return {"transcript": "[mock] Transcribed audio goes here"}

@app.post("/delete_user_data")
async def delete_user_data(session_id: str = Form(...)):
    return {"status": "deleted", "session_id": session_id}

if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=8000)