import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    td: {
        border: "6px solid #222",
        textAlign: "center",
        width: "100px",
        height: "100px",
        padding: "10px",
        '&:after': {
            content: "",
            display: "block",
            marginTop: 100,
        },
        "&:first-of-type": {
            borderLeftColor: "transparent",
            borderTopColor: "transparent"
        },
        '&:nth-of-type(2)': {
            borderTopColor: "transparent"
        },
        "&:nth-of-type(3)": {
            borderRightColor: "transparent",
            borderTopColor: "transparent"
        }
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
        returnValue = <td className={`${classes.td} ${classes.unclickable}`}>
            {renderCellContent()}
        </td>
    }
    else {
        returnValue = <td className={`${classes.td} ${classes.clickable}`} onClick={onClick}>
            {renderCellContent()}
        </td>
    }

    return returnValue;
}
