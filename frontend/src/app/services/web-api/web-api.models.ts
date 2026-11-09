export const TRANSMISSION_CODECS = {
  uncoded: 'uncoded',
  hamming74: 'hamming74',
  extendedHamming84: 'extended-hamming84',
  bch: 'bch'
} as const;

export const NOISE_MODELS = {
  independent: 'independent',
  burst: 'burst'
} as const;

export const EXPORT_FORMATS = {
  json: 'json',
  csv: 'csv',
  png: 'png'
} as const;

export type ErrorStatus = 'corrected' | 'uncorrectable' | 'undetected';

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
  imageId?: string | null;
}

export interface SimulationRequest {
  fileName: string;
  contentType: string;
  fileSize: number;
  imageId: string | null;
  configuration: SimulationConfiguration;
}

export interface SimulationMetrics {
  originalBitCount: number;
  transmittedBitCount: number;
  redundantBitCount: number;
  incorrectPixelPercentage: number;
  meanAbsoluteBrightnessError: number;
  codingOverheadPercentage: number;
  correctedBlockCount: number;
  uncorrectableBlockCount: number;
}

export interface ErrorRegion {
  blockIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  status: ErrorStatus;
}

export interface SimulationResult {
  id: string;
  status: string;
  originalImageUrl: string;
  uncorrectedImageUrl: string;
  decodedImageUrl: string;
  metrics: SimulationMetrics;
  detectedUncorrectableBlocks: number[];
  errorRegions: ErrorRegion[];
}

export interface ExperimentRequest {
  fileName: string;
  codecs: string[];
  noiseModels: string[];
  errorProbabilities: number[];
  randomSeeds: number[];
  burstLength: number;
  burstCount: number;
  imageId: string | null;
}

export interface ExperimentResultRow {
  codec: string;
  noiseModel: string;
  errorProbability: number;
  randomSeed: number | null;
  metrics: SimulationMetrics;
  simulationId: string;
  decodedImageUrl: string;
}

export interface ExperimentResult {
  id: string;
  status: string;
  results: SimulationResult[];
  rows: ExperimentResultRow[];
}

export interface ImageUploadResult {
  id: string;
  width: number;
  height: number;
  grayscaleImageUrl: string;
  contentType: string;
}

export interface ExportRequest {
  format: string;
  asset: 'report' | 'original' | 'uncorrected' | 'decoded';
}

export interface ExportDescriptor {
  id: string;
  format: string;
  downloadUrl: string;
  contentType: string;
  fileName: string | null;
}
