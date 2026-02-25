import pandas as pd
import json
import traceback

def execute_pandas_script(code: str, data_context: dict = None) -> dict:
    """
    Executes a given python/pandas script safely.
    It provides `pd` (pandas) in the global namespace.
    The script should define a variable `result` which will be returned.
    """
    if data_context is None:
        data_context = {}
        
    local_env = {
        'pd': pd,
        'result': None,
        **data_context
    }
    
    # Very basic "sandbox". In production, use WebAssembly, restricted containers, or AST parsing.
    # DO NOT use bare exec() for untrusted code in a real production system without heavy isolation.
    try:
        exec(code, {}, local_env)
        
        result_data = local_env.get('result')
        
        if isinstance(result_data, pd.DataFrame):
            # Convert DataFrame to JSON serializable dict
            return {"status": "success", "data": json.loads(result_data.to_json(orient="records"))}
        elif isinstance(result_data, dict):
            # If the script already returned a dict, merge it carefully to avoid double 'data' wrapping if specified by user
            if "data" in result_data:
                return {"status": "success", **result_data}
            return {"status": "success", "data": result_data}
        elif isinstance(result_data, list):
            return {"status": "success", "data": result_data}
        else:
            return {"status": "success", "data": str(result_data)}
            
    except Exception as e:
        return {
            "status": "error",
            "message": str(e),
            "traceback": traceback.format_exc()
        }
