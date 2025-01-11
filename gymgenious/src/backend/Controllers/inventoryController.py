from flask import Flask, request, jsonify
from services.inventoryRoutes import get_inventory


def get_inventory_route():
    try:
        inventory_list = get_inventory()
        return jsonify(inventory_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    