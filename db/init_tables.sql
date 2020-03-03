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
    cell_top_left CELL_STATE_TYPE NOT NULL,
    cell_top_middle CELL_STATE_TYPE NOT NULL,
    cell_top_right CELL_STATE_TYPE NOT NULL,
    cell_middle_left CELL_STATE_TYPE NOT NULL,
    cell_middle_middle CELL_STATE_TYPE NOT NULL,
    cell_middle_right CELL_STATE_TYPE NOT NULL,
    cell_bottom_left CELL_STATE_TYPE NOT NULL,
    cell_bottom_middle CELL_STATE_TYPE NOT NULL,
    cell_bottom_right CELL_STATE_TYPE NOT NULL,
    suggested_move_row INT NOT NULL,
    suggested_move_column INT NOT NULL,
    actual_move_row INT NOT NULL,
    actual_move_column INT NOT NULL,
    PRIMARY KEY(result_id), 
    FOREIGN KEY(subject_id) REFERENCES tblSubjects(subject_id)
);
