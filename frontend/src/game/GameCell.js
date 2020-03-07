import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    container: {
        minWidth: "50px",
        width: "100px",
        minHeight: "50px",
        height: "100px",
        margin: "10px",
        textAlign: "center",
        borderStyle: "solid",
        cursor: "pointer"
    },
});

export const cellStates = {
    X: 'X',
    O: 'O',
    UNCLAIMED: 'U'
}

export default function GameCell(props) {
    const classes = useStyles();
    const { cellValue, onClick } = props;

    function renderCellContent()  {
        switch(cellValue) {
            case cellStates.UNCLAIMED:
                return 'UNCLAIMED'
            case cellStates.O:
                return 'O'
            case cellStates.X:
                return 'X'
            default:
                throw new Error('Unsupported cell value: ' + cellValue)
        };
    }
    return (
        <td className={classes.container} onClick={onClick}>
            {renderCellContent()}
        </td>
    );
}
