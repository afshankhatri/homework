import random
import re
from flask import jsonify
from datetime import datetime
from static.functions.db_connections_functions import execute_query  # Importing the connection pool and execute_query from db_connections_functions
import logging

# # Set up logging
# logging.basicConfig(level=print, format='%(asctime)s - %(levelname)s - %(message)s')

# Generate random form ID
def generate_form_id():
    try:
        original_id = 'abcd1234'
        id_list = list(original_id)
        random.shuffle(id_list)
        return ''.join(id_list)
    except Exception as e:
        logging.error(f"Error in generate_form_id: {e}")
        return None

def is_item_already_initiated(name, product_ids):
    try:
        query = """
            SELECT ProductID FROM handover_data
            WHERE Sender = %s AND Status = 'Pending'
        """
        result = execute_query(query, (name,))
        print("this is the result of calling productids which are pending on that person", result)
        
        # Convert ProductID from string to integer in the result to match product_ids type
        transaction_product_ids = set(int(item['ProductID']) for item in result if item['ProductID'].isdigit())
        
        # Find common ProductIDs
        common_product_ids = list(set(product_ids) & transaction_product_ids)
        return common_product_ids
    except Exception as e:
        logging.error(f"Error in is_item_already_initiated: {e}")
        return []


# Fetch dropdown values from the user_info table
def receive_destination_dropdown_values():
    try:
        query = """
            SELECT Name, ID AS EmployeeID, Project FROM user_info
            WHERE TypeOfAccount != 'Admin'
            AND Name IS NOT NULL
            AND Project IS NOT NULL
            AND ID IS NOT NULL
        """
        result = execute_query(query)
        
        # Create a dictionary with project as the key and [EmployeeID, Name] as values
        project_emp_dict = {}
        for row in result:
            project = row['Project']
            emp_id = row['EmployeeID']
            name = row['Name']
            if project in project_emp_dict:
                project_emp_dict[project].append([emp_id, name])
            else:
                project_emp_dict[project] = [[emp_id, name]]
        
        # print(f'This is the project-employee dictionary: {project_emp_dict}')
        return project_emp_dict
    except Exception as e:
        logging.error(f"Error in receive_destination_dropdown_values: {e}")
        return {}




def process_form_data(form_data):
    try:
        # Extract form details
        form_details = form_data[0]
        source = form_details.get('Source', '')
        destination = form_details.get('Destination', '')
        senderid = form_details.get('Senderid', '')
        sendername = form_details.get('Sendername', '')
        receiver = form_details.get('Receiverid', '')
        receivername = form_details.get('Receivername', '')

        # Define the queries to get the manager names
        sender_manager_query = "SELECT Manager FROM projects_managers WHERE Projects = %s"
        receiver_manager_query = "SELECT Manager FROM projects_managers WHERE Projects = %s"

        # Execute the queries to get manager names
        sender_result = execute_query(sender_manager_query, (source,))
        receiver_result = execute_query(receiver_manager_query, (destination,))

        # Assuming execute_query returns a list of tuples, extract the manager names
        sender_manager_name = sender_result[0]['Manager'] if sender_result else "Unknown Manager"
        receiver_manager_name = receiver_result[0]['Manager'] if receiver_result else "Unknown Manager"


        # Format the source and destination with manager names
        formatted_source = f"{source} ({sender_manager_name})"
        formatted_destination = f"{destination} ({receiver_manager_name})"

        # Extract item details
        item_details = form_data[1:]

        # Generate a unique FormID
        query = "SELECT FormID FROM handover_data"
        result = execute_query(query)

        # If no result is found (table is empty), use the generated FormID
        if not result:
            print("No existing FormIDs found in handover_data table. Using generated FormID.")
            unique_form_id = generate_form_id()
        else:
            # Get the FormIDs from the query result
            form_ids = [item['FormID'] for item in result]
            unique_form_id = generate_form_id()
            
            # Ensure the generated FormID is unique
            while unique_form_id in form_ids:
                unique_form_id = generate_form_id()

        # Prepare the insert query for new handover_data
        query = """
            INSERT INTO handover_data (
                FormID, Source, Destination, Sender, Receiver, Category, Name, Make, Model, 
                ProductID, SenderCondition, SenderRemarks, InitiationDate, Status, EwayBillNo, 
                ReceiverCondition, ReceiverRemark, ApprovalToSend, ApprovalToReceive, 
                CompletionDate, Sendername, Receivername, ewayreason, DisapproveRemarks, ProductSerial
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        
        current_date_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        for item in item_details:
            sender_remarks = item.get('SenderRemarks', '-')  # Default value '-'
            data_tuple = (
                unique_form_id, formatted_source, formatted_destination, senderid, receiver, 
                item.get('Category', ''), item.get('Name', ''), item.get('Make', ''), item.get('Model', ''), 
                item.get('ProductID', ''), item.get('SenderCondition', ''), sender_remarks, 
                current_date_time, 'Pending', '-', '-', '-', '-', '-', '-', 
                sendername, receivername, '-', '-', item.get('ProductSerial', '')
            )
            
            # Log the query and the data being inserted for debugging purposes
            # print(f"Inserting data with FormID {unique_form_id}: {data_tuple}")
            
            # Execute the query and commit the transaction
            execute_query(query, data_tuple, commit=True)
        
        print(f"Form data successfully inserted into the handover_data table with FormID: {unique_form_id}")
        return {'message': 'Data successfully inserted into the handover_data table.'}
    
    except Exception as e:
        logging.error(f"Error processing form data: {e}")
        return {'error': str(e)}




# Function to get cart items for a user
def cart_items_function(name, project, session_data):
    try:
        # Fetch cart items from the inventory
        query = """
            SELECT ProductID, Category, Name, Make, Model, ProductSerial, Project, Owner
            FROM inventory
            WHERE Owner = %s
        """
        data = execute_query(query, (name,))

        # Extract Product IDS for checking initiation
        serial_nos = [item['ProductID'] for item in data]

        # Check which items are already initiated
        already_initiated_items = is_item_already_initiated(name, serial_nos)

        # Remove already initiated items from data
        data = [item for item in data if item['ProductID'] not in already_initiated_items]

        # Fetch dropdown values
        dropdownvalues = receive_destination_dropdown_values()

        # Collect all projects for the sender
        sender_projects = list(set(item['Project'] for item in data))

        # Create combined data
        combined_data = [data, dropdownvalues, [{'Name': name, 'Project': project}], session_data, sender_projects]
        # print(f'Combined data after adding session data: {combined_data}')

        return combined_data
    
    except Exception as e:
        logging.error(f"Error in cart_items_function: {e}")
        return {'error': str(e)}
