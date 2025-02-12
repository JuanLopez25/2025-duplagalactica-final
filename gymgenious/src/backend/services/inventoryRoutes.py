from firebase_config import db
from firebase_admin import storage
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
    

def update_item_info(newItem):
    try:
        exercises_ref = db.collection('inventory')
        doc_ref = exercises_ref.document(newItem['id'])
        doc = doc_ref.get()
        print("hola",newItem)
        if doc.exists:
            if newItem['image']: 
                file_name = f"{newItem['id']}_exercise_image.jpg"
                image_url = upload_image_to_storage(newItem['image'], file_name)
                doc_ref.update({
                    'total': int(newItem['total']),
                    'name': newItem['name'],
                    'image_url': image_url 
                })
            else:
                doc_ref.update({
                    'total': int(newItem['total']),
                    'name': newItem['name']
                })
                
            return {"message": "Actualización realizada"}
        else:
            print(f"It was not find an item with the id: {newItem['id']}")
            return {"message": "The item was not found"}

    except Exception as e:
        print(f"Error actualizando el item: {e}")
        raise RuntimeError("No se pudo actualizar el item")


def update_item_manteinance(id):
    try:
        exercises_ref = db.collection('inventory')
        doc_ref = exercises_ref.document(id)
        doc = doc_ref.get()
        print("id",id)
        if doc.exists:
            current_data = doc.to_dict()
            maintenance_value = current_data.get('mantainance', 'no')
            new_value = 'no' if maintenance_value == 'yes' else 'yes'
            doc_ref.update({'mantainance': new_value})
            print(f"Campo 'mantainance' actualizado a: {new_value}")
        else:
            print("El documento no existe")
    except Exception as e:
        print(f"Error actualizando el item: {e}")
        raise RuntimeError("No se pudo actualizar el item")