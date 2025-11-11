module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-tailwindcss'],
  plugins: ['stylelint-order'],
  rules: {
    'color-named': 'never',
    'declaration-block-no-redundant-longhand-properties': null,
    'order/properties-alphabetical-order': true,
  },
  ignoreFiles: ['dist/**/*', 'node_modules/**/*'],
}

