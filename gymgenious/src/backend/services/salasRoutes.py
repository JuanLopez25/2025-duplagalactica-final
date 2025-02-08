from firebase_config import db


def get_salas():
    try:
        places_ref = db.collection('salas')
        docs = places_ref.stream()
        places = [{'id': doc.id, **doc.to_dict()} for doc in docs]
        return places
    except Exception as e:
        print(f"Error while getting the rooms: {e}")
        raise RuntimeError("It was not possible to get the rooms")
