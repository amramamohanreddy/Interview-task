import { Component, OnInit, Input } from '@angular/core';
import { ConverstionHistory } from 'src/app/app.component';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  @Input() history: Array<ConverstionHistory>;
  constructor() { }

  ngOnInit() {

  }

}
