import firebase_admin
from firebase_config import db
from firebase_admin import credentials, firestore
import logging



def create_routine(newRoutine):
    try:
        db.collection('routines').add(newRoutine)
        created_routine = {**newRoutine}
        return created_routine
    except Exception as e:
        print(f"Error while creating the routine: {e}")
        raise RuntimeError("It was not possible to create the routine")

def assign_routine_to_user(newAssignRoutine):
    try:
        mails = [user['Mail'] for user in newAssignRoutine['user']]
        
        assignes_routine_ref = db.collection('assigned_routines')
        
        query = assignes_routine_ref.where('assigner', '==', newAssignRoutine['assigner']) \
                        .where('day', '==', newAssignRoutine['day']) \
                        .where('id', '==', newAssignRoutine['id'])
        docs = query.stream()
        doc_found = False

        for doc in docs:
            doc_found = True  
            doc_ref = assignes_routine_ref.document(doc.id)             
            doc_ref.update({
                'users': mails
            })

        if doc_found:
            return {"message": "Actualización realizada"}
        else:            
            new_doc_ref = assignes_routine_ref.add({
                'assigner': newAssignRoutine['assigner'],
                'day': newAssignRoutine['day'],
                'id': newAssignRoutine['id'],
                'owner': newAssignRoutine['owner'],
                'users': mails  
            })
            return new_doc_ref
    except Exception as e:
        print(f"Error while assigning a routine: {e}")
        raise RuntimeError("It was not possible to assign a routine")

def get_routines():
    try:
        routines_ref = db.collection('routines')
        docs = routines_ref.stream()
        routines = [{**doc.to_dict(), 'id': doc.id} for doc in docs]
        return routines
    except Exception as e:
        print(f"Error while getting the routines: {e}")
        raise RuntimeError("It was not possible to get the routines")
    
def get_assigned_routines():
    try:
        assigned_routines_ref = db.collection('assigned_routines')
        docs = assigned_routines_ref.stream()
        routines = [{**doc.to_dict()} for doc in docs]
        return routines
    except Exception as e:
        print(f"Error while getting the assigned routines: {e}")
        raise RuntimeError("It was not possible to get the assigned routines")

def update_routine_info(newRoutine):
    try:
        routines_ref = db.collection('routines')
        doc_ref = routines_ref.document(newRoutine['id'])
        doc = doc_ref.get()
        if doc.exists:        
            doc_ref.update({
                'description': newRoutine['description'],
                'name': newRoutine['name'],
                'excercises': newRoutine['excers']
            })
            
            return {"message": "Actualización realizada"}
        else:
            print(f"No se encontró una rutina con el id: {newRoutine['rid']}")
            return {"message": "No se encontró la rutina"}

    except Exception as e:
        print(f"Error while updating the routine: {e}")
        raise RuntimeError("It was not possible to update the routine")

def delete_routine(event):
    try:
        routine_ref = db.collection('routines')
        doc_ref = routine_ref.document(event['id'])
        doc = doc_ref.get()
        if doc.exists:
            assigned_routines = db.collection('assigned_routines')
            assigned_ref = assigned_routines.where('id', '==', doc.id).stream()
            for assigned_doc in assigned_ref:
                assigned_doc.reference.delete()
            doc_ref.delete()
            return {"message": "Rutina eliminada correctamente"}
        else:
            print(f"No se encontró una rutina con el ID: {event}")
            return {"message": "No se encontró la rutina"}
            
    except Exception as e:
        print(f"Error while deleting the routine: {e}")
        raise RuntimeError("It was not possible to delete the routine")
