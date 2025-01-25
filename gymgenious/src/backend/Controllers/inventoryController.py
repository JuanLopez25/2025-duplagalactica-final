from flask import Flask, request, jsonify
from services.inventoryRoutes import get_inventory,create_inventory


def get_inventory_route():
    try:
        inventory_list = get_inventory()
        return jsonify(inventory_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def create_inventory_route(item):
    try:
        item_created = create_inventory(item)
        return jsonify(item_created), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 500