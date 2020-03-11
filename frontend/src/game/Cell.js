import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CellStates } from "./utils";

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
    cell: {
        margin: "0 auto",
        fontSize: "75px",
        display: "flex",
        borderRadius: "3px",
        justifyContent: "center",
        alignItems: "center",
        width: "80%",
        height: "80%"
    },
    clickable: {
        cursor: "pointer",
        backgroundColor: "#7bb2ff",
    }
});


export default function Cell(props) {
    const classes = useStyles();
    const { isActive, cellValue, onClick } = props;

    function renderCellContent()  {            
        var className = classes.cell
        const newProps = {}
        var cellText = cellValue
        if (cellValue === CellStates.UNCLAIMED) {
            cellText = '';
            
            if (isActive) {
                className += " " + classes.clickable 
                newProps.onClick = onClick;
                cellText = '';
            }
        }

        return <div className={className} {...newProps}>{cellText}</div>
    }

    return (
        <td className={classes.td}>
            {renderCellContent()}
        </td>
    );
}
