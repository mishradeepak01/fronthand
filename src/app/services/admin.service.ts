import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { EnvService } from './env.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  httpOptions = {
    headers: new HttpHeaders({'Content-Type':'application/json'})
  }

  constructor(private http: HttpClient,
              private envService: EnvService) { }

  getReferals() {
    return this.http.get(this.envService.API_URL+'/referal', this.httpOptions);
  }

  deleteReferal(id) {
    return this.http.delete(this.envService.API_URL+`/referal/${id}`, this.httpOptions);
  }

  generateReferal() {
    return this.http.post(this.envService.API_URL+'/referal/generateReferal', this.httpOptions);
  }
              
  getCategory() {
    return this.http.get(this.envService.API_URL+'/business', this.httpOptions);
  }
  
  addTemplate(url, name, business_id, image_name) {
    return this.http.post(this.envService.API_URL+'/template/addTemplate', {url, name, business_id, image_name}, this.httpOptions);
  }

  addBusiness(category) {
    return this.http.post(this.envService.API_URL+'/business/addCategory', {category}, this.httpOptions);
  }

  addMessage(user_id, business_id, text_data) {
    return this.http.post(this.envService.API_URL+`/text_template/addMessage`, {user_id, business_id, text_data}, this.httpOptions);
  }

  addService(user_id, business_id, service_data) {
    return this.http.post(this.envService.API_URL+`/service/addService`, {user_id, business_id, service_data}, this.httpOptions);
  }
}