import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;

export const loadFFmpeg = async () => {
  if (ffmpeg) return ffmpeg;

  ffmpeg = new FFmpeg();
  
  // Load from CDN to keep bundle size small
  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  });

  return ffmpeg;
};

export const compressVideo = async (file: File, onProgress?: (progress: number) => void): Promise<File> => {
  const ffmpeg = await loadFFmpeg();
  const inputName = 'input.mp4';
  const outputName = 'output.mp4';

  await ffmpeg.writeFile(inputName, await fetchFile(file));

  // Compression command: 
  // -vcodec libx264 (standard)
  // -crf 28 (higher = smaller size, good balance)
  // -preset fast
  // -vf "scale='min(1280,iw)':-2" (limit to 720p maximum)
  
  ffmpeg.on('log', ({ message }) => {
    console.log('[FFmpeg Log]', message);
  });

  ffmpeg.on('progress', ({ progress }) => {
    if (onProgress) onProgress(Math.round(progress * 100));
  });

  // Scale down to 720p and reduce bitrate to roughly fit 50MB
  // If original is 300MB/60s (~40Mbps), we want ~6Mbps
  await ffmpeg.exec([
    '-i', inputName,
    '-vcodec', 'libx264',
    '-crf', '30',
    '-preset', 'ultrafast',
    '-vf', 'scale=-2:720',
    '-acodec', 'aac',
    '-strict', 'experimental',
    outputName
  ]);

  const data = await ffmpeg.readFile(outputName);
  const compressedFile = new File([data as any], file.name, { type: 'video/mp4' });

  // Cleanup
  await ffmpeg.deleteFile(inputName);
  await ffmpeg.deleteFile(outputName);

  return compressedFile;
};
