from firebase_config import db
from firebase_admin import storage
import uuid

def upload_image_to_storage(image_data, file_name):
    try:
        bucket = storage.bucket()
        blob = bucket.blob(file_name)
        if not image_data:
            raise ValueError("It was not obtained valid bytes.")
        
        blob.upload_from_string(image_data, content_type='image/jpeg')
        blob.make_public()
        return blob.public_url
    except Exception as e:
        print(f"Error while uploading the image: {str(e)}")
        raise RuntimeError(f"It was not possible to upload the image: {str(e)}")

def create_excersice(exercise):
    try:
        
        image_data = exercise.get('image')
        if image_data:
            unique_file_name = f"{exercise['name']}_{uuid.uuid4()}.jpeg"
            image_url = upload_image_to_storage(image_data, unique_file_name)
            exercise['image_url'] = image_url
            del exercise['image']
        db.collection('exersices').add(exercise)
        created_exercise = {**exercise}
        return created_exercise
    except Exception as e:
        print(f"Error while creating the exercise: {e}")
        raise RuntimeError("It was not possible to create the exercise")

def get_excersice_by_owner(owner):
    try:
        exercise_ref = db.collection('exersices')
        docs = exercise_ref.where('owner', '==', owner).stream()
        data = [{**doc.to_dict()} for doc in docs] 
        return data
    except Exception as e:
        print(f"Error while obtaining the exercises: {e}")
        raise RuntimeError("It was not possible to obtain the exercises")

def get_excersices():
    try:
        exercises_ref = db.collection('exersices')
        docs = exercises_ref.stream()
        data = [{'id': doc.id,**doc.to_dict()} for doc in docs] 
        return data
    except Exception as e:
        print(f"Error while getting the exercises: {e}")
        raise RuntimeError("It was not possible to obtain the exercises")

def update_exer_info(newExer):
    try:
        exercises_ref = db.collection('exersices')
        doc_ref = exercises_ref.document(newExer['id'])
        doc = doc_ref.get()
        if doc.exists:
            if newExer['image']: 
                file_name = f"{newExer['id']}_exercise_image.jpg"
                image_url = upload_image_to_storage(newExer['image'], file_name)
                doc_ref.update({
                    'description': newExer['description'],
                    'name': newExer['name'],
                    'image_url': image_url 
                })
            else:
                doc_ref.update({
                    'description': newExer['description'],
                    'name': newExer['name']
                })
                
            return {"message": "Actualización realizada"}
        else:
            print(f"It was not find an exercise with the id: {newExer['id']}")
            return {"message": "The exercise was not found"}

    except Exception as e:
        print(f"Error actualizando el ejercicio: {e}")
        raise RuntimeError("No se pudo actualizar el ejercicio")
