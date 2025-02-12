from flask import Flask, request, jsonify
from services.inventoryRoutes import get_inventory,create_inventory,update_item_info,update_item_manteinance


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
    
def update_item_info_route(newItem):
    try:
        update_item_info(newItem)
        return jsonify({"message": "Item updated successfuly"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def update_item_manteinance_route(item):
    try:
        update_item_manteinance(item)
        return jsonify({"message": "Item updated successfuly"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500