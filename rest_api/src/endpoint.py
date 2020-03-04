from flask import Flask, g, jsonify, request
from flask_cors import CORS

from src.schema import CellSelectionSchema, UserActionSchema
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

@app.route('/subject/<subject_id>', methods=['GET'])
def get_subject(subject_id):
    db = get_db_interface()

    result = db.get_subject(subject_id)

    return jsonify(result), 200, _JSON_CONTENT_TYPE

@app.route('/move', methods=['POST'])
def set_move():
    user_action = UserActionSchema().load(request.get_json())
    db = get_db_interface()
    db.store_move(**user_action)

    return "{'status': OK}", 200, _JSON_CONTENT_TYPE
