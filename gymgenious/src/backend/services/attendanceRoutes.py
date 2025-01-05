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
    
