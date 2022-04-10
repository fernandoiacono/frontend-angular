import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-delete-btn',
  templateUrl: './delete-btn.component.html',
  styleUrls: ['./delete-btn.component.css']
})
export class DeleteBtnComponent implements OnInit {

  @Input() size : string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
