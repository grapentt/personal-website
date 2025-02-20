const os = require('os');

module.exports = {
  env: {
    browser: true,
    node: true,
  },
  extends: 'airbnb',
  ignorePatterns: ['node_modules/', 'build/'],
  parser: '@babel/eslint-parser',
  plugins: ['react'],
  rules: {
    'max-len': 'off',
    'no-trailing-spaces': 'off',
    'jsx-a11y/no-noninteractive-element-to-interactive-role': 'off',
    'operator-linebreak': 'off',
    'no-multiple-empty-lines': 'off',
    'react/self-closing-comp': 'off',
    'no-unescaped-entities': 'off',
    'react/jsx-closing-tag-location': 'off',
    'eol-last': 'off',
    'react/no-unescaped-entities': 'off',
    'react/jsx-indent': 'off',
    'react/jsx-tag-spacing': 'off',
    'react/jsx-closing-bracket-location': 'off',
    'object-curly-newline': 'off',
    'jsx-a11y/alt-text': 'off',
    'react/prop-types': 'off',
    'react/button-has-type': 'off',
    'arrow-body-style': 'off',
    'import/no-unresolved': 'off',
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        aspects: ['noHref', 'invalidHref', 'preferButton'],
        components: ['Link'],
        specialLink: ['to', 'hrefLeft', 'hrefRight'],
      },
    ],
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/href-no-hash': 'off',
    'jsx-a11y/no-static-element-interactions': 0,
    'linebreak-style': ['error', os.EOL === '\r\n' ? 'windows' : 'unix'],
    'no-console': [
      'error',
      {
        allow: ['warn', 'error', 'info'],
      },
    ],
    'no-underscore-dangle': 0,
    'react/destructuring-assignment': 0,
    'react/function-component-definition': [
      2,
      { namedComponents: 'arrow-function' },
    ],
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.js', '.jsx'],
      },
    ],
    'react/jsx-no-useless-fragment': 0,
    'react/jsx-one-expression-per-line': 0,
    'react/jsx-props-no-spreading': 0,
    'react/jsx-wrap-multilines': [
      1,
      {
        assignment: true,
        declaration: true,
        return: true,
      },
    ],
  },
};
