import { Injectable } from "@angular/core";
import { BaseHttpRequest } from "../http/base-http-request.service";
import { API_URL, ENVIRONMENT } from "../../public/constants/api-url";

@Injectable({
  providedIn: "root",
})
export class OrderService extends BaseHttpRequest {
  public createOrder(payload: any) {
    return this.httpClient.post(`${ENVIRONMENT}${API_URL.ORDER}`, payload);
  }

  public getOrders() {
    return this.httpClient.get(`${ENVIRONMENT}${API_URL.GET_ORDER_LIST}`);
  }
}
