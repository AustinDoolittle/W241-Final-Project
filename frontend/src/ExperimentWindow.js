import React, { useState } from 'react'
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Step from '@material-ui/core/Step';
import Stepper from '@material-ui/core/Stepper';
import Typography from '@material-ui/core/Typography';

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

// class ExperimentWindow extends Component {
//     constructor(props) {
//         super(props)
//         this.state = {
//             activeStep: 0
//         }
//     }

//     handleNext = (event) => {
//         this.setState({activeStep: this.state.activeStep + 1})
//     }

//     render() {
//         const { classes } = this.props;
 
//         return (
//             <div className={classes.root}>
//                 <Card className={classes.card}>
//                     <CardHeader title="UC Berkeley MIDS - W241-03 Experiment" />
//                     <CardContent>
//                     <Typography component="p" className={classes.typography}>
//                         Thank you for participating in our study. This should take no longer than 10 minutes to complete. Please click the arrow to get started!. The active step is
//                     </Typography>
//                     <Button className={classes.button}
//                         onClick={this.handleNext}>
//                         Next
//                     </Button>
//                     </CardContent>
//                     <Stepper className={classes.cardElement}
//                         activeStep={this.state.activeStep} 
//                         variant="progress"
//                         position="static">
//                         <Step>

//                         </Step>
//                         <Step>

//                         </Step>
//                         <Step>

//                         </Step>
//                     </Stepper>
//                 </Card>
//             </div>
//         );
//     }
// }

export default withStyles(styles)(ExperimentWindow);
