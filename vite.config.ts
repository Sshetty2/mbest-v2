import { crx, ManifestV3Export } from '@crxjs/vite-plugin';
import { defineConfig } from 'vite';
import manifest from './manifest.json';

export default defineConfig({
  plugins: [crx({
    manifest: {
      ...manifest,
      background: {
        service_worker: 'src/background.ts',
        type          : 'module'
      }
    } as ManifestV3Export
  })]
});
