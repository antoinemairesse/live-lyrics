import { Component, OnInit } from '@angular/core';
import {LyricsService} from '../lyrics.service';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  Ly = new LyricsService(this.http, this.activatedRoute);
  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
  }

}
