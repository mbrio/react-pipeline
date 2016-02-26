require('babel-polyfill');
require('babel-register')({
  plugins: ['transform-decorators-legacy'],
  presets: ['es2015', 'react', 'stage-0']
});

process.on('unhandledRejection', function(error, promise) {
  console.error('UNHANDLED REJECTION', error.stack);
});

require('./main').default();
