import Event from './event.js';
export default class OpusWorker extends Event {
    constructor(channels, libopusPath) {
        super('worker');
        this.worker = new Worker(libopusPath);
        this.worker.addEventListener('message', this.onMessage.bind(this));
        this.worker.postMessage({
            type: 'init',
            config: {
                rate:24000,
                channels:channels
            }
        });
    }

    getSampleRate() {
        return 24000;
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
        this.worker.postMessage({
            type: 'destroy'
        });
        // Ideally we could receive a message from the worker
        // telling us that it's completed processing the "destroy"
        // command, but until that is possible, this is a reasonable
        // workaround.
        setTimeout(() => {
            this.worker.terminate();
            this.worker = null;
        }, 100); // ms
        this.offAll();
    }
}
