import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as text from './game-text.json';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  text: any = JSON.parse(localStorage.getItem("text")!) || (text as any).default;
  gameText: any = [];
  gameStarted = false;
  gameFinished = false;
  gameLost = false;
  enteredTextArr: Array<string> = [];
  enteredWord = '';
  timeLeft: number = 0;
  interval: any;
  level: string = 'easy';
  gameId: string = '';
  correctWords: number = 0;
  rounds: number = 0;

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.gameId = this.route.snapshot.params['id'];
    // console.log(this.gameId);

    if (this.gameId !== undefined) {
      this.gameText = this.text[this.gameId];
    } else {
      this.gameText = this.text[0];
    }

    if (!localStorage.getItem("text")) {
      localStorage.setItem("text", JSON.stringify(text));
    }

    console.log(typeof this.text);
  }

  updateLs() {
    localStorage.setItem("text", JSON.stringify(this.text));
  }

  chooseTextByLevel() {
    let levelArray;

    levelArray = Object.values(this.text).filter((t: any) => t.level === this.level);
    return levelArray[Math.floor(Math.random() * levelArray.length)];
  }

  verifyText(element: any) {
    if (element.value[element.value.length - 1] === ' ') {
      this.enteredTextArr.push(this.enteredWord);
      element.value = '';
    }
    this.enteredWord = element.value;

    // console.log(this.enteredTextArr);

    if (JSON.stringify(this.enteredTextArr) === JSON.stringify(this.gameText.text.split(' '))) {
      if (this.gameText.bestScore === 0) {
        this.gameText.bestScore = this.timeLeft;
      } else if (this.timeLeft < this.gameText.bestScore) {
        this.gameText.bestScore = this.timeLeft;
      }
      
      // console.log(this.text);
      this.updateLs();

      this.endGame();
    } else if (this.enteredTextArr.length === this.gameText.text.split(' ').length) {
      this.gameLost = true;

      this.endGame();
    }
  }

  endGame() {
    this.gameFinished = true;
    this.pauseTimer();
    // console.log("Game has finished");
    // console.log(this.timeLeft);
    this.rounds += 1;
  }

  compareActiveWord(i: number) {
    if (i === this.enteredTextArr.length) {
      return 'active-word';
    } else {
      return '';
    }
  }

  compare(randomWord: string, enteredWord: string) {
    if (!enteredWord) {
      return '';
    }

    return randomWord === enteredWord ? 'correct' : 'incorrect';
  }

  startTimer() {
    this.gameStarted = true;
    this.interval = setInterval(() => {
      if(this.timeLeft >= 0) {
        this.timeLeft += 0.1;
      }
      // console.log(this.timeLeft);
    }, 100);
  }

  pauseTimer() {
    clearInterval(this.interval);
    this.countCorrectWords();
  }

  changeLevel(level: string) {
    this.level = level;
    console.log(this.level);
    this.gameText = this.chooseTextByLevel();
    this.resetGame();
    this.router.navigate(['/game/' + this.gameText.id]);
  }

  resetGame() {
    this.pauseTimer();
    this.gameFinished = false;
    this.timeLeft = 0;
    this.gameStarted = false;
    this.enteredTextArr = [];
    this.correctWords = 0;
    this.gameLost = false;
  }

  countCorrectWords() {
    // console.log(this.enteredTextArr);
    // console.log(this.gameText);

    this.gameText.text.split(' ').map((text: string, i: number) => {
      if (text === this.enteredTextArr[i]) {
        this.correctWords += 1;
      }
    })

    // console.log(this.correctWords);
  }
}
