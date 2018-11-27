import Event from './event.js';
export default class OpusWorker extends Event {
    constructor(channels, libopusPath, sampleRate) {
        super('worker');
        this.worker = new Worker(libopusPath);
        this.sampleRate = sampleRate;
        this.worker.addEventListener('message', this.onMessage.bind(this));
        this.worker.postMessage({
            type: 'init',
            config: {
                rate: sampleRate,
                channels: channels
            }
        });
    }

    getSampleRate() {
        return this.sampleRate;
    }

    decode(packet) {
        let workerData = {
            type: 'decode',
            buffer: packet
        };
        this.worker.postMessage(workerData);
    }

    onMessage(event) {
        let data = event.data;
        this.dispatch('data', data.buffer);
    }
    destroy() {
        this.worker = null;
        this.offAll();
    }
}
