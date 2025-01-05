from flask import Flask, request, jsonify
from flask_cors import CORS
from services.attendanceRoutes import mark_attendance


    
def mark_attendance_route(eventId,dateInicio,dateEnd,userMail):
    try:
        created_attandance = mark_attendance(eventId,dateInicio,dateEnd,userMail)
        return jsonify(created_attandance), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
