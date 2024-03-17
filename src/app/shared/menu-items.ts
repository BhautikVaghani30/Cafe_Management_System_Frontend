import { Injectable } from '@angular/core';

export interface Menu {
  state: string;
  name: string;
  type: string;
  role: string;
}

// pages
const MENUITEMS = [
  { state: 'dashboard', name: 'Dashboard', type: 'link', role: '' },
  { state: 'category', name: 'Categories', type: 'link', role: 'admin' },
  { state: 'product', name: 'Foods', type: 'link', role: 'admin' },
  { state: 'order', name: 'Orders', type: 'link', role: '' },
  { state: 'bill', name: 'Bills', type: 'link', role: '' },
  { state: 'user', name: 'Staf', type: 'link', role: 'admin' },
  { state: 'kitchen', name: 'Chef', type: 'link', role: '' },
];

@Injectable()
export class MenuItems {
  getMenuitem(): Menu[] {
    return MENUITEMS;
  }
}
