from psycopg2 import connect

from src.enums import AssignmentStatus, ExperimentStatus
from src._db_queries import  (
    GET_ASSIGNMENT_STATUS_QUERY_TEMPLATE, 
    GET_EXPERIMENT_STATUS_QUERY_TEMPLATE,
    STORE_MOVE_QUERY_TEMPLATE,
    SET_EXPERIMENT_STATUS_QUERY_TEMPLATE
)


class DatabaseClient():
    _USER = 'postgres'

    def __init__(self, client):
        self._client = client

    def _execute_sql(self, sql_template, **kwargs):
        sql_string = sql_template.format(**kwargs)
        with self._client.cursor() as cur:
            return cur.execute(sql_string)

    def get_subject(subject_id: str) -> dict:
        result = self._execute_sql(
            GET_ASSIGNMENT_STATUS_QUERY_TEMPLATE,
            subject_id=subject_id
        )

        experiment_status, assignment_status = result.fetchone()
        return {
            'experiment_status': experiment_status,
            'assignment_status': assignment_status,
        }

    def store_move(subject_id: int, suggested_move: dict, actual_move: dict, board_state: dict):
        self._execute_sql(
            STORE_MOVE_QUERY_TEMPLATE,
            subject_id=subject_id,
            cell_top_left=board_state[0][0],
            cell_top_middle=board_state[0][1],
            cell_top_right=board_state[0][2],
            cell_middle_left=board_state[1][0],
            cell_middle_middle=board_state[1][1],
            cell_middle_right=board_state[1][2],
            cell_bottom_left=board_state[2][0],
            cell_bottom_middle=board_state[2][1],
            cell_bottom_right=board_state[2][2],
            suggested_move_row=suggested_move['row'],
            suggested_move_column=suggested_move['column'],
            actual_move_row=actual_move['row'],
            actual_move_column=actual_move['column']
        )

    def set_experiment_status(subject_id: str, experiment_status: ExperimentStatus):
        self._execute_sql(
            SET_EXPERIMENT_STATUS_QUERY_TEMPLATE,
            subject_id=subject_id,
            experiment_status=experiment_status.value
        )
