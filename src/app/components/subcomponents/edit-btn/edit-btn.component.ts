import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-btn',
  templateUrl: './edit-btn.component.html',
  styleUrls: ['./edit-btn.component.css']
})
export class EditBtnComponent implements OnInit {

  @Input() size : string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
