from flask import Flask, request, jsonify
from flask_cors import CORS
from services.missionsRoutes import add_missions

def add_missions_route(usuarios,selectedEvent):
    try:
        created_class = add_missions(usuarios,selectedEvent)
        return jsonify(created_class), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500