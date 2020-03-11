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
        margin: "auto",
        borderRadius: "3px",
        backgroundColor: "#7bb2ff",
        cursor: "pointer",
        width: "80%",
        height: "80%"
    },
    unclickable: {
        margin: "0 auto",
        fontSize: "75px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "80%",
        height: "80%"
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
        if (cellValue === cellStates.UNCLAIMED) {
            return <div className={classes.clickable} onClick={onClick}></div>
        }
        else {
            return <div className={classes.unclickable}>{cellValue}</div>
        }
    }

    return (
        <td className={classes.td}>
            {renderCellContent()}
        </td>
    );
}
