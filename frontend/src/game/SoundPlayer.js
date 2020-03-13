

export default class SoundPlayer {
    rowMap = ['top', 'center', 'bottom']
    columnMap = ['left', 'middle', 'right']
    fileExtension = 'mp3'

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
            this.cache[filename].type = `audio/${this.fileExtension}`
        }

        this.cache[filename].play();
    }

    cancelSound() {
        for (let sound of Object.values(this.cache)) {
            sound.pause();
            sound.currentTime = 0;
        }
    }

    triggerTestSound() {
        this.triggerSound(`test.${this.fileExtension}`);
    }

    triggerMoveSuggestionSound(rowIndex, columnIndex) {

        // Create the filename
        const rowString = this.rowMap[rowIndex];
        const columnString = this.columnMap[columnIndex];

        const filename = `${rowString}_${columnString}.${this.fileExtension}`;
        this.triggerSound(filename);
    }
}