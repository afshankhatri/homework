from flask import Flask, request, render_template, jsonify
import subprocess
import json
import pandas as pd
from flask_cors import CORS  # Import CORS
from flask_cors import cross_origin
from itertools import count
import re
import os
import openpyxl
from datetime import datetime
from openpyxl import Workbook
from openpyxl import load_workbook
from flask import Flask, request, redirect, url_for
from bs4 import BeautifulSoup
from flask import session
from datetime import date
from dateutil import tz
from datetime import datetime as dt, timezone
import datetime
import datetime
from datetime import datetime
from flask import Flask, jsonify
import pandas as pd
from flask import Flask, request, render_template, jsonify
from flask import Flask, request, jsonify
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from flask import Flask, request, jsonify
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle
from reportlab.lib import colors
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from flask import Flask, jsonify, request
import pandas as pd
import random
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from flask import Flask, request, render_template_string
import pandas as pd
import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
from flask import request
import mysql.connector


from flask import Flask, jsonify, request
from datetime import datetime

from static.functions import handover
from static.functions import approvaltable
from static.functions.route_callings import page_routes
from static.functions import common_functions
from static.functions import approvesend
from static.functions import approvereceive
from static.functions import transfer_progress
from static.functions import receive_items
from static.functions import transaction_history
from static.functions import inventory
from static.functions import adddeleteitem
from static.functions.db_connections_functions import execute_query


app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
cors = CORS(app, resources={r"/handover_form": {"origins": "*"}})  # Enable CORS for /handover_form route
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'

app.register_blueprint(page_routes)



@app.route('/manager')
def manager():
    return render_template('manager.html')

@app.route('/epmloyee')
def employee():
    return render_template('employee.html')

    
@app.route('/get_username')
def get_username():

    name = session.get('login_row_data', {}).get('Name')

    return jsonify({'username': name})

@app.route('/login', methods=['POST'])
def login():
    try:
        # Get the username from the request
        username = request.form['username']
        print(f"[DEBUG] Received username: {username}")
        password = request.form['password']

        # Query to find the user in user_info
        userquery = """
            SELECT * FROM user_info
            WHERE Name = %s and Password = %s
        """
        
        # Execute the query for user_info
        print("[DEBUG] Executing user query...")
        matched_rows = execute_query(userquery, (username,password))  # Use a tuple
        print(f"[DEBUG] User query result: {matched_rows}")

        if matched_rows:
            session['login_row_data'] = matched_rows[0]  # Store the first matched row
            return jsonify({"status": "success", "message": "Login matched"}), 200

        
        else:
            print("[DEBUG] No user found, checking managers_data...")
            # If user not found, check managers_data
            managerquery = """
                SELECT * FROM managers_data
                WHERE Name = %s and Password = %s
            """
            matched_rows = execute_query(managerquery, (username,password))
            print(f"[DEBUG] Manager query result: {matched_rows}")

            if matched_rows:
                # If a manager is found, get their ID
                manager_name = matched_rows[0]["ID"]  # Assuming matched_rows is a list of dicts
                print(f"[DEBUG] Manager found: {matched_rows[0]}")
                print(f"[DEBUG] Manager ID: {manager_name}")

                # Query to find the manager's projects
                get_man_projs_query = """
                    SELECT Projects FROM projects_managers WHERE Manager = %s
                """
                print("[DEBUG] Executing project query...")
                get_manager_projects = execute_query(get_man_projs_query, (manager_name,))
                print(f"[DEBUG] Manager projects query result: {get_manager_projects}")

                # Create a list of projects from the results
                manager_projects = [proj["Projects"] for proj in get_manager_projects]  # Assuming it's a list of dicts
                print(f"[DEBUG] Projects associated with the manager: {manager_projects}")

                # Convert the list of projects into a comma-separated string
                project_string = ', '.join(manager_projects)  # Join the list into a string

                # Store the manager's data in session
                session['login_row_data'] = matched_rows[0]  # Store the first matched row
                session['login_row_data']['Project'] = project_string  # Store the comma-separated string
                print(f"[DEBUG] Entire session: {session}")

                # session['Project'] = manager_projects
                # print("[DEBUG] Session data updated:")
                # print(f"    login_row_data: {session['login_row_data']}")
                # print(f"    Project: {session['Project']}")

                # Return success message
                return jsonify({"status": "success", "message": "Login matched"}), 200
            else:
                # Return a "not found" message if account not found
                print("[DEBUG] Account not found for the given username.")
                return jsonify({"status": "fail", "message": "Account not found. Please try again or register."}), 404


    except Exception as e:
        print(f"[DEBUG] Error during login: {str(e)}")
        # Return an error message with a 500 status code
        return jsonify({"status": "error", "message": "An error occurred. Please try again later."}), 500




@app.route('/get_session_data', methods=['GET'])
def get_session_data():
    print('this is the session data', session['login_row_data'])
    if 'login_row_data' not in session:
        return jsonify({"error": "User data not found in session"}), 404
    
    return jsonify(session['login_row_data'])


@app.route('/cart_items')
def cart_items():

    # Get the name from session data
    name = session.get('login_row_data', {}).get('Name')
    # Get the project from session data
    session_data = session.get('login_row_data', {})
    projects = session.get('login_row_data', {}).get('Project', '').split(', ')
    data = handover.cart_items_function(name, projects,session_data)
    # print('this is the data hahahah',data)
    return jsonify(combined_data=data)



@app.route('/send_approval_request', methods=['POST'])
def send_approval_request():
    print('hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii')
    try:
        # Get form data from the request
        form_data = request.json
        #print('this is the send approval request form data',form_data)
        handover.process_form_data(form_data)
        
        return jsonify({'message': 'Excel file updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500



@app.route('/approval_table', methods=['GET'])
def approval_table():
    # Get the project from session data
    projects = session.get('login_row_data', {}).get('Project', '').split(', ')
    session_data = session.get('login_row_data', {})
    json_data = approvaltable.approval_table_function(projects, session_data)
    return json_data






@app.route('/approve_send_request', methods=['POST'])
def approve_send_request():
    form_data = request.json  # Assuming the form data is sent as JSON
    print("This is the approve_send_request form data", form_data)
    response = approvesend.approve_send_request_function( form_data)
    print("this is the response we are sending",response)
    return response


@app.route('/disapprove_send_request', methods=['POST'])
def disapprove_send_request():
    form_data = request.json  # Assuming the form data is sent as JSON
    print("This is the disapprove_send_request form data", form_data)
    approvesend.disapprove_send_request_function( form_data)                     
    return jsonify({'message': 'Data updated successfully.'})


@app.route('/approve_receive_request', methods=['POST'])
def approve_receive_request():

    data = request.json  # Assuming the data sent in the request body is JSON
    
    approvereceive.approve_receive_request_function(data)
    return "Approval has been successfully given, the email is sent, the sender may proceed to send the items"


@app.route('/disapprove_receive_request', methods=['POST'])
def disapprove_receive_request():

    data = request.json  # Assuming the data sent in the request body is JSON
    
    approvereceive.disapprove_receive_request_function( data)
    return "Approval has been successfully given, the email is sent, the sender may proceed to send the items"




@app.route('/transfer_progress_table_data')
def transfer_progress_table_data():
    try:
        name = session.get('login_row_data', {}).get('Name')
        projects = session.get('login_row_data', {}).get('Project', '').split(', ')
        toa = session.get('login_row_data', {}).get('TypeOfAccount')
        
        print('this is the session data', session.get('login_row_data', {}))
        session_data = session.get('login_row_data', {})
        data = transfer_progress.transfer_progress_table_data_function( name, projects, toa, session_data)
        
        # print("this the progress table data haha",data)
        return data
    except Exception as e:
        print(f"Error in transfer_progress_table_data main function : {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/receive_items_table_data', methods=['GET'])
def recieve_items_table_data():

    name = session.get('login_row_data', {}).get('Name')

    data = receive_items.receive_items_table_data_function(name,session.get('login_row_data', {}))

    #print('this is the data before returning for receive items table data')
    return data


@app.route('/receive_approval_request', methods=['POST'])
def receive_approval_request():
    form_data = request.json  # Assuming the form data is sent as JSON
    #print("This is the receive_approval_request form data", form_data)
    receive_items.receive_approval_request_function(form_data)
    return "Mail for approval of receiving item is sent, you may contact your manager to approve it."



@app.route('/disapprove_receive_approval_request', methods=['POST'])
def disapprove_receive_approval_request():
    form_data = request.json  # Assuming the form data is sent as JSON
    print(" diss form_data",form_data)
    print("This is the receive_approval_request form data", form_data)
    receive_items.disapprove_receive_approval_request_function(form_data)
    return "Mail for approval of receiving item is sent, you may contact your manager to approve it."






@app.route('/transaction_history_table', methods=['GET'])
def transaction_history_table():

    name = session.get('login_row_data', {}).get('Name')
    # Get the project from session data
    projects = session.get('login_row_data', {}).get('Project', '').split(', ')
    toa = session.get('login_row_data', {}).get('TypeOfAccount')
    session_data = session.get('login_row_data', {})
    data = transaction_history.transaction_history_table_function(name,projects,toa,session_data)
    print("history table data", data)
    return data

@app.route('/my_invent_dashboard')
def my_invent_dashboard():
    name = session.get('login_row_data', {}).get('Name', 'Unknown')
    print(session.get('login_row_data', {}))
    session_data = session.get('login_row_data', {})
    data = inventory.my_invent_dashboard_function(name,session_data)
    print('this is the myinvent data',data)
    return data



@app.route('/my_project_dashboard')
def my_project_dashboard():
    # Get the project from session data
    projects = session.get('login_row_data', {}).get('Project', '').split(', ')
    print('session data in my project inventory',session.get('login_row_data', {}))

    data = inventory.my_project_dashboard_function(projects,session.get('login_row_data', {}))
    print('my project inventory data',data)
    return data


@app.route('/invent_dashboard')
def invent_dashboard():
    data = inventory.invent_dashboard_function(session.get('login_row_data', {}))
    return data





@app.route('/additem', methods=['POST'])
def additem():
    # Get data from the POST request
    data = request.json


    result = adddeleteitem.additem(data)

    return result 
    



# @app.route('/deleteitem', methods=['POST'])
# def deleteitem():

#     # Get data from the POST request
#     data = request.json



#     result = adddeleteitem.deleteitem(data)
#     return result


@app.route('/get_employee_data_panel', methods=['GET'])
def get_employee_data_panel():
    try:
        # SQL query to fetch all employee data from the user_info table
        query = "SELECT * FROM user_info"
        
        # Execute the query to get employee data
        emp_data = execute_query(query)

        # Get session data (assuming session has login_row_data)
        session_data = session.get('login_row_data', {})

        # Combine session data and employee data into a single dictionary
        combined_data = {
            'session_data': session_data,
            'emp_data': emp_data
        }

        # Print the combined data for debugging
        # print(combined_data)

        # Return the combined data as JSON
        return jsonify(combined_data)

    except Exception as e:
        # Handle exceptions (e.g., database issues)
        return jsonify({'error': str(e)}), 500
















# Initialize an empty DataFrame
json_data = pd.DataFrame()

@app.route('/send_formid')
def send_formid():
    global json_data

    form_id = request.args.get('form_id')
    print('this is the formid', form_id)
    json_data = common_functions.extract_rows_from_db( form_id)
    # print('this is the filtered df by common function', json_data)
    # Do whatever you need to do with the form ID

    return "Form ID received successfully"



@app.route('/get_form_data')
def get_form_data():
    global json_data
    # print('this is the filtered df for the given form id', json_data)
    # Convert DataFrame to JSON

    return jsonify(json_data)



@app.route('/ewaybill_data')
def ewaybill_data():
    global json_data

    # Ensure json_data is a list of dictionaries
    if isinstance(json_data, str):
        json_data = json.loads(json_data)
    
    print("This is the JSON data for ewaybill data", json_data)
    
    # Extract the Source and Destination from the first dictionary in the list
    source = json_data[0]["Source"]
    print('This is the source:', source)
    
    destination = json_data[0]["Destination"]
    print('This is the destination:', destination)

    # Get address data
    address_data = ewaybill_address_data(source, destination)
    print('This is the address data:', address_data)

    # Combine the data
    combined_data = {
        'address_data': address_data,
        'json_data': json_data
    }
    print('This is the combined data for ewaybill_data:', combined_data)
    # jsonify(combined_data)
    # Return the combined data as JSON
    return jsonify(combined_data)


def ewaybill_address_data(source, destination):
    try:
        # SQL query to get source and destination data from the 'projects_managers' table
        source_query = """
            SELECT * FROM projects_managers WHERE Projects = %s
        """
        destination_query = """
            SELECT * FROM projects_managers WHERE Projects = %s
        """
        
        # Execute the queries
        source_data = execute_query(source_query, (source,))
        destination_data = execute_query(destination_query, (destination,))
        
        # Create a dictionary with source and destination data
        data_dict = {
            "Source": source_data,
            "Destination": destination_data
        }
        print("This is the data dict:", data_dict)
        return data_dict
    except Exception as e:
        return jsonify({'error': str(e)}), 500







@app.route('/update_employee_details', methods=['POST'])
def update_employee_details():
    try:
        # Get the data from the request
        req_data = request.get_json()
        name = req_data.get('Name')
        project = req_data.get('Project')
        email = req_data.get('email')
        phone = req_data.get('phone')

        # Query to check if the employee exists
        check_employee_query = """
            SELECT * FROM user_info 
            WHERE Name = %s AND TypeOfAccount = 'Employee'
        """
        employee_exists = execute_query(check_employee_query, (name,))

        if employee_exists:
            # Query to update the employee details
            update_employee_query = """
                UPDATE user_info 
                SET Project = %s, MailID = %s, PhoneNo = %s 
                WHERE Name = %s AND TypeOfAccount = 'Employee'
            """
            execute_query(update_employee_query, (project, email, phone, name), commit=True)
            return jsonify({'message': 'success'}), 200
        else:
            return jsonify({'error': 'Employee name not found or AccountType is not Employee'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500




@app.route('/delete_employee_details', methods=['POST'])
def delete_employee_details():
    try:
        # Get the data from the request
        req_data = request.get_json()
        name = req_data.get('Name')
        project = req_data.get('Project')
        email = req_data.get('email')
        phone = req_data.get('phone')

        print('Deleting employee data:', req_data)

        # Check if there are pending items in the 'inventory' table for this employee
        inventory_query = """
            SELECT * FROM inventory WHERE Owner = %s
        """
        inventory_data = execute_query(inventory_query, (name,))
        
        if inventory_data:
            return jsonify({'message': 'Pending Items'}), 400

        # Check if there are pending transactions in the 'handover_data' table for this employee
        handover_query = """
            SELECT * FROM handover_data 
            WHERE (Sender = %s OR Receiver = %s) 
            AND Status = 'Pending'
        """
        handover_data = execute_query(handover_query, (name, name))
        
        if handover_data:
            return jsonify({'message': 'Transaction Process'}), 400

        # Create a boolean mask for the condition
        employee_query = """
            SELECT * FROM user_info WHERE Name = %s AND TypeOfAccount = 'Employee'
        """
        employee_exists = execute_query(employee_query, (name,))
        
        # Check if the employee exists
        if employee_exists:
            # SQL query to delete the employee from 'user_info' table
            delete_employee_query = """
                DELETE FROM user_info WHERE Name = %s AND TypeOfAccount = 'Employee'
            """
            execute_query(delete_employee_query, (name,), commit=True)
            return jsonify({'message': 'success'}), 200
        else:
            return jsonify({'error': 'Employee name not found or AccountType is not Employee'}), 404

    except Exception as e:
        print(f"Error during employee deletion: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/get_projects_for_registration', methods=['GET'])
def get_projects_for_registration():
    try:
        # SQL query to get all project names
        query = "SELECT Projects FROM projects_managers"
        
        # Execute the query and fetch the results
        projects = execute_query(query)
        
        # Convert the list of projects into a comma-separated string
        projects_str = ', '.join([project['Projects'] for project in projects])
        
        # Return the string as JSON
        return jsonify({'projects': projects_str})

    except Exception as e:
        return jsonify({'error': str(e)}), 500



@app.route('/registeremployee', methods=['POST'])
def register_employee():
    try:

        # Access form data and strip whitespace
        form_data = {key: value.strip() if isinstance(value, str) else value for key, value in request.form.items()}

        # Extract form values after stripping whitespace
        name = form_data.get('name')
        id = form_data.get('id')
        mail = form_data.get('mail')
        phone = form_data.get('phone')
        typeofaccount = form_data.get('typeofaccount')
        project = form_data.get('project')

        # Print the details (for debugging purposes)
        print('formdetails', name, id, mail, phone, typeofaccount, project)

        # SQL query to check if employee already exists
        check_existing_query = "SELECT * FROM user_info WHERE ID = %s"
        existing_user = execute_query(check_existing_query, (id,))

        # If the employee already exists, return an error
        if existing_user:
            return jsonify({'status': 'error', 'message': 'already exists'}), 400
        
        # SQL query to check if employee already exists
        check_existing_query_manager = "SELECT * FROM managers_data WHERE ID = %s"
        existing_manager = execute_query(check_existing_query_manager, (id,))

        # If the employee already exists, return an error
        if existing_manager:
            return jsonify({'status': 'error', 'message': 'already exists'}), 400


        if (typeofaccount=="Employee"):
                
                # SQL query to insert a new employee into the user_info table
                insert_employee_query = """
                    INSERT INTO user_info (Name, ID, Password, TypeOfAccount, Project, MailID, PhoneNo)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                """
                execute_query(insert_employee_query, (id, name, id, typeofaccount, project, mail, phone), commit=True)

        else:
                # SQL query to insert a new employee into the user_info table
                insert_employee_query = """
                    INSERT INTO managers_data (Name, ID, Password, TypeOfAccount, MailID, PhoneNo)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """
        
                execute_query(insert_employee_query, (id, name, id, typeofaccount, mail, phone), commit=True)

        # Return success response
        return jsonify({'status': 'success', 'message': 'Registration successful'}), 200

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500



@app.route('/additem_projectowner', methods=['POST'])
def additem_projectowner():
    try:
        # Step 1: Get all projects and their associated managers
        project_query = "SELECT Projects, Manager FROM projects_managers"
        try:
            projects_info = execute_query(project_query)
            print("[DEBUG] Projects info retrieved successfully:", projects_info)
        except Exception as e:
            print("[ERROR] Failed to execute project query:", str(e))
            return jsonify({'error': 'Failed to retrieve projects'}), 500

        # Step 2: Get employee information from user_info
        user_query = """
            SELECT ID, Project 
            FROM user_info 
            WHERE TypeOfAccount != 'Admin'
        """
        try:
            user_info = execute_query(user_query)
            print("[DEBUG] User info retrieved successfully:", user_info)
        except Exception as e:
            print("[ERROR] Failed to execute user query:", str(e))
            return jsonify({'error': 'Failed to retrieve user information'}), 500

        # Step 3: Create a dictionary of users per project
        user_project_dict = {}
        for row in user_info:
            project = row['Project']
            name = row['ID']
            
            # Append user names to their respective project
            if project in user_project_dict:
                user_project_dict[project].append(name)
            else:
                user_project_dict[project] = [name]

        print("[DEBUG] User project dictionary:", user_project_dict)

        # Step 4: Create a dictionary of managers and concatenate with users per project
        project_emp_dict = {}

        for project_row in projects_info:
            project = project_row['Projects']
            manager = project_row['Manager']
            
            # Start with the manager in the list and append users if they exist for this project
            combined_list = [manager]  # Include manager first
            
            # Append users to the same project if available
            if project in user_project_dict:
                combined_list.extend(user_project_dict[project])

            # Store the combined list of manager + users for each project
            project_emp_dict[project] = combined_list
            print(f"[DEBUG] Combined list for project '{project}':", combined_list)

        print("[DEBUG] Final project-employee dictionary:", project_emp_dict)

        # Step 5: Read unique product categories from the inventory
        category_query = "SELECT category_name FROM categories"
        try:
            inventory_info = execute_query(category_query)
            print("[DEBUG] Inventory info retrieved successfully:", inventory_info)
        except Exception as e:
            print("[ERROR] Failed to execute category query:", str(e))
            return jsonify({'error': 'Failed to retrieve categories'}), 500

        # Extract unique categories from inventory data
        unique_category_list = [row['category_name'] for row in inventory_info]
        print("[DEBUG] Unique categories extracted:", unique_category_list)

        # Step 6: Combine everything into a final JSON response
        combined_data = {
            "project_emp_dict": project_emp_dict,
            "categories": unique_category_list,
            "session_data": session.get('login_row_data', {})  # Assuming session contains login data
        }

        print("[DEBUG] Combined data for response:", combined_data)
        return jsonify(combined_data)

    except Exception as e:
        print("[ERROR] An unexpected error occurred:", str(e))
        return jsonify({'error': 'An unexpected error occurred'}), 500



@app.route('/delete_item', methods=['POST'])
def delete_item():
    try:
        # Get the Product ID from the request
        product_id = request.json.get('product_id')
        
        print("this is the productid", product_id)

        # Query to check if the Product ID exists in the inventory
        check_product_query = "SELECT * FROM inventory WHERE ProductID = %s"
        product_exists = execute_query(check_product_query, (product_id,))

        if not product_exists:
            return jsonify({"message": "Product ID not found", "status": "fail"}), 404

        # Get the current timestamp for deletion date
        delete_date = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        # Query to insert the product into the afterdelete table
        insert_deleted_product_query = """
            INSERT INTO afterdelete (ProductID, Category, Name, Make, Model, ProductSerial, Project, Owner, `Condition` , Handover_Date, empname, Delete_Date)
            SELECT ProductID, Category, Name, Make, Model, ProductSerial, Project, Owner, `Condition`, Handover_Date, empname, %s 
            FROM inventory 
            WHERE ProductID = %s
        """
        execute_query(insert_deleted_product_query, (delete_date, product_id), commit=True)

        # Query to delete the product from the inventory
        delete_product_query = "DELETE FROM inventory WHERE ProductID = %s"
        execute_query(delete_product_query, (product_id,), commit=True)

        return jsonify({"message": "Product deleted successfully", "status": "success"}), 200

    except Exception as e:
        return jsonify({"message": str(e), "status": "error"}), 500




# -----------------------------------------------
#                  Project Section




@app.route('/get_unique_projects')
def get_unique_projects():
    try:
        # Query to get all the data from the projects_managers table
        query_projects = "SELECT * FROM projects_managers"
        project_data = execute_query(query_projects)

        # Query to get Manager ids from Manager_data table
        query_managers = "SELECT DISTINCT ID FROM managers_data;"
        manager_data = execute_query(query_managers)

        # print(project_data)
        # print(manager_data)
        # Attach manager data to project data
        return jsonify({'projects': project_data, 'managers': manager_data})

    except Exception as e:
        return jsonify({'error': str(e)}), 500






@app.route('/add_new_project', methods=['POST'])
def add_new_project():
    try:
        project_data = request.json

        # Strip whitespace from all string values in the incoming data
        project_data = {key: value.strip() if isinstance(value, str) else value for key, value in project_data.items()}

        print(f'Processed project_data: {project_data}')

        query = """
            INSERT INTO projects_managers (Projects, Address, GSTIN, STATE, State_Code, Manager)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        execute_query(query, (
            project_data['Project'], 
            project_data['Address'], 
            project_data['GSTIN'], 
            project_data['STATE'], 
            project_data['State_Code'], 
            project_data['Manager']
        ), commit=True)

        return jsonify({"message": "Project added successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500




from flask import jsonify, request

@app.route('/update_project_details', methods=['POST'])
def update_project_details():
    try:
        # Step 1: Parse the request data
        print("Received request to update project details.")
        updated_data = request.json
        
        # Check if updated_data is received correctly
        if not updated_data:
            print("No data received in the request.")
            return jsonify({"error": "No data received"}), 400
        print("Request data received:", updated_data)

        # Step 2: Validate the incoming data to ensure required fields exist
        required_fields = ['Project_id', 'Address', 'GSTIN', 'STATE', 'State_Code', 'Manager']
        
        # Check if all required fields are present in the request
        for field in required_fields:
            if field not in updated_data:
                print(f"Missing field: {field}")
                return jsonify({"error": f"Missing field: {field}"}), 400
        
        print("All required fields are present.")
        
        # Step 3: Strip whitespace from all string fields
        updated_data = {key: value.strip() if isinstance(value, str) else value for key, value in updated_data.items()}

        # Extract data
        project_id = updated_data['Project_id']
        address = updated_data['Address']
        gstin = updated_data['GSTIN']
        state = updated_data['STATE']
        state_code = updated_data['State_Code']
        manager = updated_data['Manager']
        
        print(f"Extracted data: Project_id={project_id}, Address={address}, GSTIN={gstin}, STATE={state}, State_Code={state_code}, Manager={manager}")

        # Step 3: Database query preparation
        query = """
            UPDATE projects_managers
            SET Address = %s, GSTIN = %s, STATE = %s, State_Code = %s, Manager = %s
            WHERE project_id = %s
        """
        
        print("Prepared query:", query)
        
        # Step 4: Execute the query
        try:
            print("Executing database query...")
            execute_query(query, (address, gstin, state, state_code, manager, project_id), commit = True)
            print("Database query executed successfully.")
        except Exception as db_error:
            print(f"Database query failed: {str(db_error)}")
            return jsonify({"error": f"Database query failed: {str(db_error)}"}), 500
        
        # Step 5: Confirm success
        print("Project updated successfully.")
        return jsonify({"message": "Project updated successfully"}), 200

    except KeyError as key_error:
        # Handle missing fields within the JSON body
        print(f"Key error occurred: {str(key_error)}")
        return jsonify({"error": f"Key error: {str(key_error)}"}), 400

    except TypeError as type_error:
        # Handle if the data format is not correct (e.g., expecting JSON but receiving something else)
        print(f"Type error occurred: {str(type_error)}")
        return jsonify({"error": f"Type error: {str(type_error)}"}), 400

    except Exception as e:
        # Catch all unexpected errors
        print(f"An unexpected error occurred: {str(e)}")
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500






@app.route('/delete_project', methods=['POST'])
def delete_project():
    try:
        project_id = request.json.get('project_id')
        if not project_id:
            print("Project ID not provided in request")
            return jsonify({"error": "Project ID is required"}), 400

        print(f"Deleting project with ID: {project_id}")
        
        query = """
            DELETE FROM projects_managers
            WHERE project_id = %s
        """

        # Assuming `execute_query` is a helper function for executing DB queries
        execute_query(query, (project_id,), commit=True)
        
        return jsonify({"message": "Project deleted successfully"}), 200

    except KeyError as e:
        print(f"Key error: {str(e)}")
        return jsonify({"error": "Invalid request format, 'project_id' is missing"}), 400

    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return jsonify({"error": "An unexpected error occurred"}), 500







# -----------------------------------------------------------------------------------------------------------------------------
#                                                      Managers Section


@app.route('/get_all_managers', methods=['GET'])
def get_all_managers():
    try:
        # Query to get all the data from the managers_data table
        query_managers = "SELECT * FROM managers_data"
        manager_data = execute_query(query_managers)

        # Convert the result into a Pandas DataFrame
        df_managers = pd.DataFrame(manager_data)

        # Remove duplicate rows based on 'ID' column, keeping the first occurrence
        df_unique_managers = df_managers.drop_duplicates(subset='ID', keep='first')

        # Convert DataFrame back to JSON format
        unique_managers = df_unique_managers.to_dict(orient='records')

        # Query to get the project data
        query_projects = "SELECT Projects FROM projects_managers"
        project_data = execute_query(query_projects)

        # Return the filtered unique managers and projects
        return jsonify({'projects': project_data, 'managers': unique_managers})

    except Exception as e:
        return jsonify({'error': str(e)}), 500




# Route to add a new manager
@app.route('/add_new_manager', methods=['POST'])
def add_new_manager():
    try:

        manager_data = request.json
        print(f'manager_data: {manager_data}')

        # Step 3: Strip whitespace from all string fields
        manager_data = {key: value.strip() if isinstance(value, str) else value for key, value in manager_data.items()}
        print

        # Ensure all required fields are present in the incoming data
        manager_name = manager_data.get('Manager_Name')
        manager_id = manager_data.get('Manager_ID')  # Assuming Manager_ID should be passed
        manager_password = manager_id
        # manager_project = manager_data.get('Project')  # Assuming a Project is provided
        manager_email = manager_data.get('Email')
        manager_phone = manager_data.get('Phone')


        query = """
        select * from managers_data where Name = %s 
        """

        manager_exists = execute_query(query,(manager_id,))
        if manager_exists:
            print("Manager code already exists")
            return jsonify({"message": "exists"}), 400

        # Debugging: Print extracted data to ensure everything is correct
        print(f"Name: {manager_name}, ID: {manager_id}, Password: {manager_password}, "
              f"Email: {manager_email}, Phone: {manager_phone} ///")

        # SQL Query to insert a new manager
        query = """
            INSERT INTO managers_data (Name, ID, Password, MailID, PhoneNo, TypeOfAccount)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        toa = "Manager"
        # Execute the query with the extracted data
        execute_query(query, (manager_id, manager_name, manager_id, manager_email, manager_phone, toa), commit=True)

        return jsonify({"message": "Manager added successfully"}), 200
    except Exception as e:
        # Debugging: Print the error message for debugging purposes
        print(f"Error occurred while adding manager: {str(e)}")
        return jsonify({'error': str(e)}), 500







# Route to update manager details
@app.route('/update_manager_details', methods=['POST'])
def update_manager_details():
    try:
        # Get the updated data from the request
        updated_data = request.json
        
        # Debugging: Print the received data to ensure it's correct
        print("Received updated manager details:", updated_data)

        # SQL Query to update manager details
        query = """
            UPDATE managers_data
            SET MailID = %s, PhoneNo = %s
            WHERE manager_index_id = %s
        """
        
        # Debugging: Print the query to check if it's correct
        print("Executing query:", query)
        print("Values to be updated:", (updated_data['Email'], updated_data['Phone'], updated_data['Manager_index_id']))

        # Execute the query
        result = execute_query(query, (updated_data['Email'], updated_data['Phone'], updated_data['Manager_index_id']), commit=True)
        
        # Debugging: Print the result of the execution
        print("Result of execute_query:", result)

        return jsonify({"message": "Manager updated successfully"}), 200
    
    except Exception as e:
        # Debugging: Print the error message
        print("Error during update:", str(e))
        return jsonify({"error": str(e)}), 500


# Route to delete a manager
@app.route('/delete_manager', methods=['POST'])
def delete_manager():
    try:
        manager_id = request.json.get('Manager_index_id')
        manager_code = request.json.get('manager_code')

        query = "DELETE FROM managers_data WHERE manager_index_id = %s"
        execute_query(query, (manager_id,), commit=True)

        return jsonify({"message": "Manager deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500




if __name__ == "__main__":
    app.run(debug=True, host = '0.0.0.0',port=5000)