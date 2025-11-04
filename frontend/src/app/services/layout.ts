import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { inject, Injectable, signal } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  isHandset$: Observable<boolean>;

  drawerOpened = signal<boolean>(true);

  constructor(private breakPointObserver : BreakpointObserver){
    this.isHandset$ = this.breakPointObserver
      .observe([Breakpoints.Handset])
      .pipe(map(res => res.matches));
    

    this.isHandset$.subscribe(hs => {
      this.drawerOpened.set(!hs);
    });
  }

  toggleDrawer(){
    this.drawerOpened.update(v => !v);
  }

  openDrawer() {
    this.drawerOpened.set(true);
  }

  closeDrawer() {
    this.drawerOpened.set(false);
  }

  
}
