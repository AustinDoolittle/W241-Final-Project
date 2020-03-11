import React, { useState, useEffect } from 'react';
import CellGrid from '../game/CellGrid';
import { makeStyles } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import GameController from "../game/GameController"
import { CellStates, Players } from "../game/utils";

const useStyles = makeStyles(theme => ({
    gameStateText: {
        display: "block",
        textAlign: "center",
        fontSize: "20px"
    }
}));


export default function GamePanel(props) { 
    const { handleAdvance, numberOfGames } = props;
    const classes = useStyles(props);
    const [currentGameNumber, setCurrentGameNumber] = useState(0);
    const [currentSymbolTurn, setCurrentSymbolTurn] = useState(CellStates.X);
    var gameController;
    var playerSymbolAssignment;

    function handleGridCellClick(rowIndex, columnIndex) {
        gameController.makeMove(currentSymbolTurn, rowIndex, columnIndex)
        toggleCurrentSymbolTurn();
    }

    function toggleCurrentSymbolTurn() {
        switch(currentSymbolTurn) {
            case CellStates.X:
                setCurrentSymbolTurn(CellStates.O);
                break;
            case CellStates.O:
                setCurrentSymbolTurn(CellStates.X);
                break;
            default:
                throw new TypeError('Unsupported player value: ' + currentSymbolTurn)
        }
    }

    function initializeGameController() {
        gameController = GameController();
    }

    function initializePlayerAssignments() {
        playerSymbolAssignment = {};
        if ((currentGameNumber % 2) === 0) {
            playerSymbolAssignment[CellStates.X] = Players.HUMAN;
            playerSymbolAssignment[CellStates.O] = Players.COMPUTER;
        }
        else {
            playerSymbolAssignment[CellStates.X] = Players.COMPUTER;
            playerSymbolAssignment[CellStates.O] = Players.HUMAN;
        }
    }

    function initializeGame() {
        initializeGameController();
        initializePlayerAssignments();
    }

    function startNextGame() {
        const newGameNumber = currentGameNumber + 1;
        if (newGameNumber === numberOfGames) {
            handleAdvance();
        }

        setCurrentGameNumber(newGameNumber);
    }

    function selectRandomAvailableCell() {
        // accumulate valid moves
        const availableMoves = gameController.getAvailableMoves();

        if (availableMoves.length === 0) {
            throw new RangeError('All possible moves have been exhausted')
        }

        const randomIndex = Math.floor(Math.random() * availableMoves.length);
        const selectedMove = availableMoves[randomIndex];
        handleGridCellClick(selectedMove[0], selectedMove[1])
    }

    useEffect(initializeGame, []);
    useEffect(initializeGame, [currentGameNumber]);

    const continueButtonText = currentGameNumber === (numberOfGames + 1) ? "Finish" : "Next Game";
    var disableContinueButton = true;
    var gameStateText;
    if (gameController.isWinner())  {
        // there is a winner, make sure the message is displayed
        disableContinueButton = false;

        const winningSymbol = gameController.getWinner()
        const winner = playerSymbolAssignment[winningSymbol]

        if (winner === Players.HUMAN) {
            gameStateText = "You win!";
        }
        else {
            gameStateText = "You lose!"
        }
    }
    else if (gameController.areAllMovesExhausted()) {
        // Display a draw message
        disableContinueButton = false;
        gameStateText = "It's a draw!"
    }
    else if(playerSymbolAssignment[currentSymbolTurn] === Players.COMPUTER) {
        // display the backdrop if it is the computer's turn
        setTimeout(selectRandomAvailableCell, 1000);
        gameStateText = "The computer is making their move...";
    }
    else {
        gameStateText = "It's your turn";
    }


    return (
        <div>
            <CellGrid boardState={gameController.getBoardState()} handleClick={handleGridCellClick}></CellGrid>
            <Grid container>
                <Grid item xs={2}></Grid>
                <Grid item xs={8}>
                    <span className={classes.gameStateText}>{gameStateText}</span>
                </Grid>
                <Grid item xs={2}>
                    <Button variant="contained" disabled={disableContinueButton} onClick={startNextGame}>{continueButtonText}</Button>
                </Grid>
            </Grid>
        </div>
    )
}
