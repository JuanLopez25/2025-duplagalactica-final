from datetime import datetime, timedelta
import firebase_admin
from firebase_config import db
from firebase_admin import credentials, firestore
import logging
from datetime import datetime
import pytz
import random
from datetime import datetime

def add_missions(usuarios,selectedEvent):
    try:
        usuarios = usuarios.split(',')
        usuarios.remove('1')
        class_ref = db.collection('classes')
        document = class_ref.document(selectedEvent).get()
        if document.exists:
            dia = document.to_dict().get('day','Viernes')
            for usuario in usuarios:
                new_mission = {'uid':usuario,'day':dia}   
                class_ref = db.collection('missions').add(new_mission)
                created_class = {**new_mission}
        return created_class
    except Exception as e:
        print(f"Error al crear la clase: {e}")
        raise RuntimeError("No se pudo crear la clase")
    

def assign_mission(cantidad,usuario):
    try:
        created_missions = []
        templates_ref = db.collection('missionTemplate')
        docs = templates_ref.stream()
        classes = [{'id': doc.id, **doc.to_dict()} for doc in docs]
        missionProgress_ref = db.collection('missionsProgress')
        for i in range(0,int(cantidad)):
            numero = random.randint(0, len(classes)-1)
            mision = classes[numero]
            new_mission_progress = {'uid':usuario,'progress':0,'mid':mision['id'],'Day':mision['Day']}
            missionProgress_ref.add(new_mission_progress)
            created_missions.append(new_mission_progress) 
        return created_missions
    except Exception as e:
        print(f"Error al crear la clase: {e}")
        raise RuntimeError("No se pudo crear la clase")

def get_missions():
    try:
        missions_ref = db.collection('missions')
        docs = missions_ref.stream()
        classes = [{'id': doc.id, **doc.to_dict()} for doc in docs]
        return classes
    except Exception as e:
        print(f"Error al obtener las clases: {e}")
        raise RuntimeError("No se pudo obtener las clases")

def delete_missions(misiones):
    try:
        misiones = misiones.split(',')
        usuarios = []
        mis_ref = db.collection('missionsProgress')
        for mis in misiones:
            doc_ref = mis_ref.document(mis)
            doc = doc_ref.get()
            uid = doc.to_dict().get('uid',' ')
            usuarios.append(uid)
            doc.reference.delete()
        user_ref = db.collection('users')
        for uid in usuarios:
            documento = user_ref.where('uid', '==', uid).get() 
            for doc in documento: 
                gemas = doc.to_dict().get('Gemas', 0)  
                user_ref.document(doc.id).update({'Gemas': gemas + len(misiones)}) 
    except Exception as e:
        print(f"Error actualizando el usuario: {e}")
        raise RuntimeError("No se pudo actualizar el usuario")
    
def get_missions_progress():
    try:
        classes_ref = db.collection('missionsProgress')
        docs = classes_ref.stream()
        classes = [{'idMission': doc.id, **doc.to_dict()} for doc in docs]
        return classes
    except Exception as e:
        print(f"Error al obtener las clases: {e}")
        raise RuntimeError("No se pudo obtener las clases")
    

def get_missions_template():
    try:
        classes_ref = db.collection('missionTemplate')
        docs = classes_ref.stream()
        classes = [{'id': doc.id, **doc.to_dict()} for doc in docs]
        return classes
    except Exception as e:
        print(f"Error al obtener las clases: {e}")
        raise RuntimeError("No se pudo obtener las clases")
    


def add_mission_progress(misiones):
    try:
        misiones = misiones.split(',')
        usuarios = []
        mis_ref = db.collection('missions')
        Dias = []
        print("misiones",misiones)
        for mis in misiones:
            doc_ref = mis_ref.document(mis)
            doc = doc_ref.get()
            uid = doc.to_dict().get('uid',' ')
            day = doc.to_dict().get('day',' ')
            Dias.append(day)
            usuarios.append(uid)
            doc.reference.delete()
        user_ref = db.collection('missionsProgress')
        for day in Dias:
            documento = user_ref.where('uid', '==', usuarios[0]).where('Day','==',day).get() 
            for doc in documento: 
                progreso = doc.to_dict().get('progress', 0)  
                user_ref.document(doc.id).update({'progress': progreso + 1}) 
    except Exception as e:
        print(f"Error actualizando el usuario: {e}")
        raise RuntimeError("No se pudo actualizar el usuario")