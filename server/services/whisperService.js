const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');
const os = require('os');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function transcribeAudio(audioBuffer, mimeType) {
  try {
    const ext = mimeType.includes('webm') ? 'webm' :
                mimeType.includes('mp4') ? 'mp4' :
                mimeType.includes('wav') ? 'wav' : 'webm';

    const tmpFile = path.join(os.tmpdir(), `audio_${Date.now()}.${ext}`);
    fs.writeFileSync(tmpFile, audioBuffer);

    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tmpFile),
      model: 'whisper-1',
      language: 'en'
    });

    fs.unlinkSync(tmpFile);
    return transcription.text;
  } catch (err) {
    console.error('Whisper transcription error:', err.message);
    throw new Error('Audio transcription failed');
  }
}

module.exports = { transcribeAudio };
