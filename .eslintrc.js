module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    experimentalDecorators: true,
    modules: true
  },
  'rules': {
    'comma-dangle': ['error', 'never'],
    'keyword-spacing': ['error', { 'before': true }]
  }
}
