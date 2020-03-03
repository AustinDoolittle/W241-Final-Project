from enum import Enum

class CellState(Enum):
    X = 'X'
    O = 'O'
    Unclaimed = 'U'

class AssignmentStatus(Enum):
    NotAssigned = 'N'
    Treatment = 'T'
    Control = 'C'

class ExperimentStatus(Enum):
    NotStarted = 'N'
    Incomplete = 'I'
    Complete = 'C'
