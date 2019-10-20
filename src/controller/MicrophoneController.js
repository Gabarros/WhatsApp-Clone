import { ClassEvent } from "../util/ClassEvent";

export class MicrophoneController extends ClassEvent{

    constructor(){

        super();
        this._mimetype = 'audio/webm';

        this._available = false;

        navigator.mediaDevices.getUserMedia({
            audio: true
        }).then(stream=>{

            this._available = true;

            this._stream = stream;

           
            this.trigger('ready', this._stream);

        }).catch(err=>{

            console.error(err);

        });

       

    }

    isAvailable(){

        return this._available;

    }

    stop(){

        this._stream.getTracks().forEach(track =>{

            track.stop();

        })
    }

    startRecorder(){

        if(this.isAvailable()){

            this._mediaRecorder = new MediaRecorder(this._stream, {
                mimeType: this._mimetype
            });

            this._recordedChunks = [];

            this._mediaRecorder.addEventListener('dataavailable', e=>{

                if(e.data.size > 0) this._recordedChunks.push(e.data);

            });

            this._mediaRecorder.addEventListener('stop', e=>{

                let blob = new Blob(this._recordedChunks, {
                    type: this._mimetype
                });

                let filename = `rec${Date.now()}.webm`;

                let file = new File([blob], filename, {
                    type: this._mimetype,
                    lastModified: Date.now()
                });

                console.log('file', file);

            });

            this._mediaRecorder.start();
            this.startTimer();
            
        }    
    }

    stopRecorder(){

        
        if(this.isAvailable()){

            this._mediaRecorder.stop();
            this.stop();
            this.stopTimer();
            
        }

    }

    startTimer(){
        let start = Date.now();

        this._recordMicrophoneInterval = setInterval(()=> {
            
           this.trigger('recordTimer', (Date.now() - start));
        
        }, 100);
    }
    
    stopTimer(){
        clearInterval(this._recordMicrophoneInterval);
    }
}