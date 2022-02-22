import {Component} from '@angular/core';
import {LyricsService} from '../lyrics.service';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {interval, Subscription} from 'rxjs';

@Component({
  selector: 'app-lyrics',
  templateUrl: './lyrics.component.html',
  styleUrls: ['./lyrics.component.scss']
})
export class LyricsComponent {
  private subscription: Subscription;
  sliderValue = localStorage.getItem('volume');
  songProgress = 0;
  playing = true;
  error = false;
  Ly = new LyricsService(this.http, this.activatedRoute);

  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute) {
    const source = interval(1000);
    this.subscription = source.subscribe(() => {
      if (this.error === false){
        this.getNewVolume();
        this.songProgress = this.Ly.getSongProgress();
        this.Ly.getIsPlaying().subscribe(result => {
          if (result != null){
            const arrayC = [];
            arrayC.push(result);
            this.playing = arrayC[0].is_playing;
          }
        });
      }
    });
  }

  adjustVolume(): void {
    this.Ly.adjustVolume(this.sliderValue);
    localStorage.setItem('volume', this.sliderValue);
  }

  getNewVolume(): void {
    this.Ly.getCurrentVolume().subscribe(result => {
      const arrayC = [];
      arrayC.push(result);
      this.error = false;
      if (arrayC[0].devices.length > 0) {
        localStorage.setItem('volume', arrayC[0].devices[0].volume_percent);
        this.sliderValue = localStorage.getItem('volume');
      }
    }, (error) => {
      this.error = true;
    });
  }


}
