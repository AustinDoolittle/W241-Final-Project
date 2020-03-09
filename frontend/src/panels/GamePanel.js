import React from 'react';
import GameBoard from '../game/GameBoard';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles({});

export default function GamePanel(props) {
    const classes = useStyles(props);

    return (
        <div>
            <GameBoard></GameBoard>
        </div>
    )
}
