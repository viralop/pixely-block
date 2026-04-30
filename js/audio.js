export class Audio {
    constructor() {
        this.ctx = null;
        this.enabled = true;
        this.volume = 0.3;
    }

    _ensure() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') this.ctx.resume();
    }

    _play(freq, type, duration, vol = this.volume) {
        if (!this.enabled) return;
        try {
            this._ensure();
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            gain.gain.setValueAtTime(vol, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(this.ctx.currentTime);
            osc.stop(this.ctx.currentTime + duration);
        } catch (e) { /* ignore audio errors */ }
    }

    _playSequence(notes, type = 'square') {
        if (!this.enabled) return;
        try {
            this._ensure();
            let t = this.ctx.currentTime;
            notes.forEach(([freq, dur]) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = type;
                osc.frequency.setValueAtTime(freq, t);
                gain.gain.setValueAtTime(this.volume * 0.7, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + dur * 0.9);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(t);
                osc.stop(t + dur);
                t += dur;
            });
        } catch (e) { /* ignore */ }
    }

    jump() { this._playSequence([[500, 0.08], [700, 0.1]], 'square'); }

    attack() { this._play(200, 'sawtooth', 0.12, 0.2); }

    hit() { this._playSequence([[150, 0.1], [100, 0.15]], 'square'); }

    coin() { this._playSequence([[800, 0.08], [1200, 0.12]], 'square'); }

    heart() { this._playSequence([[400, 0.1], [600, 0.1], [800, 0.15]], 'sine'); }

    enemyDeath() { this._playSequence([[300, 0.08], [200, 0.08], [100, 0.15]], 'square'); }

    levelComplete() {
        this._playSequence([
            [523, 0.15], [659, 0.15], [784, 0.15], [1047, 0.3]
        ], 'square');
    }

    gameOver() {
        this._playSequence([
            [400, 0.2], [350, 0.2], [300, 0.2], [200, 0.5]
        ], 'sawtooth');
    }

    spike() { this._play(80, 'sawtooth', 0.15, 0.25); }
}
