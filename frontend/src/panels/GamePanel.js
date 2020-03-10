import React, { useState, useEffect } from 'react';
import CellGrid from '../game/CellGrid';
import { cellStates } from '../game/Cell';
import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import PlayerSymbolAssignment from '../game/PlayerSymbolAssignment';
import CurrentPlayer, {  players } from '../game/CurrentPlayer';
import Grid from "@material-ui/core/Grid";
import GridItem from "@material-ui/core/Grid"

const useStyles = makeStyles(theme => ({
    textAlignRight: {
        textAlign: 'right'
    },
    textAlignLeft: {
        textAlign: 'left'
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    }
}));

class InvalidMoveError extends Error {};

export default function GamePanel(props) { 
    const rowCount = 3;
    const columnCount = 3;
    const initialBoardState = Array(rowCount)
        .fill()
        .map(() => {
            return Array(columnCount)
                .fill(cellStates.UNCLAIMED);
        }
    );

    const { handleAdvance, numberOfGames } = props;
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


    function checkRowsForWinner() {
        for (let row of boardState) {
            const firstCellState = row[0]

            if (firstCellState === cellStates.UNCLAIMED) {
                continue;
            }

            var isWinningRow = true;
            for (let cell of row.slice(1)) {
                if (cell !== firstCellState) {
                    isWinningRow = false;
                    break;
                }
            }

            if (isWinningRow) {
                return true;
            }
        }

        return false;
    }

    function checkColumnsForWinner() {
        for (let columnIndex = 0; columnIndex < columnCount; columnIndex++) {
            const firstCellState = boardState[0][columnIndex];

            if (firstCellState === cellStates.UNCLAIMED) {
                continue;
            }

            var isWinningColumn = true;
            for (let row of boardState.slice(1)) {
                if (row[columnIndex] !== firstCellState) {
                    isWinningColumn = false;
                    break;
                }
            }

            if (isWinningColumn) {
                return true;
            }
        }

        return false;
    }

    function checkSequenceForWinner(cellIndices) {
        const firstIndex = cellIndices[0];
        const firstCellState = boardState[firstIndex[0]][firstIndex[1]]

        if (firstCellState === cellStates.UNCLAIMED) {
            return false;
        }

        for (let index of cellIndices.splice(1,)) {
            const currCellState = boardState[index[0]][index[1]];
            if ( currCellState !== firstCellState) {
                return false;
            }
        }

        return true;
    }

    function checkForwardDiagonalForWinner() {
        const cellIndices = [[2, 0], [1, 1], [0, 2]]
        return checkSequenceForWinner(cellIndices);
    }

    function checkBackwardDiagonalForWinner() {
        const cellIndices = [[0, 0], [1, 1], [2, 2]]
        return checkSequenceForWinner(cellIndices);
    }

    function isWinner() {
        const completeCheckFns = [
            checkRowsForWinner,
            checkColumnsForWinner,
            checkForwardDiagonalForWinner,
            checkBackwardDiagonalForWinner
        ]

        return completeCheckFns.some((fn) => fn())
    }

    function getWinner() {
        // TODO this is a hack
        // We rely on the fact that the turn is swapped before we actually check for a winner.
        if (currentSymbolTurn === cellStates.X) {
            return playerSymbolAssignment[cellStates.O]
        }
        else {
            return playerSymbolAssignment[cellStates.X]
        }
    }

    function resetGame() {
        setBoardState(initialBoardState);

        setPlayerSymbolAssignment(getCurrentPlayerSymbolAssignment());
    }

    function startNextGame() {
        const newGameNumber = currentGameNumber + 1;
        if (newGameNumber === numberOfGames) {
            handleAdvance();
        }

        setCurrentGameNumber(newGameNumber);
    }

    function getAvailableMoves() {
        const availableMoves = []
        for (let row = 0; row < boardState.length; row++) {
            for (let column = 0; column < boardState[row].length; column++) {
                if (boardState[row][column] !== cellStates.UNCLAIMED) {
                    continue;
                }

                availableMoves.push([row, column])
            }
        }
        return availableMoves;
    }

    function isBoardFull() {
        return (getAvailableMoves().length === 0)
    }

    function selectRandomAvailableCell() {
        // accumulate valid moves
        const availableMoves = getAvailableMoves();

        const randomIndex = Math.floor(Math.random() * availableMoves.length);
        const selectedMove = availableMoves[randomIndex];
        handleGridCellClick(selectedMove[0], selectedMove[1])
    }

    useEffect(resetGame, [currentGameNumber])


    var displayBackdrop = false;
    var backdropContent = null;
    if (isWinner())  {
        // there is a winner, make sure the message is displayed

        var displayString;
        if (players.HUMAN === getWinner()) {
            displayString = "You won!";
        }
        else {
            displayString = "You lost!";
        }

        displayBackdrop = true;
        backdropContent =  (<Card>
                                <CardContent>
                                    <Typography>{displayString}</Typography>
                                    <Button onClick={startNextGame}>Start Next Game</Button>
                                </CardContent>
                            </Card>)
    }
    else if (isBoardFull()) {
        // Display a draw message
        displayBackdrop = true;
        backdropContent =  (<Card>
                                <CardContent>
                                    <Typography>It's a draw!</Typography>
                                    <Button onClick={startNextGame}>Start Next Game</Button>
                                </CardContent>
                            </Card>)
    }
    else if(playerSymbolAssignment[currentSymbolTurn] === players.COMPUTER) {
        // display the backdrop if it is the computer's turn
        displayBackdrop = true;
        backdropContent =  (<Card>
                                <CardContent>
                                    <Typography>The computer is taking their turn...</Typography>
                                </CardContent>
                            </Card>)
        setTimeout(selectRandomAvailableCell, 1000)
    }

    return (
        <div>
            <Grid container spacing={2}>
                <Grid item xs={3}>
                    <CurrentPlayer currentPlayer={playerSymbolAssignment[currentSymbolTurn]} className={classes.textAlignLeft}></CurrentPlayer>
                </Grid>
                <Grid item xs={6}></Grid>
                <Grid item xs={3}>
                    <PlayerSymbolAssignment playerSymbolAssignment={playerSymbolAssignment} className={classes.textAlignRight}></PlayerSymbolAssignment>
                </Grid>
            </Grid>
            <CellGrid boardState={boardState} handleClick={handleGridCellClick}></CellGrid>
            <Backdrop className={classes.backdrop} open={displayBackdrop}>
                {backdropContent}
            </Backdrop> 
        </div>
    )
}
