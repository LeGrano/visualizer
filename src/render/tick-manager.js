import { useCamera, useComposer, useControls, useRenderer, useScene } from './init.js';

// animation params
const localData = {
    timestamp: 0,
    timeDiff: 0,
    frame: null,
};
const localFrameOpts = {
    data: localData,
};

const frameEvent = new MessageEvent('tick', localFrameOpts);

class TickManager extends EventTarget {
    constructor({ timestamp, timeDiff, frame } = localData) {
        super();

        this.timestamp = timestamp;
        this.timeDiff = timeDiff;
        this.frame = frame;
    }
    startLoop() {
        const composer = useComposer();
        const renderer = useRenderer();
        const scene = useScene();
        const camera = useCamera();
        const controls = useControls();

        if (!renderer) {
            throw new Error('Updating Frame Failed : Uninitialized Renderer');
        }

        let lastTimestamp = performance.now();

        const animate = (timestamp, frame) => {
            this.timestamp = timestamp ?? performance.now();
            this.timeDiff = timestamp - lastTimestamp;

            const timeDiffCapped = Math.min(Math.max(this.timeDiff, 0), 100);

           

            controls.update();

            composer.render();

            this.tick(timestamp, timeDiffCapped, frame);
        };

        renderer.setAnimationLoop(animate);
    }
    tick(timestamp, timeDiff, frame) {
        localData.timestamp = timestamp;
        localData.frame = frame;
        localData.timeDiff = timeDiff;
        this.dispatchEvent(frameEvent);
    }
}

export default TickManager;
