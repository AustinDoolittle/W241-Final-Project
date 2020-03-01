from flask import Flask, g
from flask_cors import CORS

from src.database_client import DatabaseClient

_JSON_CONTENT_TYPE = {'ContentType':'application/json'} 

app = Flask(__name__)
CORS(app)

def get_db_interface():
    if 'db' not in g:
        g.db = DatabaseClient()
    
    return g.db


@app.route('/', methods=['GET'])
def index():
    return "Hello world!"


@app.route('/subject/<subject_id>/experiment_status', methods=['GET'])
def get_experiment_status(subject_id):
    db = get_db_interface()

    experiment_status = db.get_experiment_status(subject_id)

    result = {
        'subject_id': subject_id,
        'experiment_status': experiment_status.value 
    }

    return experiment_status, 200, _JSON_CONTENT_TYPE
