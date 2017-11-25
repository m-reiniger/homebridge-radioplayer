const Player = require('./player');

let Service, Characteristic;

module.exports = function (homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerAccessory("homebridge-radioplayer", "RadioPlayer", RadioPlayerPlugin);
}


class RadioPlayerPlugin {

    /**
     * Creates an instance of RadioPlayerPlugin.
     * @param {any} log 
     * @param {any} config 
     * @memberof RadioPlayerPlugin
     */
    constructor(log, config) {
        this.log = log;
        this.name = config.name;
        this.streamUrl = config.streamUrl;

        this.informationService = new Service.AccessoryInformation();
        this.informationService
            .setCharacteristic(Characteristic.Manufacturer, 'Michael Reiniger')
            .setCharacteristic(Characteristic.Model, 'v1.0.0')
            .setCharacteristic(Characteristic.SerialNumber, '100-66-978');

        this.speakerService = new Service.Lightbulb(this.name);
        this.speakerService.getCharacteristic(Characteristic.On)
            .on('get', this.getSwitchOnCharacteristic.bind(this))
            .on('set', this.setSwitchOnCharacteristic.bind(this));
        
        this.speakerService.getCharacteristic(Characteristic.Brightness)
            .on('get', this.getVolume.bind(this))
            .on('set', this.setVolume.bind(this));    

        this.player = new Player(this.streamUrl);

        this.shutdownTimer = 0;
    }

    /**
     * 
     * 
     * @returns 
     * @memberof RadioPlayerPlugin
     */
    getServices() {
        return [this.informationService, this.speakerService];
    }

    /**
     * 
     * 
     * @param {any} next 
     * @returns 
     * @memberof RadioPlayerPlugin
     */
    getSwitchOnCharacteristic(next) {
        const currentState = this.player.isPlaying();
        return next(null, currentState);
    }

    /**
     * 
     * 
     * @param {any} on 
     * @param {any} next 
     * @returns 
     * @memberof RadioPlayerPlugin
     */
    setSwitchOnCharacteristic(on, next) {
        // set player state here
        if (on) {
            if (new Date().getTime() - this.shutdownTimer > 3000 && !this.player.isPlaying()) {
                this.log.info('Turning ' + this.name + ' on');
                this.player.play();
            }
        } else {
            this.log.info('Turning ' + this.name + ' off');
            this.shutdownTimer = new Date().getTime();
            this.player.stop();
        }
        return next();
    }

    /**
     * 
     * 
     * @param {any} next 
     * @returns 
     * @memberof RadioPlayerPlugin
     */
    getVolume(next) {
        const volume = this.player.getVolume() * 100;
        return next(null, volume);
    }

    /**
     * 
     * 
     * @param {any} volume 
     * @param {any} next 
     * @returns 
     * @memberof RadioPlayerPlugin
     */
    setVolume(volume, next) {
        this.log('Setting ' + this.name + ' to ' + volume + '%');
        this.player.setVolume(volume/100);
        return next();
    }
}