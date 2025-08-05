const i18n = require('i18n');

i18n.configure({
  locales: ['en', 'hi'],
  directory: __dirname + '/../locales',
  defaultLocale: 'en',
  queryParameter: 'lang',
  objectNotation: true
});

module.exports = i18n;
