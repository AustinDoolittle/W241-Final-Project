import React, { useState } from 'react';
import GameCell, {cellStates} from './GameCell.js'
import { makeStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';

const useStyles = makeStyles({
    table: {
        marginLeft: "auto",
        marginRight: "auto",
        width: "100%",
        height: "100%",
        float: "none"
    }
})

class InvalidMoveError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InvalidMoveError'
    }
}

export default function GameBoard() {
    const initialBoardState = Array(3).fill().map(() => Array(3).fill(cellStates.UNCLAIMED))
    const [boardState, setBoardState] = useState(initialBoardState);
    const [currentPlayer, setCurrentPlayer] = useState(cellStates.X);
    const classes = useStyles();

    function createClickHandler(rowIndex, columnIndex) {
        function handleClick() {
            try {
                currentPlayerMove(rowIndex, columnIndex);
            }
            catch (err) {
                window.alert(err.message)
                return;
            }

            if (checkIfGameComplete(rowIndex, columnIndex)) {
                // TODO
            }

            toggleCurrentPlayer();
        }
        return handleClick;
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
        var nColumns = boardState[currentMoveRowIndex].length;

        if (currentMoveRowIndex !== (nColumns - currentMoveColumnIndex)) {
            return false;
        }
        var diagonalValues = boardState.map((row, rowIndex) => row[nColumns - rowIndex])
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


    function checkIfGameComplete(currentMoveRowIndex, currentMoveColumnIndex) {
        var completeCheckFns = [
            checkRowForWinner,
            checkColumnForWinner,
            checkForwardDiagonalForWinner,
            checkBackwardDiagonalForWinner
        ]

        var isWinner = completeCheckFns.some((fn) => fn(currentMoveRowIndex, currentMoveColumnIndex));
        if (isWinner) {
            window.alert('Someone won!');
            return;
        }

        if (areAllMovesExhausted()) {
            window.alert('It\'s a draw!');
            return;
        }
    }

    function currentPlayerMove(rowIndex, columnIndex) {
        if (boardState[rowIndex][columnIndex] !== cellStates.UNCLAIMED) {
            throw new InvalidMoveError("This cell has already been selected.")
        }

        boardState[rowIndex][columnIndex] = currentPlayer;
        setBoardState(boardState);
    }

    function toggleCurrentPlayer() {
        switch(currentPlayer) {
            case cellStates.X:
                setCurrentPlayer(cellStates.O);
                break;
            case cellStates.O:
                setCurrentPlayer(cellStates.X);
                break;
            default:
                throw new Error('Unsupported player value: ' + currentPlayer)
        }
    }

    function renderGameCells() {
        return boardState.map((currentRow, rowIndex) => {
            return <tr>
                {
                    currentRow.map((cellValue, columnIndex) => {
                        return <GameCell cellValue={cellValue}
                                    onClick={createClickHandler(rowIndex, columnIndex)}
                                />
                    })
                }
            </tr>
        })
    };

    return (
        // TODO It feels like I should just be able to define the style for the `table` tag?
        <div>
            It's {currentPlayer}'s turn
            <table className={classes.table}>
                {renderGameCells()}
            </table>
        </div>
    )
}
