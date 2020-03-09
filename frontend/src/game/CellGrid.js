import React from 'react';
import Cell from './Cell'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    table: {
        marginLeft: "auto",
        marginRight: "auto",
        width: "100%",
        height: "100%",
        float: "none"
    }
})


export default function CellGrid(props) {

    const { boardState, handleClick } = props;

    const classes = useStyles();

    function renderGameCells() {
        return boardState.map((currentRow, rowIndex) => {
            return <tr>
                {
                    currentRow.map((cellValue, columnIndex) => {
                        return <Cell cellValue={cellValue}
                                    onClick={() => handleClick(rowIndex, columnIndex)}
                                />
                    })
                }
            </tr>
        })
    };



    return (
        <table className={classes.table}>
            <tbody>
                {renderGameCells()}
            </tbody>
        </table>
    )
}
