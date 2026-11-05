import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { TranslationService } from './services/translation-service/translation.service';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        {
          provide: TranslationService,
          useValue: {
            currentLocale: 'en',
            translate: (key: string) => (
              key === 'app.title' ? 'Transmit an image through noise' : key
            )
          }
        }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the image transmission workspace', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Transmit an image through noise');
    expect(compiled.querySelector('input[type="file"]')).toBeTruthy();
    expect(compiled.querySelector('#codec')).toBeTruthy();
  });
});
