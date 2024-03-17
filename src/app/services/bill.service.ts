import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BillService {
  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  generateReport(data: any) {
    return this.httpClient.post(this.url + '/bill/generateReport', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    });
  }

  getPdf(data: any): Observable<Blob> {
    return this.httpClient.post(this.url + '/bill/getpdf', data, {
      responseType: 'blob',
    });
  }

  getBills() {
    return this.httpClient.get(this.url + '/bill/getBills');
  }
deleteOrder(orderId:string) {
  return this.httpClient.post(this.url + '/bill/deleteOrder/'+orderId,{});
}
updateOrderStatus(data:any) {
    return this.httpClient.put(this.url + '/bill/updateOrderStatus',data);
  }
  getOrders() {
    return this.httpClient.get(this.url + '/bill/getorders');
  }

  createTransaction(totalAmount: number) {
    return this.httpClient.get(
      this.url + '/bill/createTransaction/' + totalAmount
    );
  }
  delete(id: any) {
    return this.httpClient.post(this.url + '/bill/delete/' + id, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    });
  }

  getOrdersByCategory(name:any)
  {
    const body = { category: name };
    return this.httpClient.post(this.url + '/bill/getByCategory',body, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    });
  }
}
