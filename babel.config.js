export default function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@': './src',
            '@components': './src/components',
            '@features': './src/features',
            '@services': './src/services',
            '@utils': './src/utils',
            '@types': './src/types',
            '@constants': './src/constants',
            '@theme': './src/theme',
            '@hooks': './src/hooks',
            '@navigation': './src/navigation',
          },
        },
      ],
    ],
  };
}
