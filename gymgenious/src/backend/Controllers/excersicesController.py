from flask import Flask, request, jsonify
from services.exercisesRoutes import create_excersice,get_excersice_by_owner,get_excersices,update_exer_info


def create_exersice_route(excersice):
    try:
        created_exercise = create_excersice(excersice)
        return jsonify(created_exercise), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 500 

def get_excersice_by_owner_route(owner):
    try:
        exercises_list = get_excersice_by_owner(owner)
        return jsonify(exercises_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def get_excersices_route():
    try:
        exercises_list = get_excersices()
        return jsonify(exercises_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def update_exer_info_route(newExercise):
    try:
        update_exer_info(newExercise)
        return jsonify({"message": "Exercise updated successfuly"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500