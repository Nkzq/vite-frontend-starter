import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import { minify } from 'terser'
import ts from 'typescript'

import config from '../config.js'

const { rootDir, buildDir } = config

/**
 * @param {string} src  The path to the thing to copy.
 * @param {string} dest The path to the new copy.
 */
 const copyRecursiveSync = async (src, dest) => {
  dest = dest.replace('.ts', '.js')
  const exists = fs.existsSync(src)
  const stats = exists && fs.statSync(src)
  const isDirectory = exists && stats.isDirectory()
  if (isDirectory) {
    fs.mkdirSync(dest)
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName))
    })
  } else {
    try {
      fs.copyFileSync(src, dest)
      const file = fs.readFileSync(src, 'utf8')
      const convert = await ts.transpileModule(file, {
        compilerOptions: {
          module: ts.ModuleKind.ESNext,
        },
      })
      const compiled = await minify(convert.outputText)
      fs.writeFileSync(dest, compiled.code, 'utf8')
      console.log(`📦 Module ${chalk.green(path.basename(src))} successfully converted and copied to ${chalk.yellow(path.dirname(dest))}`)
    } catch (error) {
      console.error(error)
    }
  }
}

const dynamicImportPlugin = () => {
  return {
    name: 'dynamic-import',
    enforce: 'post',
    async closeBundle() {
      copyRecursiveSync(`./${rootDir}/assets/js/modules`, `./${buildDir}/assets/modules`)
    }
  }
}

export default dynamicImportPlugin