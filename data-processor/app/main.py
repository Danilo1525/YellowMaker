from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import scripts
import warnings

# Suppress warnings for clean logs
warnings.filterwarnings("ignore")

app = FastAPI(title="Data Processor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(scripts.router, prefix="/api/scripts", tags=["Scripts"])

@app.on_event("startup")
async def startup_event():
    print("Data Processor starting up...")
    # In a real production scenario, consumers should run in separate dedicated worker processes
    # (e.g., Celery, or standalone python scripts managed by supervisord/docker).
    # Running them in background threads in FastAPI is okay for this prototype.
    import threading
    from app.consumers.file_consumer import init_consumer
    from app.consumers.script_consumer import init_script_consumer
    
    threading.Thread(target=init_consumer, daemon=True).start()
    threading.Thread(target=init_script_consumer, daemon=True).start()

@app.get("/health")
def health_check():
    return {"status": "ok"}
