import React from 'react';
import { cellStates } from './Cell';
import { players } from './CurrentPlayer';

export default function PlayerSymbolAssignment(props) {
    const { playerSymbolAssignment } = props;
    const inverseSymbolAssignment = {};
    inverseSymbolAssignment[playerSymbolAssignment[cellStates.X]] = cellStates.X;
    inverseSymbolAssignment[playerSymbolAssignment[cellStates.O]] = cellStates.O;

    const playerAssignmentString = `You: ${inverseSymbolAssignment[players.HUMAN]}, Computer: ${inverseSymbolAssignment[players.COMPUTER]}`;

    return (
        <div>{playerAssignmentString}</div>
    )
}