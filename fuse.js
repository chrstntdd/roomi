const {
  FuseBox,
  CSSPlugin,
  SassPlugin,
  PostCSSPlugin,
  QuantumPlugin,
  WebIndexPlugin
} = require('fuse-box');
const { src, task, context, exec } = require('fuse-box/sparky');
const { join } = require('path');
const express = require('express');
const autoprefixer = require('autoprefixer');
const workbox = require('workbox-build');
const { promisify } = require('util');
const { unlink, writeFile, readFile, stat, writeFileSync, readFileSync } = require('fs');
const minify = require('html-minifier').minify;

const { info } = console;
const asyncReadFile = promisify(readFile);
const asyncWriteFile = promisify(writeFile);
const asyncUnlink = promisify(unlink);
const asyncStats = promisify(stat);

const POSTCSS_PLUGINS = [autoprefixer({ browsers: ['>0.25%'] })];

const CLIENT_OUT = join(__dirname, 'build');
const TEMPLATE = join(__dirname, 'src/index.html');
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

context(
  class {
    build() {
      return FuseBox.init({
        homeDir: 'src',
        output: `${CLIENT_OUT}/$name.js`,
        target: 'browser',
        sourceMaps: true,
        cache: !IS_PRODUCTION,
        allowSyntheticDefaultImports: true,
        alias: { '@': '~', $: '~/packages' },
        plugins: [
          [
            SassPlugin({ importer: true, output: 'compressed' }),
            PostCSSPlugin(POSTCSS_PLUGINS),
            CSSPlugin(
              IS_PRODUCTION
                ? {}
                : {
                    group: 'main.css',
                    inject: false,
                    outFile: `${CLIENT_OUT}/css/main.css`
                  }
            )
          ],
          WebIndexPlugin({
            template: TEMPLATE,
            title: 'Roomi',
            path: '/',
            async: true,
            pre: 'load'
          }),
          IS_PRODUCTION &&
            QuantumPlugin({
              bakeApiIntoBundle: 'app',
              uglify: true,
              treeshake: true,
              css: { clean: true, path: 'css/main.css' }
            })
        ]
      });
    }

    startDevServer(fuse) {
      return fuse.dev({ root: false }, server => {
        const app = server.httpServer.app;
        app.use(express.static(CLIENT_OUT));
        app.get('*', (_, res) => {
          res.sendFile(join(CLIENT_OUT, 'index.html'));
        });
      });
    }
  }
);

task('dev-build', async context => {
  const fuse = context.build();

  context.startDevServer(fuse);

  fuse
    .bundle('app')
    .hmr({ reload: true })
    .watch()
    .instructions('> index.tsx');

  await fuse.run();
});

task('prod-build', async context => {
  const fuse = context.build();

  fuse
    .bundle('app')
    .splitConfig({ dest: '/bundles' })
    .instructions('!> index.tsx');

  context.testProd && context.startDevServer(fuse);

  await fuse.run();
});

task('clean', () => src('./build/*').clean('./build/'));

task('minify-html', async () => {
  const fileContents = await asyncReadFile(`${CLIENT_OUT}/index.html`, 'UTF-8');

  const minified = minify(fileContents, {
    removeComments: true,
    collapseWhitespace: true,
    removeRedundantAttributes: true,
    useShortDoctype: true,
    removeEmptyAttributes: true,
    removeStyleLinkTypeAttributes: true,
    keepClosingSlash: true,
    minifyJS: true,
    minifyCSS: true,
    minifyURLs: true
  });

  await asyncUnlink(`${CLIENT_OUT}/index.html`);
  await asyncWriteFile(`${CLIENT_OUT}/index.html`, minified, 'UTF-8');
});

task('gen-sw', async () => {
  try {
    const stats = await workbox.injectManifest({
      globDirectory: CLIENT_OUT,
      globPatterns: ['**/*.{html,js,css,png,svg,jpg,jpeg,gif}'],
      globIgnores: ['**/sw.js'],
      swSrc: join('src', 'sw.js'),
      swDest: join(CLIENT_OUT, 'sw.js')
    });

    info(
      ` ⚙️ Service worker generated 🛠 \n ${
        stats.count
      } files will be precached, totaling ${stats.size / 1000000.0} MB.`
    );
  } catch (error) {
    info('  😒 There was an error generating the service worker 😒', error);
  }
});

/* MAIN BUILD TASK CHAINS  */
task('dev', ['clean', 'dev-build'], () => info('GET TO WORK'));

task('prod', ['clean', 'prod-build', 'minify-html', 'gen-sw'], () => info('READY FOR PROD'));

task('test-prod', async context => {
  context.testProd = true;
  await exec('clean', 'prod-build', 'minify-html', 'gen-sw');
  info('Lets test prod');
});
