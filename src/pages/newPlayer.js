import { Lightning, MediaPlayer, Colors } from '@lightningjs/sdk'
import { List } from '@lightningjs/ui';


import 'dashjs/dist/dash.all.min'

export default class Player extends Lightning.Component  {

    static _template () {
        return {
            MediaPlayer: { type: MediaPlayer, w:1920, h:1080, zIndex: 9  },
            Placeholder: {alpha: 0.001, w: 1920, h: 1080},
            ScreenBlock: {w: 1920, h: 1080, rect: true, color: Colors('black').get()},
            Overlay: {
                Top: {rect: true, w: 1920, h: 540, colorBottom: Colors('black').alpha(0.3).get(), colorTop: Colors('black').alpha(0.85).get()},
                Bottom: {rect: true, w: 1920, h: 540, mountY: 1, y: 1080, colorTop: Colors('black').alpha(0.3).get(), colorBottom: Colors('black').alpha(0.85).get()}
            },
            Title: {x: 230, y: 90, w: 1060, text: {fontFace: 'Bold', wrap: true, fontSize: 74, lineHeight: 88}},
        };
    }
    _setup() {
        const blackAlpha = Colors('black').alpha(0.3).get();
    }
    _firstActive() {
        this._update();
        this.tag('MediaPlayer').updateSettings({consumer: this});
        this.videoEl = this.tag('MediaPlayer').videoEl
    }
    
    setData(data) {
        this._data = data;
        this._update();
    }
    _update() {
        if(!this._data) {
            return;
        }
        const {title, video_url} = this._data;
        this.load(video_url);
        this.patch({
            Title: {text: title}
        });

    }
    _handleEnter() {
        this.loadVideo();

    }
    load(url) {
        if(url.includes('.mpd')) this.openDash(url)
        else this.tag('MediaPlayer').open(url);
    }
    
    openDash(url) {
        this.player = dashjs.MediaPlayer().create()
        // this._metrics = Metrics.media(url)
        this.videoEl.autoplay = true
        this.videoEl.controls = true
        this.videoEl.style.display = 'block'
        this.player.initialize(this.videoEl, url, true)
    }
    loadVideo() {
        this.tag('MediaPlayer').play();
        
    }
    $loadeddata() {
        this.tag('MediaPlayer').doPlay()
    }
    _startOverlayTimeout() {
        this._clearOverlayTimeout();
        //create timeout for 3000 ms
        this._overlayTimeout = setTimeout(() => {
            //if active and player is progressing (player is playing)
            if(this.active && this._progressAnimation.isActive()) {
                this._hideControls.start();
                this._showEventMessage(`hiding controls during playback`);
            }
        }, 3000)
    }
    _clearOverlayTimeout() {
        if(this._overlayTimeout) {
            clearTimeout(this._overlayTimeout);
        }
    }
    _showScreenBlock() {
        this.tag('ScreenBlock').alpha = 1;
    }

    _hideScreenBlock() {
        this.tag('ScreenBlock').alpha = 0;
    }
    _getFocused() {
        return this.tag('MediaPlayer');
    }
    get hideBackground() {
        return true;
    }
}
