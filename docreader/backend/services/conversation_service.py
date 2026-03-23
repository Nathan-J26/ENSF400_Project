from database import supabase

def create_conversation(user_id, title):
    if not supabase: return None
    
    response = supabase.table("conversation").insert({
        "user_id": user_id,
        "title": title
    }).execute()
    
    return response.data[0] if response.data else None

def get_user_conversations(user_id):
    if not supabase: return []
    
    response = supabase.table("conversation").select("*").eq("user_id", user_id).execute()
    return response.data