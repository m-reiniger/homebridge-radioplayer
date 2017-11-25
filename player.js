const request = require('request'),
    lame = require('lame'),
    Speaker = require('speaker'),
    fs = require('fs'),
    Volume = require("pcm-volume");

// const streamURL = 'https://rbb-radioeins-live.sslcast.addradio.de/rbb/radioeins/live/mp3/128/stream.mp3';

class Player {

    constructor(streamURL) {
        this.streamURL = streamURL;
        this.playing = false;
        this.lastVolume = 1;
    }

    isPlaying() {
        return this.playing;
    }

    play() {
        if (!this.playing) {
            this.volume = new Volume();
            this.volume.setVolume(this.lastVolume);
            this.stream = request(this.streamURL);
            this.stream.pipe(new lame.Decoder())
                .pipe(this.volume)
                .pipe(new Speaker());

            this.playing = true;
        }
    }

    stop() {
        if (this.playing) {
            this.stream.abort();
            this.playing = false;
        }
    }

    setVolume(value) {
        this.lastVolume = value;
        if(this.volume) {
            this.volume.setVolume(value);
        }
    }

    getVolume() {
        return this.lastVolume;
    }

    mute() {
        this.lastVolume = 0;
        if(this.volume) {
            this.volume.setVolume(0);
        } 
    }

}

module.exports = Player;