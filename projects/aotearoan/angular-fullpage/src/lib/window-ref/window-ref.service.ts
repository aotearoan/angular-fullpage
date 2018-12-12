import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WindowRefService {

  public getNativeWindow() {
    return window;
  }
}
