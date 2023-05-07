const { defineConfig, devices } = require( '@playwright/test' );

module.exports = defineConfig( {
	timeout: 0,
	fullyParallel: false,
	retries: 0,
	workers: 1,
	maxFailures: 0,

	forbidOnly: !! process.env.CI,
	reporter: 'html',

	use: {
		trace: 'on-first-retry',
	},

	testDir: './tests',

	projects: [
		{
			name: 'chromium',
			use: { ...devices[ 'Desktop Chrome' ], storageState: "./session.json", },
		},
	],
} );
