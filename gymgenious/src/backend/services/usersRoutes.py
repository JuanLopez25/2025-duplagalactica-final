from firebase_config import db



def get_unique_user_by_email(mail):
    try:
        users_collection = db.collection('users')
        query = users_collection.where('Mail', '==', mail).stream()
        users = [doc.to_dict() for doc in query]
        
        if users:
            user = users[0]
            user_ref = users_collection.where('Mail', '==', mail).stream()
            user_id = [doc.id for doc in user_ref][0]  
            user['id'] = user_id
            return user
        else:
            raise ValueError('No existen usuarios con ese mail')
    except Exception as error:
        print("Error while getting the user:", error)
        raise ValueError('It was impossible to get the user')

def get_user(password, mail):
    try:
        users_collection = db.collection('users')
        query = users_collection.where('password', '==', password).where('mail', '==', mail).stream()
        users = [doc.to_dict() for doc in query]

        if users:
            user = users[0]
            user['uid'] = query[0].id
            return user
        else:
            raise ValueError('Usuario no encontrado')
    except Exception as error:
        print("Error while getting the user:", error)
        raise ValueError("It was nos possible to get the user")

def create_user(user):
    try:
        users_collection = db.collection('users')
        users_collection.add(user)
        return user
    except Exception as error:
        print("Error while creating the user:", error)
        raise ValueError("It was not possible to create the user")

def send_email(to_email):
    try:
        print(f"Enviar correo a: {to_email}")
        return True
    except Exception as error:
        print("Error al enviar el correo:", error)
        return False
    
def get_rankings():
    try:
        renkings_ref = db.collection('rankings')
        docs = renkings_ref.stream()
        rankings = [{'id': doc.id, **doc.to_dict()} for doc in docs]
        return rankings
    except Exception as e:
        print(f"Error while getting rankings: {e}")
        raise RuntimeError("It was not possible to get the rankings")

def get_users():
    try:
        users_ref = db.collection('users')
        docs = users_ref.stream()
        users = [{**doc.to_dict()} for doc in docs]
        return users
    except Exception as e:
        print(f"Error while getting the user: {e}")
        raise RuntimeError("It was not possible to get the user")
    
def get_clients_users():
    try:
        users_ref = db.collection('users')
        docs = users_ref.where('type', '==', 'client').stream()
        users = [{**doc.to_dict()} for doc in docs]
        return users
    except Exception as e:
        print(f"Error while getting the users that are clients: {e}")
        raise RuntimeError("It was not possible to get the client users")

def get_coach_users():
    try:
        users_ref = db.collection('users')
        docs = users_ref.where('type', '==', 'coach').stream()
        users = [{**doc.to_dict()} for doc in docs]
        return users
    except Exception as e:
        print(f"Error while getting the coaches: {e}")
        raise RuntimeError("It was not possible to get the coaches")

def get_client_users_no_match_routine(routine):
    try:
        assigned_routines_ref = db.collection('assigned_routines')
        docs = assigned_routines_ref.where('routine', '!=', routine).stream()
        emails = set()
        data = [{**doc.to_dict()} for doc in docs]
        for dat in data:
            for user in dat['user']:
                if 'Mail' in user:
                    emails.add(user['Mail'])
        email_list = [{'Mail': email} for email in emails]
        users_ref = db.collection('users')
        final_data = []
        for email_dict in email_list:
            docs_final = users_ref.where('Mail', '==', email_dict['Mail']).stream()
            for doc in docs_final:
                final_data.append(doc.to_dict())        
        return final_data  
    except Exception as e:
        print(f"Error while getting the users: {e}")
        raise RuntimeError("It was not possible to get the users")

def update_client_user(newUser):
    try:
        users_ref = db.collection('users')
        docs = users_ref.where('Mail', '==', newUser['Mail']).stream()
        updated = False
        for doc in docs:
            doc_ref = users_ref.document(doc.id)
            doc_ref.update({
                'Name': newUser['Name'],
                'Lastname': newUser['Lastname'],
                'Birthday': newUser['Birthday']
            })
            updated = True

        if not updated:
            print(f"No se encontró un usuario con el correo: {newUser.Mail}")
        return {"message": "Actualización realizada"} 
    except Exception as e:
        print(f"Error while updating the user: {e}")
        raise RuntimeError("It was not possible to update the user")

def use_geme(mail):
    try:
        users_ref = db.collection('users')
        docs = users_ref.where('Mail', '==', mail).stream()
        updated = False
        for doc in docs:
            doc_ref = users_ref.document(doc.id)
            doc = doc_ref.get()
            gems_amount = doc.to_dict().get('Gemas',' ')
            doc_ref.update({
                'Gemas': gems_amount-1
            })
            updated = True

        if not updated:
            print(f"No se encontró un usuario con el correo: {mail}")
        return {"message": "Actualización realizada"} 
    except Exception as e:
        print(f"Error while using gems: {e}")
        raise RuntimeError("It was not possible to use gems")
    
def create_ranking(newRanking):
    try:
        db.collection('rankings').add(newRanking)
        created_ranking = {**newRanking}
        return created_ranking
    except Exception as e:
        print(f"Error while crating the ranking: {e}")
        raise RuntimeError("It was not possible to create the ranking")
    
def join_ranking(rankingID,userMail): 
    try:
        ranking_ref = db.collection('rankings')
        doc_ref = ranking_ref.document(rankingID)
        doc = doc_ref.get()
        if doc.exists: 
            current_data = doc.to_dict()
            booked_users = current_data.get('participants', [])
            if userMail not in booked_users:
                booked_users.append(userMail)
            doc_ref.update({
                'participants': booked_users
            })
        return {"message": "Actualización realizada"}
    except Exception as e:
        print(f"Error joining the ranking: {e}")
        raise RuntimeError("It was not possible to join the ranking")

def leave_ranking(rankingID,userMail): 
    try:
        ranking_ref = db.collection('rankings')
        doc_ref = ranking_ref.document(rankingID)
        doc = doc_ref.get()
        if doc.exists: 
            current_data = doc.to_dict()
            booked_users = current_data.get('participants', [])
            updated_participants = [user for user in booked_users if user != userMail]
            doc_ref.update({
                'participants': updated_participants
            })
        return {"message": "Actualización realizada"}
    except Exception as e:
        print(f"Error while leaving the ranking: {e}")
        raise RuntimeError("It was not possible to leave the ranking")