from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.services.pandas_service import execute_pandas_script

router = APIRouter()

class ScriptRequest(BaseModel):
    code: str
    data_context: Optional[dict] = None

@router.post("/execute")
async def execute_script(req: ScriptRequest):
    result = execute_pandas_script(req.code, req.data_context)
    if result.get("status") == "error":
        raise HTTPException(status_code=400, detail=result.get("message"))
    return result
