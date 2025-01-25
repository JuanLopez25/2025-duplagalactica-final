from flask import Flask, request, jsonify
from services.salasRoutes import get_salas

def get_salas_route():
    try:
        room_list = get_salas()
        return jsonify(room_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500