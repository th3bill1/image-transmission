import { Service, inject } from '@angular/core';
import { WebApiService } from '../web-api/web-api.service';

@Service()
export class ExportService {
  private readonly api = inject(WebApiService);

  create(simulationId: string, format: string) {
    return this.api.createExport(simulationId, format);
  }

  download(exportId: string) {
    return this.api.downloadExport(exportId);
  }
}
