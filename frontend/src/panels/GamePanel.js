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

const randomMoveProbability = 0.5;

export default function GamePanel(props) { 
    const { handleAdvance, numberOfGames, soundPlayer, handlePlayerMove } = props;
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
    const [isOptimalMove, setIsOptimalMove] = useState(false);
    const [moveNumber, setMoveNumber] = useState(0);

    function isHumanTurn() {
        if (playerSymbolAssignment == null) {
            return false;
        }

        return playerSymbolAssignment[currentSymbolTurn] === Players.HUMAN;
    }

    function triggerMoveHandler(rowIndex, columnIndex) {
        const moveObject = {
            player_symbol: currentSymbolTurn,
            game_number: currentGameNumber,
            move_number: moveNumber,
            board_state_before_turn: boardState,
            move_taken: {
                row: rowIndex,
                column: columnIndex
            },
            suggested_move: {
                row: highlightedCell[0],
                column: highlightedCell[1]
            },
            is_suggested_move_optimal: isOptimalMove
        }

        handlePlayerMove(moveObject)
    }

    function handleGridCellClick(rowIndex, columnIndex) {
        if (isHumanTurn()) {
            triggerMoveHandler(rowIndex, columnIndex);
        }
        gameController.makeMove(currentSymbolTurn, rowIndex, columnIndex);
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
            setMoveNumber(moveNumber + 1);
            if(playerSymbolAssignment[currentSymbolTurn] === Players.COMPUTER) {
                // display the backdrop if it is the computer's turn
                newGameStateText = "The computer is making their move...";
                setTimeout(handleComputerTurn, 1000);
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

    function getOppositeSymbol(symbol) {
        switch(symbol) {
            case CellStates.X:
                return CellStates.O
            case CellStates.O:
                return CellStates.X
            default:
                throw new TypeError('Unsupported player value: ' + currentSymbolTurn)
        }
    }

    function toggleCurrentSymbolTurn() {
        const newSymbol = getOppositeSymbol(currentSymbolTurn);
        setCurrentSymbolTurn(newSymbol);
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
        setMoveNumber(0);
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

    function getMove() {
        var selectedMove;
        if (Math.random() > randomMoveProbability) {
            selectedMove = getOptimalMove();
            setIsOptimalMove(true);
        }
        else {
            selectedMove = getRandomAvailableCell();
            setIsOptimalMove(false);
        }

        return selectedMove;
    }

    function getRandomAvailableCell() {
        const availableMoves = gameController.getAvailableMoves();

        if (availableMoves.length === 0) {
            throw new RangeError('All possible moves have been exhausted')
        }

        const randomIndex = Math.floor(Math.random() * availableMoves.length);
        return availableMoves[randomIndex];
    }

    function handleComputerTurn() {
        const selectedMove = getMove();
        handleGridCellClick(selectedMove[0], selectedMove[1])
    }

    function makeSuggestion() {
        if (!isHumanTurn() || (gameController != null && gameController.isGameComplete())) {
            setHighlightedCell();
            return;
        }
        
        var selectedMove = getMove();

        // const selectedMove = getRandomAvailableCell();
        setHighlightedCell(selectedMove);
        soundPlayer.triggerMoveSuggestionSound(selectedMove[0], selectedMove[1])
    }

    function getOptimalMove() {
        function minimax(controller, symbol) {
            /* A super simple implementation of minimax optimization */

            // base case
            if (controller.isGameComplete()) {
                if (controller.areAllMovesExhausted()) {
                    return 0;
                }
                else if (controller.getWinner() === currentSymbolTurn) {
                    return 1;
                }
                else {
                    return -1;
                }
            }


            var bestVal = symbol === currentSymbolTurn ? -1000 : 1000;
            const compareFunc = symbol === currentSymbolTurn ? Math.max : Math.min
            const newSymbol = getOppositeSymbol(symbol);
            for (let move of controller.getAvailableMoves()) {
                const controllerCopy = controller.copy();
                controllerCopy.makeMove(symbol, move[0], move[1]);
                const newVal = minimax(controllerCopy, newSymbol);
                bestVal = compareFunc(newVal, bestVal);
            }

            return bestVal;
        }

        var bestVal = null;
        var bestMove = null;
        const newSymbol = getOppositeSymbol(currentSymbolTurn);
        for (let move of gameController.getAvailableMoves()) {
            const controllerCopy = gameController.copy();
            controllerCopy.makeMove(currentSymbolTurn, move[0], move[1]);
            const newVal = minimax(controllerCopy, newSymbol);
            if (bestVal == null || newVal > bestVal) {
                bestVal = newVal;
                bestMove = move;
            }
        }

        return bestMove;
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
                    <span>
                        Wins: {winLossDrawCounter.getWinCount()} Losses: {winLossDrawCounter.getLossCount()} Draws: {winLossDrawCounter.getDrawCount()}
                    </span>
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
