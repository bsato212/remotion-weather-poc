const { Polly } = require('aws-sdk');

class PollyClient {
  constructor({ region }) {
    this.region = region;
    this.polly = new Polly({ region });
  }

  async synthesizeSpeech({ text }) {
    const response = await this.polly.synthesizeSpeech({
      Engine: 'neural',
      LanguageCode: 'en-US',
      OutputFormat: 'mp3',
      SampleRate: '24000',
      Text: text,
      TextType: 'text',
      VoiceId: 'Matthew',
    }).promise();

    return response;
  }
}

module.exports = PollyClient;
