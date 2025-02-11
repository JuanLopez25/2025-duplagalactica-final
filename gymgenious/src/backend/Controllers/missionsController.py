from flask import Flask, request, jsonify
from flask_cors import CORS
from services.missionsRoutes import add_mission_progress,add_missions,get_missions,delete_missions,get_missions_progress,get_missions_template,assign_mission

def add_missions_route(users,selectedEvent):
    try:
        added_mission = add_missions(users,selectedEvent)
        return jsonify(added_mission), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def assign_mission_route(users):
    try:
        assignes_mission = assign_mission(users)
        return jsonify(assignes_mission), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def get_missions_route():
    try:
        missions = get_missions()
        return jsonify(missions), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def delete_missions_route(misiones):
    try:
        delete_missions(misiones)
        return jsonify({"message": "Mission deleted successfuly"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def add_mission_progress_route(misiones,uid):
    try:
        mission_progress = add_mission_progress(misiones,uid)
        return jsonify(mission_progress), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def get_missions_progress_route():
    try:
        mission_progress = get_missions_progress()
        return jsonify(mission_progress), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
      
def get_missions_template_route():
    try:
        misssions_templates = get_missions_template()
        return jsonify(misssions_templates), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500