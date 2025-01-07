from flask import jsonify
from static.functions.db_connections_functions import execute_query  # Ensure this import is correct

def get_name_from_id(target_id):
    try:
        # First, search in the 'user_info' table
        query = "SELECT Name FROM user_info WHERE ID = %s"
        result = execute_query(query, (target_id,))
        
        # If a matching result is found, return the ID
        if result:
            return result[0]['Name']  # Extracting 'ID' value from the first result
        
        # If not found in 'user_info', search in the 'managers_data' table
        query = "SELECT Name FROM managers_data WHERE ID = %s"
        result = execute_query(query, (target_id,))
        
        if result:
            return result[0]['Name']  # Extracting 'ID' from the first result in 'managers_data'
        else:
            return f"No matching ID found for name: {target_id}"

    except Exception as e:
        return f"An error occurred: {str(e)}"





def additem(data):
    try:
        # Extract values from the input data (JSON)
        category = data['category']
        name = data['name']
        make = data['make']
        model = data['model']
        product_id = data['productId']
        owner = data['owner']
        project = data['project']

        print(owner,project)
        # Get owner ID using get_name_from_id function
        owner_id = get_name_from_id(owner)

        print(owner_id)

        if isinstance(owner_id, str) and "error" in owner_id.lower():
            return jsonify({'message': owner_id}), 400  # Handle error when fetching owner_id


        # Get the max ProductID to generate a new one
        max_id_query = "SELECT MAX(ProductID) AS max_id FROM inventory"
        max_id_result = execute_query(max_id_query)

        new_product_id = 1  # Default to 1 if there are no entries yet
        if max_id_result and max_id_result[0]['max_id'] is not None:
            new_product_id = max_id_result[0]['max_id'] + 1

        # Insert new item into the inventory table
        insert_query = """
            INSERT INTO inventory (ProductID, Category, Name, Make, Model, ProductSerial, Owner, Project, `Condition`, Handover_Date, empname)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        params = (new_product_id, category, name, make, model, product_id, owner_id, project, 'Good', '-', owner)

        execute_query(insert_query, params, commit=True)

        return jsonify({'message': 'Item added successfully'})

    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500




def deleteitem(data):
    try:
        # Extract values from the input data (JSON)
        product_id = data['product_id']
        print("this is the product id", product_id)
        # Construct a DELETE query based on the provided data
        delete_query = """
            DELETE FROM inventory 
            WHERE ProductID = %s
        """
        params = (product_id)

        # Check if the item exists before trying to delete it
        check_query = """
            SELECT * FROM inventory
            WHERE ProductID = %s
        """
        item_exists = execute_query(check_query, params)

        if item_exists:
            # Execute the DELETE query
            execute_query(delete_query, params, commit=True)
            return jsonify({'message': 'Item deleted successfully'})
        else:
            return jsonify({'message': 'No matching item found in the database'}), 404

    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500


