from flask import Flask, request, jsonify
from flask_cors import CORS
from services.classesRoutes import add_calification,get_classes, create_class,book_class,unbook_class,delete_class,update_class_info,get_comments



def get_classes_route():
    try:
        classes_list = get_classes()
        return jsonify(classes_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def get_comments_route():
    try:
        classes_list = get_comments()
        return jsonify(classes_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def create_class_route(new_class):
    try:
        new_class = request.json
        created_class = create_class(new_class)
        return jsonify(created_class), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
  
def add_calification_route(classId,calification,commentary,userId):
    try:
        clasification_created = add_calification(classId,calification,commentary,userId)
        return jsonify(clasification_created), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def book_class_route(event,mail):
    try:
        book_class(event,mail)
        return jsonify({"message": "Class booked successfull"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def unbook_class_route(event,mail):
    try:
        unbook_class(event,mail)
        return jsonify({"message": "Class unbooked successfull"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def delete_class_route(event,mail):
    try:
        delete_class(event,mail)
        return jsonify({"message": "Class deleted successfull"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def update_class_info_route(newClass):
    try:
        update_class_info(newClass)
        return jsonify({"message": "Class updated successful"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
