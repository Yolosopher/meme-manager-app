import { config as configBase } from '@tamagui/config/v3';
import { createFont, createTamagui } from 'tamagui';

const font = createFont({
  family: 'Afacad',
  size: {
    1: 12,
    2: 14,
    3: 16,
    4: 20,
    5: 24,
    6: 32,
    7: 48,
    8: 64,
    9: 72,
  },
  weight: {
    300: 'AfacadLight',
    400: 'Afacad',
    500: 'Afacad',
    700: 'AfacadBold',
    900: 'AfacadBlack',
  },
  lineHeight: {
    1: 12,
    2: 14,
    3: 16,
    4: 20,
    5: 24,
    6: 32,
    7: 48,
    8: 64,
    9: 72,
  },
  face: {
    // pass in weights as keys
    300: { normal: 'AfacadLight' },
    400: { normal: 'Afacad' },
    500: { normal: 'Afacad' },
    700: { normal: 'AfacadBold' },
    900: { normal: 'AfacadBlack' },
  },
});
export const config = createTamagui({
  ...configBase,
  fonts: {
    body: font,
    heading: font,
    mono: font,
    silkscreen: font,
  },
});

export default config;

export type Conf = typeof config;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}
