import React, { useState } from 'react'
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';

import GameBoard from './game/GameBoard';


const styles = theme => ({
    root: {
        margin: "20%",
    },
    card: {
        margin: "0 auto",
        maxWidth: "1000px",
        backgroundColor: "#f5eaea"
    },
    cardElement: {
        backgroundColor: "#f5eaea"
    },
    grid: {
        minHeight: '100vh'
    },
    typography: {
        overflowY: "auto"
    },
    button: {
        float: "right"
    }
})

function ExperimentWindow(props) {
    const { classes } = props;
    const [currentStage, setCurrentStage] = useState(0);

    function advanceStage() {
        let newStageNumber = Math.min(currentStage + 1, 2);
        setCurrentStage(newStageNumber);
    }

    function renderContent() {
        // if (currentStage === 0) {
        //     // render landing page
        // }
        // else if (currentStage === 1) {
        //     // render instructions for playing the game
        // }
        // else {
        //     // render game board
        // }
        return (
            <GameBoard />
        )
    }

    return (
        <Card className={classes.card}>
            <CardHeader title="UC Berkeley MIDS - W241-03 Experiment" />
            <CardContent>
                {renderContent()}
            </CardContent>
        </Card>
    );
}

export default withStyles(styles)(ExperimentWindow);
