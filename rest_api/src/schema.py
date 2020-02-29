from marshmallow import Schema, fields, validate
from marshmallow_enum import EnumField

from util import CellState

_VALID_CELL_VALUES = [c.value for c in CellState]
_VALID_PLAYER_VALUES = [c.value for c in CellState if c != CellState.Unclaimed] 


class CellSelectionSchema(Schema)
    row = field.Int(required=True, validate=validate.Range(min=0, max=2))
    column = field.Int(required=True, validate=validate.Range(min=0, max=2))


class UserActionSchema(Schema):
    subject_id = fields.String(required=True)
    player_symbol = fields.String(required=True, validate=validation.oneOf(_VALID_PLAYER_VALUES))
    prior_game_state = fields.List(
        fields.List(
            fields.String(required=True, validate=validation.oneOf(_VALID_CELL_VALUES)), 
            validate=validate.Length(3)
        ),
        validate=validate.Length(3)
    )
    selected_cell = fields.Nested(CellSelectionSchema)
    suggested_cell = fields.Nested(CellSelectionSchema)
