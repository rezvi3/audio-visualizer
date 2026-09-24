import { ExportSettings } from '../types';
import { audioEngine } from '../audio/AudioEngine';

export class ExportEngine {
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private isRecording = false;

  public async startRecording(
    canvas: HTMLCanvasElement,
    settings: ExportSettings,
    onProgress?: (timeElapsed: number, duration: number) => void
  ): Promise<void> {
    if (this.isRecording) return;
    this.recordedChunks = [];

    // Capture canvas stream at specified FPS
    const canvasStream = canvas.captureStream(settings.fps);

    // Capture audio stream from AudioEngine
    const audioStream = audioEngine.getMediaStream();
    const combinedTracks: MediaStreamTrack[] = [...canvasStream.getVideoTracks()];

    if (audioStream && audioStream.getAudioTracks().length > 0) {
      combinedTracks.push(audioStream.getAudioTracks()[0]);
    }

    const combinedStream = new MediaStream(combinedTracks);

    // Check supported mime types
    const mimeTypes = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm',
    ];
    let selectedMime = '';
    for (const mime of mimeTypes) {
      if (MediaRecorder.isTypeSupported(mime)) {
        selectedMime = mime;
        break;
      }
    }

    const options: MediaRecorderOptions = {
      mimeType: selectedMime || undefined,
      videoBitsPerSecond: 12000000 // 12 Mbps for studio quality
    };

    try {
      this.mediaRecorder = new MediaRecorder(combinedStream, options);
    } catch (e) {
      console.warn('Fallback to basic MediaRecorder', e);
      this.mediaRecorder = new MediaRecorder(combinedStream);
    }

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        this.recordedChunks.push(event.data);
      }
    };

    this.isRecording = true;
    this.mediaRecorder.start(250); // Slice every 250ms

    // Seek to start and play
    audioEngine.seek(0);
    audioEngine.play();
  }

  public stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder || !this.isRecording) {
        return reject(new Error('No active recording'));
      }

      this.mediaRecorder.onstop = () => {
        this.isRecording = false;
        audioEngine.pause();
        const blob = new Blob(this.recordedChunks, { type: this.mediaRecorder?.mimeType || 'video/webm' });
        resolve(blob);
      };

      this.mediaRecorder.stop();
    });
  }

  public getIsRecording(): boolean {
    return this.isRecording;
  }
}

export const exportEngine = new ExportEngine();
