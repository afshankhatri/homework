from flask import Flask, render_template, request, redirect, jsonify, session, url_for
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os
from werkzeug.utils import secure_filename
# from multiprocessing import connection
from flask_cors import CORS
# from static.python_functions import helper_functions
from sqlalchemy.exc import SQLAlchemyError
import pandas as pd
from sqlalchemy import text

app = Flask(__name__)
CORS(app)

# Update the database URI to MySQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:root@localhost/plot_details'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Disable track modifications to save memory
app.config['UPLOAD_FOLDER'] = './uploads'  # Folder to save uploaded files
app.secret_key = 'e18b3f5c34b8a9f6a3ec2c9d6a2a1e35c0f15c774d192a4f429c8b3a574d91ee'
# Update the database URI to MySQL
# app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:Akhatri%402023@localhost/plot_details_db'
db = SQLAlchemy(app)


#--------------------------------------------------------------------------------
                                    # Template Routes
@app.route('/')
def index():
    return render_template('loginForm.html')


# for registration form
@app.route('/regiForm')
def regiForm():
    return render_template('regiForm.html')

@app.route('/manager')
def manager():
    return render_template('manager.html')

# Route for the user page
@app.route('/survey_user')
def survey_user():
    return render_template('surveyor_home_page.html')



# Route for the user page
@app.route('/validator_user')
def validator_user():
    return render_template('validator_user.html')



@app.route('/validator_verify')
def validator_verify():
    return render_template('validator_verify.html')


# Route for the user page
@app.route('/admin_user')
def admin_user():
    return render_template('admin_user.html')


@app.route('/admin_table')
def admin_table():
    return render_template('admin.html')

@app.route('/userInfo_edit_byAdmin')
def userInfo_edit_byAdmin():
    return render_template('userInfo_edit_byAdmin.html')


# Route for the user page
@app.route('/qc_user')
def qc_user():
    return render_template('qc_user.html')


# Route for the user page
@app.route('/survey_form_input')
def survey_form_input():
    return render_template('survey_form_input_phase_1.html')




@app.route('/loginForm', methods=['GET', 'POST'])
def loginForm():
    return render_template('loginForm.html')  # Display login form



@app.route('/qc_output_table')
def qc_output_table():
    return render_template('qc_output_table.html')


@app.route('/qc_form_verify')
def qc_form_verify():
    return render_template('qc_form_verify.html')


# @app.route('/qc_form')
# def qc_form():
#     return render_template('qc_form.html')

# @app.route('/validator_form_accept_reject')
# def validator_form_accept_reject():
#     return render_template('validator_form_accept_reject.html')



@app.route('/validator_table')
def validator_table():
    return render_template('validatorOUTPUTtable.html')



@app.route("/editByQC",methods=['POST','GET'])
def editByQC():
    return render_template('editByQC.html')



@app.route('/data_allocation')
def data_allocation():
    return render_template('data_allocation.html')

# Route for the user page
@app.route('/surveyor_home_page')
def surveyor_home_page():
    return render_template('surveyor_home_page.html')

@app.route('/surveyor_reports')
def surveyor_reports():
    return render_template('dashboard.html')

@app.route('/survey_output_form')
def survey_output_form():
    return render_template('survey_output_form.html')

# {}



# {}


#----------------------------------------------------------------------------------------------------
                                         # Classes

class user_info(db.Model):
    userinfo_uid = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)    # not sure yaha dataType biginteger aiga k nai... since DB me bigINt hai
    name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.Integer, nullable=False)
    value_softdel = db.Column(db.Integer)
    password = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return (f'<User Info Table Values - '
                f'userinfo_uid: {self.userinfo_uid}, '
                f'user_id: {self.user_id}, '
                f'name: {self.name}, '
                f'role: {self.role}, '
                f'value_softdel: {self.value_softdel}>')

# Define the model for dropdown_values table
class dropdown_values(db.Model):
    dropdownvalues_uid = db.Column(db.Integer, primary_key=True)
    node_name = db.Column(db.String(255))
    sector_no = db.Column(db.String(255))
    block_name = db.Column(db.String(255))
    plot_no = db.Column(db.String(255))
    value_softdel = db.Column(db.Integer)


    def __repr__(self):
        return f'<DropdownValues are : {self.dropdownvalues_uid}, {self.node_name}, {self.sector_no}, {self.block_name}, {self.plot_no},{self.value_softdel}>'




# Model for storing plot details
class survey_form_data(db.Model):
    surveyformdata_uid = db.Column(db.Integer, primary_key=True)#
    #plotdetails_uid=db.Column(db.Integer,primary_key=True)#this has been deleted frm the database instead of this we have above variable 
    user_name = db.Column(db.String(200), nullable=True) #
    node_name = db.Column(db.String(100), nullable=True)#
    sector_no = db.Column(db.String(100), nullable=True)#
    block_name = db.Column(db.String(100), nullable=True)#
    plot_name = db.Column(db.String(100), nullable=True)#
    allotment_date = db.Column(db.Date, nullable=True)#
    plot_status = db.Column(db.String(20),nullable=True)
    original_allottee = db.Column(db.String(200), nullable=True)#
    area = db.Column(db.String(1000), nullable=True)#
    use_of_plot = db.Column(db.String(100), nullable=True)#
    rate = db.Column(db.Float, nullable=True)#
    FSI = db.Column(db.Float, nullable=True)
    term_of_lease = db.Column(db.Integer ,nullable=True)
    calc_area = db.Column(db.Integer, nullable = True)
    ownerNtransferDate = db.Column(db.String(10000), nullable=True)#
    surveyor_remarks = db.Column(db.Text, nullable=True)#
    entry_date_created = db.Column(db.DateTime, default=datetime.utcnow)#
    front_photo =  db.Column(db.String(500), nullable=True)#
    left_photo =  db.Column(db.String(1000), nullable=True)#
    back_photo =  db.Column(db.String(1000), nullable=True)#
    right_photo =  db.Column(db.String(1000), nullable=True)#
    plot_sketch =  db.Column(db.String(500), nullable=True)#
    images = db.Column(db.String(100), nullable = True) #{}
    surveyform_status = db.Column(db.Integer,default=0 , nullable=False)#
    is_qc_done = db.Column(db.Integer,default=0 , nullable=False)#
    is_validation_done = db.Column(db.Integer,default=0 , nullable=False)#
    validator_remarks = db.Column(db.String(200), nullable=False)#
    month_date = db.Column(db.String(200), nullable=False)#


    def __repr__(self):
        return f"<Plot {self.surveyformdata_uid}>"



# Define the sector_table model
class sector_table(db.Model):
    __tablename__ = 'sector_table'
    sector_name = db.Column(db.String(255), nullable=False)
    sectortable_uid = db.Column(db.Integer, primary_key=True, autoincrement=True)
    sectortable_isactive = db.Column(db.String(255), nullable=False)
    userinfo_uid = db.Column(db.String(255), nullable=False)

    def __repr__(self):
        return f"<SectorTable:  sector_name='{self.sector_name}', sectortable_isactive='{self.sectortable_isactive}'>"





#--------------------------------------------------------------------------------
                                    # Data Routes



@app.route('/dashboard')
def dashboard():
    # Query data using raw SQL
    query = text("""
    SELECT surveyformdata_uid, surveyform_status, is_qc_done, is_validation_done 
    FROM survey_form_data
    """)
    result = db.session.execute(query)
    data = pd.DataFrame(result.fetchall(), columns=['surveyformdata_uid', 'surveyform_status', 'is_qc_done', 'is_validation_done'])

    # Data transformation
    data['surveyform_status'] = data['surveyform_status'].apply(lambda x: 'Done' if x == 1 else 'Not Done')
    data['is_qc_done'] = data['is_qc_done'].apply(lambda x: 'Done' if x == 1 else 'Not Done')
    data['is_validation_done'] = data['is_validation_done'].apply(lambda x: 'Done' if x == 1 else 'Not Done')


    # Calculate metrics
    unique_forms = data['surveyformdata_uid'].nunique()
    forms_completed = data[(data['is_qc_done'] == 'Done') & (data['is_validation_done'] == 'Done')].shape[0]
    forms_incomplete = unique_forms - forms_completed
    pending_qc = data[data['is_qc_done'] != 'Done'].shape[0]
    pending_validator = data[data['is_validation_done'] != 'Done'].shape[0]

    metrics = {
        'total_forms': unique_forms,
        'forms_completed': forms_completed,
        'forms_incomplete': forms_incomplete,
        'pending_qc': pending_qc,
        'pending_validator': pending_validator
    }


    # Query unique node_name and sector_no
    node_names = db.session.query(dropdown_values.node_name).distinct().all()
    sector_numbers = db.session.query(dropdown_values.sector_no).distinct().all()


    return render_template('dashboard.html', metrics=metrics,node_names=node_names, sector_numbers=sector_numbers)



@app.route('/filter', methods=['POST'])
def filter_data():
    data = request.json
    node_name = data.get('node_name')
    sector_no = data.get('sector_no')

    print(f"Received filter request: Node = {node_name}, Sector = {sector_no}")

    # Build the query
    query = db.session.query(
        db.func.count(survey_form_data.surveyformdata_uid).label('total_forms'),
        db.func.sum(survey_form_data.surveyform_status).label('forms_completed'),
        db.func.sum(~survey_form_data.surveyform_status).label('forms_incomplete'),
        db.func.sum(survey_form_data.is_qc_done).label('pending_qc'),
        db.func.sum(survey_form_data.is_validation_done).label('pending_validator')
    )

    # Apply filters if provided
    if node_name:
        query = query.filter(survey_form_data.node_name == node_name)
    if sector_no:
        query = query.filter(survey_form_data.sector_no == sector_no)

    metrics = query.first()

    # Log the results
    print("Metrics fetched from database:", metrics)

    return jsonify({
        'total_forms': metrics.total_forms or 0,
        'forms_completed': metrics.forms_completed or 0,
        'forms_incomplete': metrics.forms_incomplete or 0,
        'pending_qc': metrics.pending_qc or 0,
        'pending_validator': metrics.pending_validator or 0
    })


                # Module
#----------------------------------------------
                # Login Page

@app.route('/phone_no_validation', methods=['POST', 'GET'])
def phone_no_validation():
    print("Received request at /user_id_validation")

    # Get JSON payload from the frontend
    data = request.get_json()
    print("Payload received from frontend:", data)

    user_id = data.get('user_id')  # ID received from frontend
    password = data.get('password')  # Password received from frontend
    print("User ID and password extracted:", user_id, password)

    sector_list  = []

    try:
        # Start a database transaction
        with db.session.begin():  # Use session.begin for transactional queries
            # Query the database for the user
            user = user_info.query.filter_by(user_id=user_id, password=password).first()

        print("User lookup result:", user)

        if not user:
            print("Validation failed: user not found or invalid credentials")
            return jsonify({
                'error': True,
                'message': 'Invalid ID or password! Please try again.'
            }), 404

        # Prepare session data with user info
        session_data = {col.name: getattr(user, col.name) for col in user.__table__.columns}
        print("Checking user role...")

        print("Checking user role...")
        if user.role in [1, 2]:  # Check if role is 1 (QC) or 2 (Validator)
            print(f"User role is {user.role}. Proceeding to fetch sectors for user.")

            # Get the userinfo_uid from the user
            userinfo_uid = user.userinfo_uid  # assuming user has this field
            print(f"userinfo_uid extracted: {userinfo_uid}")

            # Query the sector table for matching userinfo_uid and sectortable_isactive = 1
            try:
                print("Querying sector_table for active sectors matching userinfo_uid...")
                sectors = sector_table.query.filter_by(userinfo_uid=userinfo_uid, sectortable_isactive=1).all()

                # Count the number of times the user was found
                user_found_count = len(sectors)
                print(f"User with userinfo_uid {userinfo_uid} found {user_found_count} times in sector_table.")

                if user_found_count > 0:
                    # Append the sectortable_uid values to the sector_list
                    sector_list = [sector.sectortable_uid for sector in sectors]
                    print(f"Sector list populated with {user_found_count} entries: {sector_list}")
                else:
                    print(f"No active sectors found for userinfo_uid {userinfo_uid}.")

            except Exception as e:
                print(f"Error querying sector_table: {str(e)}")

        else:
            # If role is not 1 or 2, append 0 to the list
            print(f"User role is {user.role}. Not 1 or 2. Setting sector_list to [0].")
            sector_list = [0]

        # Add sector_list to session_data
        session_data['sector_list'] = sector_list

        # Update the session with the session_data
        session.update(session_data)  # Update the session with user data
        print("Session updated with user data:", session)

        # Return response with user's role and sector_list
        print("User found. Preparing response...")
        return jsonify({
            'error': False,
            'message': 'Login successful.',
            'role': user.role,  # Return the role from the matched row
            'sector_list': sector_list  # Return the sector_list
        }), 200

    except Exception as e:
        # Handle any exceptions that occur during the transaction
        print("Error occurred during validation:", str(e))
        return jsonify({
            'error': True,
            'message': 'An error occurred during login. Please try again later.'
        }), 500



                # Module
#-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                # Input Survey Form



# Configure upload folder and allowed extensions
UPLOAD_FOLDER = './static/uploads'  # Folder to store imagesTHE U
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif','jfif','avif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure the images folder exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Function to check if the file extension is allowed
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS




# Route to fetch filtered dropdown data
@app.route('/get_dropdown_values', methods=['GET'])
def get_dropdown_values():
    # Get filter parameters from request arguments
    node_name = request.args.get('node_name')
    sector = request.args.get('sector')
    block_name = request.args.get('block_name')

    # Query the database and filter based on the parameters
    query = dropdown_values.query

    if node_name:
        query = query.filter_by(node_name=node_name)
    if sector:
        query = query.filter_by(sector_no=sector)
    if block_name:
        query = query.filter_by(block_name=block_name)

    dropdown_data = query.all()

    # Prepare the response data with unique values
    data = {
        'Node_Name': list(set(item.node_name for item in dropdown_data if item.node_name)),
        'Sector': list(set(item.sector_no for item in dropdown_data if item.sector_no)),
        'Block_Name': list(set(item.block_name for item in dropdown_data if item.block_name)),
        'Plot_No': list(set(item.plot_no for item in dropdown_data if item.plot_no))
    }

    # print("Filtered data being sent as JSON response:")
    # print(data)

    return jsonify(data)



# Save each file if present and allowed
def save_file(file, formcode, columnname):
    if file and allowed_file(file.filename):
        # Extract the file extension
        extension = file.filename.rsplit('.', 1)[1].lower()
        
        # Rename the file to formcode_keyname.extension
        filename = f"{formcode}_{columnname}.{extension}"
        
        # Define the full file path
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        # Save the file to the upload folder
        file.save(filepath)
        
        # Return the new filename
        return filename
    return None

    

# Route to handle form submission
@app.route('/submit_form_data', methods=['POST', 'GET'])
def submit_form_data():
    if request.method == 'POST':
        try:
            print("this is the entire form data")
            print(request.form)

            # Extract form data
            user_name = request.form.get('user_name')#
            node_name = request.form.get('node_name')#
            sector_no = request.form.get('sector_no')#
            block_name = request.form.get('block_name')#
            plot_name = request.form.get('plot_name')#
            plot_status = request.form.get('plot_status')
            allotment_date = request.form.get('allotment_date')#
            original_allottee = request.form.get('original_allottee')#
            area = request.form.get('area')#
            use_of_plot = request.form.get('use_of_plot')#
            rate = request.form.get('rate')#
            FSI = request.form.get('FSI')
            term_of_lease = request.form.get('term_of_lease')
            calc_area = request.form.get('calc_area')
            ownerNtransferDate = request.form.get('ownerNtransferDate')#
            surveyor_remarks = request.form.get('surveyor_remarks')#


            # Process uploaded files
            front_photo = request.files.get('front_photo')#
            left_photo = request.files.get('left_photo')#
            back_photo = request.files.get('back_photo')#
            right_photo = request.files.get('right_photo')#
            plot_sketch = request.files.get('plot_sketch')#
            images = request.files.getlist('images')  # Get all uploaded files as a list
            print("this is image object")
            print(images)

            # given below are the columnname
            front_photo_name = "front_photo"
            left_photo_name = "left_photo"
            back_photo_name = "back_photo"
            right_photo_name = "right_photo"
            plot_sketch_name = "plot_sketch"

            formcode = "001"
            front_photo_filename = save_file(front_photo,formcode,front_photo_name)
            left_photo_filename = save_file(left_photo,formcode,left_photo_name)
            back_photo_filename = save_file(back_photo,formcode,back_photo_name)
            right_photo_filename = save_file(right_photo,formcode,right_photo_name)
            plot_sketch_filename = save_file(plot_sketch,formcode,plot_sketch_name)
            

            images_array_count = 0


            # Loop through possible image fields (image1, image2, image3, ...)
# Loop through possible image fields (image1, image2, image3, ...)
            for i in range(0, 10):  # Adjust range if expecting more than 10 images
                key_name = f'image{i}'
                
                # Check if the key exists in request.files before calling get()
                if key_name in request.files:
                    image_file = request.files.get(key_name)
                    
                    if image_file:  # Ensure the file is not None
                        # Save the file with the new naming format
                        save_file(image_file, formcode, key_name)
                        images_array_count +=1



            # print(front_photo_filename,left_photo_filename)

            print("\nthis is here\n")
            print(user_name, node_name, sector_no, block_name, plot_name,plot_status, allotment_date, original_allottee, area, use_of_plot, rate, ownerNtransferDate,images, surveyor_remarks)#{}
            # print("about to take store ")


            # Get current timestamp and format it as 'yyyy-mm'
            month_date = datetime.now().strftime('%Y-%m')
            user_name = session.get('name')



            # Create a new plot_details record
            new_plot = survey_form_data(
                user_name=user_name, #
                node_name=node_name,
                sector_no=sector_no,
                block_name=block_name,
                plot_name=plot_name,
                plot_status = plot_status,
                allotment_date=allotment_date,
                original_allottee=original_allottee,
                area=area,
                use_of_plot=use_of_plot,
                rate=rate,
                FSI = FSI,
                term_of_lease = term_of_lease,
                calc_area = calc_area,
                ownerNtransferDate=ownerNtransferDate,
                surveyor_remarks=surveyor_remarks,
                front_photo=front_photo_filename,
                left_photo=left_photo_filename,
                back_photo=back_photo_filename,
                right_photo=right_photo_filename,
                plot_sketch=plot_sketch_filename,
                images = images_array_count,
                month_date=month_date,
            )

            # print(';;;;;;;;;;')
            # print(f"User Name: {new_plot.user_name}")

            print(new_plot)
            # Save to the database
            db.session.add(new_plot)
            db.session.commit()
            print('committted to DB')

            return redirect('/survey_user')
        except Exception as e:
            return f"There was an issue submitting the form: {str(e)}"
    else:
        print("error aala ")
        return render_template('survey_user.html')



# completed till here {{}}






                # Module
#-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                # Output table (QC/Validator/Admin)






# # Example route to query plot details
# @app.route('/query_plots', methods=['POST','GET'])
# def query_plots():
#     # Retrieve the button value from the form
#     button = request.form.get('button', 'default')

#     # Retrieve role and sector from the session
#     role = "Admin"
#     sector = "114"

#     if not role or not sector:
#         return jsonify({"error": "Role and sector must be set in session"}), 400

#     # Use the query function
#     try:
#         results = query_plot_details(role, button, sector)
#         return jsonify([plot.to_dict() for plot in results])  # Convert results to JSON-friendly format
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500



json_data = {}

@app.route('/send_formid')
def send_formid():
    global json_data

    surveyformdata_uid = request.args.get('form_id')
    print('this is the formid', surveyformdata_uid)

      # Extract data from the DB based on the form_id
    try:
        json_data = extract_rows_from_db(surveyformdata_uid)
        print('This is the data that we extracted from db for the id ', json_data)  # This is your data for the given form_id
        return jsonify({"message": "Form ID received successfully"}), 200
    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({"error": "Failed to retrieve data from the database"}), 500

@app.route('/output_table', methods=['POST', 'GET'])
def output_table():
    # Get the JSON data from the request
    data = request.get_json()

    # Role and sector list will come from session data
    role = session.get('role')
    sector_list = session.get('sector_list', [])  # Get the sector list from the session
    print("Role from session:", role)
    print("Sector list from session:", sector_list)

    selected_button = data.get('selected_button', 'No message received')
    month_date = data.get('month_date', 'No message received')

    if month_date == "default":
        month_date = datetime.now().strftime("%Y-%m")  # Get current month and year in yyyy-mm format

    # Start building the query
    query = db.session.query(survey_form_data)  # Replace survey_form_data with your actual table model
    print("Initial query created.")

    # Apply filtering based on role and button
    if role == 1:  # QC
        print("Role is QC (1), applying QC filters.")
        if selected_button == "default":
            query = query.filter(survey_form_data.is_qc_done == 0,
                                 survey_form_data.sector_no.in_(sector_list),
                                 survey_form_data.month_date == month_date)
        elif selected_button == "accept":
            query = query.filter(survey_form_data.is_qc_done == 1,
                                 survey_form_data.sector_no.in_(sector_list),
                                 survey_form_data.month_date == month_date)
        elif selected_button == "reject":
            query = query.filter(survey_form_data.is_validation_done == 2,
                                 survey_form_data.sector_no.in_(sector_list),
                                 survey_form_data.month_date == month_date)

    elif role == 2:  # Validator
        print("Role is Validator (2), applying Validator filters.")
        if selected_button == "default":
            query = query.filter(survey_form_data.is_validation_done == 0,
                                 survey_form_data.sector_no.in_(sector_list),
                                 survey_form_data.month_date == month_date)
        elif selected_button == "accept":
            query = query.filter(survey_form_data.is_validation_done == 1,
                                 survey_form_data.sector_no.in_(sector_list),
                                 survey_form_data.month_date == month_date)
        elif selected_button == "reject":
            query = query.filter(survey_form_data.is_validation_done == 2,
                                 survey_form_data.sector_no.in_(sector_list),
                                 survey_form_data.month_date == month_date)

    elif role == 3:  # Admin
        print("Role is Admin (3), applying Admin filters.")
        if selected_button == "default":
            query = query.filter(survey_form_data.is_qc_done == 0,
                                 survey_form_data.sector_no.in_(sector_list),
                                 survey_form_data.month_date == month_date)
        elif selected_button == "accept":
            query = query.filter(survey_form_data.is_qc_done == 1,
                                 survey_form_data.sector_no.in_(sector_list),
                                 survey_form_data.month_date == month_date)
        elif selected_button == "reject":
            query = query.filter(survey_form_data.is_validation_done == 2,
                                 survey_form_data.sector_no.in_(sector_list),
                                 survey_form_data.month_date == month_date)
    else:  # Surveyor or other roles
        print("Role is Surveyor or unknown role.")

    # Print the SQL query generated by SQLAlchemy
    print("Generated SQL query:", str(query.statement.compile(compile_kwargs={"literal_binds": True})))

    # Execute the query and process the results if needed (not shown here)



    # Execute the query and fetch all results
    results = query.all()
    # print("Fetched results:", results)  # Print the fetched results


    # Convert the results into a serializable format
    results_data = [
        {
            'node_name': row.node_name,
            'sector_no': row.sector_no,
            'block_name': row.block_name,
            'plot_name': row.plot_name,
            'plot_status': row.plot_status,
            'entry_date_created': row.entry_date_created.strftime('%Y-%m-%d %H:%M:%S') if row.entry_date_created else None,
            'user_name': row.user_name,
            'surveyformdata_uid': row.surveyformdata_uid,
            'surveyor_remarks': row.surveyor_remarks,  # If this is a JSON object, ensure it's serialized
            'surveyform_status': row.surveyform_status,
            'is_qc_done': row.is_qc_done,
            'is_validation_done': row.is_validation_done,
            'validator_remarks': row.validator_remarks,
            'month_date': row.month_date,

        }
        for row in results
    ]

    # Print the formatted results data
    # print("Formatted results data:", results_data)

    json_data = {'results_data':results_data, 'role':role}

    # Return the results as JSON
    return jsonify(json_data)


@app.route('/get_outputform_data' )
def get_outputform_data():
    global json_data
    print('this is the filtered df for the given form id   ..................  get_outputform_data ', json_data)

    # Convert DataFrame to JSON
    return jsonify(json_data)



# {} UPDATE IN DB BY QC
# Endpoint to update the survey_form_data table when the "Accept and Push for Validation" button is clicked
@app.route('/update_status', methods=['POST'])
def update_status():
    """Handles updating the survey_form_data table for QC validation."""
    try:
        # Parse the incoming JSON data
        data = request.get_json()
        print("Received Data:", data)  # Debugging: Log received data

        # Extract 'surveyformdata_uid' and 'is_qc_done' values from the data
        # 'surveyformdata_uid' is passed via JSON, and 'is_qc_done' is a flag indicating the QC status
        surveyformdata_uid = data.get('surveyFormDataUid')  # This should be passed in the query params (though it is generally in JSON)
        is_qc_done = data.get('is_qc_done')

        # Log the extracted form ID and QC status for debugging purposes
        print("Form ID:", surveyformdata_uid)
        print("QC Status:", is_qc_done)

        # Check if the form ID or QC status is missing
        if surveyformdata_uid is None or is_qc_done is None:
            return jsonify({'error': 'Invalid input'}), 400  # Return error if input is invalid

        # Query the database to find the survey form by form ID
        # 'surveyformdata_uid' is used to search for the correct form entry
        survey_form = survey_form_data.query.filter_by(surveyformdata_uid=surveyformdata_uid).first()

        # If the form is not found, return an error
        if not survey_form:
            return jsonify({'error': 'Form ID not found'}), 404  # Return error if form ID is not found

        # Update the 'is_qc_done' field with the value passed in the request
        # The value is expected to be a boolean (1 for QC done, 0 for not done)
        survey_form.is_qc_done = bool(is_qc_done)
        
        # Commit the changes to the database
        db.session.commit()

        # Return a success message after updating the record
        return jsonify({'message': 'Data updated successfully'}), 200

    except Exception as e:
        # Rollback the transaction if there's any error and return a message
        db.session.rollback()
        return jsonify({'error': str(e)}), 500  # Return error if any exception occurs



@app.route('/update_validation', methods=['POST'])
def update_validation():
    try:
        print("Request received at /update_validation endpoint.")

        # Parse request data
        request_data = request.get_json()
        print("Parsed request data:", request_data)

        # Extract parameters from request
        surveyformdata_uid = request_data.get('surveyformdata_uid')
        is_validation_done = request_data.get('is_validation_done')
        surveyform_status = request_data.get('surveyform_status')
        is_qc_done = request_data.get('is_qc_done')
        validator_remarks = request_data.get('validator_remarks')

        # Log extracted parameters
        print(f"Extracted Parameters: UID={surveyformdata_uid}, Validation Done={is_validation_done}, "
              f"Survey Status={surveyform_status}, QC Done={is_qc_done}, Remarks={validator_remarks}")

        # Validate required fields
        if not surveyformdata_uid or is_validation_done is None:
            print("Validation failed: Missing required fields.")
            return jsonify({"error": "Missing required fields"}), 400

        # Query the existing record
        print(f"Querying survey form data for UID: {surveyformdata_uid}")
        survey_form = db.session.query(survey_form_data).filter_by(surveyformdata_uid=surveyformdata_uid).first()

        if not survey_form:
            print("Survey form not found in the database.")
            return jsonify({"error": "Survey form not found"}), 404

        print("Survey form found:", survey_form)

        # Update the fields based on validation status
        if is_validation_done == 1:  # Accept
            print("Processing acceptance.")
            survey_form.is_validation_done = is_validation_done
            survey_form.is_qc_done = is_qc_done
            survey_form.surveyform_status = surveyform_status
            print("Fields updated for acceptance.")
        elif is_validation_done == 2:  # Reject
            print("Processing rejection.")
            survey_form.is_validation_done = is_validation_done
            survey_form.is_qc_done = is_qc_done
            survey_form.surveyform_status = surveyform_status
            survey_form.validator_remarks = validator_remarks
            print("Fields updated for rejection.")

        # Commit changes to the database
        db.session.commit()
        print("Database commit successful. Sending success response.")
        return jsonify({"message": "Validation updated successfully!"})

    except SQLAlchemyError as e:
        db.session.rollback()
        print(f"Database error occurred: {e}")
        return jsonify({"error": "An error occurred while updating validation"}), 500

    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500







                # Module
#-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                                        # Admin Panel

                
#----------------------------------------------
                # Dropdown Values Page (Admin)

# Route to fetch data for dropdowns
@app.route('/dropdown_values_admin_panel', methods=['GET'])
def dropdown_values_admin_panel():
    # the thing doesnt ends here since we are using soft delte with the help of the another column as is_dropdownvalues_active so when the page loads the filtering logic where we have put we also have to consider a condition that to filter the data where is_dropdownvalues_active is 1
    # dont use all instead add a condition that is_dropdownvalues_active should be 1 where 1 means active
    
    # Query all the values from the DropdownValues table
    dropdown_data = dropdown_values.query.filter_by(value_softdel=1).all()


    # Prepare the data to be returned as JSON
    data = {
        'dropdownvalues_uid': [item.dropdownvalues_uid for item in dropdown_data],
        'Node_Name': [item.node_name for item in dropdown_data],
        'Sector': [item.sector_no for item in dropdown_data],
        'Block_Name': [item.block_name for item in dropdown_data],
        'Plot_No': [item.plot_no for item in dropdown_data],
        'value_softDel':[item.value_softdel for item in dropdown_data]
    }

    # Print the data before calling jsonify
    print("Data being sent as JSON response: data")
    print(data)  # This prints the Python dictionary  
    return jsonify(data)  # This sends the data as a JSON response



    
# Route to update data in the database
@app.route('/update_dropdown_values', methods=['POST'])
def update_dropdown_values():
    # Get the updated data from the frontend
    updated_data = request.get_json()  # Get the JSON data sent from frontend
    
    print(updated_data)
    # Extract values from the received JSON
    node_name = updated_data.get('column1')
    sector = updated_data.get('column2')
    block_name = updated_data.get('column3')
    plot_no = updated_data.get('column4')
    dropdownvalues_uid = updated_data.get('uid')
    #first take the uid that we are getting from the requrest
    # then go in the dropdownvalue_uid column match this uid if match found then go in the is_dropdownvalues_active and set this value to 0 
    # so basically we are soft deleleting the entry but the data persists in the database table
    
    print("these si the uid")
    print(dropdownvalues_uid)


    print("these are the values we got from the updated drop down values")
    print(node_name,sector,block_name,plot_no)
    # Find the record in the database to update (example: updating the first record)
    record = dropdown_values.query.filter_by(dropdownvalues_uid=dropdownvalues_uid).first() # You can modify this to update a specific record

    # Update the fields
    if record:
        record.node_name = node_name
        record.sector = sector
        record.block_name = block_name
        record.plot_no = plot_no

        # Commit the changes to the database
        db.session.commit()

        # Return success response
        return jsonify({'success': True})

    return jsonify({'success': False, 'message': 'Record not found'})
    


# Define the route to handle the delete request
@app.route('/delete_values', methods=['POST'])
def delete_values():
    # Get the JSON data sent from the front end
    request_data = request.get_json()
    
    # Extract the uid from the request data
    uid_to_delete = request_data.get('uid')
    
    # Print the UID to the console
    print("Received UID to delete:", uid_to_delete)

    record = dropdown_values.query.filter_by(dropdownvalues_uid=uid_to_delete).first()
    print(f"value of record is: {record}")

    
    if record:
        # Update the 'value_softDel' column to 0
        record.value_softdel = 0
        
        # Commit the changes to the database
        db.session.commit()

        # # Optionally, refresh the record to ensure the update is applied
        # db.session.refresh(record)
        
        # Respond back to the front end
        return jsonify({'message': 'Record updated successfully', 'uid': uid_to_delete})
    else:
        return jsonify({'message': 'UID not found', 'uid': uid_to_delete}), 404



                # Module
#----------------------------------------------
                # Manage Sector (Admin)


@app.route('/onload_manage_sector', methods=['POST', 'GET'])
def onload_manage_sector():
    try:
        print("[DEBUG] Entered onload_manage_sector route")

        # Retrieve all active data from sector_table
        print("[DEBUG] Querying SectorTable...")
        sectors = sector_table.query.filter_by(sectortable_isactive=1).all()
        print(f"[DEBUG] Retrieved {len(sectors)} records from SectorTable")

        # Convert data to a list of dictionaries
        sector_list = []
        for sector in sectors:
            # Fetch the corresponding user info from user_info table
            user_info_data = user_info.query.filter_by(userinfo_uid=sector.userinfo_uid).first()
            user_data = {
                "user_id": user_info_data.user_id if user_info_data else None,
                "user_name": user_info_data.name if user_info_data else None,
                "role": user_info_data.role if user_info_data else None

            }

            # Add sector data along with user info
            sector_data = {
                "sector_name": sector.sector_name,
                "sectortable_uid": sector.sectortable_uid,
                "userinfo_uid": sector.userinfo_uid,
                "user_id": user_data["user_id"],
                "user_name": user_data["user_name"],
                "role": user_data["role"]

            }
            sector_list.append(sector_data)

        print(f"[DEBUG] Records to be sent to the web page: {sector_list}")

        return jsonify(sector_list), 200
    except Exception as e:
        print(f"[ERROR] Exception occurred: {str(e)}")
        return jsonify({"error": str(e)}), 500








@app.route('/del_values', methods=['POST', 'GET'])
def del_values():
    # Get the JSON data sent from the front end
    request_data = request.get_json()
    
    # Extract the sectortable_uid from the request data
    sectortable_uid_to_delete = request_data.get('sectortable_uid')
    
    # Print the sectortable_uid to the console for debugging
    print("Received UID to delete:", sectortable_uid_to_delete)

    # Query the database to find the record by sectortable_uid
    record = sector_table.query.filter_by(sectortable_uid=sectortable_uid_to_delete).first()
    print(f"value of record is: {record}")

    if record:
        # Update the 'user_id' column (or another column if necessary) to mark as deleted
        record.sectortable_isactive = '0'  # Setting the user_id to '0' to mark as deleted
        
        # Commit the changes to the database
        db.session.commit()

        # Respond back to the front end
        return jsonify({'message': 'Record updated successfully', 'sectortable_uid': sectortable_uid_to_delete})
    else:
        return jsonify({'message': 'UID not found', 'sectortable_uid': sectortable_uid_to_delete}), 404





@app.route('/update_values', methods=['POST'])
def update_values():
    # Get the JSON data sent from the front end
    request_data = request.get_json()
    print("we are here boysss")
    print(request_data)
    # Extract the values from the request
    sectortable_uid = request_data.get('sectortableUid')
    user_name = request_data.get('username')
    sector_name = request_data.get('sectorName')
    phone_no = request_data.get('phoneNo')

    # Print the received data for debugging
    print(f"Received data to update: UID={sectortable_uid}, User={user_name}, Sector={sector_name}, Phone={phone_no}")

    # Query the database to find the record by sectortable_uid
    record = sector_table.query.filter_by(sectortable_uid=sectortable_uid).first()
    print("we are here after the record tabels")
    print("this is the record")
    print(record)
    if record:
        print("we are insinde the record if statmenet ")
        # Update the fields with the new values
        record.user_name = user_name
        record.sector_name = sector_name
        record.phone_no = phone_no

        # Commit the changes to the database
        db.session.commit()

        # Respond back to the front end
        return jsonify({'message': 'Record updated successfully'})
    else:
        return jsonify({'message': 'UID not found'}), 404
    



#----------------------------------------------
# Employee Table (Admin) - Put Code here





# {} helper functions

def extract_rows_from_db(surveyformdata_uid):
    try:
        # Query the survey_form_data table using the given surveyformdata_uid
        plot_detail = survey_form_data.query.filter(survey_form_data.surveyformdata_uid == surveyformdata_uid).first()


        if plot_detail:
            # Return the data as a dictionary
            return {
                'surveyformdata_uid': surveyformdata_uid,
                'user_name': plot_detail.user_name,
                'node_name': plot_detail.node_name,
                'sector_no': plot_detail.sector_no,
                'block_name': plot_detail.block_name,
                'plot_name': plot_detail.plot_name,
                'plot_status': plot_detail.plot_status,
                'allotment_date': plot_detail.allotment_date.strftime('%Y-%m-%d'),  # Formatting the date
                'original_allottee': plot_detail.original_allottee,
                'area': plot_detail.area,
                'use_of_plot': plot_detail.use_of_plot,
                'rate': plot_detail.rate,
                'FSI': plot_detail.FSI,
                'term_of_lease': plot_detail.term_of_lease,
                'calc_area' : plot_detail.calc_area,
                'ownerNtransferDate':plot_detail.ownerNtransferDate,
                'surveyor_remarks': plot_detail.surveyor_remarks,
                'front_photo': plot_detail.front_photo,
                'left_photo': plot_detail.left_photo,
                'back_photo': plot_detail.back_photo,
                'right_photo': plot_detail.right_photo,
                'plot_sketch': plot_detail.plot_sketch,
                'images' : plot_detail.images,
                'entry_date_created': plot_detail.entry_date_created.strftime('%Y-%m-%d %H:%M:%S'),  # Formatting the datetime
                'surveyform_status': plot_detail.surveyform_status,
                'is_qc_done':plot_detail.is_qc_done,
                'is_validation_done':plot_detail.is_validation_done,
                'validator_remarks':plot_detail.validator_remarks
            }
        else:
            # If no record is found, return an error message
            return {'error': 'Plot details not found'}
    
    except Exception as e:
        # Handle any exceptions that might occur during the query
        return {'error': f'An error occurred: {str(e)}'}







#----------------------------------------------
                # Dashboard code here 
#----------------------------------------------







# {}
# user info editsection trial code --------------------------------------------------------------------------------------------




# 
# Route to fetch filtered dropdown data
@app.route('/get_editUser_values', methods=['GET'])
def get_editUser_values():
    # Get filter parameters from request arguments
    name = request.args.get('name')
    user_id = request.args.get('user_id')
    role = request.args.get('role')

    # Query the database and filter based on the parameters
    query = user_info.query

    if name:
        query = query.filter_by(name=name)
    if user_id:
        query = query.filter_by(user_id=user_id)
    if role:
        query = query.filter_by(role=role)

    userEdit = query.all()

    # Prepare the response data with unique values
    data = {
        'name': list(set(item.name for item in userEdit if item.name)),
        'user_id': list(set(item.user_id for item in userEdit if item.user_id)),
        'role': list(set(item.role for item in userEdit if item.role))
    }

    print("Filtered data being sent as JSON response:")
    print(data)

    return jsonify(data)
# 





@app.route('/userEdit_values_admin_panel', methods=['GET'])
def userEdit_values_admin_panel():
    # the thing doesnt ends here since we are using soft delte with the help of the another column as is_dropdownvalues_active so when the page loads the filtering logic where we have put we also have to consider a condition that to filter the data where is_dropdownvalues_active is 1
    # dont use all instead add a condition that is_dropdownvalues_active should be 1 where 1 means active
    
    # Query all the values from the DropdownValues table
    userEdit = user_info.query.filter_by(value_softdel=1).all()

    print("this is the user edit", userEdit)
    # Prepare the data to be returned as JSON
    data = {
        'userinfo_uid': [item.userinfo_uid for item in userEdit],
        'name': [item.name for item in userEdit],
        'user_id': [item.user_id for item in userEdit],
        'role': [item.role for item in userEdit],
        'value_softdel':[item.value_softdel for item in userEdit],

    }

    # Print the data before calling jsonify
    print("Data being sent as JSON response: data")
    print(data)  # This prints the Python dictionary  
    return jsonify(data)  # This sends the data as a JSON response



    
# Route to update data in the database
@app.route('/update_userEdit_values', methods=['POST'])
def update_userEdit():
    # Get the updated data from the frontend
    updated_data = request.get_json()  # Get the JSON data sent from frontend
    
    print("rolcheckcheckcheckcheckcheckcheckcheckcheckcheckcheckcheckcheckcheckcheckcheckcheckcheckcheckcheckcheckcheckcheckcheckcheckcheckcheck")
    print(updated_data)
    print("checkcheckcheckcheckcheckcheckcheckcheckcheckcheckcheckcheckcheckcheckcheckcheckcheckcheckcheckcheckcheckcheckcheckcheckcheckcheckcheck")
    # Extract values from the received JSON
    name = updated_data.get('column2')
    user_id = updated_data.get('column1')
    userinfo_uid = updated_data.get('uid')
    roletext = updated_data.get('roleText')

    role = 99
    #first take the uid that we are getting from the requrest
    # then go in the dropdownvalue_uid column match this uid if match found then go in the is_dropdownvalues_active and set this value to 0 
    # so basically we are soft deleleting the entry but the data persists in the database table
    
    print("these si the uid")
    print(userinfo_uid)


    print("these are the values we got from the updated drop down values")
    print(name,user_id,role)

    if roletext =="Surveyor":
        role = 0
    elif roletext =="QC":
        role = 1
    elif roletext =="Validator":
        role = 2
    elif roletext =="Client":
        role = 4

    # Find the record in the database to update (example: updating the first record)
    record = user_info.query.filter_by(userinfo_uid=userinfo_uid).first() # You can modify this to update a specific record

    # Update the fields
    if record:
        record.name = name
        record.user_id = user_id
        record.role = role

        # Commit the changes to the database
        db.session.commit()

        # Return success response
        return jsonify({'success': True})

    return jsonify({'success': False, 'message': 'Record not found'})
    


# Define the route to handle the delete request
@app.route('/delete_user_values', methods=['POST'])
def delete_user_values():
    # Get the JSON data sent from the front end
    request_data = request.get_json()
    
    # Extract the uid from the request data
    uid_to_delete = request_data.get('uid')
    
    # Print the UID to the console
    print("Received UID to delete:", uid_to_delete)

    record = user_info.query.filter_by(userinfo_uid=uid_to_delete).first()
    print(f"value of record is: {record}")

    
    if record:
        # Update the 'value_softDel' column to 0
        record.value_softdel = 0
        
        # Commit the changes to the database
        db.session.commit()

        # # Optionally, refresh the record to ensure the update is applied
        # db.session.refresh(record)
        
        # Respond back to the front end
        return jsonify({'message': 'Record updated successfully', 'uid': uid_to_delete})
    else:
        return jsonify({'message': 'UID not found', 'uid': uid_to_delete}), 404

# {}------------------------------------------------------------------------------------------------------------------------------------------
# @app.route('/getTransferDetails', methods=['GET'])
# def get_transfer_details():
#     try:
#         # Query the database for transfer details
#         result = request.args.get('ownerNtransferDate')
#         print(result)
#         if result and result.ownerNtransferDate:
#             return jsonify({'data': result.ownerNtransferDate})
#         else:
#             return jsonify({'data': ''}), 404  # No data found
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)

