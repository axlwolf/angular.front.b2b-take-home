import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { Order } from '../../domain/entities/order.entity';

@Injectable({
  providedIn: 'root'
})
export class OperationsRepository {
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  private allOrders: Order[] = [];

  constructor(private http: HttpClient) {}

  loadInitialData(): Observable<Order[]> {
    return this.http.get<Order[]>('assets/db.json').pipe(
      tap((data) => {
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
      map(orders =>
        Array.from(new Set(orders.map(order => order.branchId))).sort((a, b) => a - b)
      )
    );
  }
}
