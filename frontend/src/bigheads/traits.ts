import {
  accessoryMap,
  AvatarProps,
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
import weighted from 'weighted'

type WeightedTrait<T> = { [key in keyof T]: number }

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
  naked: 0.001,
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
  red: 0.01,
  black: 0.02,
  dark: 0.03,
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

const booleanTrait = {
  yes: true,
  no: false,
}

const weightedMaskTraitMap = {
  yes: 1,
  no: 0.001,
}

const weightedFaceMaskTraitMap = {
  yes: 0.001,
  no: 1,
}

const weightedLashesTraitMap = {
  yes: 1,
  no: 100,
}

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

export const generateNewRandomTraits = (): AvatarProps => {
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

  const mask = selectRandomTrait(booleanTrait)(weightedMaskTraitMap) === 'yes'
  const faceMask =
    selectRandomTrait(booleanTrait)(weightedFaceMaskTraitMap) === 'yes'
  const lashes =
    selectRandomTrait(booleanTrait)(weightedLashesTraitMap) === 'yes'

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
