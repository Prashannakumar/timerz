export const COLORS = {
  primary: '#8BD3DD',
  secondary: '#F582AE',
  background: '#FFFFFE',
  text: '#172C66',
  inactive: '#D9D9D9',
};

export const PRESET_PATTERNS = [
  {
    id: 'inhale-hold-exhale',
    name: 'Inhale-Hold-Exhale',
    phases: [
      { name: 'Inhale', duration: 4 },
      { name: 'Hold', duration: 4 },
      { name: 'Exhale', duration: 4 },
    ],
  },
  {
    id: 'inhale-exhale',
    name: 'Inhale-Exhale',
    phases: [
      { name: 'Inhale', duration: 4 },
      { name: 'Exhale', duration: 4 },
    ],
  },
  {
    id: 'inhale-hold-exhale-hold',
    name: 'Inhale-Hold-Exhale-Hold',
    phases: [
      { name: 'Inhale', duration: 4 },
      { name: 'Hold', duration: 4 },
      { name: 'Exhale', duration: 4 },
      { name: 'Hold', duration: 4 },
    ],
  },
];