export interface CodecDescriptor {
  id: string;
  name: string;
  description: string;
}

export interface NoiseModelDescriptor {
  id: string;
  name: string;
  description: string;
}

export interface SimulationConfiguration {
  codec: string;
  noiseModel: string;
  errorProbability: number;
  burstLength: number;
  burstCount: number;
  randomSeed: number | null;
}

export interface SimulationMetrics {
  originalBitCount: number;
  transmittedBitCount: number;
  redundantBitCount: number;
  incorrectPixelPercentage: number;
  meanAbsoluteBrightnessError: number;
}

export interface SimulationResult {
  id: string;
  status: string;
  originalImageUrl: string;
  uncorrectedImageUrl: string;
  decodedImageUrl: string;
  metrics: SimulationMetrics;
  detectedUncorrectableBlocks: number[];
}

export interface ExperimentRequest {
  fileName: string;
  codecs: string[];
  noiseModels: string[];
  errorProbabilities: number[];
  randomSeeds: number[];
}

export interface ExperimentResult {
  id: string;
  status: string;
  results: SimulationResult[];
}

export interface ImageUploadResult {
  id: string;
  width: number;
  height: number;
  grayscaleImageUrl: string;
}

export interface ExportDescriptor {
  id: string;
  format: string;
  downloadUrl: string;
}
