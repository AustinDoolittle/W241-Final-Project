from psycopg2 import connect, sql

from src.enums import AssignmentStatus, ExperimentStatus
from src._db_queries import  (
    GET_SUBJECT_QUERY_TEMPLATE, 
    STORE_MOVE_QUERY_TEMPLATE,
    SET_EXPERIMENT_STATUS_QUERY_TEMPLATE
)


class DatabaseClient():
    _USER = 'postgres'

    def __init__(self):
        self._client = connect(
            dbname='postgres', 
            host='postgres', 
            port=5432, 
            user='postgres', 
            password='CHANGEME'
        )

    def _execute_sql(self, sql_template, cursor=None, **kwargs):
        sql_string = self._construct_query(sql_template, **kwargs)

        local_cursor = not cursor
        if local_cursor:
            cursor = self._client.cursor()

        cursor.execute(sql_string)

        if local_cursor:
            cursor.close()

    def _execute_sql_and_return_results(self, *args, **kwargs):
        cursor = self._client.cursor()
        self._execute_sql(*args, cursor=cursor, **kwargs)
        try:
            return cursor.fetchall()
        finally:
            cursor.close()

    def _construct_query(self, query_str, **kwargs):
        sanitized_kwargs = self._sanitize_sql_arguments(**kwargs)
        return sql.SQL(query_str).format(**sanitized_kwargs)

    def _sanitize_sql_arguments(self, **kwargs):
        return {k: sql.Literal(v) for k, v in kwargs.items()}

    def get_subject(self, subject_id: str) -> dict:
        result = self._execute_sql_and_return_results(
            GET_SUBJECT_QUERY_TEMPLATE,
            subject_id=subject_id
        )

        if not result:
            raise ValueError(f'Invalid Subject ID {subject_id}')

        experiment_status, assignment_status = result[0]

        return {
            'experiment_status': experiment_status,
            'assignment_status': assignment_status,
        }

    def store_move(self, subject_id: int, suggested_move: dict, move_taken: dict, board_state_before_turn: dict, game_number: int, player_symbol: str):
        self._execute_sql(
            STORE_MOVE_QUERY_TEMPLATE,
            subject_id=subject_id,
            player_symbol=player_symbol,
            game_number=game_number,
            board_state_top_left=board_state_before_turn[0][0],
            board_state_top_middle=board_state_before_turn[0][1],
            board_state_top_right=board_state_before_turn[0][2],
            board_state_middle_left=board_state_before_turn[1][0],
            board_state_middle_middle=board_state_before_turn[1][1],
            board_state_middle_right=board_state_before_turn[1][2],
            board_state_bottom_left=board_state_before_turn[2][0],
            board_state_bottom_middle=board_state_before_turn[2][1],
            board_state_bottom_right=board_state_before_turn[2][2],
            suggested_move_row=suggested_move['row'],
            suggested_move_column=suggested_move['column'],
            move_taken_row=move_taken['row'],
            move_taken_column=move_taken['column'],
        )

    def set_experiment_status(self, subject_id: str, experiment_status: ExperimentStatus):
        self._execute_sql(
            SET_EXPERIMENT_STATUS_QUERY_TEMPLATE,
            subject_id=subject_id,
            experiment_status=experiment_status.value
        )
