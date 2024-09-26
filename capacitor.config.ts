import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.impulselc.uz',
  appName: 'ImpulseLC Quiz App',
  webDir: 'dist',
  plugins: {
    CapacitorJitsiMeet: {
      url: 'https://meet.jit.si'
    }
  }
};

export default config;
