import { Service, inject } from '@angular/core';
import { ExperimentRequest } from '../web-api/web-api.models';
import { WebApiService } from '../web-api/web-api.service';

@Service()
export class ExperimentService {
  private readonly api = inject(WebApiService);

  run(request: ExperimentRequest) {
    return this.api.runExperiment(request);
  }

  getResult(id: string) {
    return this.api.getExperiment(id);
  }
}
