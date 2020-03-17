GET_SUBJECT_QUERY_TEMPLATE = """
SELECT experiment_status, assignment_status, is_pilot, gender, email_address
FROM tblSubjects 
WHERE subject_id = {subject_id};
"""

STORE_MOVE_QUERY_TEMPLATE = """
INSERT INTO tblResults (
    subject_id,
    game_number,
    move_number,
    player_symbol,
    board_state_top_left,
    board_state_top_middle,
    board_state_top_right,
    board_state_middle_left,
    board_state_middle_middle,
    board_state_middle_right,
    board_state_bottom_left,
    board_state_bottom_middle,
    board_state_bottom_right,
    suggested_move_row,
    suggested_move_column,
    is_suggested_move_optimal,
    move_taken_row,
    move_taken_column
) VALUES (
    {subject_id},
    {game_number},
    {move_number},
    {player_symbol},
    {board_state_top_left},
    {board_state_top_middle},
    {board_state_top_right},
    {board_state_middle_left},
    {board_state_middle_middle},
    {board_state_middle_right},
    {board_state_bottom_left},
    {board_state_bottom_middle},
    {board_state_bottom_right},
    {suggested_move_row},
    {suggested_move_column},
    {is_suggested_move_optimal},
    {move_taken_row},
    {move_taken_column}
);
""" 

SET_EXPERIMENT_STATUS_QUERY_TEMPLATE = """
UPDATE tblSubjects
SET experiment_status={experiment_status} 
WHERE subject_id = {subject_id};
"""
GET_SUBJECT_EMAILS_QUERY_TEMPLATE = """
SELECT subject_id, email_address
FROM tblSubjects
WHERE is_pilot = {is_pilot}
"""

GET_SUBJECT_RESULTS_QUERY_TEMPLATE = """
SELECT 
    game_number,
    move_number,
    player_symbol,
    board_state_top_left,
    board_state_top_middle,
    board_state_top_right,
    board_state_middle_left,
    board_state_middle_middle,
    board_state_middle_right,
    board_state_bottom_left,
    board_state_bottom_middle,
    board_state_bottom_right,
    suggested_move_row,
    suggested_move_column,
    is_suggested_move_optimal,
    move_taken_row,
    move_taken_column
FROM tblResults
WHERE subject_id = {subject_id}
ORDER BY game_number, move_number
"""