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
    },
    clickable: {
        cursor: "pointer"
    },
    unclickable: {
        cursor: "not-allowed"
    }
});

export const cellStates = {
    X: 'X',
    O: 'O',
    UNCLAIMED: 'U'
}

export default function Cell(props) {
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

    var returnValue;
    if (cellValue !== cellStates.UNCLAIMED) {
        returnValue = <td className={`${classes.container} ${classes.unclickable}`}>
            {renderCellContent()}
        </td>
    }
    else {
        returnValue = <td className={`${classes.container} ${classes.clickable}`} onClick={onClick}>
            {renderCellContent()}
        </td>
    }

    return returnValue;
}
