import React from 'react';
import Cell from './Cell'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    table: {
        width: "100%",
        maxWidth: "750px",
        marginLeft: "auto",
        marginRight: "auto",
        borderCollapse: "collapse"
    },
    tr: {
        "&:nth-of-type(3) td": {
            borderBottomColor: "transparent"
        }
    },
})


export default function CellGrid(props) {

    const { boardState, isActive, handleClick, highlightedCell } = props;

    const classes = useStyles();

    function isCellHighlighted(rowIndex, columnIndex) {
        if (highlightedCell == null) {
            return false;
        }

        return (rowIndex === highlightedCell[0]) && (columnIndex === highlightedCell[1]);
    }

    function renderGameCells() {
        return boardState.map((currentRow, rowIndex) => {
            return <tr className={classes.tr}>
                {
                    currentRow.map((cellValue, columnIndex) => {
                        return <Cell isActive={isActive} 
                                    cellValue={cellValue}
                                    onClick={() => handleClick(rowIndex, columnIndex)}
                                    isHighlighted={isCellHighlighted(rowIndex, columnIndex)}
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
