

export default class SoundPlayer {
    rowMap = ['top', 'center', 'bottom']
    columnMap = ['left', 'middle', 'right']

    constructor(baseURL, subjectID) {
        this.baseURL = baseURL;
        this.subjectID = subjectID
        this.cache = {}
    }

    createSoundURL(filename) {
        return this.baseURL + '/sounds/' + filename +"?subjectID=" + this.subjectID;
    }

    triggerSound(filename) {
        if (!this.cache.hasOwnProperty(filename)) {
            this.cache[filename] = new Audio(this.createSoundURL(filename));
            this.cache[filename].type = "audio/wav"
            this.cache.onended = () => this.soundIsActive = false;
        }

        this.cache[filename].play();
    }

    triggerTestSound() {
        return this.getSound('test.wav')
    }

    triggerMoveSuggestionSound(rowIndex, columnIndex) {

        // Create the filename
        const rowString = this.rowMap[rowIndex]
        const columnString = this.columnMap[columnIndex]

        const filename = `${rowString}_${columnString}.wav`
        this.triggerSound(filename)
    }
}