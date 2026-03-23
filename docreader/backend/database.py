import os
from dotenv import load_dotenv
from supabase import create_client, Client

# This manually loads the variables from the .env file I just created
load_dotenv() 

url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")

if url and key:
    supabase: Client = create_client(url, key)
else:
    print("WARNING: SUPABASE_URL and SUPABASE_KEY are not set in the environment.")
    supabase = None
