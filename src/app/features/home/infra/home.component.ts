import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Subscription, combineLatest } from 'rxjs';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { GetOperationsUseCase } from '../application/get-operations.usecase';
import { Order } from '../domain/entities/order.entity';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  isFiltersVisible = true;
  totalSales = 0;
  totalOrders = 0;
  averageTicket = 0;

  availableBranches: number[] = [];
  selectedBranches = new Set<number>();
  startDateControl = new FormControl('');
  endDateControl = new FormControl('');

  private subscriptions$ = new Subscription();
  private allOrders: Order[] = [];
  private filteredOrders: Order[] = [];

  constructor(private getOperationsUseCase: GetOperationsUseCase) {}

  ngOnInit() {
    // Cargar datos iniciales
    this.getOperationsUseCase.loadInitialData().subscribe();

    this.subscriptions$.add(
      this.getOperationsUseCase.getAvailableBranches().subscribe((branches) => {
        this.availableBranches = branches;
        this.selectedBranches = new Set(branches);
        this.applyFilters();
      })
    );

    // Obtener todos los pedidos
    this.subscriptions$.add(
      this.getOperationsUseCase.getOrders().subscribe((orders) => {
        this.allOrders = orders;
        this.applyFilters();
      })
    );

    // Observar cambios en los filtros
    this.setupFilterObservers();
  }

  ngOnDestroy() {
    this.subscriptions$.unsubscribe();
  }

  private setupFilterObservers(): void {
    // Observar cambios en las sucursales, fechas y aplicar filtros
    this.subscriptions$.add(
      combineLatest([
        this.startDateControl.valueChanges,
        this.endDateControl.valueChanges,
      ]).subscribe(() => {
        this.applyFilters();
      })
    );
  }

  private applyFilters(): void {
    this.filteredOrders = [...this.allOrders];

    // Filtrar por sucursales
    if (this.selectedBranches.size > 0) {
      this.filteredOrders = this.filteredOrders.filter((order) =>
        this.selectedBranches.has(order.branchId)
      );
    }

    const startDate = this.startDateControl.value
      ? new Date(this.startDateControl.value)
      : null;
    const endDate = this.endDateControl.value
      ? new Date(this.endDateControl.value)
      : null;

    if (startDate && endDate) {
      endDate.setHours(23, 59, 59, 999);
      this.filteredOrders = this.filteredOrders.filter((order) => {
        const orderDate = new Date(order.updatedAt);
        return orderDate >= startDate && orderDate <= endDate;
      });
    }

    this.calculateStats();
  }

  private calculateStats(): void {
    this.totalOrders = this.filteredOrders.length;
    this.totalSales = this.filteredOrders.reduce(
      (sum, order) => sum + order.price,
      0
    );
    this.averageTicket =
      this.totalOrders > 0 ? this.totalSales / this.totalOrders : 0;
  }

  toggleFiltersVisibility(): void {
    this.isFiltersVisible = !this.isFiltersVisible;
  }

  areFiltersActive(): boolean {
    const hasDateFilters =
      !!this.startDateControl.value || !!this.endDateControl.value;
    const allBranchesSelected =
      this.selectedBranches.size === this.availableBranches.length;
    const hasBranchFilters = !allBranchesSelected;
    return hasDateFilters || hasBranchFilters;
  }

  toggleBranchSelection(branchId: number): void {
    if (this.selectedBranches.has(branchId)) {
      this.selectedBranches.delete(branchId);
    } else {
      this.selectedBranches.add(branchId);
    }
    this.applyFilters();
  }

  resetAllFilters(): void {
    this.startDateControl.setValue('');
    this.endDateControl.setValue('');
    this.selectedBranches = new Set(this.availableBranches);
    this.applyFilters();
  }

  onBranchSelectionChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedOptions = Array.from(selectElement.selectedOptions).map(
      (option) => Number(option.value)
    );
    this.selectedBranches = new Set(selectedOptions);
    this.applyFilters();
  }

  getBranchButtonClass(branchId: number): string {
    const baseClass = 'px-4 py-2 rounded-full text-sm font-medium';
    const selectedClass = 'bg-gray-800 text-black';
    const unselectedClass = 'bg-gray-100 text-gray-700 hover:bg-gray-200';
    return this.selectedBranches.has(branchId)
      ? `${baseClass} ${selectedClass}`
      : `${baseClass} ${unselectedClass}`;
  }
}
