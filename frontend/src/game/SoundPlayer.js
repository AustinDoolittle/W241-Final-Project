
export class AudioPlaybackError extends Error {};

class SoundWrapper {
    constructor(url, mediaType) {
        this.internalAudio = new Audio(url);
        this.internalAudio.type = mediaType;
        this.internalAudio.onerror = this.handleError;
    }

    play() {
        this.internalAudio.play();
    }

    stop() {
        this.internalAudio.pause();
        this.internalAudio.currentTime = 0;
    }

    handleError() {
        throw AudioPlaybackError();
    }
}

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
            this.cache[filename] = new SoundWrapper(this.createSoundURL(filename), `audio/${this.fileExtension}`);
        }

        this.cache[filename].play();
    }

    cancelSound() {
        for (let sound of Object.values(this.cache)) {
            sound.stop();
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