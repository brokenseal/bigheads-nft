import {
  accessoryMap,
  AvatarProps,
  BigHead,
  bodyMap,
  clothingMap,
  eyebrowsMap,
  eyesMap,
  facialHairMap,
  graphicsMap,
  hairMap,
  hatMap,
  mouthsMap,
  theme,
} from '@bigheads/core'
import { mkdirSync, rmSync, writeFileSync } from 'fs'
// import mersenne from 'mersenne'
import * as jsdom from 'jsdom'
import { dirname, join } from 'path'
import React from 'react'
import { render } from 'react-dom'
import { fileURLToPath } from 'url'
import weighted from 'weighted'

type WeightedTrait<T> = { [key in keyof T]: number }

// const rand = () => mersenne.rand() / 32_768
// const rand = () => Math.random() / 32_768;
const rand = Math.random

const selectRandomTrait = <T extends Object>(_traitsMap: T) => (
  weightedTraitsMap: { [key in keyof T]: number },
) => {
  const items = Object.entries(weightedTraitsMap) as [keyof T, number][]
  const keys = items.map(([key]) => key)
  const weights = items.map(([_key, weight]) => weight)
  const keysWithUndefined = [...keys]
  const weightsWithWeightForUndefined = [...weights]

  const randomKey = weighted.select(
    keysWithUndefined,
    weightsWithWeightForUndefined,
    { rand },
  )

  return randomKey
}

const weightedHairMap: WeightedTrait<typeof hairMap> = {
  afro: 0.01,
  balding: 0.02,
  pixie: 0.02,
  bob: 0.03,
  bun: 0.05,
  buzz: 0.1,
  long: 0.1,
  none: 0.1,
  short: 0.1,
}

const weightedHatMap: WeightedTrait<typeof hatMap> = {
  beanie: 0.01,
  turban: 0.02,
  none: 0.1,
  none2: 0.1,
  none3: 0.1,
  none4: 0.1,
  none5: 0.1,
}

const weightedMouthsMapTrait: WeightedTrait<typeof mouthsMap> = {
  grin: 0.01,
  open: 0.02,
  lips: 0.05,
  openSmile: 0.1,
  sad: 0.1,
  serious: 0.1,
  tongue: 0.1,
}

const clothingMapTrait: WeightedTrait<typeof clothingMap> = {
  naked: 0.01,
  tankTop: 0.02,
  shirt: 0.05,
  dress: 0.1,
  dressShirt: 0.1,
  vneck: 0.1,
}

const graphicsTrait: WeightedTrait<typeof graphicsMap> = {
  redwood: 0.01,
  gatsby: 0.02,
  graphQL: 0.1,
  vue: 0.1,
  react: 0.2,
  none: 0.5,
}

const bodyMapType: WeightedTrait<typeof bodyMap> = {
  breasts: 0.1,
  chest: 0.1,
}

const weightedFacialHairTrait: WeightedTrait<typeof facialHairMap> = {
  mediumBeard: 0.01,
  stubble: 0.02,
  none: 0.1,
  none2: 0.1,
  none3: 0.1,
}

const weightedAccessoryTrait: WeightedTrait<typeof accessoryMap> = {
  tinyGlasses: 0.01,
  shades: 0.02,
  roundGlasses: 0.1,
  none: 0.5,
}

const weightedEyesTrait: WeightedTrait<typeof eyesMap> = {
  heart: 0.01,
  squint: 0.02,
  dizzy: 0.03,
  leftTwitch: 0.05,
  happy: 0.1,
  content: 0.1,
  wink: 0.1,
  simple: 0.2,
  normal: 0.5,
}

const weightedEyebrowsTrait: WeightedTrait<typeof eyebrowsMap> = {
  leftLowered: 0.01,
  angry: 0.02,
  concerned: 0.03,
  serious: 0.3,
  raised: 0.5,
}

const weightedSkinTrait: WeightedTrait<typeof theme.colors.skin> = {
  red: 0.001,
  black: 0.01,
  dark: 0.02,
  brown: 0.05,
  light: 0.1,
  yellow: 0.5,
}

const weightedHairColorMap: WeightedTrait<typeof theme.colors.hair> = {
  white: 0.01,
  pink: 0.02,
  blue: 0.02,
  orange: 0.2,
  black: 0.2,
  blonde: 0.2,
  brown: 0.2,
}

const weightedClothingColorMap: WeightedTrait<typeof theme.colors.clothing> = {
  white: 0.01,
  black: 0.1,
  green: 0.1,
  red: 0.1,
  blue: 0.5,
}

const weightedBgColorMap: WeightedTrait<typeof theme.colors.bgColors> = {
  blue: 0.1,
}

const weightedLipColorMap: WeightedTrait<typeof theme.colors.lipColors> = {
  green: 0.01,
  turqoise: 0.02,
  pink: 0.1,
  purple: 0.2,
  red: 0.5,
}

const generateNewRandomTraits = (): AvatarProps => {
  const skinTone = selectRandomTrait(theme.colors.skin)(weightedSkinTrait)
  const eyes = selectRandomTrait(eyesMap)(weightedEyesTrait)
  const eyebrows = selectRandomTrait(eyebrowsMap)(weightedEyebrowsTrait)
  const mouth = selectRandomTrait(mouthsMap)(weightedMouthsMapTrait)
  const hair = selectRandomTrait(hairMap)(weightedHairMap)
  const facialHair = selectRandomTrait(facialHairMap)(weightedFacialHairTrait)
  const clothing = selectRandomTrait(clothingMap)(clothingMapTrait)
  const accessory = selectRandomTrait(accessoryMap)(weightedAccessoryTrait)
  const graphic = selectRandomTrait(graphicsMap)(graphicsTrait)
  const hat = selectRandomTrait(hatMap)(weightedHatMap)
  const body = selectRandomTrait(bodyMap)(bodyMapType)

  const hairColor = selectRandomTrait(theme.colors.hair)(weightedHairColorMap)
  const clothingColor = selectRandomTrait(theme.colors.clothing)(
    weightedClothingColorMap,
  )
  const circleColor = selectRandomTrait(theme.colors.bgColors)(
    weightedBgColorMap,
  )
  const lipColor = selectRandomTrait(theme.colors.lipColors)(
    weightedLipColorMap,
  )
  const hatColor = selectRandomTrait(theme.colors.clothing)(
    weightedClothingColorMap,
  )
  const faceMaskColor = selectRandomTrait(theme.colors.clothing)(
    weightedClothingColorMap,
  )

  const mask =
    selectRandomTrait({
      true: true,
      false: false,
    })({
      false: 100,
      true: 1,
    }) === 'true'
  // const mask = true;
  const faceMask =
    selectRandomTrait({
      true: true,
      false: false,
    })({
      false: 1000,
      true: 1,
    }) === 'true'
  const lashes =
    selectRandomTrait({
      true: true,
      false: false,
    })({
      false: 1,
      true: 1,
    }) === 'true'

  return {
    skinTone,
    eyes,
    eyebrows,
    mouth,
    hair,
    facialHair,
    clothing,
    accessory,
    graphic,
    hat,
    body,
    hairColor,
    clothingColor,
    circleColor,
    lipColor,
    hatColor,
    faceMaskColor,
    mask,
    faceMask,
    lashes,
  }
}

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

const generatedCombinations: { [key: string]: true } = {}
const generatedTraitsStatistics: GeneratedTraits = {
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
}
let duplicatesCount = 0

export const generateUniqueTraits = () => {
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

// const bigHeadsCount = 10_000;
const bigHeadsCount = 100

const generateRandomUniqueTraits = () =>
  new Array(bigHeadsCount).fill(null).map(() => generateUniqueTraits())

const dom = new jsdom.JSDOM("<html><body><div id='root'></div></body></html>")
;(global as any).window = dom.window

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '../../')
const generatedDirPath = join(rootDir, 'src', 'bigheads', 'generated')

const generateBigHeads = () => {
  rmSync(generatedDirPath, { recursive: true, force: false })
  mkdirSync(generatedDirPath)

  const traits = generateRandomUniqueTraits()
  const traitsPerGenerateFile: { [key: string]: AvatarProps } = {}

  traits.forEach((bigHeadTraits, index) => {
    const container = dom.window.document.getElementById('root')
    const bigHead = React.createElement(BigHead, bigHeadTraits)
    render(bigHead, container)
    const fileName = `bighead_${index}.svg`
    const path = join(generatedDirPath, fileName)
    writeFileSync(path, container!.innerHTML, { flag: 'w' })
    traitsPerGenerateFile[fileName] = bigHeadTraits

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
  })

  return traitsPerGenerateFile
}

const traits = generateBigHeads()
const traitsFilePath = join(generatedDirPath, `_traits.json`)
writeFileSync(traitsFilePath, JSON.stringify(traits, undefined, 2))
const statisticsFilePath = join(generatedDirPath, `_statistics.json`)
writeFileSync(
  statisticsFilePath,
  JSON.stringify(generatedTraitsStatistics, undefined, 2),
)
