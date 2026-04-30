export class Input {
    constructor() {
        this.keys = {};
        this.prevKeys = {};
        this.touch = { active: false, left: false, right: false, jump: false, attack: false };
        this._onKeyDown = (e) => {
            this.keys[e.code] = true;
            if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
                e.preventDefault();
            }
        };
        this._onKeyUp = (e) => { this.keys[e.code] = false; };
        window.addEventListener('keydown', this._onKeyDown);
        window.addEventListener('keyup', this._onKeyUp);
        this._setupTouch();
    }

    _setupTouch() {
        const canvas = document.getElementById('gameCanvas');
        canvas.addEventListener('touchstart', (e) => { e.preventDefault(); this._handleTouch(e); }, { passive: false });
        canvas.addEventListener('touchmove', (e) => { e.preventDefault(); this._handleTouch(e); }, { passive: false });
        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.touch.active = false;
            this.touch.left = false;
            this.touch.right = false;
            this.touch.jump = false;
            this.touch.attack = false;
        }, { passive: false });
    }

    _handleTouch(e) {
        this.touch.active = true;
        this.touch.left = false;
        this.touch.right = false;
        this.touch.jump = false;
        this.touch.attack = false;
        const canvas = document.getElementById('gameCanvas');
        for (let i = 0; i < e.touches.length; i++) {
            const t = e.touches[i];
            const x = t.clientX - canvas.getBoundingClientRect().left;
            const y = t.clientY - canvas.getBoundingClientRect().top;
            const w = canvas.width;
            const h = canvas.height;
            if (y > h * 0.6) {
                if (x < w * 0.3) this.touch.left = true;
                else if (x < w * 0.6) this.touch.right = true;
            }
            if (y < h * 0.4) this.touch.jump = true;
            if (x > w * 0.7 && y < h * 0.5) this.touch.attack = true;
        }
    }

    update() {
        this.prevKeys = { ...this.keys };
    }

    isDown(code) {
        return this.keys[code] === true;
    }

    justPressed(code) {
        return this.keys[code] === true && this.prevKeys[code] !== true;
    }

    get left() {
        return this.isDown('ArrowLeft') || this.isDown('KeyA') || this.touch.left;
    }
    get right() {
        return this.isDown('ArrowRight') || this.isDown('KeyD') || this.touch.right;
    }
    get jump() {
        return this.isDown('ArrowUp') || this.isDown('KeyW') || this.isDown('Space') || this.touch.jump;
    }
    get jumpPressed() {
        return this.justPressed('ArrowUp') || this.justPressed('KeyW') || this.justPressed('Space');
    }
    get attack() {
        return this.justPressed('KeyJ') || this.justPressed('KeyZ') || this.justPressed('KeyX') || this.touch.attack;
    }
    get enter() {
        return this.justPressed('Enter') || this.justPressed('Space');
    }
    get escape() {
        return this.justPressed('Escape');
    }

    destroy() {
        window.removeEventListener('keydown', this._onKeyDown);
        window.removeEventListener('keyup', this._onKeyUp);
    }
}
