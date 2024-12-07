import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GetOperationsUseCase } from '../../application/get-operations.usecase';
import { Order } from '../../domain/entities/order.entity';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
})
export class HistorialComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  paginatedOrders: Order[] = [];
  totalOrdersCount: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  sortDirection: { [key: string]: 'asc' | 'desc' } = {
    loanId: 'asc',
    updatedAt: 'asc',
    status: 'asc',
    price: 'asc',
  };

  startDateControl = new FormControl('');
  endDateControl = new FormControl('');

  constructor(private getOperationsUseCase: GetOperationsUseCase) {}

  ngOnInit() {
    this.loadOrders();
    this.setupFilterObservers();
  }

  loadOrders() {
    this.getOperationsUseCase.loadInitialData().subscribe((orders) => {
      this.orders = orders;
      this.applyFilters();
    });
  }

  setupFilterObservers() {
    this.startDateControl.valueChanges.subscribe(() => this.applyFilters());
    this.endDateControl.valueChanges.subscribe(() => this.applyFilters());
  }

  applyFilters() {
    let filtered = this.orders;

    const startDate = this.startDateControl.value
      ? new Date(this.startDateControl.value)
      : null;
    const endDate = this.endDateControl.value
      ? new Date(this.endDateControl.value)
      : null;

    if (startDate && endDate) {
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.updatedAt);
        return orderDate >= startDate && orderDate <= endDate;
      });
    }

    this.filteredOrders = filtered;
    this.totalOrdersCount = this.filteredOrders.length;
    this.updatePagination();
  }

  updatePagination() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedOrders = this.filteredOrders.slice(startIndex, endIndex);
  }

  changePage(page: number) {
    this.currentPage = page;
    this.updatePagination();
  }

  get totalPages(): number {
    return Math.ceil(this.totalOrdersCount / this.itemsPerPage);
  }

  sortOrders(field: keyof Order) {
    const direction = this.sortDirection[field] || 'asc'; // Provide default sort direction

    this.filteredOrders.sort((a, b) => {
      const valueA = a[field];
      const valueB = b[field];

      const isString = (val: any): val is string => typeof val === 'string';
      const isNumber = (val: any): val is number => typeof val === 'number';
      const isDate = (val: any): val is Date => val instanceof Date;

      if (isString(valueA) && isString(valueB)) {
        return direction === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else if (isNumber(valueA) && isNumber(valueB)) {
        return direction === 'asc' ? valueA - valueB : valueB - valueA;
      } else if (isDate(valueA) && isDate(valueB)) {
        return direction === 'asc'
          ? valueA.getTime() - valueB.getTime()
          : valueB.getTime() - valueA.getTime();
      } else {
        console.warn(
          `Sorting on field ${field} with inconsistent types. Defaulting to no sort.`
        );
        return 0;
      }
    });

    this.sortDirection[field] = direction === 'asc' ? 'desc' : 'asc';
    this.updatePagination();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'APROBADO':
        return 'bg-[#7be2a1] text-black py-1 px-3 rounded';
      // Otros casos para diferentes estados
      default:
        return 'bg-gray-300 text-black py-1 px-3 rounded';
    }
  }
}
