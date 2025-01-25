from flask import Flask, request, jsonify
from flask_cors import CORS
from services.membershipsRoutes import edit_memb_price,get_membership_template,get_unique_user_membership,update_class_use,use_membership_class,get_memb_user,unuse_membership_class,aquire_membership_month


def get_unique_user_membership_route():
    try:
        user_membership = get_unique_user_membership()
        return jsonify(user_membership), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 500

def get_membership_template_route():
    try:
        membership_template = get_membership_template()
        return jsonify(membership_template), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 500

def use_membership_class_route(classId,membId):
    try:
        use_membership_class(classId,membId)
        return jsonify({"message": "Membrship used successfuly"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def edit_memb_price_route(tipo,precio):
    try:
        edit_memb_price(tipo,precio)
        return jsonify({"message": "Membrship updated successfuly"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def unuse_membership_class_route(classId,membId):
    try:
        unuse_membership_class(classId,membId)
        return jsonify({"message": "Membrship unused successfuly"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def aquire_membership_month_route(startDate,uid,endDate,type_memb):
    try:
        aquire_membership_month(startDate,uid,endDate,type_memb)
        return jsonify({"message": "Membership aquired successfuly"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def get_memb_user_route():
    try:
        memberships_users = get_memb_user()
        return jsonify(memberships_users), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def update_class_use_route(users,selectedEvent):
    try:
        update_class_use(users,selectedEvent)
        return jsonify({"message": "Class used correctly"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500