import React, { useState, useEffect } from 'react';
import CellGrid from '../game/CellGrid';
import { makeStyles } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import GameController from "../game/GameController"
import { CellStates, Players } from "../util/enums";
import WinLossDrawCounter from '../game/WinLossDrawCounter';

const useStyles = makeStyles(theme => ({
    gameStateText: {
        display: "block",
        textAlign: "center",
        fontSize: "20px"
    }
}));


export default function GamePanel(props) { 
    const { handleAdvance, numberOfGames, soundPlayer } = props;
    const classes = useStyles(props);
    const [currentGameNumber, setCurrentGameNumber] = useState(0);
    const [currentSymbolTurn, setCurrentSymbolTurn] = useState(CellStates.X);
    const [gameController, setGameController] = useState();
    const [boardState, setBoardState] = useState([]);
    const [winLossDrawCounter, setWinLossDrawCounter] = useState(new WinLossDrawCounter());
    const [playerSymbolAssignment, setPlayerSymbolAssignment] = useState();
    const [highlightedCell, setHighlightedCell] = useState();
    const [continueButtonText, setContinueButtonText] = useState('Next Game');
    const [isGameComplete, setIsGameComplete] = useState(false);
    const [gameStateText, setGameStateText] = useState("Initializing Tic-Tac-Toe...");
    const [boardIsActive, setBoardIsActive] = useState(false);

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
                winLossDrawCounter.incrementWinCount();
                setWinLossDrawCounter(winLossDrawCounter);
            }
            else {
                winLossDrawCounter.incrementLossCount();
                setWinLossDrawCounter(winLossDrawCounter);
            }
        }
        else if (gameController.areAllMovesExhausted()) {
            winLossDrawCounter.incrementDrawCount();
            setWinLossDrawCounter(winLossDrawCounter);
        }
    }

    function handleTurnChange() {
        if (gameController == null) {
            return
        }

        setBoardState(gameController.getBoardState());
        soundPlayer.cancelSound();

        var newGameStateText;
        if (gameController.isGameComplete()) {
            setIsGameComplete(true);
            setBoardIsActive(false);

            if (gameController.isWinner())  {
                // there is a winner, make sure the message is displayed
        
                const winningSymbol = gameController.getWinner()
                const winner = playerSymbolAssignment[winningSymbol]
                
                if (winner === Players.HUMAN) {
                    newGameStateText = "You win!";
                }
                else {
                    newGameStateText = "You lose!"
                }
            }
            else {
                newGameStateText = "It's a draw!";
            }
        }
        else {
            if(playerSymbolAssignment[currentSymbolTurn] === Players.COMPUTER) {
                // display the backdrop if it is the computer's turn
                newGameStateText = "The computer is making their move...";
                setTimeout(selectRandomAvailableCell, 1000);
                setBoardIsActive(false);
            }
            else {
                newGameStateText = "It's your turn";
                setBoardIsActive(true);
                makeSuggestion();
            }
        }

        setGameStateText(newGameStateText);
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
        setGameController(new GameController());
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
        setIsGameComplete(false);
        setHighlightedCell();
    }

    function startNextGame() {
        const newGameNumber = currentGameNumber + 1;
        if (newGameNumber === numberOfGames) {
            handleAdvance();
        }

        if (newGameNumber === numberOfGames - 1) {
            setContinueButtonText("Finish");
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
        if (!isHumanTurn() || (gameController != null && gameController.isGameComplete())) {
            setHighlightedCell();
            return;
        }
        
        const selectedMove = getRandomAvailableCell();
        setHighlightedCell(selectedMove);
        soundPlayer.triggerMoveSuggestionSound(selectedMove[0], selectedMove[1])
    }

    useEffect(initializeGame, [currentGameNumber]);
    useEffect(handleTurnChange, [currentSymbolTurn, playerSymbolAssignment]);

    return (
        <div>
        <Grid container>
            <Grid item xs={3}>
                <span>Game {currentGameNumber + 1} of {numberOfGames}</span>
            </Grid>
            <Grid item xs={6}>
            </Grid>
            <Grid item xs={3}>
                <span>Wins: {winLossDrawCounter.getWinCount()} Losses: {winLossDrawCounter.getLossCount()} Draws: {winLossDrawCounter.getDrawCount()}</span>
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
                    <Button variant="contained" disabled={!isGameComplete} onClick={startNextGame}>{continueButtonText}</Button>
                </Grid>
            </Grid>
        </div>
    )
}
