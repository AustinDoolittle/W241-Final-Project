import React from 'react';
import Button from "@material-ui/core/Button";
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    continueButton: {
        float: "right",
        margin: "10px"
    }
});

export default function PreTreatmentInformationPanel(props) {
    const classes = useStyles(props);
    const { handleAdvance } = props;
    return (
        <div>
            <p>
                You will be asked to play 5 simple games of tic-tac-toe. Before each of your moves, 
                you will hear a speaker suggest a move. These moves may or may not be optimal and you 
                are not required to follow their suggestion. Have fun playing!
            </p>
            <Button variant="contained" onClick={handleAdvance} className={classes.continueButton}>Continue</Button>
        </div>
    )
};
