import { inject, Injectable } from '@angular/core';
import { Order } from '../domain/entities/order.entity';
import { Observable } from 'rxjs';
import { OperationsRepository } from '../domain/repositories/operations.repository';

@Injectable({
  providedIn: 'root',
})
export class GetOperationsUseCase {
  readonly #repository = inject(OperationsRepository);

  constructor() {}

  loadInitialData(): Observable<Order[]> {
    return this.#repository.loadInitialData();
  }

  getOrders(): Observable<Order[]> {
    return this.#repository.getOrders();
  }

  getAvailableBranches(): Observable<number[]> {
    return this.#repository.getAvailableBranches();
  }
}
