import React from 'react';
import Button from "@material-ui/core/Button";
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles();

export default function PreTreatmentInformationPanel(props) {
    const classes = useStyles(props);
    const { handleAdvance } = props;
    return (
        <div>
        <p>Don't screw up</p>
        <Button onClick={handleAdvance} className={classes.advanceButton}>Click Me</Button>
        </div>
    )
};
