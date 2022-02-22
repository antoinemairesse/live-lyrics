import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LyricsComponent } from './lyrics/lyrics.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatIconModule} from '@angular/material/icon';
import {MatSliderModule} from '@angular/material/slider';
import {FormsModule} from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { ArtistCarouselComponent } from './artist-carousel/artist-carousel.component';

@NgModule({
  declarations: [
    AppComponent,
    LyricsComponent,
    LoginComponent,
    ArtistCarouselComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatProgressBarModule,
    MatIconModule,
    MatSliderModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
