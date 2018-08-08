const {
  FuseBox,
  CSSPlugin,
  CSSModules,
  PostCSSPlugin,
  QuantumPlugin,
  WebIndexPlugin
} = require('fuse-box');
const { src, task, context, tsc } = require('fuse-box/sparky');
const { join } = require('path');
const express = require('express');
const autoprefixer = require('autoprefixer');

const { info } = console;

const POSTCSS_PLUGINS = [autoprefixer({ browsers: ['>0.25%'] })];

const CLIENT_OUT = join(__dirname, 'build/client');
const SERVER_OUT = join(__dirname, 'build/server');
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
            CSSModules({
              scopedName: IS_PRODUCTION ? '[local]___[sha512:hash:base64:8]' : '[local]__[emoji:6]'
            }),
            PostCSSPlugin(POSTCSS_PLUGINS),
            CSSPlugin()
          ],
          WebIndexPlugin({
            template: TEMPLATE,
            title: 'Roomi',
            path: '/',
            async: true
          }),
          IS_PRODUCTION &&
            QuantumPlugin({
              bakeApiIntoBundle: 'app',
              uglify: true,
              treeshake: true,
              css: { clean: true, path: `css/main.css` }
            })
        ]
      });
    }

    async compileServer() {
      await tsc('src/server', {
        target: 'esnext',
        outDir: SERVER_OUT,
        listEmittedFiles: true,
        sourceMap: true,
        watch: !IS_PRODUCTION
      });
    }
  }
);

task('dev-build', async context => {
  const fuse = context.build();

  fuse.dev({ root: false }, server => {
    const app = server.httpServer.app;
    app.use(express.static(CLIENT_OUT));
    app.get('*', (_, res) => {
      res.sendFile(join(CLIENT_OUT, 'index.html'));
    });
  });

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

  await fuse.run();
});

task('server-build', async context => await context.compileServer());

task('client-clean', () => src(`${CLIENT_OUT}/*`).clean(`${CLIENT_OUT}`));
task('server-clean', () => src(`${SERVER_OUT}/*`).clean(`${SERVER_OUT}`));

task('copy-schema', () =>
  src('./**/*.graphql', { base: './src/server/graphql' }).dest(join(SERVER_OUT, 'graphql'))
);

/* MAIN BUILD TASK CHAINS  */
task('dev', ['client-clean', 'dev-build'], () => info('GET TO WORK'));
task('prod', ['client-clean', 'prod-build'], () => info('READY FOR PROD'));

task('server-dev', ['server-clean', 'copy-schema', 'server-build'], _ =>
  info('The back end code has been compiled. GET TO WORK!')
);
