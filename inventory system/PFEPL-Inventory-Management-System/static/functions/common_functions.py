from flask import jsonify
from static.functions.db_connections_functions import execute_query  # Import the connection pool function

def extract_rows_from_db(form_id):
    try:
        # Prepare the SQL query to fetch rows based on FormID
        query = """
        SELECT * FROM handover_data
        WHERE FormID = %s
        """
        
        # Using the execute_query method for connection pooling
        result = execute_query(query, (form_id,))
        
        # If no data is found, return an empty JSON
        if not result:
            return jsonify({"message": "No data found for the provided FormID"})

        # print("Data extracted successfully from the database")
        return result

    except Exception as e:
        print(f"Error in extract_rows_from_db: {str(e)}")
        return jsonify({"error": "Error extracting data from the database"})
