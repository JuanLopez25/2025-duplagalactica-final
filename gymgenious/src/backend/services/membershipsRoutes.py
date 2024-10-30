import firebase_admin
from firebase_config import db
from firebase_admin import credentials, firestore
import logging
from datetime import datetime
import pytz
from datetime import datetime

def get_memb_user():
    try:
        classes_ref = db.collection('membershipsUsers')
        docs = classes_ref.stream()
        classes = [{'id': doc.id, **doc.to_dict()} for doc in docs]
        return classes
    except Exception as e:
        print(f"Error al obtener las clases: {e}")
        raise RuntimeError("No se pudo obtener las clases")


def get_unique_user_membership():
    try:
        classes_ref = db.collection('memberships')
        docs = classes_ref.stream()
        classes = [{'id': doc.id, **doc.to_dict()} for doc in docs]
        return classes
    except Exception as error:
        print("Error al obtener el usuario:", error)
        raise ValueError('No existen usuarios con ese mail')
    

def use_membership_class(classId,membId): 
    try:

        """ current_datetime = datetime.utcnow()
        formatted_date = current_datetime.strftime('%Y-%m-%dT%H:%M:%S.000Z')
        new_class = {'booked':formatted_date,'classID':classId}
        booked_class_ref  = db.collection('bookedClass').add(new_class)
        document_id = booked_class_ref[1].get().id """
        users_ref = db.collection('memberships')
        doc_ref = users_ref.document(membId)
        doc = doc_ref.get()
        current_data = doc.to_dict()
        booked_users = current_data.get('BookedClasses', [])
        if classId not in booked_users:
            booked_users.append(classId)
        doc_ref.update({
            'BookedClasses': booked_users
        })
        return {"message": "Actualización realizada"}
    except Exception as e:
        print(f"Error actualizando el usuario: {e}")
        raise RuntimeError("No se pudo actualizar el usuario")

def unuse_membership_class(classId,membId): 
    try:
        users_ref = db.collection('memberships')
        doc_ref = users_ref.document(membId)
        doc = doc_ref.get()
        current_data = doc.to_dict()
        booked_users = current_data.get('BookedClasses', [])
        if classId in booked_users:
            booked_users.remove(classId)
            doc_ref.update({
                'BookedClasses': booked_users
            })
        return {"message": "Actualización realizada"}
    except Exception as e:
        print(f"Error actualizando el usuario: {e}")
        raise RuntimeError("No se pudo actualizar el usuario")

