import { Injectable } from '@angular/core';
import { Order } from '../entities/order.entity';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class OperationsRepository {
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  private allOrders: Order[] = [];

  constructor(private http: HttpClient) {}

  loadInitialData(): Observable<Order[]> {
    return this.http.get<Order[]>('/assets/db.json').pipe(
      tap((data) => {
        console.log('Orders loaded:', data);
        this.allOrders = data;
        this.ordersSubject.next(this.allOrders);
      })
    );
  }

  getOrders(): Observable<Order[]> {
    return this.ordersSubject.asObservable();
  }

  getAvailableBranches(): Observable<number[]> {
    return this.ordersSubject.pipe(
      map((orders) =>
        Array.from(new Set(orders.map((order) => order.branchId))).sort(
          (a, b) => a - b
        )
      )
    );
  }
}
