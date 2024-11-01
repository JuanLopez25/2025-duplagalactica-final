from flask import Flask, request, jsonify
from flask_cors import CORS
from services.missionsRoutes import add_missions,get_missions,delete_missions

def add_missions_route(usuarios,selectedEvent):
    try:
        created_class = add_missions(usuarios,selectedEvent)
        return jsonify(created_class), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def get_missions_route():
    try:
        classes_list = get_missions()
        return jsonify(classes_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def delete_missions_route(misiones):
    try:
        deleted_missions = delete_missions(misiones)
        return jsonify({"message": "Clase eliminada exitosamente"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500