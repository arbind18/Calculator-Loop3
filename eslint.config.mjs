import next from 'eslint-config-next'

const config = [
	{
		ignores: ['_legacy_backup/**', '**/tmp_*.log'],
	},
	...next,
	{
		rules: {
			// These rules are from React Compiler/advanced hooks analysis and can produce
			// many false positives in real-world apps (they do not necessarily indicate
			// runtime bugs). Keep them non-blocking.
			'react-hooks/set-state-in-effect': 'off',
			'react-hooks/static-components': 'off',
			'react-hooks/preserve-manual-memoization': 'off',
			'react-hooks/immutability': 'off',

			// Content text often contains quotes/apostrophes; we don't want lint to block builds.
			'react/no-unescaped-entities': 'off',
		},
	},
]

export default config
