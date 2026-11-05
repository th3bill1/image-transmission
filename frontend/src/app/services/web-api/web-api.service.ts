import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import {
  CodecDescriptor,
  ExperimentRequest,
  ExperimentResult,
  ExportDescriptor,
  ImageUploadResult,
  NoiseModelDescriptor,
  SimulationResult
} from './web-api.models';

@Service()
export class WebApiService {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = '/api';

  getCodecs() {
    return this.http.get<CodecDescriptor[]>(`${this.baseUrl}/catalog/codecs`);
  }

  getNoiseModels() {
    return this.http.get<NoiseModelDescriptor[]>(`${this.baseUrl}/catalog/noise-models`);
  }

  getTranslations(locale: string) {
    return this.http.get<Record<string, string>>(`${this.baseUrl}/translations/${locale}`);
  }

  uploadImage(image: File) {
    const form = new FormData();
    form.append('image', image);
    return this.http.post<ImageUploadResult>(`${this.baseUrl}/images/grayscale`, form);
  }

  getGrayscaleImage(id: string) {
    return this.http.get(`${this.baseUrl}/images/${id}/grayscale`, {
      responseType: 'blob'
    });
  }

  runSimulation(
    image: File,
    configuration: {
      codec: string;
      noiseModel: string;
      errorProbability: number;
      burstLength: number;
      burstCount: number;
      randomSeed: number | null;
    }
  ) {
    const form = new FormData();
    form.append('image', image);
    form.append('codec', configuration.codec);
    form.append('noiseModel', configuration.noiseModel);
    form.append('errorProbability', String(configuration.errorProbability));
    form.append('burstLength', String(configuration.burstLength));
    form.append('burstCount', String(configuration.burstCount));
    if (configuration.randomSeed !== null) {
      form.append('randomSeed', String(configuration.randomSeed));
    }
    return this.http.post<SimulationResult>(`${this.baseUrl}/simulations`, form);
  }

  getSimulation(id: string) {
    return this.http.get<SimulationResult>(`${this.baseUrl}/simulations/${id}`);
  }

  runExperiment(request: ExperimentRequest) {
    return this.http.post<ExperimentResult>(`${this.baseUrl}/experiments`, request);
  }

  getExperiment(id: string) {
    return this.http.get<ExperimentResult>(`${this.baseUrl}/experiments/${id}`);
  }

  createExport(simulationId: string, format: string) {
    return this.http.post<ExportDescriptor>(
      `${this.baseUrl}/simulations/${simulationId}/exports`,
      { format }
    );
  }

  downloadExport(exportId: string) {
    return this.http.get(`${this.baseUrl}/exports/${exportId}/download`, {
      responseType: 'blob'
    });
  }
}
