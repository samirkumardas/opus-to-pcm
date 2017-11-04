If we want to decode raw opus packet to PCM in our browsers, there are two ways to do that:

 1. Using [libopus](https://opus-codec.org/) decoder of javascript version that can be ported using Emscripten.
 2. Using the Web Audio API method [decodeAudioData](https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/decodeAudioData)

First approach is very straight forward but it needs to carry a big size decoder js file (approx. 900KB) and it is very resource expensive that become difficult to handle for the browsers that are running on low resource like mobile devices.

Second approach is the best way but unfortunately **decodeAudioData** fails to decode raw opus packet. Actually it expects Ogg bitstream instead of raw opus packet. This project basically does that thing. It encapsulate raw opus packet into ogg packet on the fly so that decodeAudioData can decode to PCM data. One problem with this approach is that opus is supported by all browsers till today e.g. Safari so libopus is included as a fallback.
