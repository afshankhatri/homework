from static.functions.db_connections_functions import execute_query  # Import the connection pool function

def approve_receive_request_function(data):
    try:
        print('Received data:', data)
        print('This is the approve_receive_request_function', data)

        completiondate = data[0]['completiondate']
        form_id = data[0]['FormNo']
    
        # print("Form ID:", form_id)
        print("this is the completion date", completiondate)
        # Update handover_data table
        try:
            # First, check if the form exists and update accordingly
            query = """
                SELECT CompletionDate FROM handover_data WHERE FormID = %s
            """
            result = execute_query(query, (form_id,))

            if result:
                # print("Form found in database")

                # Check if CompletionDate is not None or empty
                if result[0]['CompletionDate'] != 0:
                    # Update if CompletionDate has a valid value
                    update_query = """
                        UPDATE handover_data
                        SET ApprovalToReceive = '1', Status = 'Approved'
                        WHERE FormID = %s
                    """
                    # print(f"Executing query: {update_query} with form_id: {form_id}")
                    execute_query(update_query, (form_id,), commit=True)
                else:
                    # Reject if CompletionDate is None or invalid
                    update_query = """
                        UPDATE handover_data
                        SET ApprovalToReceive = 0, Status = 'Rejected'
                        WHERE FormID = %s
                    """
                    # print(f"Executing query: {update_query} with form_id: {form_id}")
                    execute_query(update_query, (form_id,), commit=True)

            else:
                print(f"FormID {form_id} not found in handover_data table")
                # Return if form is not found, no need to proceed further
                return

        except Exception as e:
            print(f"Error updating handover_data: {e}")
            # Return immediately if there's an error updating handover_data
            return

        # If we reach here, it means handover_data update was successful, so proceed to the next part:
        # Update inventory table based on SerialNo
        try:
            # Loop through the items in data starting from the second element (data[1:])
            for index, item in enumerate(data[1:]):
                # print(f"\nProcessing item {index + 1}: {item}")

                # Extract fields from the item and add debugging
                serial_no = item.get('ProductID')
                if serial_no is None:
                    print(f"Error: 'ProductID' not found in item {index + 1}")
                    continue
                serial_no = int(serial_no)  # Convert ProductID to integer
                # print(f"serial_no: {serial_no}")

                receiverid = item.get('Owner')
                # if receiverid is None:
                #     print(f"Error: 'Owner' not found in item {index + 1}")
                #     continue
                # print(f"receiverid: {receiverid}")

                project = item.get('Project')
                # if project is None:
                #     print(f"Error: 'Project' not found in item {index + 1}")
                #     continue
                # print(f"project: {project}")

                empsendname = item.get('empsendname')
                empreceivername = item.get('empreceivername')
                # if empsendname is None:
                #     print(f"Warning: 'empsendname' not found in item {index + 1}")
                # if empreceivername is None:
                #     print(f"Warning: 'empreceivername' not found in item {index + 1}")
                # print(f"empsendname: {empsendname}, empreceivername: {empreceivername}")

                category = item.get('Category')
                # print(f"category: {category}")

                name = item.get('Name')
                # print(f"name: {name}")

                make = item.get('Make')
                # print(f"make: {make}")

                model = item.get('Model')
                # print(f"model: {model}")

                # Determine the condition based on 'Reached' and set the empname
                reached = item.get('Reached')
                if reached == 'Accepted':
                    condition = item.get('ReceiverCondition')
                    empname = empreceivername
                    # print(f"Condition: {condition} (ReceiverCondition) and empname: {empname}")
                else:
                    condition = item.get('SenderCondition')
                    empname = empsendname
                    # print(f"Condition: {condition} (SenderCondition) and empname: {empname}")

                # Check if the condition was set
                if condition is None:
                    # print(f"Error: Neither 'ReceiverCondition' nor 'SenderCondition' found in item {index + 1}")
                    continue

                # Prepare the query to update the inventory table
                update_query = """
                    UPDATE inventory
                    SET `Condition` = %s, Owner = %s, Project = %s, Handover_Date = %s, empname = %s
                    WHERE ProductID = %s
                """

                # # Debugging the query and its parameters
                # print("Executing the following update query:")
                # print(update_query)
                # print(f"Params: condition={condition}, receiverid={receiverid}, project={project}, completiondate={completiondate}, empname={empname}, serial_no={serial_no}")

                # Execute the query with the provided parameters
                execute_query(update_query, (condition, receiverid, project, completiondate, empname, serial_no), commit=True)

                print(f"Update query executed for ProductID: {serial_no}")

        except Exception as e:
            print(f"Error updating inventory: {e}")

    except Exception as e:
        print(f"Unexpected error in approve_receive_request_function: {e}")



def disapprove_receive_request_function(form_data):
    try:
        # Extract formNo from the form_data
        formNo = form_data['formNo']
        remarks = form_data['remarks']
        print(formNo)

        # Update the 'Status' and 'ApprovalToReceive' fields in the handover_data table where 'FormID' matches formNo
        try:
            update_query = """
                UPDATE handover_data
                SET Status = 'Rejected', ApprovalToReceive = 0, DisapproveRemarks = %s
                WHERE FormID = %s
            """
            execute_query(update_query, (remarks, formNo), commit = True)

        except Exception as e:
            print(f"Error updating handover_data: {e}")

    except Exception as e:
        print(f"Unexpected error in disapprove_receive_request_function: {e}")
