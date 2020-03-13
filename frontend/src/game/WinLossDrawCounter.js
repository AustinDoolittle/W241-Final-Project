
export default class WinLossDrawCounter {
    constructor() {
        this.winCount = 0;
        this.lossCount = 0;
        this.drawCount = 0;
    }

    incrementWinCount() {
        this.winCount += 1;
    }

    incrementLossCount() {
        this.lossCount += 1;
    }

    incrementDrawCount() {
        this.drawCount += 1;
    }

    getWinCount() {
        return this.winCount;
    }

    getDrawCount() {
        return this.drawCount;
    }

    getLossCount() {
        return this.lossCount;
    }
}