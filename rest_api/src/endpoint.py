import flask
from flask_cors import CORS

app = flask.Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def index():
    return "Hello world!"
