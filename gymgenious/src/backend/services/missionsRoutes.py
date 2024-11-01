from datetime import datetime, timedelta
import firebase_admin
from firebase_config import db
from firebase_admin import credentials, firestore
import logging
from datetime import datetime
import pytz
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