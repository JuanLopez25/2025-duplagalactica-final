from flask import Flask, request, jsonify
from flask_cors import CORS
from services.attendanceRoutes import mark_attendance,get_coach_clients_assistance


    
def mark_attendance_route(eventId,dateInicio,dateEnd,userMail):
    try:
        created_attandance_message = mark_attendance(eventId,dateInicio,dateEnd,userMail)
        return jsonify(created_attandance_message), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def get_coach_clients_assistance_route():
    try:
        attendance_list = get_coach_clients_assistance()
        return jsonify(attendance_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500