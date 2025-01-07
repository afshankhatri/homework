from static.functions.db_connections_functions import execute_query  # Import execute_query from db_connections_functions

def approve_send_request_function(form_data):
    try:
        # Extract necessary fields from form_data
        formNo = form_data[1]['FormNo']
        ewayBill = str(form_data[0]['EwayBill'])  # Convert ewayBill to string
        ewayreason = form_data[2]['ewayreason']

        # Query to check if the FormID exists
        select_query = "SELECT * FROM handover_data WHERE FormID = %s"
        result = execute_query(select_query, (formNo,))

        if not result:
            return "FormID not found."

        # Now perform the actual update based on the ewayBill value
        if ewayBill == '' or ewayBill.isspace():
            ewayBill = '-'

        if ewayreason == '-':
            update_query = """
                UPDATE handover_data 
                SET EwayBillNo = %s, ApprovalToSend = 1, ewayreason = %s 
                WHERE FormID = %s
            """
            execute_query(update_query, (ewayBill, ewayreason, formNo), commit=True)
        else:
            update_query = """
                UPDATE handover_data 
                SET EwayBillNo = 'No ewaybill', ApprovalToSend = 1, ewayreason = %s 
                WHERE FormID = %s
            """
            execute_query(update_query, (ewayreason, formNo), commit=True)

        return "Approval has been successfully given"

    except Exception as e:
        print(f"Error: {str(e)}")
        return f"Error: {str(e)}"

from static.functions.db_connections_functions import execute_query  # Import execute_query from db_connections_functions

def disapprove_send_request_function(form_data):
    try:
        # Extract 'formNo' and 'remarks' from the form_data
        formNo = form_data['formNo']
        remarks = form_data['remarks']

        # Query to update the 'Status' column and add 'DisapproveRemarks'
        update_query = """
            UPDATE handover_data 
            SET Status = %s, ApprovalToSend = %s, DisapproveRemarks = %s 
            WHERE FormID = %s
        """
        # Execute the query and commit the changes
        execute_query(update_query, ('Rejected', 0, remarks, formNo), commit=True)

        return "Disapproval has been successfully recorded"

    except Exception as e:
        print(f"Error: {str(e)}")
        return f"Error: {str(e)}"

