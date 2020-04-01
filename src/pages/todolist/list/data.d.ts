export interface TodoItemDataType {
  id: number;
  title: string;
  description: string;
  date: number;
  status: 'default' | 'processing' | 'success';
}
