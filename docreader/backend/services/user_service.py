from database import supabase

def create_user(username, email, password):
    # In a typical Supabase architecture, user creation happens on the 
    # frontend using supabase.auth.signUp() so that the session is managed safely.
    # However, if creating from the backend:
    if not supabase: return None
    
    response = supabase.auth.sign_up({
        "email": email,
        "password": password,
        "options": {
            "data": {
                "username": username
            }
        }
    })
    return response.user

def find_user_by_email(email):
    # Typically, you query the auth.users table or a public.users profile table.
    # Supabase doesn't allow direct SELECT on auth.users with the anon key.
    # A Service Role key would be required to use admin APIs.
    raise NotImplementedError("Supabase handles authentication. Use JWT tokens to identify users.")