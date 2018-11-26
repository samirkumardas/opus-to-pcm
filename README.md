Opus to PCM
-----------
If we want to decode raw opus packet to PCM in our browsers, there are two ways to do that:

 1. Using [libopus](https://opus-codec.org/) decoder of javascript version that can be ported using Emscripten.
 2. Using the Web Audio API method [decodeAudioData](https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/decodeAudioData)

First approach is very straight forward but it needs to carry a big size decoder js file (approx. 900KB) and it is very resource expensive that become difficult to handle for the browsers that are running on low resource like mobile devices.

Second approach is the best way but unfortunately **decodeAudioData** fails to decode raw opus packet. Actually it expects Ogg bitstream instead of raw opus packet. This project basically does that thing. It encapsulate raw opus packet into ogg packet on the fly so that decodeAudioData can decode to PCM data. One problem with this approach is that opus is supported by all browsers till today e.g. Safari so libopus is included as a fallback.

**How to use?**

    var decoder = new OpusToPCM(option);

Available options are:

*channels* - no of channels in opus data

*fallback* - true/false. Whether it will use libopus as fallback or not. Default is true.

*libopusPath* - If fallback is true, you must provide libopus.js file path. A pre-built libopus file is available in dist directory

*nativeSupport* - true/false. If nativeSupport is false it will always decode from the provided provide libopus.js

*sampleRate* - define the decoding sample rate it only works on the libopus.js

Decoder fire an event *decode* whenever it completes decoding. Usually it decodes several opus packet at a time for better performance although it need to be provided single opus packet into *decode* method.

**Complete example:**

    var decoder = new OpusToPCM({
	  channels: 1,
	  fallback: true,
      libopusPath: 'libopus/opus.min.js' /* a pre-built libopus file is available in dist directory */
    });
    decoder.on('decode', function(pcmData) {
         //do whatever you want to do with PCM data
    });
    
    // single opus packet and it is a typedArray
    decoder.decode(opus_packet); 

** ES6 example:**

    npm install opus-to-pcm --save

    import OpusToPCM from 'opus-to-pcm';

    const decoder = new OpusToPCM({
        channels: 1
    });

    decoder.on('decode', (pcmData)=> {
        console.log(pcmData); /* PCM data */
    }); 

**Available Methods**

| Name        | Parameter           | Remark  |
| ------------- |:-------------:| -----:|
| getSampleRate      | - | It return output sample rate of the PCM data |
| decode      | data TypedArray      |  Decode provided opus packet to PCM  |
| destroy | -      |    Destroy the decoder instance and release the resources |
  
 **Compatibility**
 
   it is supported on:

 * Chrome for Android 34+
 * Chrome for Desktop 34+
 * Firefox for Android 41+
 * Firefox for Desktop 42+
 * IE11+ for Windows 8.1+ (fallback)
 * Edge for Windows 10+
 * Opera for Desktop
 * Safari for Mac 8+ (fallback)

**How to run example?**

An example with simple node server script is available that include some raw opus packets that will be served by websocket and at the client end, it will be played through simple PCM player after decoding from opus. For running the example, first run the node server by following command:

*node server.js*

then, visit *example/index.html* page through any webserver.

**How to build?**

A distribution version is available inside *dist* directory. However, if you need to build, you can do as follows:

 1. git clone https://github.com/samirkumardas/opus-to-pcm.git
 2. cd pcm-player
 3. npm install
 4. npm run build
