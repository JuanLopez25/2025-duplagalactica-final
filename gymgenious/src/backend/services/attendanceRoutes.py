import firebase_admin
from firebase_config import db
from firebase_admin import credentials, firestore
import logging



    
def mark_attendance(eventId,dateInicio,dateEnd,userMail):
    try:
        new_class = {'IdClase':eventId,'MailAlumno':userMail,'Inicio':dateInicio,'Fin':dateEnd}
        class_ref = db.collection('assistedClasses').add(new_class)
        markedAttendance = {**new_class}
        return {'message':'Todo ok'}
    except Exception as e:
        print(f"Error al crear la clase: {e}")
        raise RuntimeError("No se pudo crear la clase")
    
def get_coach_clients_assistance():
    try:
        classes_ref = db.collection('assistedClasses').stream()
        classes = [{'id': doc.id, **doc.to_dict()} for doc in classes_ref]
        return classes
    except Exception as e:
        print(f"Error al obtener las asistencias: {e}")
        raise RuntimeError("No se pudo obtener la información de asistencia")
