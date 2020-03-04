CREATE TYPE CELL_STATE_TYPE AS ENUM ('X', 'O', 'U');
CREATE TYPE ASSIGNMENT_STATUS_TYPE AS ENUM ('N', 'I', 'C');
CREATE TYPE EXPERIMENT_STATUS_TYPE AS ENUM ('N', 'I', 'C');

CREATE TABLE tblSubjects (
    subject_id SERIAL,
    experiment_status EXPERIMENT_STATUS_TYPE NOT NULL,
    assignment_status ASSIGNMENT_STATUS_TYPE NOT NULL,
    PRIMARY KEY(subject_id)
);

CREATE TABLE tblResults (
    result_id SERIAL,
    subject_id INT NOT NULL,
    game_number INT NOT NULL,
    player_symbol CELL_STATE_TYPE NOT NULL,
    board_state_top_left CELL_STATE_TYPE NOT NULL,
    board_state_top_middle CELL_STATE_TYPE NOT NULL,
    board_state_top_right CELL_STATE_TYPE NOT NULL,
    board_state_middle_left CELL_STATE_TYPE NOT NULL,
    board_state_middle_middle CELL_STATE_TYPE NOT NULL,
    board_state_middle_right CELL_STATE_TYPE NOT NULL,
    board_state_bottom_left CELL_STATE_TYPE NOT NULL,
    board_state_bottom_middle CELL_STATE_TYPE NOT NULL,
    board_state_bottom_right CELL_STATE_TYPE NOT NULL,
    suggested_move_row INT NOT NULL,
    suggested_move_column INT NOT NULL,
    move_taken_row INT NOT NULL,
    move_taken_column INT NOT NULL,
    PRIMARY KEY(result_id), 
    FOREIGN KEY(subject_id) REFERENCES tblSubjects(subject_id)
);
