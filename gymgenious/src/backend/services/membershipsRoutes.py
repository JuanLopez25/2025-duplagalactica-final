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
        membership_ref = db.collection('membershipsUsers')
        docs = membership_ref.stream()
        memberships = [{'id': doc.id, **doc.to_dict()} for doc in docs]
        return memberships
    except Exception as e:
        print(f"Error while getting the membership: {e}")
        raise RuntimeError("It was not possible to obtain the memberships")

def get_membership_template():
    try:
        membershipsTemplate_ref = db.collection('membershipTemplate')
        docs = membershipsTemplate_ref.stream()
        membershipsTemplates = [{'id': doc.id, **doc.to_dict()} for doc in docs]
        return membershipsTemplates
    except Exception as e:
        print(f"Error while getting the template: {e}")
        raise RuntimeError("It was not possible to get the memberships template")

def get_unique_user_membership():
    try:
        memberships_ref = db.collection('memberships')
        docs = memberships_ref.stream()
        memberships = [{'id': doc.id, **doc.to_dict()} for doc in docs]
        return memberships
    except Exception as error:
        print("Error while getting the memberships:", error)
        raise ValueError('It was not possible to get the memberships')
    
def use_membership_class(classId,membId): 
    try:
        memberships_ref = db.collection('memberships')
        doc_ref = memberships_ref.document(membId)
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
        print(f"Error while using the membership: {e}")
        raise RuntimeError("It was not possible to use the membership")

def unuse_membership_class(classId,membId): 
    try:
        membership_ref = db.collection('memberships')
        doc_ref = membership_ref.document(membId)
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
        print(f"Error while unusing the membership: {e}")
        raise RuntimeError("It was not possible to unuse the membership")

def edit_memb_price(tipo,precio): 
    try:
        membershipTemplate_ref = db.collection('membershipTemplate')
        docs = membershipTemplate_ref.where('type', '==', tipo).stream()
        for doc in docs:
            doc_ref = membershipTemplate_ref.document(doc.id)
            doc = doc_ref.get()
            doc_ref.update({
                'price': precio
            })
        return {"message": "Actualización realizada"} 
    except Exception as e:
        print(f"Error while updating the membershipTemplate: {e}")
        raise RuntimeError("It was not possible to update the membership template")
    
def aquire_membership_month(fechaInicio, uid, fechaFin, type_memb): 
    try:
        membershipsUsers_ref = db.collection('membershipsUsers')
        docs = membershipsUsers_ref.where('userId', '==', uid).stream()
        doc = next(docs, None) 
        if type_memb == 'monthly':
            top_val = 12
        elif type_memb == 'yearly':
            top_val = 144
        elif type_memb == 'never':
            top_val = 1
        if doc: 
            current_data = doc.to_dict()
            membershipId = current_data.get('membershipId')
            exp_date = current_data.get('exp') 
            today_date = datetime.utcnow()
            format_data = today_date.strftime('%Y-%m-%dT%H:%M:%S.') + '{:03d}Z'.format(today_date.microsecond // 1000)
            if exp_date!='never' and exp_date <= format_data:
                memberships_ref = db.collection('memberships')
                ref = memberships_ref.document(membershipId).delete()
                membershipsUsers_ref.document(doc.id).delete() 
                aquire_membership_month(fechaInicio,uid,fechaFin,type_memb)
            if exp_date!='never':
                end_date = datetime.fromisoformat(exp_date) if isinstance(exp_date,str) else exp_date
            else:
                if type_memb=='never':
                    end_date='never'
                elif type_memb=='monthly':
                    end_date=today_date
                elif type_memb=='yearly':
                    end_date=today_date
            if type_memb!='never':
                if type_memb == 'yearly':
                    endDateUpdated = end_date + timedelta(days=365)
                elif type_memb == 'monthly':
                    endDateUpdated = end_date + timedelta(days=30) 
                else:
                    endDateUpdated = end_date

                formatted_endDate = endDateUpdated.strftime('%Y-%m-%dT%H:%M:%S.') + '{:03d}Z'.format(endDateUpdated.microsecond // 1000)
                doc.reference.update({
                    'exp': formatted_endDate
                })
            memberships_ref = db.collection('memberships')
            ref = memberships_ref.document(membershipId)
            doc2 = ref.get()
            memb_data = doc2.to_dict()
            new_top_val = memb_data.get('top')
            if type_memb=='yearly' or type_memb=='monthly':
                ref.update({
                    'top': new_top_val+top_val
                })
            else:
                ref.update({
                    'top': (new_top_val + 1)
                })
        else:
            new_memb = {'BookedClasses': [], 'top': top_val, 'type': type_memb}
            class_ref = db.collection('memberships').add(new_memb)
            document_id = class_ref[1].get().id

            new_memb_user = {
                'exp': fechaFin,
                'ini': fechaInicio,
                'membershipId': document_id,
                'userId': uid
            }
            membershipsUsers_ref.add(new_memb_user) 

        return {"message": "Actualización realizada"}
    
    except Exception as e:
        print(f"Error while aquiring a membership: {e}")
        raise RuntimeError("It was not possible to aquire a membership")

def update_class_use(usuarios,selectedEvent):
    try:
        usuarios = usuarios.split(',')
        membershipUsers_ref = db.collection('membershipsUsers')
        membership_ids = []
        deleted_memberships = []
        for user_id in usuarios:
            user_doc = membershipUsers_ref.where('userId', '==', user_id).get()
            for doc in user_doc:
                membership_ids.append(doc.to_dict().get('membershipId'))
        memb_ref = db.collection('memberships')
        for membership_id in membership_ids:
            memb_doc = memb_ref.document(membership_id).get()
            if memb_doc.exists:
                current_top = memb_doc.to_dict().get('top', 0) 
                new_top = current_top - 1  
                memb_ref.document(membership_id).update({'top': new_top})
                booked_classes = memb_doc.to_dict().get('BookedClasses', [])
                if new_top < len(booked_classes):
                    if selectedEvent in booked_classes:
                        booked_classes.remove(selectedEvent)
                        deleted_memberships.append(membership_id)
                        memb_ref.document(membership_id).update({'BookedClasses': booked_classes})
        deleted_users = []
        for mem in deleted_memberships:
            document = membershipUsers_ref.where('membershipId', '==', mem).get()
            for doc in document:
                if doc.exists:
                    deleted_users.append(doc.to_dict().get('userId'))
        users_reference = db.collection('users')
        deleted_mails = []
        for usuario in deleted_users:
            document = users_reference.where('uid','==',usuario).get()
            for doc in document:
                if doc.exists:
                    deleted_mails.append(doc.to_dict().get('Mail'))
        clases_ref = db.collection('classes')
        class_document = clases_ref.document(selectedEvent).get()
        if class_document.exists:
            booked_users = class_document.to_dict().get('BookedUsers', [])
            for mail in deleted_mails:
                booked_users.remove(mail)
            clases_ref.document(selectedEvent).update({'BookedUsers': booked_users})
        return {"message": "Actualización realizada"} 
    except Exception as e:
        print(f"Error while updating the use of a class: {e}")
        raise RuntimeError("It was not possible to update the use of a class")