import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { bigHeadsCount, generatedDirPath } from './config.js'
import {
  createGeneratedFolder,
  generateBigHeadSvgs,
  prepareDom,
  saveSvgToFiles,
  removeGeneratedFolder,
  saveToFileStatisticsAndTraits,
  GenerateBitHeadsResult,
} from './generate-bigheads.js'
import { createClient, uploadFile } from './ipfs.js'
import { getFilePath } from './utils.js'

yargs(hideBin(process.argv))
  .command('generate', 'Generated bigheads', () => {
    const { container } = prepareDom()

    const {
      generatedTraitsStatistics,
      svgFileNameContentList,
      traitsPerGeneratedFile,
    } = generateBigHeadSvgs(container, generatedDirPath, bigHeadsCount)

    removeGeneratedFolder()
    createGeneratedFolder()
    saveToFileStatisticsAndTraits({
      generatedTraitsStatistics,
      traitsPerGeneratedFile,
      svgFileNameContentList,
    })
  })
  .command('save-to-file', 'Save generated SVGs to file system', () => {
    saveSvgToFiles()
  })
  .command('upload', 'Upload generated bigheads to IPFS', (argv) => {
    const svgFileNameContentListPath = join(generatedDirPath, `svgs.json`)
    const svgFile = readFileSync(svgFileNameContentListPath)
    const svgFileNameContentList: GenerateBitHeadsResult['svgFileNameContentList'] = JSON.parse(
      svgFile.toString(),
    )
    const client = createClient()

    Promise.all(
      svgFileNameContentList.map(async ({ content, fileName, path }) => {
        const ipfsPath = await uploadFile(client, content)

        return { ipfsPath, fileName }
      }),
    ).then((svgFilePaths) => {
      const filePath = getFilePath(import.meta.url)

      writeFileSync(
        join(filePath, 'generated', 'uploaded.json'),
        JSON.stringify(svgFilePaths, undefined, 2),
      )
    })
  })
  .parse()
