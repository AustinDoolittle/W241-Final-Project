from src.enums import AssignmentStatus, ExperimentStatus

from psycopg2 import connect

class DatabaseClient():
    _USER = 'postgres'

    def __init__(self, host='postgres', port=5432):
        password = self._get_password()
        self._client = connect(dbname='default', host=host, port=port, user=self._USER, password=password)

    @staticmethod
    def _get_password(self):
        # TODO CHANGEME
        return 'CHANGEME'

    def get_assignment_status(subject_id: str) -> AssignmentStatus:
        raise NotImplementedError()

    def get_experiment_status(subject_id: str) -> ExperimentStatus:
        raise NotImplementedError()

    def store_move(move: dict):
        raise NotImplementedError()

    def set_experiment_status(subject_id: str):
        raise NotImplementedError