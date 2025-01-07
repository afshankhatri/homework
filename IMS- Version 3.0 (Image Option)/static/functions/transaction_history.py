from flask import jsonify
from static.functions.db_connections_functions import execute_query
import pandas as pd

def transaction_history_table_function(name, projects, toa, session_data):
    try:
        # Initialize empty lists for Send and Receive queries
        send_query = ""
        receive_query = ""
        query_params_send = []
        query_params_receive = []

        # Constructing SQL queries based on 'toa' (Type of Access)
        if toa == "Employee":
            send_query = """
                SELECT * FROM handover_data 
                WHERE Sender = %s AND Status != 'Pending'
            """
            receive_query = """
                SELECT * FROM handover_data 
                WHERE Receiver = %s AND Status != 'Pending'
            """
            query_params_send = [name]
            query_params_receive = [name]
        
        elif toa == "Manager":
            # Use multiple placeholders (%s) for the IN clause based on the length of projects
            project_placeholders = ','.join(['%s'] * len(projects))
            
            send_query = f"""
                SELECT * FROM handover_data 
                WHERE (Source IN ({project_placeholders}) OR Sender = %s) AND Status != 'Pending'
            """
            receive_query = f"""
                SELECT * FROM handover_data 
                WHERE (Destination IN ({project_placeholders}) OR Receiver = %s) AND Status != 'Pending'
            """
            query_params_send = projects + [name]
            query_params_receive = projects + [name]
        
        else:
            send_query = "SELECT * FROM handover_data WHERE Status != 'Pending'"
            receive_query = "SELECT * FROM handover_data WHERE Status != 'Pending'"

        # Execute the queries to get Send and Receive data
        Send_data = execute_query(send_query, query_params_send)
        Receive_data = execute_query(receive_query, query_params_receive)

        # Process the results
        if Send_data is None:
            Send_data = []
        if Receive_data is None:
            Receive_data = []

        # Convert the query result to pandas DataFrame
        Send_df = pd.DataFrame(Send_data)
        Receive_df = pd.DataFrame(Receive_data)

        # Update columns in the DataFrames
        Send_df["TransactionType"] = "Send"
        Receive_df["TransactionType"] = "Receive"

        # Combine the Send and Receive DataFrames
        combined_df = pd.concat([Send_df, Receive_df])

        # Remove duplicate entries based on 'FormID'
        combined_df = combined_df.drop_duplicates(subset=['FormID'])

        # Check if 'InitiationDate' exists before sorting
        if 'InitiationDate' in combined_df.columns:
            # Sort the DataFrame based on "InitiationDate"
            combined_df = combined_df.sort_values(by="InitiationDate", ascending=False)
        else:
            print("Warning: 'InitiationDate' column not found in data")

        # Convert the sorted DataFrame to dictionaries
        data_dict = combined_df.to_dict(orient='records')

        # Combine data dictionaries
        final_data = {"filtered_data": data_dict, "session_data": session_data}

        # Convert the final data to JSON format and return
        json_data = jsonify(final_data)
        print("Data processed and converted to JSON successfully")
        return json_data

    except Exception as e:
        print(f"Error in transaction_history_table_function: {str(e)}")
        return jsonify({"error": "Error converting data to JSON"})
