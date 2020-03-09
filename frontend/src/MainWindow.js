import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import GamePanel from './panels/GamePanel';
import LandingPanel from './panels/LandingPanel';
import PreTreatmentPanel from './panels/PreTreatmentPanel';
import PostTreatmentPanel from './panels/PostTreatmentPanel';


const useStyles = makeStyles({
    card: {
        margin: "0 auto",
        maxWidth: "1000px",
        backgroundColor: "#f5eaea"
    },
    advanceButton: {
        margin: "100px",
        float: "left"
    }
})

const numberOfGames = 1;

export default function MainWindow(props) {
    const classes = useStyles(props);
    const [currentPanelIndex, setCurrentPanelIndex] = useState(0);
    const panelCount = 4;

    function advanceToNextPanel() {
        const newIndex = currentPanelIndex + 1
        if (newIndex >= panelCount) {
            return;
        }

        setCurrentPanelIndex(newIndex);
    }

    function renderCurrentPanel() {
        const panelProps = {
            handleAdvance: advanceToNextPanel
        }

        if (currentPanelIndex === 0) {
            return <LandingPanel {... panelProps}/>;
        }
        else if (currentPanelIndex === 1) {
            return <PreTreatmentPanel {... panelProps}/>;
        }
        else if (currentPanelIndex === 2) {
            return <GamePanel numberOfGames={numberOfGames} {... panelProps}/>;
        }
        else {
            return <PostTreatmentPanel {... panelProps}/>;
        }
    }

    return (
        <Card className={classes.card}>
            <CardHeader title="UC Berkeley MIDS - W241 Experiment" />
            <CardContent>
                {renderCurrentPanel()}
            </CardContent>
        </Card>
    );
}
