from flask import Flask, request, jsonify
from flask_cors import CORS
from Controllers.classesController import add_calification_route,get_comments_route,get_classes_route, create_class_route,book_class_route,book_class_with_gem_route,unbook_class_route,delete_class_route,update_class_info_route
from Controllers.usersController import leave_ranking_route,join_ranking_route,get_rankings_route,create_ranking_route,use_geme_route,get_unique_user_by_email_route ,get_user_route, send_email_route, create_user_route,get_users_route,get_coach_users_route,get_clients_users_route,get_client_users_no_match_routine_route,update_users_info_route
from Controllers.excersicesController import create_exersice_route,get_excersice_by_owner_route,get_excersices_route,update_exer_info_route
from Controllers.routineController import create_routine_route,assign_routine_to_user_route,get_routines_route,get_assigned_routines_route,update_routine_info_route,delete_routine_route
from Controllers.salasController import get_salas_route
from Controllers.missionsController import add_mission_progress_route,get_missions_route,delete_missions_route,get_missions_progress_route,get_missions_template_route,assign_mission_route
from Controllers.membershipController import edit_memb_price_route,get_unique_user_membership_route,get_membership_template_route,update_class_use_route,use_membership_class_route,get_memb_user_route,unuse_membership_class_route,aquire_membership_month_route
from Controllers.attendanceController import mark_attendance_route,get_coach_clients_assistance_route
from Controllers.inventoryController import get_inventory_route,create_inventory_route,update_item_info_route,update_item_manteinance_route
import jwt
import json
import re
from dateutil import parser
import datetime


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})



SECRET_KEY = 'mi_clave_secreta'

@app.route('/', methods=['GET'])
def default_route():
    return jsonify({'status': 'OK'})

# Users functions -------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------

# GET -------------------------------------------
#------------------------------------------------
#------------------------------------------------

@app.route('/get_user', methods=['GET'])
def get_user():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        password = request.args.get('password')
        mail = request.args.get('mail')
        patron = r'^[\w\.-]+(\+[\w\.-]+)?@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$'
        if re.match(patron, mail):
            return get_user_route(password,mail)
        else:
            return jsonify({'error':'Not a mail'})
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})
        
@app.route('/get_rankings', methods=['GET'])
def get_rankings():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        return get_rankings_route()
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

@app.route('/get_unique_user_by_email', methods=['GET'])
def get_unique_user_by_email():
    try:
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        username = request.args.get('mail')
        print("hgola")
        patron = r'^[\w\.-]+(\+[\w\.-]+)?@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$'
        if re.match(patron, username):
            print("1")
            return get_unique_user_by_email_route(username)
        else:
            print("2")
            return jsonify({'error':'Not a mail'})
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})


#------------------------------------------------
#------------------------------------------------

# PUT -------------------------------------------
#------------------------------------------------
#------------------------------------------------

@app.route('/use_geme', methods=['PUT'])
def use_geme():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        mail = request.json.get('mail')
        patron = r'^[\w\.-]+(\+[\w\.-]+)?@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$'
        if re.match(patron, mail):
            return use_geme_route(mail)
        else:
            return jsonify({'error':'Not a mail'})
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})
   
@app.route('/join_ranking', methods=['PUT'])
def join_ranking():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        rankingID = request.json.get('id')
        userMail = request.json.get('user')
        patron = r'^[\w\.-]+(\+[\w\.-]+)?@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$'
        if re.match(patron, userMail):
            return join_ranking_route(rankingID,userMail)
        else:
            return jsonify({'error':'Not a mail'})
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})
    
@app.route('/leave_ranking', methods=['PUT'])
def leave_ranking():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        rankingID = request.json.get('id')
        userMail = request.json.get('user')
        patron = r'^[\w\.-]+(\+[\w\.-]+)?@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$'
        if re.match(patron, userMail):
            return leave_ranking_route(rankingID,userMail)
        else:
            return jsonify({'error':'Not a mail'})
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})
    
@app.route('/update_users_info', methods=['PUT'])
def update_users_info():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        newUserInfo = request.json.get('newUser')
        campos_requeridos = {
            "Birthday": str,
            "Gemas": int,
            "Lastname": str,
            "Mail": str,
            "MissionsComplete": int, 
            "Name": str,
            "type": str,
            "uid": str
        }
        
        for campo, tipo in campos_requeridos.items():
            if campo not in newUserInfo:
                print(f"Falta el campo requerido: {campo}")
                return jsonify({'error':'Something went wrong'})
            if not isinstance(newUserInfo[campo], tipo):
                print(f"El campo '{campo}' debe ser de tipo {tipo.__name__}")
                return jsonify({'error':'Something went wrong'})
            if isinstance(newUserInfo[campo], str) and not newUserInfo[campo].strip():
                print(f"El campo '{campo}' no puede estar vacío")
                return jsonify({'error':'Something went wrong'})

        return update_users_info_route(newUserInfo)
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})
   
#------------------------------------------------
#------------------------------------------------

# POST -------------------------------------------
#------------------------------------------------
#------------------------------------------------

@app.route('/create_user', methods=['POST'])
def create_user():
    user = request.json
    campos_requeridos = {
        "uid": str,
        "Name": str,
        "Lastname": str,
        "Mail": str,
        "Birthday": str,
        "Gemas": int,  
        "MissionsComplete": int,
        "type": str
    }

    email_pattern = r'^[\w\.-]+(\+[\w\.-]+)?@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$'

    for campo, tipo in campos_requeridos.items():
        if campo not in user:
            return jsonify({'error':'Something went wrong'})
        if not isinstance(user[campo], tipo):
            return jsonify({'error':'Something went wrong'})
    if not re.match(email_pattern, user["Mail"]):
        return jsonify({'error':'Something went wrong'})
    if not user["Name"].strip():
        return jsonify({'error':'Something went wrong'})
    if not user["Lastname"].strip():
        return jsonify({'error':'Something went wrong'})
    if user["Gemas"] != 0:
        return jsonify({'error':'Something went wrong'})
    if user["MissionsComplete"] != 0:
        return jsonify({'error':'Something went wrong'})
    if user["type"] not in ["client", "coach"]:
        return jsonify({'error':'Something went wrong'})
    return create_user_route(user)

@app.route('/send_email', methods=['POST'])
def send_email():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        to_email = request.json.get('toEmail')
        patron = r'^[\w\.-]+(\+[\w\.-]+)?@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$'
        if re.match(patron, to_email):
            return send_email_route(to_email)
        else:
            return jsonify({'error':'Not a mail'})
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})

@app.route('/create_ranking', methods=['POST'])
def create_ranking():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        newRanking = request.json
        return create_ranking_route(newRanking)
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})

#------------------------------------------------
#------------------------------------------------

#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------

# Salas functions -------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------

# GET -------------------------------------------
#------------------------------------------------
#------------------------------------------------

@app.route('/get_salas', methods=['GET'])
def get_salas():
    return get_salas_route()

#------------------------------------------------
#------------------------------------------------

#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------

# Missions functions ----------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------

# GET -------------------------------------------
#------------------------------------------------
#------------------------------------------------

@app.route('/get_missions_progress', methods=['GET'])
def get_missions_progress():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        return get_missions_progress_route()
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})

@app.route('/get_missions_template', methods=['GET'])
def get_missions_template():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        return get_missions_template_route()
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})

@app.route('/get_missions', methods=['GET'])
def get_missions():
    return get_missions_route()

@app.route('/delete_missions', methods=['DELETE'])
def delete_missions():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        missions = request.form.get('misiones')
        
        return delete_missions_route(missions)
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})

#------------------------------------------------
#------------------------------------------------

# POST  -----------------------------------------
#------------------------------------------------
#------------------------------------------------

@app.route('/assign_mission', methods=['POST'])
def assign_mission():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        userId = request.form.get('uid')
        return assign_mission_route(userId)
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})

#------------------------------------------------
#------------------------------------------------

# DELETE  ---------------------------------------
#------------------------------------------------
#------------------------------------------------

@app.route('/add_mission_progress', methods=['DELETE'])
def add_mission_progress():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        missions = request.form.get('misiones')
        uid = request.form.get('uid')
        return add_mission_progress_route(missions,uid)
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})

#------------------------------------------------
#------------------------------------------------

#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------


# Membership functions --------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------

# GET -------------------------------------------
#------------------------------------------------
#------------------------------------------------

@app.route('/get_memb_user', methods=['GET'])
def get_memb_user():
    token = request.headers.get('Authorization')
    if not token or 'Bearer' not in token:
        return jsonify({'error':'Missing token'})
    return get_memb_user_route()

@app.route('/get_memberships', methods=['GET'])
def get_unique_user_membership():
    token = request.headers.get('Authorization')
    if not token or 'Bearer' not in token:
        return jsonify({'error':'Missing token'})
    return get_unique_user_membership_route()

@app.route('/get_membership_template', methods=['GET'])
def get_membership_template():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        return get_membership_template_route()
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})

#------------------------------------------------
#------------------------------------------------ 

# PUT -------------------------------------------
#------------------------------------------------
#------------------------------------------------
    
@app.route('/aquire_membership_month', methods=['PUT'])
def aquire_membership_month():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        startDate = request.json.get('inicio')
        uid = request.json.get('userId')
        endDate = request.json.get('fin')
        type_memb = request.json.get('type_memb')
        campos_requeridos = {
            "inicio": str,
            "userId": str,
            "fin": str,
            "type_memb": str
        }
        request_json = {
            "inicio": startDate,
            "userId": uid,
            "fin": endDate,
            "type_memb": type_memb
        }
        valores_validos_type_memb = {"never", "yearly", "monthly"}
        for campo, tipo in campos_requeridos.items():
            if campo not in request_json:
                return jsonify({'error':'Something went wrong'})
            if not isinstance(request_json[campo], tipo):
                return jsonify({'error':'Something went wrong'})
            if not request_json[campo].strip():
                return jsonify({'error':'Something went wrong'})

        if request_json["type_memb"] not in valores_validos_type_memb:
            return jsonify({'error':'Something went wrong'})
        return aquire_membership_month_route(startDate,uid,endDate,type_memb)
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

@app.route('/update_class_use', methods=['PUT'])
def update_class_use():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        users = request.form.get('usuarios')
        event = request.form.get('selectedEvent')
        return update_class_use_route(users,event)
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})

@app.route('/edit_memb_price', methods=['PUT'])
def edit_memb_price():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        type_user = request.json.get('tipo')
        price = request.json.get('precio') 
        print("precio",price)
        if not isinstance(float(price), float):
            return jsonify({'error':'Something went wrong'})
        if float(price) <= 0.00:
            return jsonify({'error':'Something went wrong'})
        return edit_memb_price_route(type_user,price)
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

#------------------------------------------------
#------------------------------------------------ 

#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------

# Attendance functions --------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------

# GET -------------------------------------------
#------------------------------------------------
#------------------------------------------------

@app.route('/get_coach_clients_assistance', methods=['GET'])
def get_coach_clients_assistance():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        return get_coach_clients_assistance_route()
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})

#------------------------------------------------
#------------------------------------------------

# POST  -----------------------------------------
#------------------------------------------------
#------------------------------------------------

@app.route('/attendance', methods=['POST'])
def mark_attendance():
    token = request.args.get('token')  
    if not token:
        return jsonify({'error': 'Token is required'}), 400

    try:
        decoded_token = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        event_id = decoded_token['eventId']
        dateInicio = decoded_token['start']
        dateEnd = decoded_token['end']
        userMail = decoded_token['userMail']
        patron = r'^[\w\.-]+(\+[\w\.-]+)?@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$'
        if re.match(patron, userMail):
            return mark_attendance_route(event_id,dateInicio,dateEnd,userMail)
        else:
            return jsonify({'error':'Not a mail'})

    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token had expired'}), 400
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Token invalid'}), 400
    
#------------------------------------------------
#------------------------------------------------
    
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------

# Inventory functions ---------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------

# GET -------------------------------------------
#------------------------------------------------
#------------------------------------------------

@app.route('/get_inventory', methods=['GET'])
def get_inventory():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        return get_inventory_route()
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})

#------------------------------------------------
#------------------------------------------------

# POST  -----------------------------------------
#------------------------------------------------
#------------------------------------------------

@app.route('/create_inventory', methods=['POST'])
def create_inventory():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        name = request.form.get('name')
        total = request.form.get('total')
        if not isinstance(int(total), int):
            print("error")
            return jsonify({'error':'Something went wrong'})
        if int(total) <= 0:
            print("error")
            return jsonify({'error':'Something went wrong'})
        image = request.files.get('image')
        image_data = None
        if image:
            image_data = image.read()  

        newItem = {
            'name': name,
            'total': int(total),
            'image': image_data,
            'mantainance' : 'no'
        }
        return create_inventory_route(newItem)
    except Exception as e:
        print("Error a")
        return jsonify({'error':'Something went wrong'})

#------------------------------------------------
#------------------------------------------------

@app.route('/update_item_info', methods=['PUT'])
def update_item_info():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        name = request.form.get('name')
        total = request.form.get('total')
        image_url = request.form.get('image_url')        
        image = request.files.get('image')
        image_data = None
        if image:
            image_data = image.read()  
        id = request.form.get('id')
        newItem = {
            'id' : id,
            'name': name,
            'total': total,
            'image_url': image_url,
            'image': image_data 
        }
        return update_item_info_route(newItem)
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})
    
@app.route('/update_item_manteinance', methods=['PUT'])
def update_item_manteinance():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        id = request.form.get('id')
        return update_item_manteinance_route(id)
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})

#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------


# Classes functions -----------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------

# GET -------------------------------------------
#------------------------------------------------
#------------------------------------------------
@app.route('/get_classes', methods=['GET'])
def get_classes():
    return get_classes_route()

@app.route('/get_comments', methods=['GET'])
def get_comments():
    return get_comments_route()

#------------------------------------------------
#------------------------------------------------

# POST  -----------------------------------------
#------------------------------------------------
#------------------------------------------------

@app.route('/create_class', methods=['POST'])
def create_class():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        new_class = request.json
        required_fields = ["name", "dateInicio", "dateFin", "hour", "reservations", 
                       "day", "permanent", "owner", "capacity", "sala", "BookedUsers"]

        for field in required_fields:
            if field not in new_class or new_class[field] in [None,""]:
                return jsonify({'error':'Something went wrong'})
        try:
            date_inicio = parser.isoparse(new_class["dateInicio"])
            date_fin = parser.isoparse(new_class["dateFin"])
            if date_fin < date_inicio + datetime.timedelta(minutes=30):
                return jsonify({'error':'Something went wrong'})
        except ValueError:
            return jsonify({'error':'Something went wrong'})

        now = datetime.datetime.now(datetime.UTC) 
        if date_inicio < now:
            return jsonify({'error':'Something went wrong'})

        if not re.match(r"^\d{2}:\d{2}$", new_class["hour"]):
            return jsonify({'error':'Something went wrong'})

        if not isinstance(new_class["reservations"], list):
            return jsonify({'error':'Something went wrong'})

        if new_class["permanent"] not in ["Si", "No"]:
            return jsonify({'error':'Something went wrong'})
        
        patron = r"^[\w\.\+-]+@[\w\.-]+\.\w+$"
        if not re.match(patron, new_class["owner"]):
            return jsonify({'error':'Something went wrong'})

        try:
            capacity = int(new_class["capacity"])
            if capacity <= 0:
                return jsonify({'error':'Something went wrong'})
        except ValueError:
            return jsonify({'error':'Something went wrong'})
        
        if not new_class["sala"].strip():
            return jsonify({'error':'Something went wrong'})
        
        return create_class_route(new_class)
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})
    

#------------------------------------------------
#------------------------------------------------


# PUT  ------------------------------------------
#------------------------------------------------
#------------------------------------------------

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
        place = request.form.get('sala')
        capacity = request.form.get('capacity')
        reservations_json = request.form.get('reservations')
        if reservations_json:
            reservations = json.loads(reservations_json)  
        else:
            reservations = []
        newClassInfo = {
            'cid' : cid,
            'DateFin': DateFin,
            'DateInicio': DateInicio,
            'Day':Day,
            'Name': name,
            'Hour':Hour,
            'Permanent':permanent,
            'sala':place,
            'capacity':capacity,
            'reservations':reservations
        }
        print("1")
        try:
            date_inicio = parser.isoparse(DateInicio)
            date_fin = parser.isoparse(DateFin)
            if date_fin < date_inicio + datetime.timedelta(minutes=30):
                print("2")
                return jsonify({'error':'Something went wrong'})
        except ValueError:
            print("3")
            return jsonify({'error':'Something went wrong'})
        print("20")
        now = datetime.datetime.now(datetime.UTC) 
        print("30")
        if parser.isoparse(DateInicio) < now:
            print("4")
            return jsonify({'error':'Something went wrong'})
        print("39")
        if not re.match(r"^\d{2}:\d{2}$", Hour):
            print("5")
            return jsonify({'error':'Something went wrong'})
        print("35")
        if not isinstance(reservations, list):
            print("6")
            return jsonify({'error':'Something went wrong'})
        if permanent not in ["Si", "No"]:
            print("7")
            return jsonify({'error':'Something went wrong'})
        print("33")
        try:
            capacity2 = int(capacity)
            if capacity2 <= 0:
                print("81")
                return jsonify({'error':'Something went wrong'})
        except ValueError:
            print("9")
            return jsonify({'error':'Something went wrong'})
        if not place.strip():
            print("10")
            return jsonify({'error':'Something went wrong'})
        return update_class_info_route(newClassInfo)
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
        uid = request.json.get('uid')
        patron = r'^[\w\.-]+(\+[\w\.-]+)?@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$'
        if re.match(patron, mail):
            return unbook_class_route(event,mail,uid)
        else:
            return jsonify({'error':'Not a mail'})
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
        uid = request.json.get('uid')
        patron = r'^[\w\.-]+(\+[\w\.-]+)?@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$'
        if re.match(patron, mail):
            return book_class_route(event,mail,uid)
        else:
            return jsonify({'error':'Not a mail'})
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})
    
@app.route('/book_class_with_gem', methods=['PUT'])
def book_class_with_gem():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        print("a")
        event = request.json.get('event')
        mail = request.json.get('mail')
        membId = request.json.get('membId')
        patron = r'^[\w\.-]+(\+[\w\.-]+)?@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$'
        if re.match(patron, mail):
            return book_class_with_gem_route(event,mail,membId)
        else:
            return jsonify({'error':'Not a mail'})
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})
    

@app.route('/add_calification', methods=['PUT'])
def add_calification():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        classId = request.json.get('event')
        calification = request.json.get('calification')
        commentary = request.json.get('commentary')        
        userId = request.json.get('user')
        if not isinstance(commentary, str):
            return jsonify({'error':'Something went wrong'})
        if not isinstance(calification, (int, float)):
            return jsonify({'error':'Something went wrong'})
        elif calification < 1 or calification > 5:
            return jsonify({'error':'Something went wrong'})
        return add_calification_route(classId,calification,commentary,userId)
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})
    
#------------------------------------------------
#------------------------------------------------

# DELETE ----------------------------------------
#------------------------------------------------
#------------------------------------------------
@app.route('/delete_class', methods=['DELETE'])
def delete_class():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        event = request.json.get('event')
        mail = request.json.get('mail')
        patron = r'^[\w\.-]+(\+[\w\.-]+)?@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$'
        if re.match(patron, mail):
            return delete_class_route(event,mail)
        else:
            return jsonify({'error':'Not a mail'})
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})
#------------------------------------------------
#------------------------------------------------

    

#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------



# Excersices functions --------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------

# GET -------------------------------------------
#------------------------------------------------
#------------------------------------------------

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

#------------------------------------------------
#------------------------------------------------
 
# PUT  ------------------------------------------
#------------------------------------------------
#------------------------------------------------
  
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
    
#------------------------------------------------
#------------------------------------------------

# POST  -----------------------------------------
#------------------------------------------------
#------------------------------------------------

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
        image_data = None
        if image:
            image_data = image.read()  

        newExersice = {
            'name': name,
            'description': description,
            'owner': owner,
            'image': image_data 
        }
        return create_exersice_route(newExersice)
    except Exception as e:
        print("Error a")
        return jsonify({'error':'Something went wrong'})
#------------------------------------------------
#------------------------------------------------

#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------



# Routine functions -----------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------

# GET -------------------------------------------
#------------------------------------------------
#------------------------------------------------

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

#------------------------------------------------
#------------------------------------------------

# DELETE ----------------------------------------
#------------------------------------------------
#------------------------------------------------

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

#------------------------------------------------
#------------------------------------------------

# POST ------------------------------------------
#------------------------------------------------
#------------------------------------------------

@app.route('/create_routine', methods=['POST'])
def create_routine():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        newRoutine = request.json
        name = newRoutine['name']
        if not name or name == '':
            return jsonify({'error':'Something went wrong'})
        description = newRoutine['description']
        if not description or description == '':
            return jsonify({'error':'Something went wrong'})
        routineExercises = newRoutine['excercises']
        if not routineExercises or len(routineExercises) == 0:
            return jsonify({'error':'Something went wrong'})

        for index, exercise in enumerate(routineExercises):
            reps = exercise['reps']
            if not isinstance(reps, list):
                return jsonify({'error':'Something went wrong'})
            else:
                parsed_reps = [float(item) if item else None for item in reps]
                if any(item is None or item == '' for item in parsed_reps):
                    return jsonify({'error':'Something went wrong'})
                elif any(isinstance(item, str) and not item.isdigit() for item in reps):
                    print(6)
                    return jsonify({'error':'Something went wrong'})

            timing = exercise['timing']
            if int(timing) == 0:
                print(7)
                return jsonify({'error':'Something went wrong'})
            print("8")
            series = exercise['series']
            if not isinstance(int(series), int) or int(series) <= 0:
                print(8)
                return jsonify({'error':'Something went wrong'})
            
        return create_routine_route(newRoutine)
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})

#------------------------------------------------
#------------------------------------------------

# PUT -------------------------------------------
#------------------------------------------------
#------------------------------------------------

@app.route('/update_routine_info', methods=['PUT'])
def update_routine_info():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        newRoutine = request.json.get('newRoutine')
        name = newRoutine['name']
        if not name or name == '':
            return jsonify({'error':'Something went wrong'})
        description = newRoutine['description']
        if not description or description == '':
            return jsonify({'error':'Something went wrong'})
        routineExercises = newRoutine['excercises']
        if not routineExercises or len(routineExercises) == 0:
            return jsonify({'error':'Something went wrong'})

        for index, exercise in enumerate(routineExercises):
            reps = exercise['reps']
            if not isinstance(reps, list):
                return jsonify({'error':'Something went wrong'})
            else:
                parsed_reps = [float(item) if item else None for item in reps]
                if any(item is None or item == '' for item in parsed_reps):
                    return jsonify({'error':'Something went wrong'})
                elif any(isinstance(item, str) and not item.isdigit() for item in reps):
                    print(6)
                    return jsonify({'error':'Something went wrong'})

            timing = exercise['timing']
            if int(timing) == 0:
                print(7)
                return jsonify({'error':'Something went wrong'})
            print("8")
            series = exercise['series']
            if not isinstance(int(series), int) or int(series) <= 0:
                print(8)
                return jsonify({'error':'Something went wrong'})
            
        return update_routine_info_route(newRoutine)
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
        if not isinstance(newAssignRoutine['id'], str) or not newAssignRoutine.get('id'):
            return jsonify({'error':'Something went wrong'})
        if not isinstance(newAssignRoutine['user'], list) or not newAssignRoutine['user'] or any(not isinstance(email, str) or not email for email in newAssignRoutine['user']):
            return jsonify({'error':'Something went wrong'})
        if not isinstance(newAssignRoutine['owner'], str) or not newAssignRoutine['owner']: 
            return jsonify({'error':'Something went wrong'})
        if not isinstance(newAssignRoutine['assigner'], str) or not newAssignRoutine['assigner']:   
            return jsonify({'error':'Something went wrong'})
        if not isinstance(newAssignRoutine['day'], str) or not newAssignRoutine['day']:  
            return jsonify({'error':'Something went wrong'})
        if not isinstance(newAssignRoutine['routine'], str) or not newAssignRoutine['routine']:  
            return jsonify({'error':'Something went wrong'})
        return assign_routine_to_user_route(newAssignRoutine)
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})

#------------------------------------------------
#------------------------------------------------

#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------

def generate_token(event_id,date_fin,date_inicio):
    payload = {
        'eventId': event_id,
        'start': date_inicio,
        'end':date_fin,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256') 
    return token

def generate_token_userSide(event_id,date_fin,date_inicio,user_id):
    payload = {
        'eventId': event_id,
        'userMail':user_id,
        'start': date_inicio,
        'end':date_fin,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256') 
    return token

@app.route('/generate-token/<event_id>/<date_fin>/<date_inicio>', methods=['GET'])
def generate_qr_token(event_id,date_fin,date_inicio):
    token = generate_token(event_id,date_fin,date_inicio)  
    return jsonify({'token': token}), 200

@app.route('/generate-token-userSide/<event_id>/<date_fin>/<date_inicio>/<user_id>', methods=['GET'])
def generate_qr_token_userSide(event_id,date_fin,date_inicio,user_id):
    token = generate_token_userSide(event_id,date_fin,date_inicio,user_id)  
    return jsonify({'token': token}), 200

@app.route('/get_decoded_token', methods=['GET'])
def get_decoded_token():
    token = request.args.get('token')  
    if not token:
        return jsonify({'error': 'Token is required'}), 400
    try:
        decoded_token = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        event_id = decoded_token['eventId']
        dateInicio = decoded_token['start']
        dateEnd = decoded_token['end']
        return {'eventId':event_id,'start':dateInicio,'end':dateEnd}
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token ha expirado'}), 400
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Token inválido'}), 400


























if __name__ == '__main__':
    app.run(debug=True)
