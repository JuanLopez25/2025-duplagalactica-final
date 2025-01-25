from flask import Flask, request, jsonify
from services.routineRoutes import create_routine, assign_routine_to_user,get_routines,get_assigned_routines,update_routine_info,delete_routine


def create_routine_route(newRoutine):
    try:
        newRoutine = request.json
        created_routine = create_routine(newRoutine)
        return jsonify(created_routine), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 500
    
def assign_routine_to_user_route(newAssignRoutine):
    try:
        newAssignRoutine = request.json
        asssigned_routine = assign_routine_to_user(newAssignRoutine)
        return jsonify(asssigned_routine), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 500

def get_routines_route():
    try:
        routines_list = get_routines()
        return jsonify(routines_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def get_assigned_routines_route():
    try:
        assigned_routines_list = get_assigned_routines()
        return jsonify(assigned_routines_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def update_routine_info_route(newRoutine):
    try:
        update_routine_info(newRoutine)
        return jsonify({"message": "Routine updated successfuly"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def delete_routine_route(routine):
    try:
        delete_routine(routine)
        return jsonify({"message": "Routine deleted successfuly"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
