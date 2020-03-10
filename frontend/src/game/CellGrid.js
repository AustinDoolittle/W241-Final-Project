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

    const { boardState, handleClick } = props;

    const classes = useStyles();

    function renderGameCells() {
        return boardState.map((currentRow, rowIndex) => {
            return <tr className={classes.tr}>
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
