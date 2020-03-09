import React from 'react';

export const players = {
    COMPUTER: 'COMPUTER',
    HUMAN: 'HUMAN'
}

export default function CurrentPlayer(props) {
    const { currentPlayer } = props;

    var currentPlayerString;
    if (currentPlayer === players.COMPUTER) {
        currentPlayerString = "the computer's"
    }
    else {
        currentPlayerString = "your"
    }
    return <div>It's {currentPlayerString} turn</div>
}