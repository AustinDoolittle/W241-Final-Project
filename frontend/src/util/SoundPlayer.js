
export class AudioPlaybackError extends Error {
    constructor(obj) {
        super();
        this.obj = obj;
    }
};

class SoundWrapper {
    constructor(url, mediaType, onReady=null) {
        this.url = url
        this.onReady = onReady
        this.isReady = false;
        this.internalAudio = new Audio(url);
        this.internalAudio.addEventListener('error', (event) => this.handleError(event));
        this.internalAudio.addEventListener('canplaythrough', (event) => this.handleCanPlayThrough(event));
        this.internalAudio.type = mediaType;
    }

    handleCanPlayThrough(event) {
        this.isReady = true;
        
        if (this.onReady != null) {
            this.onReady(this);
        }
    }

    getUrl() {
        return this.url;
    }

    play() {
        // this.internalAudio.load();
        this.internalAudio.play();
    }

    stop() {
        this.internalAudio.pause();
        this.internalAudio.currentTime = 0;
    }

    handleError(event) {
        throw new AudioPlaybackError(this);
    }
}

export default class SoundPlayer {
    rowMap = ['top', 'center', 'bottom']
    columnMap = ['left', 'middle', 'right']
    fileExtension = 'mp3'
    mediaType = `audio/${this.fileExtension}`
    testSoundFilename = `test.${this.fileExtension}`;
    selectBFilename = `select_letter_b.${this.fileExtension}`;

    constructor(baseURL, subjectID, onReady = null) {
        this.isReady = false;
        this.onReady = onReady;
        this.baseURL = baseURL;
        this.subjectID = subjectID;
        const filenames = [this.testSoundFilename, this.selectBFilename];
        for (let rowIndex = 0; rowIndex < this.rowMap.length; rowIndex++) {
            for (let columnIndex = 0; columnIndex < this.columnMap.length; columnIndex++) {
                filenames.push(this.createMoveFilename(rowIndex, columnIndex));
            }
        }
        this.expectedSoundCount = filenames.length

        this.sounds = {};
        for (let filename of filenames) {
            const url = this.createSoundURL(filename);
            this.sounds[filename] = new SoundWrapper(url, this.mediaType, (event) => this.handleCanPlayThrough(event));
        }
    }

    handleCanPlayThrough(obj) {
        if (Object.keys(this.sounds).length != this.expectedSoundCount) {
            return;
        }

        if (Object.values(this.sounds).every((sound) => sound.isReady)) {
            this.onReady();
        }
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

    triggerSelectBSound() {
        this.triggerSound(this.selectBFilename);
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