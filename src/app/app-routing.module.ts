import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { GameComponent } from './components/game/game.component';

const routes: Routes = [
  { path: '',  component: HomeComponent, title: 'Home - No More Typos_' },
  { path: 'game', component: GameComponent, title: 'Game - No More Typos_', },
  { path: 'game/:id', component: GameComponent, title: 'Game - No More Typos_' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
