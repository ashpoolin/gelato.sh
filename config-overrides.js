const { ProvidePlugin } = require('webpack');

module.exports = function (config, env) {
    return {
        ...config,
        module: {
            ...config.module,
            rules: [
                ...config.module.rules,
                {
                    test: /\.m?[jt]sx?$/,
                    enforce: 'pre',
                    use: ['source-map-loader'],
                },
                {
                    test: /\.m?[jt]sx?$/,
                    resolve: {
                        fullySpecified: false,
                    },
                },
            ],
        },
        plugins: [
            ...config.plugins,
            // Work around for Buffer is undefined:
            // https://github.com/webpack/changelog-v5/issues/10
            new ProvidePlugin({
                Buffer: ['buffer', 'Buffer'],
            }),
            new ProvidePlugin({
                process: 'process/browser',
            }),
        ],
        resolve: {
            ...config.resolve,
            fallback: {
                assert: require.resolve('assert'),
                buffer: require.resolve('buffer'),
                crypto: require.resolve('crypto-browserify'),
                stream: require.resolve('stream-browserify'),
            },
        },
        ignoreWarnings: [/Failed to parse source map/],
    };
};