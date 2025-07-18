import Sound from 'react-native-sound';

Sound.setCategory('Playback');

interface Sounds {
  phaseStart: Sound;
  phaseComplete: Sound;
  cycleComplete: Sound;
  setComplete: Sound;
  sessionComplete: Sound;
}

let sounds: Sounds;

export const initSounds = () => {
  sounds = {
    phaseStart: new Sound('phase_start.mp3', Sound.MAIN_BUNDLE),
    phaseComplete: new Sound('phase_start.mp3', Sound.MAIN_BUNDLE),
    cycleComplete: new Sound('cycle_complete.mp3', Sound.MAIN_BUNDLE),
    setComplete: new Sound('set_complete.mp3', Sound.MAIN_BUNDLE),
    sessionComplete: new Sound('session_complete.mp3', Sound.MAIN_BUNDLE),
  };
};

export const playSound = (type: keyof Sounds) => {
  if (!sounds) return;
  
  sounds[type].stop(() => {
    sounds[type].play((success) => {
      if (!success) {
        console.warn('Sound playback failed');
      }
    });
  });
};

export const setVolume = (volume: number) => {
  if (!sounds) return;
  
  Object.values(sounds).forEach(sound => {
    sound.setVolume(volume);
  });
};