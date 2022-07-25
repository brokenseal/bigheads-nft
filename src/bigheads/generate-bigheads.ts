import { AvatarProps, BigHead } from '@bigheads/core'
import { mkdirSync, rmSync, writeFileSync } from 'fs'
import * as jsdom from 'jsdom'
import { dirname, join } from 'path'
import React from 'react'
import { render } from 'react-dom'
import { fileURLToPath } from 'url'
import { generateNewRandomTraits } from './traits.js'

type RequiredAvatarProps = Omit<
  Required<AvatarProps>,
  'mask' | 'faceMask' | 'lashes'
>

type GeneratedTraitsInfo = {
  count: number
  fileNames: string[]
}
type BaseGeneratedTraits = {
  [Key in keyof RequiredAvatarProps]: {
    [key in RequiredAvatarProps[Key]]: GeneratedTraitsInfo
  }
}

type GeneratedTraits = BaseGeneratedTraits & {
  mask: {
    yes: GeneratedTraitsInfo
    no: GeneratedTraitsInfo
  }
  faceMask: {
    yes: GeneratedTraitsInfo
    no: GeneratedTraitsInfo
  }
  lashes: {
    yes: GeneratedTraitsInfo
    no: GeneratedTraitsInfo
  }
}

const createGeneratedTraitsInfo = (): GeneratedTraitsInfo => ({
  count: 0,
  fileNames: [],
})

const createGeneratedTraitsStatistics = (): GeneratedTraits => ({
  accessory: {
    none: createGeneratedTraitsInfo(),
    roundGlasses: createGeneratedTraitsInfo(),
    shades: createGeneratedTraitsInfo(),
    tinyGlasses: createGeneratedTraitsInfo(),
  },
  body: {
    breasts: createGeneratedTraitsInfo(),
    chest: createGeneratedTraitsInfo(),
  },
  circleColor: {
    blue: createGeneratedTraitsInfo(),
  },
  clothing: {
    dress: createGeneratedTraitsInfo(),
    dressShirt: createGeneratedTraitsInfo(),
    naked: createGeneratedTraitsInfo(),
    shirt: createGeneratedTraitsInfo(),
    tankTop: createGeneratedTraitsInfo(),
    vneck: createGeneratedTraitsInfo(),
  },
  clothingColor: {
    black: createGeneratedTraitsInfo(),
    blue: createGeneratedTraitsInfo(),
    green: createGeneratedTraitsInfo(),
    red: createGeneratedTraitsInfo(),
    white: createGeneratedTraitsInfo(),
  },
  eyebrows: {
    angry: createGeneratedTraitsInfo(),
    concerned: createGeneratedTraitsInfo(),
    leftLowered: createGeneratedTraitsInfo(),
    raised: createGeneratedTraitsInfo(),
    serious: createGeneratedTraitsInfo(),
  },
  eyes: {
    content: createGeneratedTraitsInfo(),
    dizzy: createGeneratedTraitsInfo(),
    happy: createGeneratedTraitsInfo(),
    heart: createGeneratedTraitsInfo(),
    leftTwitch: createGeneratedTraitsInfo(),
    normal: createGeneratedTraitsInfo(),
    simple: createGeneratedTraitsInfo(),
    squint: createGeneratedTraitsInfo(),
    wink: createGeneratedTraitsInfo(),
  },
  faceMask: {
    yes: createGeneratedTraitsInfo(),
    no: createGeneratedTraitsInfo(),
  },
  faceMaskColor: {
    black: createGeneratedTraitsInfo(),
    blue: createGeneratedTraitsInfo(),
    green: createGeneratedTraitsInfo(),
    red: createGeneratedTraitsInfo(),
    white: createGeneratedTraitsInfo(),
  },
  facialHair: {
    mediumBeard: createGeneratedTraitsInfo(),
    none: createGeneratedTraitsInfo(),
    none2: createGeneratedTraitsInfo(),
    none3: createGeneratedTraitsInfo(),
    stubble: createGeneratedTraitsInfo(),
  },
  graphic: {
    gatsby: createGeneratedTraitsInfo(),
    graphQL: createGeneratedTraitsInfo(),
    none: createGeneratedTraitsInfo(),
    react: createGeneratedTraitsInfo(),
    redwood: createGeneratedTraitsInfo(),
    vue: createGeneratedTraitsInfo(),
  },
  hair: {
    afro: createGeneratedTraitsInfo(),
    balding: createGeneratedTraitsInfo(),
    bob: createGeneratedTraitsInfo(),
    bun: createGeneratedTraitsInfo(),
    buzz: createGeneratedTraitsInfo(),
    long: createGeneratedTraitsInfo(),
    none: createGeneratedTraitsInfo(),
    pixie: createGeneratedTraitsInfo(),
    short: createGeneratedTraitsInfo(),
  },
  hairColor: {
    black: createGeneratedTraitsInfo(),
    blonde: createGeneratedTraitsInfo(),
    blue: createGeneratedTraitsInfo(),
    brown: createGeneratedTraitsInfo(),
    orange: createGeneratedTraitsInfo(),
    pink: createGeneratedTraitsInfo(),
    white: createGeneratedTraitsInfo(),
  },
  hat: {
    beanie: createGeneratedTraitsInfo(),
    none: createGeneratedTraitsInfo(),
    none2: createGeneratedTraitsInfo(),
    none3: createGeneratedTraitsInfo(),
    none4: createGeneratedTraitsInfo(),
    none5: createGeneratedTraitsInfo(),
    turban: createGeneratedTraitsInfo(),
  },
  hatColor: {
    black: createGeneratedTraitsInfo(),
    blue: createGeneratedTraitsInfo(),
    green: createGeneratedTraitsInfo(),
    red: createGeneratedTraitsInfo(),
    white: createGeneratedTraitsInfo(),
  },
  lashes: {
    yes: createGeneratedTraitsInfo(),
    no: createGeneratedTraitsInfo(),
  },
  lipColor: {
    green: createGeneratedTraitsInfo(),
    pink: createGeneratedTraitsInfo(),
    purple: createGeneratedTraitsInfo(),
    red: createGeneratedTraitsInfo(),
    turqoise: createGeneratedTraitsInfo(),
  },
  mask: {
    yes: createGeneratedTraitsInfo(),
    no: createGeneratedTraitsInfo(),
  },
  mouth: {
    grin: createGeneratedTraitsInfo(),
    lips: createGeneratedTraitsInfo(),
    open: createGeneratedTraitsInfo(),
    openSmile: createGeneratedTraitsInfo(),
    sad: createGeneratedTraitsInfo(),
    serious: createGeneratedTraitsInfo(),
    tongue: createGeneratedTraitsInfo(),
  },
  skinTone: {
    black: createGeneratedTraitsInfo(),
    brown: createGeneratedTraitsInfo(),
    dark: createGeneratedTraitsInfo(),
    light: createGeneratedTraitsInfo(),
    red: createGeneratedTraitsInfo(),
    yellow: createGeneratedTraitsInfo(),
  },
})

export const generateUniqueTraits = () => {
  let duplicatesCount = 0
  const generatedCombinations: { [key: string]: true } = {}

  while (true) {
    const newTraits = generateNewRandomTraits()
    const id = JSON.stringify(newTraits)

    if (generatedCombinations[id]) {
      duplicatesCount += 1
      console.log(`Created a duplicate! ${duplicatesCount}`)
      continue
    }

    generatedCombinations[id] = true
    return newTraits
  }
}

const generateRandomUniqueTraits = (bigHeadsCount = 100) =>
  new Array(bigHeadsCount).fill(null).map(() => generateUniqueTraits())

const prepareDomAndFolders = () => {
  const dom = new jsdom.JSDOM("<html><body><div id='root'></div></body></html>")
  ;(global as any).window = dom.window

  const fileName = fileURLToPath(import.meta.url)
  const dirName = dirname(fileName)
  const rootDir = join(dirName, '../../')
  const generatedDirPath = join(rootDir, 'src', 'bigheads', 'generated')

  rmSync(generatedDirPath, { recursive: true, force: false })
  mkdirSync(generatedDirPath)

  return { dom, generatedDirPath }
}

const generateBigHeadSvgs = (
  container: HTMLElement,
  generatedDirPath: string,
) => {
  const traits = generateRandomUniqueTraits()
  const generatedTraitsStatistics = createGeneratedTraitsStatistics()
  const traitsPerGeneratedFile: { [key: string]: AvatarProps } = {}

  const svgFileNameContentList = traits.map((bigHeadTraits, index) => {
    const bigHead = React.createElement(BigHead, bigHeadTraits)
    render(bigHead, container)
    const fileName = `bighead_${index}.svg`
    const path = join(generatedDirPath, fileName)
    traitsPerGeneratedFile[fileName] = bigHeadTraits

    type Key = keyof AvatarProps
    Object.entries(bigHeadTraits).forEach((keyValue) => {
      const key = keyValue[0] as Key
      const value = keyValue[1] as Exclude<AvatarProps[Key], undefined>

      if (value === undefined) {
        ;(generatedTraitsStatistics[key] as any)['undefined'].count += 1
        ;(generatedTraitsStatistics[key] as any)['undefined'].fileNames.push(
          fileName,
        )
      } else if (typeof value === 'boolean' && value === true) {
        ;(generatedTraitsStatistics[key] as any)['yes'].count += 1
        ;(generatedTraitsStatistics[key] as any)['yes'].fileNames.push(fileName)
      } else if (typeof value === 'boolean' && value === false) {
        ;(generatedTraitsStatistics[key] as any)['no'].count += 1
        ;(generatedTraitsStatistics[key] as any)['no'].fileNames.push(fileName)
      } else {
        ;(generatedTraitsStatistics[key] as any)[value].count += 1
        ;(generatedTraitsStatistics[key] as any)[value].fileNames.push(fileName)
      }
    })

    return { path, content: container!.innerHTML }
  })

  return {
    traitsPerGeneratedFile,
    generatedTraitsStatistics,
    svgFileNameContentList,
  }
}

const main = () => {
  const { dom, generatedDirPath } = prepareDomAndFolders()
  const {
    traitsPerGeneratedFile,
    generatedTraitsStatistics,
    svgFileNameContentList,
  } = generateBigHeadSvgs(
    dom.window.document.getElementById('root')!,
    generatedDirPath,
  )

  svgFileNameContentList.forEach(({ path, content }) => {
    writeFileSync(path, content, { flag: 'w' })
  })
  const traitsFilePath = join(generatedDirPath, `_traits.json`)
  writeFileSync(
    traitsFilePath,
    JSON.stringify(traitsPerGeneratedFile, undefined, 2),
  )
  const statisticsFilePath = join(generatedDirPath, `_statistics.json`)
  writeFileSync(
    statisticsFilePath,
    JSON.stringify(generatedTraitsStatistics, undefined, 2),
  )
}

main()
