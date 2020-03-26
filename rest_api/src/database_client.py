import csv
import os

from psycopg2 import connect, sql

from src.enums import AssignmentStatus, ExperimentStatus
from src._db_queries import  (
    GET_SUBJECT_EMAILS_QUERY_TEMPLATE,
    GET_SUBJECT_RESULTS_QUERY_TEMPLATE,
    GET_SUBJECT_QUERY_TEMPLATE, 
    STORE_MOVE_QUERY_TEMPLATE,
    SET_EXPERIMENT_STATUS_QUERY_TEMPLATE,
    GET_SUBJECT_EMAILS_NOT_COMPLETE_QUERY_TEMPLATE,
)


class DatabaseClient():
    _USER = 'postgres'

    def __init__(self):
        self._client = connect(
            dbname=os.environ['POSTGRES_DBNAME'], 
            host=os.environ["POSTGRES_HOST"], 
            port=int(os.environ["POSTGRES_PORT"]), 
            user=os.environ["POSTGRES_USERNAME"], 
            password=os.environ["POSTGRES_PASSWORD"]
        )

    def _execute_sql(self, sql_template, cursor=None, **kwargs):
        sql_string = self._construct_query(sql_template, **kwargs)

        local_cursor = not cursor
        if local_cursor:
            cursor = self._client.cursor()

        cursor.execute(sql_string) 
        self._client.commit()

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

        experiment_status, assignment_status, is_pilot, gender, email_address = result[0]

        return {
            'experiment_status': experiment_status,
            'assignment_status': assignment_status,
            'is_pilot': is_pilot, 
            'gender': gender, 
            'email_address': email_address
        }

    def _set_experiment_status(self, subject_id: str, status: ExperimentStatus):
        self._execute_sql(
            SET_EXPERIMENT_STATUS_QUERY_TEMPLATE,
            subject_id=subject_id,
            experiment_status=status.value
        )

    def start_experiment(self, subject_id: str):
        self._set_experiment_status(subject_id, ExperimentStatus.Incomplete)
    
    def complete_experiment(self, subject_id: str):
        self._set_experiment_status(subject_id, ExperimentStatus.Complete)

    def store_move(self, subject_id: int, suggested_move: dict, move_taken: dict, board_state_before_turn: dict, game_number: int, move_number: int, is_suggested_move_optimal: bool, player_symbol: str):
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
            move_number=move_number,
            is_suggested_move_optimal=is_suggested_move_optimal,
        )

    def set_experiment_status(self, subject_id: str, experiment_status: ExperimentStatus):
        self._execute_sql(
            SET_EXPERIMENT_STATUS_QUERY_TEMPLATE,
            subject_id=subject_id,
            experiment_status=experiment_status.value
        )

    def get_subject_emails(self, is_pilot, reminder):
        if reminder:
            query_template = GET_SUBJECT_EMAILS_NOT_COMPLETE_QUERY_TEMPLATE
        else:
            query_template = GET_SUBJECT_EMAILS_QUERY_TEMPLATE

        return self._execute_sql_and_return_results(
            query_template,
            is_pilot=is_pilot
        )

    def get_subject_results(self, subject_id):
        return self._execute_sql_and_return_results(
            GET_SUBJECT_RESULTS_QUERY_TEMPLATE,
            subject_id=subject_id
        )

    def insert_subjects_from_csv(self, filename):
        def row_count():
            with open(filename) as in_file:
                return sum(1 for _ in in_file)

        num_rows = row_count()
        fp = open(filename, 'r')
        csv_reader = csv.DictReader(fp)

        kwargs = {}

        sql_string = "INSERT INTO tblSubjects ("
        for i, column_name in enumerate(csv_reader.fieldnames):
            sql_string += column_name

            if i < len(csv_reader.fieldnames) - 1:
                sql_string += ', '

        sql_string += ') VALUES '
        
        for i, row in enumerate(csv_reader):
            sql_string += '(\n'
            for j, (column_name, column_value) in enumerate(row.items()):
                key_string = column_name + '_' + str(i)
                kwargs[key_string] = column_value
                sql_string += '{' + key_string + '}'
                if j < (len(row) - 1):
                    sql_string += ','

                sql_string += '\n'
        
            sql_string += ')'

            if csv_reader.line_num != num_rows:
                sql_string += ','

            sql_string += '\n'
        
        sql_string += ';'

        self._execute_sql(sql_string, **kwargs)



