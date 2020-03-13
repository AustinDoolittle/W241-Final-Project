CREATE TABLE tblSubjects (
    subject_id SERIAL,
    experiment_status VARCHAR(2) NOT NULL,
    assignment_status VARCHAR(2) NOT NULL,
    is_pilot BOOLEAN NOT NULL,
    email_address VARCHAR(256) NOT NULL,
    
    PRIMARY KEY(subject_id)
);

CREATE TABLE tblResults (
    result_id SERIAL,
    subject_id INT NOT NULL,
    game_number INT NOT NULL,
    move_number INT NOT NULL,
    player_symbol VARCHAR(2) NOT NULL,
    board_state_top_left VARCHAR(2) NOT NULL,
    board_state_top_middle VARCHAR(2) NOT NULL,
    board_state_top_right VARCHAR(2) NOT NULL,
    board_state_middle_left VARCHAR(2) NOT NULL,
    board_state_middle_middle VARCHAR(2) NOT NULL,
    board_state_middle_right VARCHAR(2) NOT NULL,
    board_state_bottom_left VARCHAR(2) NOT NULL,
    board_state_bottom_middle VARCHAR(2) NOT NULL,
    board_state_bottom_right VARCHAR(2) NOT NULL,
    suggested_move_row INT NOT NULL,
    suggested_move_column INT NOT NULL,
    is_suggested_move_optimal BOOLEAN NOT NULL,
    move_taken_row INT NOT NULL,
    move_taken_column INT NOT NULL,
    PRIMARY KEY(result_id), 
    FOREIGN KEY(subject_id) REFERENCES tblSubjects(subject_id)
);
