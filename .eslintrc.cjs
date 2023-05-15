module.exports = {
	env: {
		browser: true,
		es2021: true
	},
	extends: [
		'plugin:vue/vue3-essential',
		'plugin:vue/vue3-strongly-recommended',
		'plugin:vue/vue3-recommended',
		'standard-with-typescript',
		'standard',
		'prettier'
	],
	overrides: [],
	parser: 'vue-eslint-parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
		tsconfigRootDir: __dirname,
		parser: '@typescript-eslint/parser',
		project: ['tsconfig.json'],
		extraFileExtensions: ['.vue'],
		ecmaFeatures: {
			jsx: true
		}
	},
	plugins: ['vue', 'prettier'],
	rules: {
		'prettier/prettier': 'error',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'no-use-before-define': 'off'
	}
};
