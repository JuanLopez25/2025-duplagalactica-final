import firebase_admin
from firebase_config import db
from firebase_admin import credentials, firestore, storage
import logging
import base64
import uuid


def get_inventory():
    try:
        inventory_ref = db.collection('inventory')
        docs = inventory_ref.stream()
        data = [{'id': doc.id,**doc.to_dict()} for doc in docs] 
        return data
    except Exception as e:
        print(f"Error while getting the inventory: {e}")
        raise RuntimeError("It was not possible to get the inventory")

def upload_image_to_storage(image_data, file_name):
    try:
        bucket = storage.bucket()
        blob = bucket.blob(file_name)
        if not image_data:
            raise ValueError("The image bytes were not obtained correctly")
        
        blob.upload_from_string(image_data, content_type='image/jpeg')
        blob.make_public()
        return blob.public_url
    except Exception as e:
        print(f"Error while uploading the image: {str(e)}")
        raise RuntimeError(f"It was not possible to upload the image: {str(e)}")

def create_inventory(item):
    try: 
        image_data = item.get('image')
        if image_data:
            unique_file_name = f"{item['name']}_{uuid.uuid4()}.jpeg"
            image_url = upload_image_to_storage(image_data, unique_file_name)
            item['image_url'] = image_url
            del item['image']
        db.collection('inventory').add(item)
        created_item = {**item}
        return created_item
    except Exception as e:
        print(f"Error while creating the item: {e}")
        raise RuntimeError("It was not possible to create the item")
