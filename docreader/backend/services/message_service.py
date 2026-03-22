from database import supabase

def add_message(conversation_id, role, content):
    if not supabase: return None

    response = supabase.table("message").insert({
        "conversation_id": conversation_id,
        "role": role,
        "content": content
    }).execute()
    
    return response.data[0] if response.data else None

def get_messages(conversation_id):
    if not supabase: return []
    
    response = supabase.table("message").select("*").eq("conversation_id", conversation_id).execute()
    return response.data