import pandas as pd
import json
from datetime import datetime
from flask import jsonify
from static.functions.db_connections_functions import execute_query  # Import the execute_query function from the db_connections_functions module

def approval_table_function(projects, session_data):
    try:

        # print(projects)
        # Query to filter based on the 'Source', 'ApprovalToSend', and 'Status' columns for sending approvals
        query_source = """
            SELECT *, 'Send' AS ApprovalType
            FROM handover_data
            WHERE Source IN (%s) AND ApprovalToSend = '-' AND Status = 'Pending' AND ApprovalToReceive = '-'
        """
        # Format the query for multiple project values
        formatted_query_source = query_source % ', '.join(['%s'] * len(projects))
        source_data = execute_query(formatted_query_source, tuple(projects))  # Using the execute_query function

        # Query to filter based on the 'Destination', 'CompletionDate', and 'Status' columns for receiving approvals
        query_destination = """
            SELECT *, 'Receive' AS ApprovalType
            FROM handover_data
            WHERE Destination IN (%s) AND CompletionDate != '-' AND Status = 'Pending'
        """
        formatted_query_destination = query_destination % ', '.join(['%s'] * len(projects))
        destination_data = execute_query(formatted_query_destination, tuple(projects))  # Using the execute_query function

        # Combine both source and destination data
        combined_data = source_data + destination_data

        # Remove duplicates based on 'FormID'
        seen_form_ids = set()
        combined_data_filtered = []
        for row in combined_data:
            if row['FormID'] not in seen_form_ids:
                combined_data_filtered.append(row)
                seen_form_ids.add(row['FormID'])

        # Sort by 'InitiationDate' in descending order
        combined_data_filtered.sort(key=lambda x: x['InitiationDate'], reverse=True)

        # Combine filtered data with session data
        response_data = {
            "filtered_data": combined_data_filtered,
            "session_data": session_data
        }

        print("this is the response data of approval table", response_data)
        # Return the response data as JSON
        return jsonify(response_data)

    except mysql.connector.Error as err:
        return jsonify({'error': f"MySQL error: {str(err)}"})

    except Exception as e:
        return jsonify({'error': str(e)})
