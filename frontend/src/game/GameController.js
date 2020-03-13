import {CellStates} from '../util/enums'

class InvalidMoveError extends Error {};

export default class GameController {
    rowCount = 3;
    columnCount = 3;
    rowWinningSequences = [
        [[0, 0], [0, 1], [0, 2]],
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],
    ]

    columnWinningSequences = [
        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],
    ]

    diagonalWinningSequences = [
        [[2, 0], [1, 1], [0, 2]],
        [[0, 0], [1, 1], [2, 2]]
    ]

    allPossibleWinningSequences = this.rowWinningSequences
        .concat(this.columnWinningSequences)
        .concat(this.diagonalWinningSequences)

    constructor() {
        this.boardState = this.createEmptyBoard();
    }

    createEmptyBoard() {
        return Array(this.rowCount)
            .fill()
            .map(() => {
                return Array(this.columnCount)
                    .fill(CellStates.UNCLAIMED);
            }
        );
    }
    
    isWinningSequence(sequenceCoordinates) {
        const firstCellCoordinates = sequenceCoordinates[0];
        const firstCellState = this.getCellState(firstCellCoordinates[0], firstCellCoordinates[1]);

        if (firstCellState === CellStates.UNCLAIMED) {
            return false;
        }

        for (let currentCellCoordinates of sequenceCoordinates.slice(1)) {
            const currCellState = this.getCellState(currentCellCoordinates[0], currentCellCoordinates[1])
            if ( currCellState !== firstCellState) {
                return false;
            }
        }

        return true;
    }

    isGameComplete() {
        return this.areAllMovesExhausted() || this.isWinner()
    }

    isWinner() {
        return this.getWinningSequences().length !== 0;
    }

    getWinner() {
        const winningSequences = this.getWinningSequences()
        const firstCellCoordinates = winningSequences[0][0]

        return this.getCellState(firstCellCoordinates[0], firstCellCoordinates[1])
    }

    getWinningSequences() {
        const winningSequences = [];
        for (let sequence of this.allPossibleWinningSequences) {
            if (this.isWinningSequence(sequence)) {
                winningSequences.push(sequence)
            }
        }

        return winningSequences;
    }

    getBoardState() {
        return this.boardState;
    }

    getAvailableMoves() {
        const availableMoves = []
        for (let row = 0; row < this.rowCount; row++) {
            for (let column = 0; column < this.columnCount; column++) {
                const currentCellState = this.getCellState(row, column)
                if (currentCellState !== CellStates.UNCLAIMED) {
                    continue;
                }

                availableMoves.push([row, column])
            }
        }
        return availableMoves;
    }

    areAllMovesExhausted() {
        return this.getAvailableMoves().length === 0
    }

    makeMove(symbol, rowIndex, columnIndex) {
        if (symbol === CellStates.UNCLAIMED) {
            throw TypeError(`Attempted to make move with invalid symbol: ${symbol}`)
        }

        this.setCellState(symbol, rowIndex, columnIndex);
    }

    assertCoordinatesInBounds(rowIndex, columnIndex) {
        if (rowIndex >= this.rowCount) {
            throw new InvalidMoveError(`Row index ${rowIndex} is out of bounds.`);
        }

        if (columnIndex >= this.columnCount) {
            throw new InvalidMoveError(`Column index ${columnIndex} is out of bounds.`);
        }
    }

    assertCellIsUnclaimed(rowIndex, columnIndex) {
        const cellValue = this.getCellState(rowIndex, columnIndex);

        if (cellValue !== CellStates.UNCLAIMED) {
            throw new InvalidMoveError(`Expected cell to be unclaimed. Was ${cellValue}.`);
        }
    }

    getCellState(rowIndex, columnIndex) {
        return this.boardState[rowIndex][columnIndex]
    }

    setCellState(newState, rowIndex, columnIndex) {
        this.assertCoordinatesInBounds(rowIndex, columnIndex)
        this.assertCellIsUnclaimed(rowIndex, columnIndex)

        this.boardState[rowIndex][columnIndex] = newState;
    }
}