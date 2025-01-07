from flask import Flask, jsonify
import json
from static.functions.db_connections_functions import execute_query  # Import execute_query

# Function to get inventory data based on 'Owner' (name)
def my_invent_dashboard_function(name, session_data):
    try:
        # Query to fetch inventory data where 'Owner' matches the given name
        query = "SELECT * FROM inventory WHERE Owner = %s"
        
        # Execute the query using the execute_query function
        filtered_data = execute_query(query, (name,))
        
        # Combine filtered data with session data
        combined_data = {
            "filtered_data": filtered_data,
            "session_data": session_data
        }

        # Return JSON object
        return jsonify(combined_data)
    
    except Exception as e:
        # Catch any exceptions and return the error as JSON
        return jsonify({'error': str(e)})

# Function to get inventory data based on 'Project'
def my_project_dashboard_function(projects, session_data):
    try:
        # Ensure 'projects' is a list
        if isinstance(projects, str):
            projects = [projects]
        
        # Create the query placeholders for the project list
        projects_placeholder = ', '.join(['%s'] * len(projects))
        
        # Query to fetch inventory data where 'Project' matches any of the projects
        query = f"SELECT * FROM inventory WHERE Project IN ({projects_placeholder})"
        
        # Execute the query using the execute_query function
        filtered_data = execute_query(query, projects)
        
        # Combine filtered data with session data
        combined_data = {
            "filtered_data": filtered_data,
            "session_data": session_data
        }

        # Return filtered data as JSON
        return jsonify(combined_data)
    
    except Exception as e:
        # Catch any exceptions and return the error as JSON
        return jsonify({'error': str(e)})

# Function to get all inventory data
def invent_dashboard_function(session_data):
    try:
        # Query to fetch all inventory data
        query = "SELECT * FROM inventory"
        
        # Execute the query using the execute_query function
        inventory_data = execute_query(query)
        
        # Combine the inventory data with session data
        combined_data = {
            "filtered_data": inventory_data,
            "session_data": session_data
        }

        # Return combined data as JSON
        return jsonify(combined_data)
    
    except Exception as e:
        # Catch any exceptions and return the error as JSON
        return jsonify({'error': str(e)})
