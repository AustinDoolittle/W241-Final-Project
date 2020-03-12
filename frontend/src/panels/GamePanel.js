import React, { useState, useEffect } from 'react';
import CellGrid from '../game/CellGrid';
import { makeStyles } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import GameController from "../game/GameController"
import { CellStates, Players } from "../game/utils";
import SoundPlayer from '../game/SoundPlayer';

const useStyles = makeStyles(theme => ({
    gameStateText: {
        display: "block",
        textAlign: "center",
        fontSize: "20px"
    }
}));

const REST_BASE_URL = 'http://localhost:5000';


export default function GamePanel(props) { 
    const { handleAdvance, numberOfGames, subjectID } = props;
    const classes = useStyles(props);
    const [currentGameNumber, setCurrentGameNumber] = useState(0);
    const [currentSymbolTurn, setCurrentSymbolTurn] = useState(CellStates.X);
    const [gameController, setGameController] = useState();
    const [winCount, setWinCount] = useState(0);
    const [lossCount, setLossCount] = useState(0);
    const [drawCount, setDrawCount] = useState(0);
    const [playerSymbolAssignment, setPlayerSymbolAssignment] = useState();
    const [soundPlayer, setSoundPlayer] = useState(new SoundPlayer(REST_BASE_URL, subjectID));
    const [highlightedCell, setHighlightedCell] = useState();

    function isHumanTurn() {
        if (playerSymbolAssignment == null) {
            return false;
        }

        return playerSymbolAssignment[currentSymbolTurn] === Players.HUMAN;
    }

    function handleGridCellClick(rowIndex, columnIndex) {
        gameController.makeMove(currentSymbolTurn, rowIndex, columnIndex)
        toggleCurrentSymbolTurn();
        setGameController(gameController);

        if (gameController.isWinner())  {
            const winningSymbol = gameController.getWinner()
            const winner = playerSymbolAssignment[winningSymbol]
    
            if (winner === Players.HUMAN) {
                setWinCount(winCount + 1);
            }
            else {
                setLossCount(lossCount + 1);
            }
        }
        else if (gameController.areAllMovesExhausted()) {
            setDrawCount(drawCount + 1);
        }
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
        setGameController(new GameController(REST_BASE_URL, subjectID));
    }

    function initializePlayerAssignments() {
        const newPlayerSymbolAssignment = {};
        if ((currentGameNumber % 2) === 0) {
            newPlayerSymbolAssignment[CellStates.X] = Players.HUMAN;
            newPlayerSymbolAssignment[CellStates.O] = Players.COMPUTER;
        }
        else {
            newPlayerSymbolAssignment[CellStates.X] = Players.COMPUTER;
            newPlayerSymbolAssignment[CellStates.O] = Players.HUMAN;
        }
        setPlayerSymbolAssignment(newPlayerSymbolAssignment);
    }

    function initializeGame() {        
        initializePlayerAssignments();
        initializeGameController();
        setCurrentSymbolTurn(CellStates.X);
        setHighlightedCell();
    }

    function startNextGame() {
        const newGameNumber = currentGameNumber + 1;
        if (newGameNumber === numberOfGames) {
            handleAdvance();
        }

        setCurrentGameNumber(newGameNumber);
    }

    function getRandomAvailableCell() {
        const availableMoves = gameController.getAvailableMoves();

        if (availableMoves.length === 0) {
            throw new RangeError('All possible moves have been exhausted')
        }

        const randomIndex = Math.floor(Math.random() * availableMoves.length);
        return availableMoves[randomIndex];
    }

    function selectRandomAvailableCell() {
        const selectedMove = getRandomAvailableCell();
        handleGridCellClick(selectedMove[0], selectedMove[1])
    }

    function makeSuggestion() {
        if (!isHumanTurn()) {
            return;
        }
        
        const selectedMove = getRandomAvailableCell();
        setHighlightedCell(selectedMove);
        soundPlayer.triggerMoveSuggestionSound(selectedMove[0], selectedMove[1])
    }

    useEffect(initializeGame, [currentGameNumber]);
    useEffect(makeSuggestion, [currentSymbolTurn, playerSymbolAssignment]);

    const continueButtonText = (currentGameNumber === (numberOfGames + 1)) ? "Finish" : "Next Game";
    var disableContinueButton = true;
    var gameStateText;
    var boardState = [];
    var boardIsActive = false;
    if (gameController == null) {
        gameStateText = "Initializing game...";
    }
    else 
    {
        boardState = gameController.getBoardState();
        
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
            boardIsActive = true;
        }
    }


    return (
        <div>
        <Grid container>
            <Grid item xs={3}>
                <span>Game {currentGameNumber + 1} of {numberOfGames}</span>
            </Grid>
            <Grid item xs={6}>
            </Grid>
            <Grid item xs={3}>
                <span>Wins: {winCount} Losses: {lossCount} Draws: {drawCount}</span>
            </Grid>
        </Grid>
            <CellGrid 
                boardState={boardState} 
                handleClick={handleGridCellClick} 
                isActive={boardIsActive}
                highlightedCell={highlightedCell}></CellGrid>
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
