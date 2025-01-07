import mysql.connector
from static.functions.db_connections_functions import execute_query
from datetime import datetime
from flask import jsonify

from flask import jsonify
import mysql.connector
import pandas as pd
from static.functions.db_connections_functions import execute_query

def receive_items_table_data_function(name, session_data):
    try:
        # Prepare SQL query to fetch filtered data (without deduplication in SQL)
        query = """
        SELECT * FROM handover_data
        WHERE Receiver = %s
        AND ApprovalToSend = 1
        AND ApprovalToReceive = '-'
        AND CompletionDate = '-'
        ORDER BY InitiationDate DESC
        """

        # Execute query using connection pooling
        filtered_data = execute_query(query, (name,))

        # If no data is found, return empty response
        if not filtered_data:
            return jsonify({
                "filtered_data": [],
                "session_data": session_data
            })

        # Convert the result to a pandas DataFrame for easier manipulation
        df = pd.DataFrame(filtered_data)

        # Remove duplicates based on 'FormID', keeping the latest row (sorted by 'InitiationDate')
        df = df.drop_duplicates(subset='FormID', keep='first')

        # Convert DataFrame back to a list of dictionaries
        filtered_data_unique = df.to_dict(orient='records')

        # Combine the filtered data with session data
        combined_data = {
            "filtered_data": filtered_data_unique,
            "session_data": session_data
        }

        # Return the combined data as JSON
        return jsonify(combined_data)

    except mysql.connector.Error as err:
        return jsonify({"error": f"MySQL error: {str(err)}"})
    except Exception as e:
        return jsonify({"error": f"Error: {str(e)}"})


def receive_approval_request_function(form_data):
    try:
        form_no = form_data[0]['FormID']
        current_datetime = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        # Iterate through the form data (excluding the first dictionary)
        for form_item in form_data[1:]:
            serial_no = form_item['SerialNo']
            receiver_condition = form_item['ReceiverCondition']
            receiver_remark = form_item['ReceiverRemark']

            # Prepare query to find matching FormID and ProductID
            select_query = """
            SELECT * FROM handover_data
            WHERE FormID = %s AND ProductID = %s
            """
            match_row = execute_query(select_query, (form_no, serial_no))

            if match_row:
                # Prepare query to update the handover_data table
                if form_item['Reached']:
                    update_query = """
                    UPDATE handover_data
                    SET ReceiverCondition = %s, ReceiverRemark = %s, CompletionDate = %s
                    WHERE FormID = %s AND ProductID = %s
                    """
                    execute_query(update_query, (receiver_condition, receiver_remark, current_datetime, form_no, serial_no), commit=True)
                else:
                    update_query = """
                    UPDATE handover_data
                    SET ReceiverCondition = %s, ReceiverRemark = %s, CompletionDate = 0
                    WHERE FormID = %s AND ProductID = %s
                    """
                    execute_query(update_query, (receiver_condition, receiver_remark, form_no, serial_no), commit=True)

        return "Data processed successfully"

    except mysql.connector.Error as err:
        return jsonify({"error": f"MySQL error: {str(err)}"})
    except Exception as e:
        return jsonify({"error": f"Error: {str(e)}"})

def disapprove_receive_approval_request_function(form_data):
    try:
        form_no = form_data['formNo']
        remarks = form_data['remarks']

        # Prepare query to update the status to 'Rejected' and add DisapproveRemarks
        update_query = """
        UPDATE handover_data
        SET Status = 'Rejected', CompletionDate = 0, DisapproveRemarks = %s
        WHERE FormID = %s
        """
        execute_query(update_query, (remarks, form_no), commit=True)

        return "Disapproval has been successfully recorded"

    except mysql.connector.Error as err:
        return jsonify({"error": f"MySQL error: {str(err)}"})
    except Exception as e:
        return jsonify({"error": f"Error: {str(e)}"})
