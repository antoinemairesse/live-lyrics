import {Injectable} from '@angular/core';
import {OnDestroy} from '@angular/core';
import {getSong} from 'genius-lyrics-api';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {interval, Observable, Subscription} from 'rxjs';
import {ActivatedRoute, Params} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LyricsService implements OnDestroy {
  private login = true;
  private errorSpotify = true;
  private errorLyrics = true;
  private artistName = '';
  private songName = '';
  private albumArt: string;
  private lyrics: string;
  private subscription: Subscription;
  private accessToken = localStorage.getItem('accessToken');
  private songDurationMin: string;
  private songDurationSec: string;
  private songProgress = 0;
  private playing = true;
  private title = '';
  private artist = '';
  private ArtistId;
  RelatedArtists: object[];

  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      if (params.access_token) {
        localStorage.setItem('accessToken', params.access_token);
        this.accessToken = localStorage.getItem('accessToken');
        window.location.href = 'http://localhost:4200/';
      }
    });
    if (window.location.href.indexOf('#') > -1) {
      window.location.href = window.location.href.replace('#', '?');
    }
    const source = interval(1000);
    this.subscription = source.subscribe(() => {
      if (this.login === true) {
        this.getCurrentVolume();
        this.getPlayingSong();
      }
    });
  }

  getPlayingSong(): void {
    if (this.accessToken !== null) {
      this.http.get('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + this.accessToken,
        })
      }).subscribe(result => {
        if (result != null) {
          this.errorSpotify = false;
          const arrayC = [];
          arrayC.push(result);
          this.ArtistId = arrayC[0].item.artists[0].id;

          if (arrayC[0].item != null) {
            let sec: string = String((arrayC[0].item.duration_ms / 60000) % 1);
            const min = (arrayC[0].item.duration_ms / 60000) - Number(sec);
            sec = String(Number(sec) * 60 - ((Number(sec) * 60) % 1));
            if (Number(sec) < 10) {
              sec = '0' + sec;
            }

            this.songProgress = ((arrayC[0].progress_ms / arrayC[0].item.duration_ms) * 100);
            this.songDurationMin = String(min);
            this.songDurationSec = String(sec);

            if (this.artist !== arrayC[0].item.artists[0].name || this.title !== arrayC[0].item.name) {
              this.fetchLyrics(arrayC[0].item.name, arrayC[0].item.artists[0].name);
            }
            this.artist = arrayC[0].item.artists[0].name;
            this.title = arrayC[0].item.name;

            let i = 0;
            this.artistName = '';
            arrayC[0].item.artists.forEach(value => {
              this.artistName += value.name;
              i++;
              if (arrayC[0].item.artists.length > 1 && i < arrayC[0].item.artists.length) {
                this.artistName += ', ';
              }
            });
            this.songName = arrayC[0].item.name;
            this.albumArt = arrayC[0].item.album.images[0].url;
          }
        } else {
          this.errorSpotify = true;
        }
      }, error => {
        this.login = false;
      });
    } else {
      this.login = false;
    }
  }

  fetchLyrics(title, artist): void {
    const options = {
      apiKey: 'ZgYwtB7yjBMJz9Kaz2A7By7QBS59Ekeu_30QPjOBHgcZ1TcyDGGsFFzOIPLCw7mA',
      title,
      artist,
      optimizeQuery: true
    };

    getSong(options).then((song) => {
        if (song != null) {
          this.lyrics = song.lyrics;
          this.errorLyrics = false;
        } else {
          this.errorLyrics = true;
        }
      }
    );
  }

  skipPrevious(): void {
    this.http.post('https://api.spotify.com/v1/me/player/previous', {}, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.accessToken,
      })
    }).subscribe(() => {
      },
      error => {
        this.login = false;
        console.log(error);
      });
    this.getPlayingSong();
  }

  skipNext(): void {
    this.http.post('https://api.spotify.com/v1/me/player/next', {}, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.accessToken,
      })
    }).subscribe(() => {
    }, error => {
      this.login = false;
      console.log(error);
    });
    this.getPlayingSong();
  }

  PauseResume(): void {
    this.getIsPlaying().subscribe(result => {
      const arrayC = [];
      arrayC.push(result);

      if (arrayC[0].is_playing === true) {
        this.http.put('https://api.spotify.com/v1/me/player/pause', {}, {
          headers: new HttpHeaders({
            Authorization: 'Bearer ' + this.accessToken,
          })
        }).subscribe(() => {
          this.playing = true;
        }, error => {
          this.login = false;
          console.log(error);
        });
      } else {
        this.http.put('https://api.spotify.com/v1/me/player/play', {}, {
          headers: new HttpHeaders({
            Authorization: 'Bearer ' + this.accessToken,
          })
        }).subscribe(() => {
          this.playing = false;
        }, error => {
          this.login = false;
          console.log(error);
        });
      }
    });
    this.getPlayingSong();
  }

  log_in(): void {
    window.location.href = 'https://accounts.spotify.com/authorize?client_id=1392011dcaa04c37813125aec6094aac&response_type=token&redirect_uri=http://localhost:4200&state=1546165454zeaeaz&scope=user-read-currently-playing user-modify-playback-state user-read-playback-state&show_dialog=true';
    this.login = true;
  }

  adjustVolume(value): void {
    this.http.put('https://api.spotify.com/v1/me/player/volume?volume_percent=' + value, {}, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.accessToken,
      })
    }).subscribe();
  }

  getCurrentVolume(): Observable<any> {
    return this.http.get('https://api.spotify.com/v1/me/player/devices', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.accessToken,
      })
    });
  }

  getRelatedArtists(): void {
    if (this.ArtistId != null) {
      this.http.get('https://api.spotify.com/v1/artists/' + this.ArtistId + '/related-artists', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + this.accessToken,
        })
      }).subscribe(result => {
        const arrayC = [];
        arrayC.push(result);
        this.RelatedArtists = [];
        arrayC[0].artists.forEach(value => {
          this.RelatedArtists.push({
            id: value.id,
            name: value.name,
            photo: value.images[0].url,
            genre: value.genres[0],
            url: value.external_urls.spotify
          });
        });
      });
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getErrorSpotify(): boolean {
    return this.errorSpotify;
  }

  getErrorLyrics(): boolean {
    return this.errorLyrics;
  }

  getArtistName(): string {
    return this.artistName;
  }

  getSongName(): string {
    return this.songName;
  }

  getAlbumArt(): string {
    return this.albumArt;
  }

  getLyrics(): string {
    return this.lyrics;
  }

  getLoginStatus(): boolean {
    return this.login;
  }

  getAccessToken(): string {
    return this.accessToken;
  }

  getSongDuractionMin(): string {
    return this.songDurationMin;
  }

  getSongDuractionSec(): string {
    return this.songDurationSec;
  }

  getSongProgress(): number {
    return this.songProgress;
  }

  getIsPlaying(): Observable<any> {
    return this.http.get('https://api.spotify.com/v1/me/player', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.accessToken,
      })
    });
  }

}
