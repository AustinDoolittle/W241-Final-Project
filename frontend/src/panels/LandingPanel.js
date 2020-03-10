import React from 'react';
import Button from "@material-ui/core/Button";

export default function LandingPanel(props) {
    const { handleAdvance } = props; 

    return (
        <div>
            <p>Hello, and thank you for agreeing to take part in our study.</p>
            <p>The study will ask that you complete a short game. It is a requirement that you have headphones or speakers, as there are some audio cues during the course of this activity. You can use the button below to test out the sound on your device.</p>
            <Button >Test Audio</Button>
            <p>Once you are ready to start the experiment, please click the button below. NOTE: If you reload or navigate away from this page before completing all tasks given to you, your results will be invalidated and you will not be given another opportunity to complete the experiment. Please refrain from leaving this webpage without first completing the experiment.</p>
            <Button onClick={handleAdvance}>Start</Button>
        </div>
    )
}