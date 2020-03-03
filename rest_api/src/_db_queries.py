GET_SUBJECT = """
SELECT experiment_status, assignment_status 
FROM tblResults 
WHERE subject_id = {subject_id};
"""

STORE_MOVE_QUERY_TEMPLATE = """
INSERT INTO tblResults (
    subject_id,
    cell_top_left,
    cell_top_middle,
    cell_top_right,
    cell_middle_left,
    cell_middle_middle,
    cell_middle_right,
    cell_bottom_left,
    cell_bottom_middle,
    cell_bottom_right,
    suggested_move_row,
    suggested_move_column,
    actual_move_row,
    actual_move_column
) FROM (
    {subject_id},
    {cell_top_left},
    {cell_top_middle},
    {cell_top_right},
    {cell_middle_left},
    {cell_middle_middle},
    {cell_middle_right},
    {cell_bottom_left},
    {cell_bottom_middle},
    {cell_bottom_right},
    {suggested_move_row},
    {suggested_move_column},
    {actual_move_row},
    {actual_move_column}
);
""" 

SET_EXPERIMENT_STATUS_QUERY_TEMPLATE = """
UPDATE tblSubjects
SET experiment_status={experiment_status} 
FROM tblSubjects 
WHERE subject_id = {subject_id};
"""
