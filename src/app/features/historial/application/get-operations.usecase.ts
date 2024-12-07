import { Injectable } from '@angular/core';
import { OperationsRepository } from '../domain/repositories/operations.repository';
import { Observable } from 'rxjs';
import { Order } from '../domain/entities/order.entity';

@Injectable({
  providedIn: 'root',
})
export class GetOperationsUseCase {
  constructor(private operationsRepository: OperationsRepository) {}

  loadInitialData(): Observable<Order[]> {
    return this.operationsRepository.loadInitialData();
  }

  getOrders(): Observable<Order[]> {
    return this.operationsRepository.getOrders();
  }

  getAvailableBranches(): Observable<number[]> {
    return this.operationsRepository.getAvailableBranches();
  }
}
