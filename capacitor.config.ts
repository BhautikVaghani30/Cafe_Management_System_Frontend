import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'cafe-management',
  webDir: 'dist/Frontend',
  server: {
    androidScheme: 'http',
  },
};

export default config;
