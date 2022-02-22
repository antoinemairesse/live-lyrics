import {Component} from '@angular/core';
import {LyricsService} from './lyrics.service';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  Ly = new LyricsService(this.http, this.activatedRoute);

  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute) {

  }

  title = 'live-lyrics';
}
