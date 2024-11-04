from flask import Flask, request, jsonify
from services.usersRoutes import use_geme,get_unique_user_by_email,get_coach_users, get_user, create_user, send_email,get_users,get_clients_users,get_client_users_no_match_routine,update_client_user

def use_geme_route(mail):
    try:
        booked_class = use_geme(mail)
        return jsonify({"message": "Usuario actualizado exitosamente"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def get_unique_user_by_email_route(mail):
    try:
        print(mail)
        user = get_unique_user_by_email(mail)
        print("controller final",user)
        return jsonify(user), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 500

def get_user_route(password,mail):
    try:
        password = request.args.get('password')
        mail = request.args.get('mail')
        user = get_user(mail, password)
        return jsonify(user), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 500

def create_user_route(user):
    try:
        user = request.json
        created_user = create_user(user)
        return jsonify(created_user), 201
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 500

def send_email_route(to_email):
    try:
        to_email = request.json.get('toEmail')
        result = send_email(to_email)
        return jsonify(result), 200
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 500

def get_users_route():
    try:
        users_list = get_users()
        return jsonify(users_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def get_clients_users_route():
    try:
        users_list = get_clients_users()
        return jsonify(users_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def get_coach_users_route():
    try:
        users_list = get_coach_users()
        return jsonify(users_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def get_client_users_no_match_routine_route(routine):
    try:
        users_list = get_client_users_no_match_routine(routine)
        return jsonify(users_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def update_users_info_route(newUser):
    try:
        update_client_user(newUser)
        return jsonify({"message": "Usuario actualizado exitosamente"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
