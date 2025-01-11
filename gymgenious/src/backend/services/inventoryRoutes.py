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
