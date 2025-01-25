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
        datitos = [{'id': doc.id,**doc.to_dict()} for doc in docs] 
        return datitos
    except Exception as e:
        print(f"Error al obtener el inventario: {e}")
        raise RuntimeError("No se pudo obtener el inventario")

def upload_image_to_storage(image_data, file_name):
    try:
        bucket = storage.bucket()
        blob = bucket.blob(file_name)
        if not image_data:
            raise ValueError("No se han obtenido bytes de imagen válidos.")
        
        blob.upload_from_string(image_data, content_type='image/jpeg')
        blob.make_public()
        return blob.public_url
    except Exception as e:
        print(f"Error al subir la imagen: {str(e)}")
        raise RuntimeError(f"No se pudo subir la imagen: {str(e)}")

def create_inventory(excersice):
    try:
        
        image_data = excersice.get('image')
        if image_data:
            unique_file_name = f"{excersice['name']}_{uuid.uuid4()}.jpeg"
            image_url = upload_image_to_storage(image_data, unique_file_name)
            excersice['image_url'] = image_url
            del excersice['image']
        class_ref = db.collection('inventory').add(excersice)
        created_excersice = {**excersice}
        return created_excersice
    except Exception as e:
        print(f"Error al crear la clase: {e}")
        raise RuntimeError("No se pudo crear la clase")
