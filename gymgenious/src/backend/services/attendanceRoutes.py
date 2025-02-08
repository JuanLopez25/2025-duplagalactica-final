
from firebase_config import db



    
def mark_attendance(eventId,dateInicio,dateEnd,userMail):
    try:
        new_attendance = {'IdClase':eventId,'MailAlumno':userMail,'Inicio':dateInicio,'Fin':dateEnd}
        db.collection('assistedClasses').add(new_attendance)
        db.collection('historicalAssistance').add(new_attendance)
        return {'message':'Todo ok'}
    except Exception as e:
        print(f"Error while marking the attendance: {e}")
        raise RuntimeError("The attendance could not be marked correctly")
    
def get_coach_clients_assistance():
    try:
        classes_ref = db.collection('historicalAssistance').stream()
        attendances = [{'id': doc.id, **doc.to_dict()} for doc in classes_ref]
        return attendances
    except Exception as e:
        print(f"Error while getting the assistance: {e}")
        raise RuntimeError("The assitance information could not be obtained")
