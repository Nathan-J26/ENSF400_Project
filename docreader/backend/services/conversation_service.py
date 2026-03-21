from database import db, Conversation

def create_conversation(user_id, title):
    convo = Conversation(user_id=user_id, title=title)
    db.session.add(convo)
    db.session.commit()
    return convo

def get_user_conversations(user_id):
    return Conversation.query.filter_by(user_id=user_id).all()