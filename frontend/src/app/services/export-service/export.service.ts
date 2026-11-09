import { Service, inject } from '@angular/core';
import { ExportRequest } from '../web-api/web-api.models';
import { WebApiService } from '../web-api/web-api.service';

@Service()
export class ExportService {
  private readonly api = inject(WebApiService);

  create(simulationId: string, request: ExportRequest) {
    return this.api.createExport(simulationId, request);
  }

  download(exportId: string) {
    return this.api.downloadExport(exportId);
  }
}
