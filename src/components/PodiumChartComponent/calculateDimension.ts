import { fontSizes } from '../../../global-class';

export type TRecalculateDimensions = {
  screenWidth: number;
  screenHeight: number;
  svgWidth: number;
};

export type TDimentions = {
  newWidth: number;
  newHeight: number;

  rectWidth: number;
  rectHeight: number;
};

export type TRectDimentions = {
  rectY: number;
  rectX: number;

  polygonX1: number;
  polygonX2: number;
  polygonX3: number;
  polygonX4: number;

  polygonY1: number;
  polygonY2: number;
  polygonY3: number;
  polygonY4: number;

  positionTextX: number;
  positionTextY: number;
  positionFontSize: number;

  informationContainerWidth: number;
  informationContainerX: number;
  informationContainerY: number;

  profilePictureWidth: number;
  profilePictureHeight: number;
  profilePictureX: number;
  profilePictureY: number;

  profileFlagWidth: number;
  profileFlagHeight: number;
  profileFlagX: number;
  profileFlagY: number;

  userNameWidth: number;
  userNameHeight: number;
  userNameSvgWidth: number;
  userNameX: number;
  userNameY: number;
  userNameFontSize: number;

  pointsTextWidth: number;
  pointsTextHeight: number;
  poinstTextSvgWidth: number;
  pointsTextX: number;
  pointsTextY: number;
  pointsTextFontSize: number;
};

export type TPictures = {
  width: number;
  height: number;
}

export type TFullDimentions = {
  dimentions: TDimentions,
  reacts: TRectDimentions[]
}

export type TDisplay = {
  dimentions: TFullDimentions;
  display: boolean;
};

const screenDimensions: Record<string, { width: number; height: number }> = {
  '480p': {
    width: 540.8450776871839,
    height: 787.6056443819616,
  },
  '720p': {
    width: 540.8450413639423,
    height: 937.4647383641666,
  },
  '1080p': {
    width: 540,
    height: 936,
  },
  '2040p': {
    width: 411.42857142857144,
    height: 914.2857142857143,
  },
};


export function recalculateDimension(params: TRecalculateDimensions): TDisplay {
  const { screenWidth, screenHeight, svgWidth } = params;

  console.log(screenWidth, screenHeight);

  if (
    screenDimensions['480p'].width === screenWidth &&
    screenDimensions['480p'].height === screenHeight
  ) {
    console.log('480pV', svgWidth);

    const newDimentions: TDimentions = {
      newWidth: screenWidth,
      newHeight: screenHeight * 0.6,
      rectWidth: svgWidth / 9,
      rectHeight: screenHeight * 0.15,
    };

    const { rectWidth, rectHeight } = newDimentions;

    const profilePicture: TPictures = {
      width: 50,
      height: 50,
    };

    const profileFlag: TPictures = {
      width: 20,
      height: 20,
    };

    const rect1: TRectDimentions = {
      rectX: 0,
      rectY: rectHeight * 0.15,

      polygonX1: 0,
      polygonX2: rectWidth,
      polygonX3: rectWidth,
      polygonX4: rectWidth * 0.1,

      polygonY1: rectHeight * 0.4,
      polygonY2: rectHeight * 0.4,
      polygonY3: rectHeight * 0.36,
      polygonY4: rectHeight * 0.36,

      positionTextX: rectWidth * 0.5,
      positionTextY: rectHeight * 0.85,
      positionFontSize: rectWidth,

      informationContainerWidth: rectWidth * 2,
      informationContainerX: 0,
      informationContainerY: -(rectHeight * 0.25),

      profilePictureWidth: profilePicture.width,
      profilePictureHeight: profilePicture.height,
      profilePictureX: profilePicture.width * 0,
      profilePictureY: profilePicture.height * 0,

      profileFlagWidth: profileFlag.width,
      profileFlagHeight: profileFlag.height,
      profileFlagX: profilePicture.width * 0.85,
      profileFlagY: profilePicture.height * 0.6,

      userNameWidth: rectWidth * 0.8,
      userNameHeight: rectHeight * 0.1,
      userNameSvgWidth: rectWidth * 2,
      userNameX: 0,
      userNameY: 0,
      userNameFontSize: rectWidth * 0.12,

      pointsTextWidth: rectWidth * 0.8,
      pointsTextHeight: rectHeight * 0.15,
      poinstTextSvgWidth: rectWidth * 2,
      pointsTextX: rectWidth * 0.1,
      pointsTextY: 0,
      pointsTextFontSize: rectWidth * 0.1,
    };

    const rect2: TRectDimentions = {
      rectX: rectWidth,
      rectY: rectHeight * 0.1,

      polygonX1: 0,
      polygonX2: 0,
      polygonX3: 0,
      polygonX4: 0,

      polygonY1: 0,
      polygonY2: 0,
      polygonY3: 0,
      polygonY4: 0,

      positionTextX: 0,
      positionTextY: 0,
      positionFontSize: 0,

      informationContainerWidth: 0,
      informationContainerX: 0,
      informationContainerY: 0,

      profilePictureWidth: profilePicture.width,
      profilePictureHeight: profilePicture.height,
      profilePictureX: profilePicture.width * 0,
      profilePictureY: profilePicture.height * 0,

      profileFlagWidth: profileFlag.width,
      profileFlagHeight: profileFlag.height,
      profileFlagX: profilePicture.width * 0.55,
      profileFlagY: profilePicture.height * 0.65,

      userNameWidth: 0,
      userNameHeight: 0,
      userNameSvgWidth: 0,
      userNameX: 0,
      userNameY: 0,
      userNameFontSize: 0,

      pointsTextWidth: 0,
      pointsTextHeight: 0,
      poinstTextSvgWidth: 0,
      pointsTextX: 0,
      pointsTextY: 0,
      pointsTextFontSize: 0,
    };

    const rect3: TRectDimentions = {
      rectX: rectWidth * 2,
      rectY: rectHeight * 0.2,

      polygonX1: rectWidth * 2,
      polygonX2: rectWidth * 2,
      polygonX3: rectWidth * 3,
      polygonX4: rectWidth * 2.9,

      polygonY1: rectHeight * 0.15,
      polygonY2: rectHeight * 0.2,
      polygonY3: rectHeight * 0.2,
      polygonY4: rectHeight * 0.15,

      positionTextX: rectWidth * 0.5,
      positionTextY: rectHeight * 0.85,
      positionFontSize: rectWidth,

      informationContainerWidth: rectWidth * 2,
      informationContainerX: 0,
      informationContainerY: -(rectHeight * 0.25),

      profilePictureWidth: profilePicture.width,
      profilePictureHeight: profilePicture.height,
      profilePictureX: profilePicture.width * 0,
      profilePictureY: profilePicture.height * 0,

      profileFlagWidth: profileFlag.width,
      profileFlagHeight: profileFlag.height,
      profileFlagX: profilePicture.width * 0.85,
      profileFlagY: profilePicture.height * 0.6,

      userNameWidth: rectWidth * 0.8,
      userNameHeight: rectHeight * 0.1,
      userNameSvgWidth: rectWidth * 2,
      userNameX: 0,
      userNameY: 0,
      userNameFontSize: rectWidth * 0.12,

      pointsTextWidth: rectWidth * 0.8,
      pointsTextHeight: rectHeight * 0.15,
      poinstTextSvgWidth: rectWidth * 2,
      pointsTextX: rectWidth * 0.1,
      pointsTextY: 0,
      pointsTextFontSize: rectWidth * 0.1,
    };

    const reacts: TRectDimentions[] = [rect1, rect2, rect3];
    const dimentions: TFullDimentions = { dimentions: newDimentions, reacts };
    return { dimentions, display: false };
  }

  if (
    screenDimensions['720p'].width === screenWidth &&
    screenDimensions['720p'].height === screenHeight
  ) {
    console.log('720pV', svgWidth);

    const newDimentions: TDimentions = {
      newWidth: screenWidth,
      newHeight: screenHeight * 0.6,
      rectWidth: svgWidth / 6,
      rectHeight: screenHeight * 0.15,
    };

    const { rectWidth, rectHeight } = newDimentions;

    const profilePicture: TPictures = {
      width: 50,
      height: 50,
    };

    const profileFlag: TPictures = {
      width: 20,
      height: 20,
    };

    const rect1: TRectDimentions = {
      rectX: 0,
      rectY: rectHeight * 0.4,

      polygonX1: 0,
      polygonX2: rectWidth,
      polygonX3: rectWidth,
      polygonX4: rectWidth * 0.1,

      polygonY1: rectHeight * 0.4,
      polygonY2: rectHeight * 0.4,
      polygonY3: rectHeight * 0.36,
      polygonY4: rectHeight * 0.36,

      positionTextX: rectWidth * 0.5,
      positionTextY: rectHeight * 0.85,
      positionFontSize: rectWidth,

      informationContainerWidth: rectWidth * 2,
      informationContainerX: 0,
      informationContainerY: -(rectHeight * 0.25),

      profilePictureWidth: profilePicture.width,
      profilePictureHeight: profilePicture.height,
      profilePictureX: profilePicture.width * 0,
      profilePictureY: profilePicture.height * 0,

      profileFlagWidth: profileFlag.width,
      profileFlagHeight: profileFlag.height,
      profileFlagX: profilePicture.width * 0.85,
      profileFlagY: profilePicture.height * 0.6,

      userNameWidth: rectWidth * 0.8,
      userNameHeight: rectHeight * 0.1,
      userNameSvgWidth: rectWidth * 2,
      userNameX: 0,
      userNameY: 0,
      userNameFontSize: rectWidth * 0.12,

      pointsTextWidth: rectWidth * 0.8,
      pointsTextHeight: rectHeight * 0.15,
      poinstTextSvgWidth: rectWidth * 2,
      pointsTextX: rectWidth * 0.1,
      pointsTextY: 0,
      pointsTextFontSize: rectWidth * 0.1,
    };

    const rect2: TRectDimentions = {
      rectX: rectWidth,
      rectY: rectHeight * 0.3,

      polygonX1: rectWidth * 1.08,
      polygonX2: rectWidth * 1.9,
      polygonX3: rectWidth * 2,
      polygonX4: rectWidth,

      polygonY1: rectHeight * 0.26,
      polygonY2: rectHeight * 0.26,
      polygonY3: rectHeight * 0.3,
      polygonY4: rectHeight * 0.3,

      positionTextX: rectWidth * 1.5,
      positionTextY: rectHeight * 0.75,
      positionFontSize: rectWidth,

      informationContainerWidth: rectWidth * 1.9,
      informationContainerX: rectWidth * 2,
      informationContainerY: -(rectHeight * 0.45),

      profilePictureWidth: profilePicture.width,
      profilePictureHeight: profilePicture.height,
      profilePictureX: profilePicture.width * 0,
      profilePictureY: profilePicture.height * 0,

      profileFlagWidth: profileFlag.width,
      profileFlagHeight: profileFlag.height,
      profileFlagX: profilePicture.width * 0.8,
      profileFlagY: profilePicture.height * 0.65,

      userNameWidth: rectWidth * 0.8,
      userNameHeight: rectHeight * 0.1,
      userNameSvgWidth: rectWidth * 2,
      userNameX: 0,
      userNameY: 0,
      userNameFontSize: rectWidth * 0.12,

      pointsTextWidth: rectWidth * 0.8,
      pointsTextHeight: rectHeight * 0.15,
      poinstTextSvgWidth: rectWidth * 2,
      pointsTextX: rectWidth * 0.1,
      pointsTextY: 0,
      pointsTextFontSize: rectWidth * 0.1,
    };

    const rect3: TRectDimentions = {
      rectX: rectWidth * 2,
      rectY: rectHeight * 0.4,

      polygonX1: rectWidth * 2,
      polygonX2: rectWidth * 2.9,
      polygonX3: rectWidth * 3,
      polygonX4: rectWidth * 2,

      polygonY1: rectHeight * 0.36,
      polygonY2: rectHeight * 0.36,
      polygonY3: rectHeight * 0.4,
      polygonY4: rectHeight * 0.4,

      positionTextX: rectWidth * 2.5,
      positionTextY: rectHeight * 0.85,
      positionFontSize: rectWidth,

      informationContainerWidth: rectWidth * 2,
      informationContainerX: rectWidth * 3.9,
      informationContainerY: -(rectHeight * 0.25),

      profilePictureWidth: profilePicture.width,
      profilePictureHeight: profilePicture.height,
      profilePictureX: profilePicture.width * 0,
      profilePictureY: profilePicture.height * 0,

      profileFlagWidth: profileFlag.width,
      profileFlagHeight: profileFlag.height,
      profileFlagX: profilePicture.width * 0.55,
      profileFlagY: profilePicture.height * 0.65,

      userNameWidth: rectWidth * 0.8,
      userNameHeight: rectHeight * 0.1,
      userNameSvgWidth: rectWidth * 2,
      userNameX: 0,
      userNameY: 0,
      userNameFontSize: rectWidth * 0.1,

      pointsTextWidth: rectWidth * 0.8,
      pointsTextHeight: rectHeight * 0.15,
      poinstTextSvgWidth: rectWidth * 2,
      pointsTextX: rectWidth * 0.1,
      pointsTextY: 0,
      pointsTextFontSize: rectWidth * 0.1,
    };

    const reacts: TRectDimentions[] = [rect1, rect2, rect3];
    const dimentions: TFullDimentions = { dimentions: newDimentions, reacts };
    return { dimentions, display: true };
  }

  if (
    screenDimensions['1080p'].width === screenWidth &&
    screenDimensions['1080p'].height === screenHeight
  ) {
    console.log('1080pV', svgWidth);

    const newDimentions: TDimentions = {
      newWidth: screenWidth,
      newHeight: screenHeight * 0.6,
      rectWidth: svgWidth / 4,
      rectHeight: screenHeight * 0.25,
    };

    const { rectWidth, rectHeight } = newDimentions;

    const profilePicture: TPictures = {
      width: 50,
      height: 50,
    };

    const profileFlag: TPictures = {
      width: 20,
      height: 20,
    };

    const rect1: TRectDimentions = {
      rectX: 0,
      rectY: screenHeight * 0.08,

      polygonX1: 0,
      polygonX2: rectWidth,
      polygonX3: rectWidth,
      polygonX4: rectWidth * 0.1,

      polygonY1: rectHeight * 0.32,
      polygonY2: rectHeight * 0.32,
      polygonY3: rectHeight * 0.26,
      polygonY4: rectHeight * 0.26,

      positionTextX: rectWidth * 0.5,
      positionTextY: rectHeight * 0.69,
      positionFontSize: rectWidth * 0.9,

      informationContainerWidth: rectWidth * 1.31,
      informationContainerX: 0,
      informationContainerY: -(rectWidth * 0.53),

      profilePictureWidth: profilePicture.width,
      profilePictureHeight: profilePicture.height,
      profilePictureX: 0,
      profilePictureY: 0,

      profileFlagWidth: profileFlag.width,
      profileFlagHeight: profileFlag.height,
      profileFlagX: profilePicture.width * 0.85,
      profileFlagY: profilePicture.height * 0.65,

      userNameWidth: rectWidth * 0.6,
      userNameHeight: rectHeight * 0.1,
      userNameSvgWidth: rectWidth,
      userNameX: 0,
      userNameY: (rectHeight * 0.03),
      userNameFontSize: fontSizes.xxs,

      pointsTextWidth: rectWidth * 0.6,
      pointsTextHeight: rectHeight * 0.1,
      poinstTextSvgWidth: rectWidth,
      pointsTextX: rectWidth * 0.1,
      pointsTextY: rectWidth * 0.05,
      pointsTextFontSize: fontSizes.xxs,
    };

    const rect2: TRectDimentions = {
      rectX: rectWidth,
      rectY: screenHeight * 0.067,

      polygonX1: rectWidth * 1.06,
      polygonX2: rectWidth * 1.9,
      polygonX3: rectWidth * 2,
      polygonX4: rectWidth,

      polygonY1: rectHeight * 0.21,
      polygonY2: rectHeight * 0.21,
      polygonY3: rectHeight * 0.27,
      polygonY4: rectHeight * 0.27,

      positionTextX: rectWidth * 1.5,
      positionTextY: rectHeight * 0.67,
      positionFontSize: rectWidth,

      informationContainerWidth: rectWidth * 1.31,
      informationContainerX: rectWidth * 1.31,
      informationContainerY: -(rectWidth * 0.675),

      profilePictureWidth: profilePicture.width,
      profilePictureHeight: profilePicture.height,
      profilePictureX: 0,
      profilePictureY: 0,

      profileFlagWidth: profileFlag.width,
      profileFlagHeight: profileFlag.height,
      profileFlagX: profilePicture.width * 0.85,
      profileFlagY: profilePicture.height * 0.65,

      userNameWidth: rectWidth * 0.6,
      userNameHeight: rectHeight * 0.1,
      userNameSvgWidth: rectWidth,
      userNameX: 0,
      userNameY: (rectHeight * 0.03),
      userNameFontSize: fontSizes.xxs,

      pointsTextWidth: rectWidth * 0.6,
      pointsTextHeight: rectHeight * 0.1,
      poinstTextSvgWidth: rectWidth,
      pointsTextX: rectWidth * 0.1,
      pointsTextY: rectWidth * 0.05,
      pointsTextFontSize: fontSizes.xxs,
    };

    const rect3: TRectDimentions = {
      rectX: rectWidth * 2,
      rectY: screenHeight * 0.11,

      polygonX1: rectWidth * 2,
      polygonX2: rectWidth * 3,
      polygonX3: rectWidth * 2.9,
      polygonX4: rectWidth * 2,

      polygonY1: rectHeight * 0.44,
      polygonY2: rectHeight * 0.44,
      polygonY3: rectHeight * 0.38,
      polygonY4: rectHeight * 0.38,

      positionTextX: rectWidth * 2.5,
      positionTextY: rectHeight * 0.77,
      positionFontSize: rectWidth * 0.8,

      informationContainerWidth: rectWidth * 1.31,
      informationContainerX: rectWidth * 2.61,
      informationContainerY: -(rectWidth * 0.195),

      profilePictureWidth: profilePicture.width,
      profilePictureHeight: profilePicture.height,
      profilePictureX: 0,
      profilePictureY: 0,

      profileFlagWidth: profileFlag.width,
      profileFlagHeight: profileFlag.height,
      profileFlagX: profilePicture.width * 0.85,
      profileFlagY: profilePicture.height * 0.65,

      userNameWidth: rectWidth * 0.6,
      userNameHeight: rectHeight * 0.1,
      userNameSvgWidth: rectWidth,
      userNameX: 0,
      userNameY: (rectHeight * 0.03),
      userNameFontSize: fontSizes.xxs,

      pointsTextWidth: rectWidth * 0.6,
      pointsTextHeight: rectHeight * 0.1,
      poinstTextSvgWidth: rectWidth,
      pointsTextX: rectWidth * 0.1,
      pointsTextY: rectWidth * 0.05,
      pointsTextFontSize: fontSizes.xxs,
    };

    const reacts: TRectDimentions[] = [rect1, rect2, rect3];
    const dimentions: TFullDimentions = { dimentions: newDimentions, reacts };
    return { dimentions, display: true };
  }

  if (
    screenDimensions['2040p'].width === screenWidth &&
    screenDimensions['2040p'].height === screenHeight
  ) {
    console.log('2040pV', svgWidth);

    const newDimentions: TDimentions = {
      newWidth: screenWidth,
      newHeight: screenHeight * 0.6,
      rectWidth: svgWidth / 3,
      rectHeight: screenHeight * 0.25,
    };

    const { rectWidth, rectHeight } = newDimentions;

    const profilePicture: TPictures = {
      width: 50,
      height: 50,
    };

    const profileFlag: TPictures = {
      width: 20,
      height: 20,
    };

    const rect1: TRectDimentions = {
      rectX: 0,
      rectY: screenHeight * 0.15,

      polygonX1: 0,
      polygonX2: rectWidth,
      polygonX3: rectWidth,
      polygonX4: rectWidth * 0.1,

      polygonY1: rectHeight * 0.6,
      polygonY2: rectHeight * 0.6,
      polygonY3: rectHeight * 0.54,
      polygonY4: rectHeight * 0.54,

      positionTextX: rectWidth * 0.5,
      positionTextY: rectHeight * 1.05,
      positionFontSize: rectWidth,

      informationContainerWidth: rectWidth,
      informationContainerX: 0,
      informationContainerY: -(rectWidth * 0.2),

      profilePictureWidth: profilePicture.width,
      profilePictureHeight: profilePicture.height,
      profilePictureX: 0,
      profilePictureY: 0,

      profileFlagWidth: profileFlag.width,
      profileFlagHeight: profileFlag.height,
      profileFlagX: profilePicture.width * 0.55,
      profileFlagY: profilePicture.height * 0.65,

      userNameWidth: rectWidth,
      userNameHeight: rectHeight * 0.15,
      userNameSvgWidth: rectWidth * 1.2,
      userNameX: 0,
      userNameY: rectHeight * 0.1,
      userNameFontSize: fontSizes.xs,

      pointsTextWidth: rectWidth * 0.8,
      pointsTextHeight: rectHeight * 0.12,
      poinstTextSvgWidth: rectWidth,
      pointsTextX: rectWidth * 0.1,
      pointsTextY: rectWidth * 0.05,
      pointsTextFontSize: fontSizes.xs,
    };

    const rect2: TRectDimentions = {
      rectX: rectWidth,
      rectY: screenHeight * 0.11,

      polygonX1: rectWidth,
      polygonX2: rectWidth * 2,
      polygonX3: rectWidth * 1.9,
      polygonX4: rectWidth * 1.1,

      polygonY1: rectHeight * 0.44,
      polygonY2: rectHeight * 0.44,
      polygonY3: rectHeight * 0.38,
      polygonY4: rectHeight * 0.38,

      positionTextX: rectWidth * 1.5,
      positionTextY: (screenHeight * 0.11) * 2.05,
      positionFontSize: rectWidth,

      informationContainerWidth: rectWidth,
      informationContainerX: rectWidth,
      informationContainerY: -(rectWidth * 0.58),

      profilePictureWidth: profilePicture.width,
      profilePictureHeight: profilePicture.height,
      profilePictureX: profilePicture.width * 0,
      profilePictureY: profilePicture.height * 0,

      profileFlagWidth: profileFlag.width,
      profileFlagHeight: profileFlag.height,
      profileFlagX: profilePicture.width * 0.55,
      profileFlagY: profilePicture.height * 0.65,

      userNameWidth: rectWidth,
      userNameHeight: rectHeight * 0.15,
      userNameSvgWidth: rectWidth * 1.2,
      userNameX: 0,
      userNameY: rectHeight * 0.1,
      userNameFontSize: fontSizes.xs,

      pointsTextWidth: rectWidth * 0.8,
      pointsTextHeight: rectHeight * 0.12,
      poinstTextSvgWidth: rectWidth,
      pointsTextX: rectWidth * 0.1,
      pointsTextY: rectWidth * 0.05,
      pointsTextFontSize: fontSizes.xs,
    };

    const rect3: TRectDimentions = {
      rectX: rectWidth * 2,
      rectY: screenHeight * 0.19,

      polygonX1: rectWidth * 2,
      polygonX2: rectWidth * 3,
      polygonX3: rectWidth * 2.9,
      polygonX4: rectWidth * 2,

      polygonY1: rectHeight * 0.76,
      polygonY2: rectHeight * 0.76,
      polygonY3: rectHeight * 0.70,
      polygonY4: rectHeight * 0.70,

      positionTextX: rectWidth * 2.5,
      positionTextY: rectHeight * 1.2,
      positionFontSize: rectWidth,

      informationContainerWidth: rectWidth,
      informationContainerX: rectWidth * 2,
      informationContainerY: rectWidth * 0.1,

      profilePictureWidth: profilePicture.width,
      profilePictureHeight: profilePicture.height,
      profilePictureX: profilePicture.width * 0,
      profilePictureY: profilePicture.height * 0,

      profileFlagWidth: profileFlag.width,
      profileFlagHeight: profileFlag.height,
      profileFlagX: profilePicture.width * 0.55,
      profileFlagY: profilePicture.height * 0.65,

      userNameWidth: rectWidth,
      userNameHeight: rectHeight * 0.15,
      userNameSvgWidth: rectWidth * 1.2,
      userNameX: 0,
      userNameY: rectHeight * 0.1,
      userNameFontSize: fontSizes.xs,

      pointsTextWidth: rectWidth * 0.8,
      pointsTextHeight: rectHeight * 0.12,
      poinstTextSvgWidth: rectWidth,
      pointsTextX: rectWidth * 0.1,
      pointsTextY: rectWidth * 0.05,
      pointsTextFontSize: fontSizes.xs,
    };

    const reacts: TRectDimentions[] = [rect1, rect2, rect3];
    const dimentions: TFullDimentions = { dimentions: newDimentions, reacts };
    return { dimentions, display: true };
  }

  const dimentions: TFullDimentions = { dimentions: null, reacts: [] };
  return { dimentions, display: false };
}
