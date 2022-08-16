import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
// import { transformStyle } from '../../plugins/transform-style'
// const { peerDependencies, dependencies } = require('./package.json')

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '@xm/': path.resolve(__dirname, '@xm/'),
      '~antd': 'antd'
    }
  },

  // plugins: [react(), transformStyle()],
  plugins: [react()],

  // build: {
  //   lib: {
  //     entry: path.resolve(__dirname, './src/index.tsx'),
  //     formats: ['es'],
  //     name: 'xeditor-editor-form',
  //     // the proper extensions will be added
  //     fileName: 'xeditor-editor-form'
  //   },
  //   rollupOptions: {
  //     // 确保外部化处理那些你不想打包进库的依赖
  //     external: [
  //       ...Object.keys(dependencies).filter(x => x.startsWith('@xm')),
  //       ...Object.keys(peerDependencies)
  //     ],
  //     output: {}
  //   }
  // }
})
