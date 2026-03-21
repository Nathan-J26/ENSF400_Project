from database import db, Message

def add_message(conversation_id, role, content):
    msg = Message(
        conversation_id=conversation_id,
        role=role,
        content=content
    )
    db.session.add(msg)
    db.session.commit()
    return msg

def get_messages(conversation_id):
    return Message.query.filter_by(conversation_id=conversation_id).all()