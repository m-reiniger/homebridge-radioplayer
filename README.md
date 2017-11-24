# Radio Player

This is a first draft of a web radio Player controllable with HomeKit and Siri. See homebridge for further doku on how to use homebridge.

This will simulate a radio player you can add as an accessory in your HomeKit Setup. It'll register as a light bulb until Apples Home app supports Speakers. 

Configure your favorite radio stations by supplying the streams URL in you homebridge config. See the example config file. Add another accessory for each radio station you want to support.

Changing the brightness of this accessory will change the players volume. 

Sound will be streamed to the default audio out.

## Installation

```npm install -g homebridge-radioplayer```

## Configuration

``` 
{
    "bridge": {
        "name": "Homebridge",
        "username": "CC:22:3D:E3:CE:30",
        "port": 51826,
        "pin": "031-45-154"
    },
    "accessories": [
        {
            "accessory": "RadioPlayer",
            "name": "radioeins",
            "streamUrl": "https://rbb-radioeins-live.sslcast.addradio.de/rbb/radioeins/live/mp3/128/stream.mp3",
            "brightness": true
        }
    ]
}
```

Doku is work in progress. Feel free to make pull requests.