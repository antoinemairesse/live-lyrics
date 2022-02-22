import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {LyricsService} from '../lyrics.service';
import {interval, Subscription} from 'rxjs';

@Component({
  selector: 'app-artist-carousel',
  templateUrl: './artist-carousel.component.html',
  styleUrls: ['./artist-carousel.component.scss']
})
export class ArtistCarouselComponent implements OnInit {
  Ly = new LyricsService(this.http, this.activatedRoute);
  private subscription: Subscription;
  related = [];
  i = 0;
  filled = false;

  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute) {
    const source = interval(1000);
    this.subscription = source.subscribe(() => {
      this.Ly.getRelatedArtists();
      if (this.Ly.RelatedArtists != null) {
        this.related = [];
        this.filled = false;
        this.related.push(this.Ly.RelatedArtists);
        this.filled = true;
      }
    });
  }

  ngOnInit(): void {

  }

  next(): void {
    if (this.i + 1 < this.related[0].length){
      this.i++;
    }
  }

  previous(): void {
    if (this.i > 0){
      this.i--;
    }
  }

}
