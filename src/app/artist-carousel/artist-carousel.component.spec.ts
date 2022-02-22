import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistCarouselComponent } from './artist-carousel.component';

describe('ArtistCarouselComponent', () => {
  let component: ArtistCarouselComponent;
  let fixture: ComponentFixture<ArtistCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArtistCarouselComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtistCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
