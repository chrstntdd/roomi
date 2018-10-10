const {
  FuseBox,
  CSSPlugin,
  SassPlugin,
  PostCSSPlugin,
  QuantumPlugin,
  WebIndexPlugin
} = require('fuse-box');
const { src, task, context, tsc, exec } = require('fuse-box/sparky');
const { TypeChecker } = require('fuse-box-typechecker');
const { join } = require('path');
const express = require('express');
const autoprefixer = require('autoprefixer');
const workbox = require('workbox-build');
const { unlinkSync, writeFileSync, readFileSync } = require('fs');
const minify = require('html-minifier').minify;

const { info } = console;

const POSTCSS_PLUGINS = [autoprefixer({ browsers: ['>0.25%'] })];
const CLIENT_OUT = join(__dirname, 'build/client');
const SERVER_OUT = join(__dirname, 'build/server');
const TEMPLATE = join(__dirname, 'src/client/index.html');
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const USE_SERVICE_WORKER = process.env.USE_SW;

const { sw } = require(join(__dirname, 'src/client/inline-sw'));

context(
  class {
    build() {
      return FuseBox.init({
        homeDir: 'src',
        output: `${CLIENT_OUT}/$name.js`,
        log: {
          enabled: IS_PRODUCTION,
          showBundledFiles: IS_PRODUCTION
        },
        target: 'browser',
        sourceMaps: true,
        cache: !IS_PRODUCTION,
        allowSyntheticDefaultImports: true,
        alias: { '@': '~/client', $: '~/packages' },
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
            pre: 'load',
            engine: 'handlebars',
            locals: {
              service_worker: IS_PRODUCTION && USE_SERVICE_WORKER ? sw : ' '
            }
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

    async compileServer() {
      await tsc('src/server', {
        target: 'ESNext',
        outDir: SERVER_OUT,
        sourceMap: true,
        ...(IS_PRODUCTION ? {} : { watch: true })
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

const typeguard = TypeChecker({
  tsConfig: './tsconfig.json',
  basePath: './',
  name: '',
  tsConfigOverride: {
    include: ['src/client/**/*.ts', 'src/client/**/*.tsx']
  }
});

task('client-dev-build', async context => {
  const fuse = context.build();

  context.startDevServer(fuse);

  fuse
    .bundle('app')
    .hmr({ reload: true })
    .watch()
    .instructions('> client/index.tsx');

  typeguard.runWatch('./src');

  await fuse.run();
});

task('client-prod-build', async context => {
  const fuse = context.build();

  fuse
    .bundle('app')
    .splitConfig({ dest: '/bundles' })
    .instructions('!> client/index.tsx');

  typeguard.runAsync();

  context.testProd && context.startDevServer(fuse);

  await fuse.run();
});

task('server-build', async context => await context.compileServer());

task('client-clean', () => src(`${CLIENT_OUT}/*`).clean(`${CLIENT_OUT}`));
task('server-clean', () => src(`${SERVER_OUT}/*`).clean(`${SERVER_OUT}`));

task('copy-schema', () =>
  src('./**/*.graphql', { base: './src/server/graphql' }).dest(join(SERVER_OUT, 'graphql'))
);

task('minify-html', () => {
  const fileContents = readFileSync(`${CLIENT_OUT}/index.html`, 'UTF-8');

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

  unlinkSync(`${CLIENT_OUT}/index.html`);
  writeFileSync(`${CLIENT_OUT}/index.html`, minified, 'UTF-8');
});

task('gen-sw', async () => {
  if (USE_SERVICE_WORKER) {
    try {
      const stats = await workbox.injectManifest({
        globDirectory: CLIENT_OUT,
        globPatterns: ['**/*.{html,js,css,png,svg,jpg,jpeg,gif}'],
        globIgnores: ['**/sw.js'],
        swSrc: join('src/client', 'sw.js'),
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
  }
});

/* MAIN BUILD TASK CHAINS  */

// Compile client code for development
task('client-dev', ['client-clean', 'client-dev-build'], _ =>
  info('Client code compiled. Get to building  🚧  🛠  💰  🏗  ')
);

// Compile client code for production
task('client-prod', ['client-clean', 'client-prod-build', 'minify-html', 'gen-sw'], _ =>
  info('🚀  Client code ready for production, lets secure this bag 🚀')
);

// Compile server
task('server-dev', ['server-clean', 'copy-schema', 'server-build'], _ =>
  info('Back end code compiled successfully!')
);

// Compile server for production
// (Identical to the dev build, but this task has its NODE_ENV set to prod)
task('server-prod', ['server-clean', 'copy-schema', 'server-build'], _ =>
  info('Back end code compiled successfully!')
);

// Test production client build with the express dev server provided by fusebox
task('test-prod', async context => {
  context.testProd = true;
  await exec('client-clean', 'client-prod');
  info('Lets test prod');
});
