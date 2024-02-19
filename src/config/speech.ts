// @ts-ignore
import AudioRecorder from 'node-audiorecorder/library/index.js';
import fs from 'fs';
import portAudio from 'naudiodon';
import { set } from 'lodash';

console.log("devices", portAudio.getDevices());

// Import module.


const record = async () => {

    try {


        const ai = portAudio.AudioIO({
            inOptions: {
                channelCount: 1,
                sampleFormat: portAudio.SampleFormat16Bit,
                sampleRate: 48000,
                deviceId: 0, // Use -1 or omit the deviceId to select the default device
                closeOnError: true // Close the stream if an audio error is detected, if set false then just log the error
            }
        });

        // // Create a write stream to write out to a raw audio file
        const ws = fs.createWriteStream('rawAudio.raw');

        // //Start streaming
        // ws.pipe(ai);

        ai.start();

        ai.pipe(ws);


        await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(true);
            }, 3000);
        });

        // setTimeout(() => {
        //     ai.quit(() => {
        //         // ws.end();
        //     });
        // }, 3000);

        ai.quit(() => {
            ws.end();
        });


        // Options is an optional parameter for the constructor call.
        // If an option is not given the default value, as seen below, will be used.
        // const options = {
        //     program: `sox`, // Which program to use, either `arecord`, `rec`, or `sox`.
        //     device: 1, // Recording device to use, e.g. `hw:1,0`

        //     bits: 16, // Sample size. (only for `rec` and `sox`)
        //     channels: 2, // Channel count.
        //     encoding: `signed-integer`, // Encoding type. (only for `rec` and `sox`)
        //     format: `S16_LE`, // Encoding type. (only for `arecord`)
        //     rate: 16000, // Sample rate.
        //     type: `wav`, // Format type.

        //     // Following options only available when using `rec` or `sox`.
        //     silence: 2, // Duration of silence in seconds before it stops recording.
        //     thresholdStart: 0.5, // Silence threshold to start recording.
        //     thresholdStop: 0.5, // Silence threshold to stop recording.
        //     keepSilence: true, // Keep the silence in the recording.
        // }
        // // Optional parameter intended for debugging.
        // // The object has to implement a log and warn function.
        // const logger = console

        // // Create an instance.
        // let audioRecorder = new AudioRecorder(options, logger);


        // const fileStream = fs.createWriteStream('rawAudio2.raw', { encoding: 'binary' });

        // // Start and write to the file.
        // audioRecorder.start().stream().pipe(fileStream);


        // Start recording.

    }
    catch (error) {
        console.log("error record", error?.message);
    }

}

record();