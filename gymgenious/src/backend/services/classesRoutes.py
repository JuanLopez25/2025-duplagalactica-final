from firebase_config import db


def get_classes():
    try:
        classes_ref = db.collection('classes')
        docs = classes_ref.stream()
        classes = [{'id': doc.id, **doc.to_dict()} for doc in docs]
        return classes
    except Exception as e:
        print(f"Error while getting the classes: {e}")
        raise RuntimeError("It was not possible to get the classes")

def get_comments():
    try:
        classification_ref = db.collection('califications')
        docs = classification_ref.stream()
        classifications = [{'id': doc.id, **doc.to_dict()} for doc in docs]
        return classifications
    except Exception as e:
        print(f"Error while getting the clasifications: {e}")
        raise RuntimeError("It was not possible to get the clasifications")


def create_class(new_class):
    try:
        db.collection('classes').add(new_class)
        created_class = {**new_class}
        return created_class
    except Exception as e:
        print(f"Error while creating the class: {e}")
        raise RuntimeError("It was not possible to create the class")
    

def add_calification(classId, calification, commentary, userId):
    try:
        new_calification = {
            'cid': classId,
            'uid': userId,
            'calification': calification,
            'commentary': commentary
        }
        ref = db.collection('califications')
        docs = list(ref.where('uid', '==', userId).where('cid', '==', classId).stream())
        if docs:
            for doc in docs:
                ref.document(doc.id).update({
                    'calification': calification,
                    'commentary': commentary
                })
            return new_calification 
        else:
            ref.add(new_calification)
            return new_calification 
    except Exception as e:
        print(f"Error while creating the classification: {e}")
        raise RuntimeError("It was not possible to create the classification")

def book_class(event, mail):
    try:
        print("id:",event)
        classes_ref = db.collection('classes')
        doc_ref = classes_ref.document(event)
        doc = doc_ref.get()
        current_data = doc.to_dict()
        booked_users = current_data.get('BookedUsers', [])
        if mail not in booked_users:
            booked_users.append(mail)
        doc_ref.update({
            'BookedUsers': booked_users
        })
        return {"message": "Actualización realizada"} 
    except Exception as e:
        print(f"Error while booking the class: {e}")
        raise RuntimeError("It was not possible to book the class")
    
def unbook_class(event, mail):
    try:
        classes_ref = db.collection('classes')
        doc_ref = classes_ref.document(event)
        doc = doc_ref.get()
        current_data = doc.to_dict()
        booked_users = current_data.get('BookedUsers', [])
        if mail in booked_users:
            booked_users.remove(mail)
            doc_ref.update({
                'BookedUsers': booked_users
            })
        return {"message": "Actualización realizada"} 
    except Exception as e:
        print(f"Error while unbooking the class: {e}")
        raise RuntimeError("It was not possible to unbook the class")

def delete_class(event,mail):
    try:
        classes_ref = db.collection('classes')
        doc_ref = classes_ref.document(event)
        doc = doc_ref.get()
        doc.reference.delete()
    except Exception as e:
        print(f"Error while deleting the class: {e}")
        raise RuntimeError("It was not possible to delete the class")
    
def update_class_info(newClass):
    try:
        classes_ref = db.collection('classes')
        doc_ref = classes_ref.document(newClass['cid'])
        doc = doc_ref.get()
        if doc.exists: 
            doc_ref.update({
                'dateFin': newClass['DateFin'],
                'dateInicio': newClass['DateInicio'],
                'day': newClass['Day'],
                'hour':newClass['Hour'],
                'name': newClass['Name'],
                'permanent': newClass['Permanent'],
                'sala': newClass['sala'],
                'capacity' : int(newClass['capacity']),
                'reservations' : newClass['reservations']
            })
        return {"message": "Actualización realizada"} 
    except Exception as e:
        print(f"Error while updating the class: {e}")
        raise RuntimeError("It was not possible to update the class")
