CREATE TABLE IF NOT EXISTS tblSubjects (
    SubjectID INT UNIQUE,
    ExperimentStatus VARCHAR(2),
    TreatmentStatus VARCHAR(2),
    PRIMARY KEY(SubjectID)
);

CREATE TABLE IF NOT EXISTS tblResults (
    ResultKey INT UNIQUE,
    SubjectID INT,
    FOREIGN KEY(SubjectID) REFERENCES tblSubjects(SubjectID)
);