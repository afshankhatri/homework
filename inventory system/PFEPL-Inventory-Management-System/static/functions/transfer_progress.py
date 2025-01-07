from flask import jsonify
from static.functions.db_connections_functions import execute_query  # Import the connection pool function

def transfer_progress_table_data_function(name, projects, toa, session_data):
    try:
        # Prepare base query to fetch data
        base_query = """
        SELECT * FROM handover_data
        WHERE Status = 'Pending'
        """

        # Using connection pooling to fetch data
        if toa == "Employee":
            # If the user is an Employee, filter based on sender and receiver
            query_send = base_query + " AND Sender = %s"
            query_receive = base_query + " AND Receiver = %s"
            send_data = execute_query(query_send, (name,))
            receive_data = execute_query(query_receive, (name,))

        elif toa == "Manager":
            # If the user is a Manager, filter based on project or sender/receiver
            # Dynamically generate the placeholders for the number of projects
            placeholders = ', '.join(['%s'] * len(projects))

            # Query for sending approvals
            query_send = f"{base_query} AND (Source IN ({placeholders}) OR Sender = %s)"
            # Query for receiving approvals
            query_receive = f"{base_query} AND (Destination IN ({placeholders}) OR Receiver = %s)"

            # Pass the projects and name as parameters to the query
            send_data = execute_query(query_send, (*projects, name))
            receive_data = execute_query(query_receive, (*projects, name))

        else:
            # For other types, get all pending records
            send_data = execute_query(base_query)
            receive_data = execute_query(base_query)

        # Add TransactionType to both Send and Receive data
        for row in send_data:
            row["TransactionType"] = "Send"

        for row in receive_data:
            row["TransactionType"] = "Receive"

        # Combine the Send and Receive Data into a single list
        combined_data = send_data + receive_data

        # Remove duplicates based on 'FormID' (like drop_duplicates)
        unique_combined_data = {v['FormID']: v for v in combined_data}.values()

        # Sort the combined data by 'InitiationDate' in descending order
        sorted_combined_data = sorted(unique_combined_data, key=lambda x: x['InitiationDate'], reverse=True)

        # Prepare the final JSON object
        final_data = {"filtered_data": sorted_combined_data, "session_data": session_data}
        print("This is the final data:", final_data)

        return jsonify(final_data)  # Ensure the response is in JSON format

    except Exception as e:
        print(f"Error in transfer_progress_table_data_function: {str(e)}")
        # Return the error as JSON
        return jsonify({"error": "Error processing data"})
