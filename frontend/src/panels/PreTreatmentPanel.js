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
        <p>Don't screw up</p>
        <Button variant="contained" onClick={handleAdvance} className={classes.continueButton}>Continue</Button>
        </div>
    )
};
