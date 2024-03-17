import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = environment.apiUrl; // link to backend

  constructor(private httpClient:HttpClient) { }

  signup(data:any) {
    return this.httpClient.post(this.url + "/user/signup", data, {
      headers:new HttpHeaders().set('Content-Type', 'application/json')
    })
  }

  forgotPassword(data:any) {
    return this.httpClient.post(this.url + "/user/forgotPassword", data, {
      headers:new HttpHeaders().set('Content-Type', 'application/json')
    })
  }

  login(data:any) {
    return this.httpClient.post(this.url + "/user/login", data, {
      headers:new HttpHeaders().set('Content-Type', 'application/json')
    })
  }

  checkToken() {
    return this.httpClient.get(this.url + "/user/checkToken");
  }

  changePassword(data:any) {
    return this.httpClient.post(this.url + "/user/changePassword", data, {
      headers:new HttpHeaders().set('Content-Type', 'application/json')
    })
  }

  getUsers() {
    return this.httpClient.get(this.url + "/user/get");
  }

  update(data:any) {
    return this.httpClient.post(this.url + "/user/update", data, {
      headers:new HttpHeaders().set('Content-Type', 'application/json')
    })
  }

  updateUserRole(requestBody: any): Observable<any> {
    const url = `${this.url}/user/updateRole`; // Constructing the API URL

    return this.httpClient.put(url, requestBody, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }


}
