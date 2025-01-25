from datetime import datetime, timedelta
import firebase_admin
from firebase_config import db
from firebase_admin import credentials, firestore
import logging
from datetime import datetime
import pytz
import random
from datetime import datetime

def add_missions(users,selectedEvent):
    try:
        users = users.split(',')
        users.remove('1')
        class_ref = db.collection('classes')
        document = class_ref.document(selectedEvent).get()
        created_mission = []
        if document.exists:
            day = document.to_dict().get('day','Viernes')
            for user in users:
                new_mission = {'uid':user,'day':day}   
                db.collection('missions').add(new_mission)
                created_mission = {**new_mission}
        return created_mission
    except Exception as e:
        print(f"Error while adding a mission: {e}")
        raise RuntimeError("It was not possible to add a mission")
    
def assign_mission(amount,users):
    try:
        created_missions = []
        templates_ref = db.collection('missionTemplate')
        docs = templates_ref.stream()
        missionsTemplate = [{'id': doc.id, **doc.to_dict()} for doc in docs]
        missionProgress_ref = db.collection('missionsProgress')
        for i in range(0,int(amount)):
            number = random.randint(0, len(missionsTemplate)-1)
            mission = missionsTemplate[number]
            new_mission_progress = {'uid':users,'progress':0,'mid':mission['id'],'Day':mission['Day']}
            missionProgress_ref.add(new_mission_progress)
            created_missions.append(new_mission_progress) 
        return created_missions
    except Exception as e:
        print(f"Error while assigning missions: {e}")
        raise RuntimeError("It was not possible to assign missions")

def get_missions():
    try:
        missions_ref = db.collection('missions')
        docs = missions_ref.stream()
        missions = [{'id': doc.id, **doc.to_dict()} for doc in docs]
        return missions
    except Exception as e:
        print(f"Error while getting missions: {e}")
        raise RuntimeError("It was not possible to get missions")

def delete_missions(missions):
    try:
        missions = missions.split(',')
        users = []
        mis_ref = db.collection('missionsProgress')
        for mis in missions:
            doc_ref = mis_ref.document(mis)
            doc = doc_ref.get()
            uid = doc.to_dict().get('uid',' ')
            users.append(uid)
            doc.reference.delete()
        user_ref = db.collection('users')
        for uid in users:
            documento = user_ref.where('uid', '==', uid).get() 
            for doc in documento: 
                gems = doc.to_dict().get('Gemas', 0)  
                MissionsComplete = doc.to_dict().get('MissionsComplete', 0)  
                user_ref.document(doc.id).update({'Gemas': gems + len(missions)}) 
                user_ref.document(doc.id).update({'MissionsComplete': MissionsComplete + len(missions)})
    except Exception as e:
        print(f"Error while deleting missions: {e}")
        raise RuntimeError("It was not possible to delete missions")
    
def get_missions_progress():
    try:
        missionsProgress_ref = db.collection('missionsProgress')
        docs = missionsProgress_ref.stream()
        mission_progress = [{'idMission': doc.id, **doc.to_dict()} for doc in docs]
        return mission_progress
    except Exception as e:
        print(f"Error while getting the progress of missions: {e}")
        raise RuntimeError("It was not possible to obtain the progress of the missions")
    
def get_missions_template():
    try:
        mission_template_ref = db.collection('missionTemplate')
        docs = mission_template_ref.stream()
        missionTemplate = [{'id': doc.id, **doc.to_dict()} for doc in docs]
        return missionTemplate
    except Exception as e:
        print(f"Error while getting the mission templates: {e}")
        raise RuntimeError("It was not possible to obtain the template of the missions")
    
def add_mission_progress(missions):
    try:
        missions = missions.split(',')
        users = []
        mis_ref = db.collection('missions')
        days = []
        for mis in missions:
            doc_ref = mis_ref.document(mis)
            doc = doc_ref.get()
            uid = doc.to_dict().get('uid',' ')
            day = doc.to_dict().get('day',' ')
            days.append(day)
            users.append(uid)
            doc.reference.delete()
        missionProgress_ref = db.collection('missionsProgress')
        for day in days:
            document = missionProgress_ref.where('uid', '==', users[0]).where('Day','==',day).get() 
            for doc in document: 
                progress = doc.to_dict().get('progress', 0)  
                missionProgress_ref.document(doc.id).update({'progress': progress + 1}) 
    except Exception as e:
        print(f"Error while adding a progress to the missions: {e}")
        raise RuntimeError("It was not possible to add a progress to the missions")