from database import db, User, bcrypt

def create_user(username, email, password):
    hashed = bcrypt.generate_password_hash(password).decode('utf-8')
    user = User(username=username, email=email, password_hash=hashed)
    db.session.add(user)
    db.session.commit()
    return user

def find_user_by_email(email):
    return User.query.filter_by(email=email).first()