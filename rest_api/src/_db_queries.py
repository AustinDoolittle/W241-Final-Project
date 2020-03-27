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

GET_SUBJECT_EMAILS_NOT_COMPLETE_QUERY_TEMPLATE = """
SELECT subject_id, email_address
FROM tblSubjects
WHERE is_pilot = {is_pilot} AND experiment_status = 'N'
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

GET_ALL_MOVES = """
SELECT 
    s.subject_id, 
    s.experiment_status, 
    s.assignment_status, 
    s.is_pilot, 
    s.gender, 
    s.age, 
    s.email_address, 
    r.game_number, 
    r.move_number, 
    r.player_symbol, 
    r.board_state_top_left,      
    r.board_state_top_left,
    r.board_state_top_middle,
    r.board_state_top_right,
    r.board_state_middle_left,
    r.board_state_middle_middle,
    r.board_state_middle_right,
    r.board_state_bottom_left,
    r.board_state_bottom_middle,
    r.board_state_bottom_right,
    r.suggested_move_row,
    r.suggested_move_column,
    r.is_suggested_move_optimal,
    r.move_taken_row,
    r.move_taken_column
FROM 
    tblSubjects s,
    tblResults r

WHERE s.subject_id = r.subject_id
"""

GET_COMPLIANCE_RATES = """
SELECT
    s.subject_id,
    s.experiment_status,
    s.assignment_status,
    s.is_pilot,
    s.gender,
    s.age,
    s.email_address,
    COALESCE(c.complied_count, 0),
    COALESCE(c.total_count, 0),
    CASE WHEN c.total_count IS NULL THEN 0
        ELSE c.complied_count / CAST(c.total_count AS FLOAT)
    END AS comply_rate
FROM 
    tblSubjects s
LEFT JOIN (
    SELECT 
        subject_id,
        SUM(
            CAST(
                    (
                        r.suggested_move_row = r.move_taken_row AND 
                        r.suggested_move_column = r.move_taken_column
                    ) AS INT
                )
        ) AS complied_count,
        COUNT(subject_id) as total_count
    FROM tblResults as r
    GROUP BY r.subject_id
) c
ON c.subject_id = s.subject_id;
"""
