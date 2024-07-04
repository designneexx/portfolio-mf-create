import path from 'path';
import ESLintPlugin from 'eslint-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import TerserWebpackPlugin from 'terser-webpack-plugin';
import webpack, { DefinePlugin } from 'webpack';
import packageJson from './package.json';

const deps = packageJson.dependencies;

import 'webpack-dev-server';

type ConfigParams = Record<string, string>;

enum WebpackMode {
    Development = 'development',
    None = 'none',
    Production = 'production'
}

const SERVER_HOST = 'localhost';
const SERVER_PORT = process.env.PORT || 3005;
const { ModuleFederationPlugin } = webpack.container;

function getWebpackMode(mode: string): WebpackMode {
    switch (mode) {
        case WebpackMode.Development:
        case WebpackMode.Production:
            return mode;
        default:
            return WebpackMode.None;
    }
}

export default (env: ConfigParams, args: ConfigParams): webpack.Configuration => {
    const mode = getWebpackMode(args.mode);
    const isDev = mode === WebpackMode.Development;
    const isProd = mode === WebpackMode.Production;

    return {
        context: path.resolve(__dirname),
        devServer: {
            allowedHosts: 'all',
            client: {
                logging: 'none',
                overlay: {
                    errors: true,
                    runtimeErrors: false,
                    warnings: false
                }
            },
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            historyApiFallback: true,
            host: '0.0.0.0',
            hot: true,
            port: SERVER_PORT
        },
        devtool: 'source-map',
        entry: path.resolve(__dirname, 'src', 'index.tsx'),
        mode,
        module: {
            rules: [
                {
                    exclude: /node_modules/,
                    test: /\.(ts|tsx)?$/,
                    use: 'ts-loader'
                },
                {
                    generator: {
                        filename: 'public/media/[name].[hash:8][ext]'
                    },
                    test: /\.(png|svg|jpg|jpeg|gif)$/i,
                    type: 'asset'
                },
                {
                    test: /\.svg$/,
                    use: ['@svgr/webpack']
                }
            ]
        },
        optimization: {
            minimize: isProd,
            minimizer: [new TerserWebpackPlugin()]
        },
        output: {
            chunkFilename: isDev
                ? 'public/js/[name].chunk.js'
                : 'public/js/[name].[contenthash:8].js',
            clean: true,
            filename: isDev ? 'public/js/bundle.js' : 'public/js/[name].[contenthash:8].js',
            path: path.resolve(__dirname, 'dist'),
            publicPath: isDev ? `//${SERVER_HOST}:${SERVER_PORT}/` : process.env.PUBLIC_PATH
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, 'public', 'index.html'),
                title: 'ВТБ Про'
            }),
            new ESLintPlugin({
                extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx']
            }),
            new DefinePlugin({
                'process.env': JSON.stringify({
                    BASE_API_URL: process.env.BASE_API_URL
                })
            }),
            new ModuleFederationPlugin({
                exposes: {
                    './MFProvider': './src/components/MFProvider'
                },
                filename: 'remoteEntry.js',
                name: 'designexx_creator',
                shared: {
                    '@chakra-ui/anatomy': {
                        requiredVersion: deps['@chakra-ui/anatomy'],
                        singleton: true
                    },
                    '@chakra-ui/react': {
                        requiredVersion: deps['@chakra-ui/react'],
                        singleton: true
                    },
                    '@emotion/react': {
                        requiredVersion: deps['@emotion/react'],
                        singleton: true
                    },
                    '@emotion/styled': {
                        requiredVersion: deps['@emotion/styled'],
                        singleton: true
                    },
                    mobx: {
                        requiredVersion: deps.mobx,
                        singleton: true
                    },
                    'mobx-react-lite': {
                        requiredVersion: deps['mobx-react-lite'],
                        singleton: true
                    },
                    react: { requiredVersion: deps.react, singleton: true },
                    'react-dom': { requiredVersion: deps['react-dom'], singleton: true },
                    'react-router-dom': {
                        requiredVersion: deps['react-router-dom'],
                        singleton: true
                    }
                }
            })
        ],
        resolve: {
            alias: {
                src: path.resolve(__dirname, 'src')
            },
            extensions: ['.wasm', '.ts', '.tsx', '.mjs', '.cjs', '.js', '.json']
        },
        target: 'web'
    };
};
