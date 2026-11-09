import { Service, inject } from '@angular/core';
import { WebApiService } from '../web-api/web-api.service';
import { SimulationConfiguration } from '../web-api/web-api.models';

@Service()
export class SimulationService {
  private readonly api = inject(WebApiService);

  run(image: File, configuration: SimulationConfiguration) {
    return this.api.runSimulation(image, configuration);
  }

  getResult(id: string) {
    return this.api.getSimulation(id);
  }
}
