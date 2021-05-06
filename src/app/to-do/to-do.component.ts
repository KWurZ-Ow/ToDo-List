import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {formatDate} from '@angular/common';


@Component({
  selector: 'app-to-do',
  templateUrl: './to-do.component.html',
  styleUrls: ['./to-do.component.scss']
})
export class ToDoComponent implements OnInit {

  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.loadList();
  }

  list!:Array<any> | any;
  new = "";
  editValue = "";
  edited!:number;

  add() {
    if (this.new != ""){
      var currentDate = formatDate(new Date(), 'dd/MM/yyyy - HH:mm:ss', 'en', 'UTC+2');
      if (this.list == null){
        this.list = [
          [false, this.new, true, `${currentDate}`]
        ];
      }else{
        this.list.push([false, this.new, true, `${currentDate}`]);
      }
      this.new = "";
      setTimeout(() => {
        this.list[this.list.length-1][2] = false;
      }, 1);
    }
    this.save(this.list);
  }
  remove(item: number) {
    this.list[item][2] = true;
    setTimeout(() => {
      this.list.splice(item, 1);
      if (this.list.length < 1){
        this.list = null;
        this.save([]);
      }else{
        this.save(this.list);
      }
    }, 500);
  }
  edit(item:number){
    this.edited = item;
    this.editValue = this.list[item][1];
    setTimeout(() => {
      document.getElementById(`edit`)?.focus();
    }, 1);
  }
  validateEdit(id:number){
    this.edited = -1;
    this.list[id][1] = this.editValue;
  }
  save(list: Array<any>) {
    setTimeout(() => {
      this.httpClient
        .put('https://todo-list-ellistat-default-rtdb.europe-west1.firebasedatabase.app/list.json', list)
        .subscribe();
    }, 100);
  }
  get() {
    return this.httpClient.get<any[]>('https://todo-list-ellistat-default-rtdb.europe-west1.firebasedatabase.app/list.json');
  }
  loadList(){
    var list$ = this.get()
    list$?.subscribe(
      (value) => {
        if (value != null){
          this.list = value;
        }
      }
    )
  }
}