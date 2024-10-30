from flask import Flask, request, jsonify
from flask_cors import CORS
from services.membershipsRoutes import get_unique_user_membership,use_membership_class,get_memb_user,unuse_membership_class


def get_unique_user_membership_route():
    try:
        user = get_unique_user_membership()
        return jsonify(user), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 500

def use_membership_class_route(classId,membId):
    try:
        membresia = use_membership_class(classId,membId)
        return jsonify({"message": "Membresia actualizada exitosamente"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def unuse_membership_class_route(classId,membId):
    try:
        membresia = unuse_membership_class(classId,membId)
        return jsonify({"message": "Membresia actualizada exitosamente"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def get_memb_user_route():
    try:
        classes_list = get_memb_user()
        return jsonify(classes_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500