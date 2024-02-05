import 'dotenv/config';

import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives';
import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';
import { mainConfig } from './webpack.main.config';
import packageJson from './package.json';
import { rendererConfig } from './webpack.renderer.config';

const config: ForgeConfig = {
  // hooks: {
  //   packageAfterCopy: async (forgeConfig, build_path) => {
  //     console.log(`\nBuild Path: ${build_path}`);
  //     await minify(build_path + '/src');
  //   },
  // },
  packagerConfig: {
    name: packageJson.productName,
    icon: './src/assets/icon',
    asar: true,
    protocols: [
      {
        "name": packageJson.productName,
        "schemes": [packageJson.name]
      }
    ],
    osxSign: {
      identity: process.env.SIGN_ID,
    }, // object must exist even if empty
    osxNotarize: {
      appleId: process.env.APPLE_ID || "",
      appleIdPassword: process.env.APPLE_PASSWORD || "",
      teamId: process.env.APPLE_TEAM_ID || ""
      // appleApiKey: process.env.APPLE_API_KEY || "",
      // appleApiKeyId: process.env.APPLE_API_KEY_ID || "",
      // appleApiIssuer: process.env.APPLE_API_ISSUER || ""
    }
  },
  rebuildConfig: {},
  makers: [new MakerSquirrel({
    iconUrl: 'https://raw.githubusercontent.com/ceddybi/AIJ/master/src/assets/icon.png',
    setupIcon: './src/assets/icon.ico',
  }), new MakerZIP({}, ['darwin']), new MakerRpm({}),
  {
    "name": "@electron-forge/maker-deb",
    "config": {
      "mimeType": [`x-scheme-handler/${packageJson.name}`],
      options: {
        maintainer: packageJson.author.name,
        homepage: packageJson.homepage,
        icon: './src/assets/icon.png',
        categories: ['Utility']
      }
    }
  }
  ],
  plugins: [
    new AutoUnpackNativesPlugin({}),
    new WebpackPlugin({
      mainConfig,
      devContentSecurityPolicy: "default-src 'self' 'unsafe-eval' 'unsafe-inline' static: http: https: ws:",
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: './src/index.html',
            js: './src/renderer.ts',
            name: 'main_window',
            preload: {
              js: './src/preload.ts',
            },
          },
        ],
      },
    }),

  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'ceddybi',
          name: 'AIJ'
        },
        prerelease: true
      }
    }
  ]
};

export default config;
