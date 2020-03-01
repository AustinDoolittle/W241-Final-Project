from enum import Enum

class CellState(Enum):
    X = 'X'
    O = 'O'
    Unclaimed = 'U'

class AssignmentStatus(Enum):
    Treatment = 'T'
    Control = 'C'
    NotAssigned = 'NA'

class ExperimentStatus(Enum):
    NotStarted = 'NA'
    Incomplete = 'I'
    Complete = 'C'
