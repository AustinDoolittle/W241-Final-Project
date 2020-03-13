import React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles({
    continueButton: {
        float: "right",
        margin: "10px"
    }
});

export default function LandingPanel(props) {
    const { handleAdvance, soundPlayer } = props; 
    const classes = useStyles(props);

    return (
        <div>
            <p>Hello, and thank you for agreeing to take part in our study.</p>
            <p>You will be asked to play 5 short and simple games.</p>
            <p>
                It is a requirement that you have headphones or speakers, as there are some 
                audio cues during the course of this activity. You can use the button below 
                to test out the sound on your device. 
            </p>
            <Button onClick={() => soundPlayer.triggerTestSound()}>Test Audio</Button>
            <p>
                Once you are ready to start playing, please click the START button below. NOTE: 
                If you reload or navigate away from this page before completing all games, your
                results will be invalidated and you will not be given another opportunity to 
                complete all the games. Please refrain from leaving this webpage without first completing the games.
            </p>
            <Button variant="contained" className={classes.continueButton} onClick={handleAdvance}>Start</Button>
        </div>
    )
}
