import wave
import sys
import os
import pyaudio

CHUNK = 1024
FORMAT = pyaudio.paInt16
CHANNELS = 1 if sys.platform == 'darwin' else 2
RATE = 22050
RECORD_SECONDS = 600
output_dir = 'audio_files'

def record_audio():
    files = [f for f in os.listdir(output_dir) if os.path.isfile(os.path.join(output_dir, f))]
    n = len(files)
    next_number = n + 1
    with wave.open(f'{output_dir}/output_{next_number}.wav', 'wb') as wf:
        p = pyaudio.PyAudio()
        wf.setnchannels(CHANNELS)
        wf.setsampwidth(p.get_sample_size(FORMAT))
        wf.setframerate(RATE)

        stream = p.open(
            format=FORMAT,
            channels=CHANNELS,
            rate=RATE,
            input=True,
            frames_per_buffer=CHUNK
        )

        print('Recording...')
        try:
            for _ in range(0, RATE // CHUNK * RECORD_SECONDS):
                wf.writeframes(stream.read(CHUNK))
            print('Done recording')
            return True
        except KeyboardInterrupt:
            print("Recording stopped early by user.")
            return False  # Recording was interrupted
        finally:
            stream.close()
            p.terminate()