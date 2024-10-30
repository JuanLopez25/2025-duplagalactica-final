from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import firebase_admin
from firebase_admin import credentials, firestore
from Controllers.classesController import get_classes_route, create_class_route,book_class_route,unbook_class_route,delete_class_route,update_class_info_route
from Controllers.usersController import get_unique_user_by_email_route ,get_user_route, send_email_route, create_user_route,get_users_route,get_coach_users_route,get_clients_users_route,get_client_users_no_match_routine_route,update_users_info_route
from Controllers.excersicesController import create_exersice_route,get_excersice_by_owner_route,get_excersices_route,update_exer_info_route
from Controllers.routineController import create_routine_route,assign_routine_to_user_route,get_routines_route,get_assigned_routines_route,update_routine_info_route,delete_routine_route
from Controllers.salasController import get_salas_route
from Controllers.membershipController import get_unique_user_membership_route,use_membership_class_route,get_memb_user_route,unuse_membership_class_route

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})



@app.route('/get_classes', methods=['GET'])
def get_classes():
    return get_classes_route()


@app.route('/get_memb_user', methods=['GET'])
def get_memb_user():
    return get_memb_user_route()

@app.route('/get_salas', methods=['GET'])
def get_salas():
    return get_salas_route()

@app.route('/create_class', methods=['POST'])
def create_class():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        new_class = request.json
        return create_class_route(new_class)
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})

@app.route('/update_class_info', methods=['PUT'])
def update_class_info():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        cid = request.form.get('cid')
        name = request.form.get('Name')
        DateFin = request.form.get('DateFin')
        DateInicio = request.form.get('DateInicio')  
        Day = request.form.get('Day')       
        Hour = request.form.get('Hour')
        permanent = request.form.get('Permanent')
        sala = request.form.get('sala')
        capacity = request.form.get('capacity')
        newUser = {
            'cid' : cid,
            'DateFin': DateFin,
            'DateInicio': DateInicio,
            'Day':Day,
            'Name': name,
            'Hour':Hour,
            'Permanent':permanent,
            'sala':sala,
            'capacity':capacity
        }
        print(newUser)
        return update_class_info_route(newUser)
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})

@app.route('/book_class', methods=['PUT'])
def book_class():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        event = request.json.get('event')
        mail = request.json.get('mail')
        return book_class_route(event,mail)
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})
    

@app.route('/use_membership_class', methods=['PUT'])
def use_membership_class():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        classId = request.json.get('id')
        membId = request.json.get('membId')
        return use_membership_class_route(classId,membId)
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})



@app.route('/unuse_membership_class', methods=['PUT'])
def unuse_membership_class():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        classId = request.json.get('id')
        membId = request.json.get('membId')
        return unuse_membership_class_route(classId,membId)
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})

@app.route('/unbook_class', methods=['PUT'])
def unbook_class():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        event = request.json.get('event')
        mail = request.json.get('mail')
        return unbook_class_route(event,mail)
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})

@app.route('/delete_class', methods=['DELETE'])
def delete_class():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        event = request.json.get('event')
        mail = request.json.get('mail')
        return delete_class_route(event,mail)
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})

@app.route('/delete_routine', methods=['DELETE'])
def delete_routine():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        event = request.json.get('event')
        return delete_routine_route(event)
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})

@app.route('/get_unique_user_by_email', methods=['GET'])
def get_unique_user_by_email():
    username = request.args.get('mail')
    return get_unique_user_by_email_route(username)

@app.route('/get_memberships', methods=['GET'])
def get_unique_user_membership():
    return get_unique_user_membership_route()

@app.route('/get_user', methods=['GET'])
def get_user():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        password = request.args.get('password')
        mail = request.args.get('mail')
        return get_user_route(password,mail)
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})

@app.route('/create_user', methods=['POST'])
def create_user():
    user = request.json
    return create_user_route(user)

@app.route('/send_email', methods=['POST'])
def send_email():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        to_email = request.json.get('toEmail')
        return send_email_route(to_email)
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})


@app.route('/update_users_info', methods=['PUT'])
def update_users_info():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        newUser = request.json.get('newUser')
        return update_users_info_route(newUser)
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})

@app.route('/update_routine_info', methods=['PUT'])
def update_routine_info():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        newRoutine = request.json.get('newRoutine')
        return update_routine_info_route(newRoutine)
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})

@app.route('/update_exer_info', methods=['PUT'])
def update_exer_info():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        name = request.form.get('name')
        description = request.form.get('description')
        image_url = request.form.get('image_url')        
        image = request.files.get('image')
        image_data = None
        if image:
            image_data = image.read()  
        id = request.form.get('id')
        newExersice = {
            'id' : id,
            'name': name,
            'description': description,
            'image_url': image_url,
            'image': image_data 
        }
        return update_exer_info_route(newExersice)
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})



@app.route('/get_users', methods=['GET'])
def get_users():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        return get_users_route()
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})

@app.route('/get_client_users', methods=['GET'])
def get_client_users():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        return get_clients_users_route()
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})
    
@app.route('/', methods=['GET'])
def default_route():
    return jsonify({'status': 'OK'})
    
@app.route('/get_coach_users', methods=['GET'])
def get_coach_users():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        return get_coach_users_route()
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})

@app.route('/get_client_users_no_match_routine', methods=['GET'])
def get_client_users_no_match_routine():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        routine = request.args.get('routine')
        return get_client_users_no_match_routine_route(routine)
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})


@app.route('/get_excersice_by_owner', methods=['GET'])
def get_excersice_by_owner():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        owner = request.args.get('owner')
        return get_excersice_by_owner_route(owner)
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})

@app.route('/get_excersices', methods=['GET'])
def get_excersices():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        return get_excersices_route()
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})


@app.route('/create_exersice', methods=['POST'])
def create_exersice():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        name = request.form.get('name')
        description = request.form.get('description')
        owner = request.form.get('owner')        
        image = request.files.get('image')
        print("asi se ve la imagen",image)
        image_data = None
        if image:
            image_data = image.read()  

        newExersice = {
            'name': name,
            'description': description,
            'owner': owner,
            'image': image_data 
        }
        print(f'Datos recibidos: {name}, {description}, {owner}, {image}')
        return create_exersice_route(newExersice)
    except Exception as e:
        print("Error a")
        return jsonify({'error':'Something went wrong'})

@app.route('/create_routine', methods=['POST'])
def create_routine():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        newRoutine = request.json
        return create_routine_route(newRoutine)
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})


@app.route('/get_routines', methods=['GET'])
def get_routines():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        return get_routines_route()
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})

@app.route('/assign_routine_to_user', methods=['PUT'])
def assign_routine_to_user():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        newAssignRoutine = request.json
        return assign_routine_to_user_route(newAssignRoutine)
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})


@app.route('/get_assigned_routines', methods=['GET'])
def get_assigned_routines():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        return get_assigned_routines_route()
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})


if __name__ == '__main__':
    app.run(debug=True)
