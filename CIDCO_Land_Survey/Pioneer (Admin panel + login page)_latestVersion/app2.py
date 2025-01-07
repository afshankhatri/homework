from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import pandas as pd
from sqlalchemy import text


app = Flask(__name__)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+pymysql://root:root@127.0.0.1:3305/plot_details'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize SQLAlchemy
db = SQLAlchemy(app)

# Define the data model (optional, for ORM queries)
class survey_form_data(db.Model):
    __tablename__ = 'survey_form_data'
    surveyformdata_uid = db.Column(db.Integer, primary_key=True)
    surveyform_status = db.Column(db.Integer)
    is_qc_done = db.Column(db.Integer)
    is_validation_done = db.Column(db.Integer)
    node_name = db.Column(db.String(100))
    sector_no = db.Column(db.String(50))

class dropdown_values(db.Model):
    __tablename__ = 'dropdown_values'
    dropdownvalues_uid = db.Column(db.String(50), primary_key=True)
    node_name = db.Column(db.String(100))
    sector_no = db.Column(db.String(50))
    block_name = db.Column(db.String(50))
    plot_name = db.Column(db.String(100))
    value_softDel = db.Column(db.Boolean)

@app.route('/dashboard')
def index():
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
if __name__ == '__main__':
    app.run(debug=True)
