from datetime import datetime, timedelta
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
        if doc.exists: 
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
        if doc.exists: 
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
    


def aquire_membership_month(fechaInicio, uid, fechaFin, type_memb): 
    try:
        users_ref = db.collection('membershipsUsers')
        docs = users_ref.where('userId', '==', uid).stream()
        doc = next(docs, None) 
        if type_memb == 'monthly':
            top_val = 12
        elif type_memb == 'yearly':
            top_val = 50
        if doc: 
            current_data = doc.to_dict()
            membership = current_data.get('membershipId')
            inicio = current_data.get('ini')
            inicio_date = datetime.fromisoformat(inicio) if isinstance(inicio, str) else inicio
            if type_memb == 'yearly':
                fechaFinUpd = inicio_date + timedelta(days=365)
            elif type_memb == 'monthly':
                fechaFinUpd = inicio_date + timedelta(days=30) 
            else:
                fechaFinUpd = current_data.get('exp') 
            formatted_fechaFin = fechaFinUpd.strftime('%Y-%m-%dT%H:%M:%S.') + '{:03d}Z'.format(fechaFinUpd.microsecond // 1000)
            doc.reference.update({
                'exp': formatted_fechaFin
            })
            memberships_ref = db.collection('memberships')
            ref = memberships_ref.document(membership)
            doc2 = ref.get()
            datos_memb = doc2.to_dict()
            top_actual_val = datos_memb.get('top')
            if type_memb=='yearly' or type_memb=='monthly':
                ref.update({
                    'top': top_val
                })
            else:
                ref.update({
                    'top': (top_actual_val + 1)
                })
        else:
            new_memb = {'BookedClasses': [], 'top': 12, 'type': type_memb}
            class_ref = db.collection('memberships').add(new_memb)
            document_id = class_ref[1].get().id

            new_memb_user = {
                'exp': fechaFin,
                'ini': fechaInicio,
                'membershipId': document_id,
                'userId': uid
            }
            users_ref.add(new_memb_user) 

        return {"message": "Actualización realizada"}
    
    except Exception as e:
        print(f"Error actualizando el usuario: {e}")
        raise RuntimeError("No se pudo actualizar el usuario")
