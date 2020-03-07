import React, { useState } from 'react';
import GameCell, {cellStates} from './GameCell.js'
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({

})

function GameBoard() {
    const initialBoardState = Array(3).fill(Array(3).fill(cellStates.UNCLAIMED))
    const [boardState, setBoardState] = useState(initialBoardState);

    function handleClick(rowIndex, columnIndex) {
        function updateBoardState(playerSymbol) {
            boardState[rowIndex][columnIndex] = playerSymbol
            setBoardState(this.boardState)
        }
        return updateBoardState;
    }

    function renderGameCells() {
        return boardState.map((currentRow, rowIndex) => {
            return <tr>
                {
                    currentRow.map((cellValue, columnIndex) => {
                        return <GameCell cellValue={cellValue} onClick={handleClick(rowIndex, columnIndex)}></GameCell>
                    })
                }
            </tr>
        })
    };

    return (
        <table>
            {renderGameCells()}
        </table>
    )
}

export default withStyles(styles)(GameBoard);