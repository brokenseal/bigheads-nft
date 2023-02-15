import { readFileSync, writeFileSync } from 'fs'
import { AddResult } from 'ipfs-core-types/dist/src/root.js'
import { join } from 'path'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { bigHeadsCount, generatedDirPath } from './config.js'
import {
  createGeneratedFolder,
  generateBigHeadSvgs,
  GenerateBitHeadsResult,
  prepareDom,
  removeGeneratedFolder,
  saveSvgToFiles,
  saveToFileStatisticsAndTraits,
} from './generate-bigheads.js'
import { baseUrl, createClient, uploadFile } from './ipfs.js'
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
  .command(
    'save-to-file-frontend',
    'Move generated SVGs to frontend workspace',
    () => {
      const dirName = getFilePath(import.meta.url)
      saveSvgToFiles(
        join(
          dirName,
          '..',
          '..',
          'frontend',
          'public',
          'bigheads',
          'generated',
        ),
      )
    },
  )
  .command('upload', 'Upload generated bigheads to IPFS', () => {
    const svgFileNameContentListPath = join(generatedDirPath, `svgs.json`)
    const svgFile = readFileSync(svgFileNameContentListPath)
    const svgFileNameContentList: GenerateBitHeadsResult['svgFileNameContentList'] = JSON.parse(
      svgFile.toString(),
    )
    const client = createClient()

    Promise.all(
      svgFileNameContentList.map(async ({ content, fileName, path }) => {
        const ipfsPath: AddResult = await uploadFile(client, content)
        const fullPath = `${baseUrl}/ipfs/${ipfsPath.path}`

        const uploadResult: UploadResult = { ipfsPath, fileName, fullPath }
        return uploadResult
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

type UploadResult = { ipfsPath: AddResult; fileName: string; fullPath: string }
