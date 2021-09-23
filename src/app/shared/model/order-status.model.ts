export class OrderStatusModel {
  id: number;
  statusId: number;
  isAccept: number;
  label: string;

  constructor(id: number, statusId: number, isAccept: number, label: string) {
    this.id = id;
    this.statusId = statusId;
    this.isAccept = isAccept;
    this.label = label;
  }
}
