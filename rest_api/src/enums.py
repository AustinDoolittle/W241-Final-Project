from enum import Enum

class CellState(Enum):
    X = 'X'
    O = 'O'
    Unclaimed = 'U'

class AssignmentStatus(Enum):
    NotAssigned = 'N'
    TreatmentMale = 'TM'
    TreatmentFemale = 'TF'
    Control = 'C'

class ExperimentStatus(Enum):
    NotStarted = 'N'
    Incomplete = 'I'
    Complete = 'C'
