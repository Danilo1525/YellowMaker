import duckdb
import os
import pandas as pd

DUCKDB_PATH = os.environ.get("DUCKDB_PATH", "/data/analytics.duckdb")

def get_connection():
    # If path doesn't exist (e.g., local dev without docker), use in-memory or local file
    if not os.path.exists(os.path.dirname(DUCKDB_PATH)):
        return duckdb.connect("local_analytics.duckdb")
    return duckdb.connect(DUCKDB_PATH)

def execute_query(query: str):
    """
    Executes a SQL query on DuckDB and returns the result as a list of dicts.
    """
    try:
        conn = get_connection()
        result_df = conn.execute(query).df()
        conn.close()
        return {"status": "success", "data": result_df.to_dict(orient="records")}
    except Exception as e:
        return {"status": "error", "message": str(e)}

def query_file(filepath: str, query: str):
    """
    Executes a query directly on a file (e.g., CSV, Parquet) using DuckDB.
    Example query: "SELECT * FROM read_csv_auto('{}') LIMIT 10"
    """
    try:
        conn = get_connection()
        formatted_query = query.format(filepath)
        result_df = conn.execute(formatted_query).df()
        conn.close()
        return {"status": "success", "data": result_df.to_dict(orient="records")}
    except Exception as e:
         return {"status": "error", "message": str(e)}
