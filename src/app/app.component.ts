import { Component, ViewChild, ElementRef } from '@angular/core';
import { CdkDrag, CdkDragEnd } from '@angular/cdk/drag-drop';
import { v4 as uuidv4 } from 'uuid';

interface IButton {
  id: string,
  type: string,
  text: string,
  color: string,
  position: { x: number, y: number },
  visible: boolean,
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  isCollapsed = false;
  savedButtons = localStorage.getItem('buttons');
  buttons: IButton[] = this.savedButtons ? JSON.parse(this.savedButtons) : [];
  selectedButtonText: string = ''; // Biến để lưu giữ nội dung của button được chọn
  selectedButton: IButton | undefined
  selectedButtonColor: string = ''

  ngOnInit(): void {

  }

  constructor() { }

  selectButton(btn: IButton): void {
    this.selectedButton = btn;
    this.selectedButtonText = btn.text;
    this.selectedButtonColor = btn.color;
  }

  handleChangeColor(color: string ): void {
    if (this.selectedButton) {
      this.selectedButton.color = color;
      localStorage.setItem('buttons', JSON.stringify(this.buttons));
    }
  }

  handleAddButton(buttonData: {
    type: string,
    text: string,
    color: string,
    position: { x: number, y: number },
    visible: boolean;
  }): void {

    const newButton: IButton = {
      id: uuidv4(),
      type: buttonData.type,
      text: buttonData.text,
      color: buttonData.color,
      position: { x: this.buttons.length * 10, y: this.buttons.length * 10 },
      visible: false,
    };

    this.buttons.push(newButton);
    // lưu các nút vào localstorage
    localStorage.setItem('buttons', JSON.stringify(this.buttons));
  }

  handleDeleteButton(id: string) {
    const updatedButtons = this.buttons.filter(btn => btn.id !== id)

    this.buttons = updatedButtons;
    localStorage.setItem('buttons', JSON.stringify(updatedButtons));

  }

  updateSelectedButton(): void {
    if (this.selectedButton) {
      this.selectedButton.text = this.selectedButtonText;
      localStorage.setItem('buttons', JSON.stringify(this.buttons));
    }
  }

  // Sử dụng trackBy để chỉ định cách xác định mỗi phần tử trong danh sách
  trackByButtonId(index: number, button: IButton): string {
    return button.id;
  }


  change(value: boolean): void {
    console.log(value);
  }

  dragEnded(event: CdkDragEnd, button: IButton): void {
    const draggable: CdkDrag = event.source;
    // Lấy vị trí mới của nút sau khi kéo thả
    const newPosition = { x: draggable.getFreeDragPosition().x, y: draggable.getFreeDragPosition().y };

    // Cập nhật vị trí của nút trong mảng
    const updatedButton = { ...button, position: newPosition };
    const updatedButtons = this.buttons.map(btn => (btn.id === updatedButton.id ? updatedButton : btn));

    this.buttons = updatedButtons
    // Lưu mảng cập nhật vào local storage
    localStorage.setItem('buttons', JSON.stringify(updatedButtons));

  }






}


