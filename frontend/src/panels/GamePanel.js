import React, { useState, useEffect } from 'react';
import CellGrid from '../game/CellGrid';
import { cellStates } from '../game/Cell';
import {makeStyles} from '@material-ui/core/styles';
import PlayerSymbolAssignment from '../game/PlayerSymbolAssignment';
import CurrentPlayer, {  players } from '../game/CurrentPlayer';

const useStyles = makeStyles({
    floatRight: {
        float: 'right'
    },
    floatLeft: {
        float: 'left'
    }
});

class InvalidMoveError extends Error {};

export default function GamePanel(props) { 
    const rowCount = 3;
    const columnCount = 3;
    const numberofGames = 5;   
    const initialBoardState = Array(rowCount)
        .fill()
        .map(() => {
            return Array(columnCount)
                .fill(cellStates.UNCLAIMED);
        }
    );

    const { handleAdvance } = props;
    const classes = useStyles(props);
    const [currentGameNumber, setCurrentGameNumber] = useState(0);
    const [boardState, setBoardState] = useState(initialBoardState);
    const [currentSymbolTurn, setCurrentSymbolTurn] = useState(cellStates.X);

    function getCurrentPlayerSymbolAssignment() {
        const newPlayerSymbolAssignment = {};
        if ((currentGameNumber % 2) === 0) {
            newPlayerSymbolAssignment[cellStates.X] = players.HUMAN;
            newPlayerSymbolAssignment[cellStates.O] = players.COMPUTER;
        }
        else {
            newPlayerSymbolAssignment[cellStates.X] = players.COMPUTER;
            newPlayerSymbolAssignment[cellStates.O] = players.HUMAN;
        }
        return newPlayerSymbolAssignment
    }
    const [playerSymbolAssignment, setPlayerSymbolAssignment] = useState(getCurrentPlayerSymbolAssignment());


    function handleGridCellClick(rowIndex, columnIndex) {
        if (boardState[rowIndex][columnIndex] !== cellStates.UNCLAIMED) {
            throw new InvalidMoveError("This cell has already been selected.")
        }

        boardState[rowIndex][columnIndex] = currentSymbolTurn;
        setBoardState(boardState);
        toggleCurrentSymbolTurn();
    }

    function toggleCurrentSymbolTurn() {
        switch(currentSymbolTurn) {
            case cellStates.X:
                setCurrentSymbolTurn(cellStates.O);
                break;
            case cellStates.O:
                setCurrentSymbolTurn(cellStates.X);
                break;
            default:
                throw new Error('Unsupported player value: ' + currentSymbolTurn)
        }
    }


    function hasSomeoneWon(currentMoveRowIndex, currentMoveColumnIndex) {
        var completeCheckFns = [
            checkRowForWinner,
            checkColumnForWinner,
            checkForwardDiagonalForWinner,
            checkBackwardDiagonalForWinner
        ]

        return completeCheckFns.some((fn) => fn(currentMoveRowIndex, currentMoveColumnIndex));
    }

    function checkIfSequenceIsComplete(sequence) {
        var firstValue = sequence[0];

        if (firstValue === cellStates.UNCLAIMED) {
            return false;
        }

        return sequence.slice(1).every((currValue) => currValue === firstValue);
    }

    function checkRowForWinner(currentMoveRowIndex, currentMoveColumnIndex) {
        return checkIfSequenceIsComplete(boardState[currentMoveRowIndex]);
    }
    function checkColumnForWinner(currentMoveRowIndex, currentMoveColumnIndex) {
        var columnValues = boardState.map((row, rowIndex) => row[currentMoveColumnIndex]);
        return checkIfSequenceIsComplete(columnValues);
    }
    function checkForwardDiagonalForWinner(currentMoveRowIndex, currentMoveColumnIndex) {
        var maxIndex = boardState[currentMoveRowIndex].length - 1;

        if (currentMoveRowIndex !== (maxIndex - currentMoveColumnIndex)) {
            return false;
        }
        var diagonalValues = boardState.map((row, rowIndex) => row[maxIndex - rowIndex])
        return checkIfSequenceIsComplete(diagonalValues);
    }
    function checkBackwardDiagonalForWinner(currentMoveRowIndex, currentMoveColumnIndex) {
        if (currentMoveRowIndex !== currentMoveColumnIndex) {
            return false;
        }

        var diagonalValues = boardState.map((row, rowIndex) => row[rowIndex]);
        return checkIfSequenceIsComplete(diagonalValues);
    }
    function areAllMovesExhausted() {
        return boardState.every((row) => row.every((cell) => cell !== cellStates.UNCLAIMED))
    }

    function resetGame() {
        setBoardState(initialBoardState);

        setPlayerSymbolAssignment(getCurrentPlayerSymbolAssignment());
    }

    useEffect(resetGame, [currentGameNumber])

    return (
        <div>
            <div className={classes.floatLeft}>
                <CurrentPlayer currentPlayer={playerSymbolAssignment[currentSymbolTurn]}></CurrentPlayer>
            </div>
            <div className={classes.floatRight}>
                <PlayerSymbolAssignment playerSymbolAssignment={playerSymbolAssignment}></PlayerSymbolAssignment>
            </div>
            <CellGrid boardState={boardState} handleClick={handleGridCellClick}></CellGrid>
        </div>
    )
}
