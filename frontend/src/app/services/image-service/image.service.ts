import { Service, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { WebApiService } from '../web-api/web-api.service';

export interface GrayscaleImage {
  id: string;
  url: string;
  width: number;
  height: number;
}

@Service()
export class ImageService {
  private readonly api = inject(WebApiService);

  async uploadAndGetGrayscale(image: File): Promise<GrayscaleImage> {
    const uploaded = await firstValueFrom(this.api.uploadImage(image));
    const content = await firstValueFrom(this.api.getGrayscaleImage(uploaded.id));
    return {
      id: uploaded.id,
      url: URL.createObjectURL(content),
      width: uploaded.width,
      height: uploaded.height
    };
  }
}
