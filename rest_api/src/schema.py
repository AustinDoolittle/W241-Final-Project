from marshmallow import Schema, fields, validate
from marshmallow_enum import EnumField

from src.enums import CellState

_VALID_CELL_VALUES = [c.value for c in CellState]
_VALID_PLAYER_VALUES = [c.value for c in CellState if c != CellState.Unclaimed] 


class CellSelectionSchema(Schema):
    row = fields.Int(required=True, validate=validate.Range(min=0, max=2))
    column = fields.Int(required=True, validate=validate.Range(min=0, max=2))


class UserActionSchema(Schema):
    subject_id = fields.Int(required=True)
    player_symbol = fields.String(required=True, validate=validate.OneOf(_VALID_PLAYER_VALUES))
    game_number = fields.Int(required=True)
    board_state_before_turn = fields.List(
        fields.List(
            fields.String(required=True, validate=validate.OneOf(_VALID_CELL_VALUES)), 
            validate=validate.Length(3)
        ),
        validate=validate.Length(3)
    )
    move_taken = fields.Nested(CellSelectionSchema)
    suggested_move = fields.Nested(CellSelectionSchema)
