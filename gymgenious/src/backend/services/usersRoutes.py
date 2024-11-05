import firebase_admin
from firebase_config import db
from firebase_admin import credentials, firestore
import logging



def get_unique_user_by_email(mail):
    try:
        users_collection = db.collection('users')
        print("llegamos al final", mail)
        query = users_collection.where('Mail', '==', mail).stream()
        users = [doc.to_dict() for doc in query]
        
        if users:
            user = users[0]
            user_ref = users_collection.where('Mail', '==', mail).stream()
            user_id = [doc.id for doc in user_ref][0]  
            user['id'] = user_id
            print("final",user)
            return user
        else:
            raise ValueError('No existen usuarios con ese mail')
    except Exception as error:
        print("Error al obtener el usuario:", error)
        raise ValueError('No existen usuarios con ese mail')


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
        print("Error al obtener el usuario:", error)
        raise ValueError("No se pudo obtener el usuario")

def create_user(user):
    try:
        print(user)
        users_collection = db.collection('users')
        users_collection.add(user)
        return user
    except Exception as error:
        print("Error al crear el usuario:", error)
        raise ValueError("No se pudo crear el usuario")

def send_email(to_email):
    try:
        print(f"Enviar correo a: {to_email}")
        return True
    except Exception as error:
        print("Error al enviar el correo:", error)
        return False
    

def get_rankings():
    try:
        users_ref = db.collection('rankings')
        docs = users_ref.stream()
        users = [{'id': doc.id, **doc.to_dict()} for doc in docs]
        return users
    except Exception as e:
        print(f"Error al obtener los rankings: {e}")
        raise RuntimeError("No se pudo obtener los rankings")


def get_users():
    try:
        users_ref = db.collection('users')
        docs = users_ref.stream()
        users = [{**doc.to_dict()} for doc in docs]
        return users
    except Exception as e:
        print(f"Error al obtener los usuarios: {e}")
        raise RuntimeError("No se pudo obtener las usuarios")
    
def get_clients_users():
    try:
        users_ref = db.collection('users')
        docs = users_ref.where('type', '==', 'client').stream()
        users = [{**doc.to_dict()} for doc in docs]
        return users
    except Exception as e:
        print(f"Error al obtener los usuarios: {e}")
        raise RuntimeError("No se pudo obtener las usuarios")

def get_coach_users():
    try:
        users_ref = db.collection('users')
        docs = users_ref.where('type', '==', 'coach').stream()
        users = [{**doc.to_dict()} for doc in docs]
        return users
    except Exception as e:
        print(f"Error al obtener los usuarios: {e}")
        raise RuntimeError("No se pudo obtener las usuarios")


def get_client_users_no_match_routine(routine):
    try:
        routines_ref = db.collection('assigned_routines')
        docs = routines_ref.where('routine', '!=', routine).stream()
        emails = set()
        datitos = [{**doc.to_dict()} for doc in docs]
        for dat in datitos:
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
        print(f"Error al obtener los usuarios: {e}")
        raise RuntimeError("No se pudo obtener los usuarios")

def update_client_user(newUser):
    try:
        print(newUser)
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
        print(f"Error actualizando el usuario: {e}")
        raise RuntimeError("No se pudo actualizar el usuario")

def use_geme(mail):
    try:
        users_ref = db.collection('users')
        docs = users_ref.where('Mail', '==', mail).stream()
        updated = False
        for doc in docs:
            doc_ref = users_ref.document(doc.id)
            doc = doc_ref.get()
            cant_gemas = doc.to_dict().get('Gemas',' ')
            doc_ref.update({
                'Gemas': cant_gemas-1
            })
            updated = True

        if not updated:
            print(f"No se encontró un usuario con el correo: {newUser.Mail}")
        return {"message": "Actualización realizada"} 
    except Exception as e:
        print(f"Error actualizando el usuario: {e}")
        raise RuntimeError("No se pudo actualizar el usuario")
    


def create_ranking(newRanking):
    try:
        ranking_ref = db.collection('rankings').add(newRanking)
        created_ranking = {**newRanking}
        return created_ranking
    except Exception as e:
        print(f"Error al crear el ranking: {e}")
        raise RuntimeError("No se pudo crear el ranking")
    
    
def join_ranking(rankingID,userMail): 
    try:
        users_ref = db.collection('rankings')
        doc_ref = users_ref.document(rankingID)
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
        print(f"Error actualizando el usuario: {e}")
        raise RuntimeError("No se pudo actualizar el usuario")


def leave_ranking(rankingID,userMail): 
    try:
        users_ref = db.collection('rankings')
        doc_ref = users_ref.document(rankingID)
        doc = doc_ref.get()
        print("datos",rankingID,userMail)
        if doc.exists: 
            current_data = doc.to_dict()
            booked_users = current_data.get('participants', [])
            updated_participants = [user for user in booked_users if user != userMail]
            doc_ref.update({
                'participants': updated_participants
            })
        return {"message": "Actualización realizada"}
    except Exception as e:
        print(f"Error actualizando el usuario: {e}")
        raise RuntimeError("No se pudo actualizar el usuario")