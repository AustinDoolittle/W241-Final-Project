
export class AudioPlaybackError extends Error {};

class SoundWrapper {
    constructor(url, mediaType) {
        this.internalAudio = new Audio(url);
        this.internalAudio.type = mediaType;
        this.internalAudio.onerror = this.handleError;
        this.internalAudio.load();
    }

    play() {
        this.internalAudio.play();
    }

    stop() {
        this.internalAudio.pause();
        this.internalAudio.currentTime = 0;
    }

    handleError() {
        throw new AudioPlaybackError();
    }
}

export default class SoundPlayer {
    rowMap = ['top', 'center', 'bottom']
    columnMap = ['left', 'middle', 'right']
    fileExtension = 'mp3'
    testSoundFilename = `test.${this.fileExtension}`;

    constructor(baseURL, subjectID, onReady = null) {
        this.baseURL = baseURL;
        this.subjectID = subjectID
        this.sounds = this.loadSounds();
        this.onReady = onReady;
    }

    triggerOnReadyEvent() {
        if (this.onReady == null) {
            return;
        }
    }

    loadSounds() {
        const filenames = [this.testSoundFilename];
        for (let rowIndex = 0; rowIndex < this.rowMap.length; rowIndex++) {
            for (let columnIndex = 0; columnIndex < this.columnMap.length; columnIndex++) {
                filenames.push(this.createMoveFilename(rowIndex, columnIndex));
            }
        }

        const loadedSounds = {};

        for (let filename of filenames) {
            loadedSounds[filename] = new SoundWrapper(this.createSoundURL(filename), `audio/${this.fileExtension}`);
        }

        return loadedSounds;
    }

    createSoundURL(filename) {
        return this.baseURL + '/sounds/' + filename +"?subjectID=" + this.subjectID;
    }

    triggerSound(filename) {
        this.sounds[filename].play();
    }

    cancelSound() {
        for (let sound of Object.values(this.sounds)) {
            sound.stop();
        }
    }

    triggerTestSound() {
        this.triggerSound(this.testSoundFilename);
    }

    triggerMoveSuggestionSound(rowIndex, columnIndex) {

        // Create the filename
        const filename = this.createMoveFilename(rowIndex, columnIndex)
        this.triggerSound(filename);
    }

    createMoveFilename(rowIndex, columnIndex) {
        const rowString = this.rowMap[rowIndex];
        const columnString = this.columnMap[columnIndex];

        return `${rowString}_${columnString}.${this.fileExtension}`;
    }
}