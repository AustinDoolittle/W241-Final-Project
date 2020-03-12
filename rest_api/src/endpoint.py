from flask import (
    Flask, 
    g, 
    jsonify, 
    request,
    send_file
)
from flask_cors import CORS

from src.enums import AssignmentStatus
from src.database_client import DatabaseClient
from src.schema import CellSelectionSchema, UserActionSchema
from src.sound_file_retriever import SoundFileRetriever

_JSON_CONTENT_TYPE = {'ContentType':'application/json'} 
_SOUND_FILE_PATH = './assets'

app = Flask(__name__)
CORS(app)


def get_db_client():
    if 'db' not in g:
        g.db = DatabaseClient()
    
    return g.db


def get_sound_file_retriever():
    if 'sound_file_retriever' not in g:
        g.sound_file_retriever = SoundFileRetriever(_SOUND_FILE_PATH)
    
    return g.sound_file_retriever


@app.route('/', methods=['GET'])
def index():
    return "Hello world!"

@app.route('/subject/<subject_id>', methods=['GET'])
def get_subject(subject_id):
    db = get_db_client()

    result = db.get_subject(subject_id)

    return jsonify(result), 200, _JSON_CONTENT_TYPE

@app.route('/move', methods=['POST'])
def set_move():
    user_action = UserActionSchema().load(request.get_json())
    db = get_db_client()
    db.store_move(**user_action)

    return "{'status': OK}", 200, _JSON_CONTENT_TYPE

@app.route('/sounds/<sound_file>', methods=["GET"])
def get_suggestion_audio_clip(sound_file):
    if "subjectID" not in request.args:
        return "Missing required parameter `subjectID`", 400

    subject_id = request.args['subjectID']
    db_interface = get_db_client()
    sound_file_retriever = get_sound_file_retriever()

    subject_information = db_interface.get_subject(subject_id)
    assignment_status = subject_information['assignment_status']
    
    if assignment_status == AssignmentStatus.NotAssigned:
        return "This subject has not been assigned to an experiment group yet", 400

    sound_file_path = sound_file_retriever.resolve_filename(sound_file, assignment_status)

    return send_file(
        sound_file_path,
        mimetype='audio/wav',
        as_attachment=True,
        attachment_filename=sound_file
    )
