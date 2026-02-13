import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Sale {
  id: number;
  time: string;
  items: string[];
  amount: number;
  method: string;
  type: 'sale' | 'refund';
}

interface Correction {
  id: number;
  itemName: string;
  issue: string;
  solution: string;
  status: 'pending' | 'resolved';
  timestamp: string;
}

interface CartItem {
  name: string;
  price: number;
  quantity: number;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  // Header
  currentDate: Date = new Date();
  currentTime: string = '';
  isOnline: boolean = true;
  private timeInterval: any;

  // Tabs
  activeTab: string = 'sales';
  tabs = [
    { id: 'sales', label: 'Ventas', icon: '💰' },
    { id: 'corrections', label: 'Correcciones', icon: '🔧' },
    { id: 'calculator', label: 'Calculador', icon: '🧮' },
    { id: 'reports', label: 'Reportes', icon: '📈' },
  ];

  // Sales data
  salesList: Sale[] = [
    { id: 1, time: '09:15', items: ['Laptop', 'Mouse'], amount: 5500, method: 'Tarjeta', type: 'sale' },
    { id: 2, time: '10:30', items: ['Monitor'], amount: 3200, method: 'Efectivo', type: 'sale' },
    { id: 3, time: '11:45', items: ['Teclado'], amount: -800, method: 'Efectivo', type: 'refund' },
    { id: 4, time: '13:20', items: ['Webcam', 'Micrófono'], amount: 2500, method: 'Transferencia', type: 'sale' },
    { id: 5, time: '14:50', items: ['Cable USB 3 in 1'], amount: 350, method: 'Tarjeta', type: 'sale' },
  ];

  corrections: Correction[] = [
    {
      id: 1,
      itemName: 'Monitor LG 27"',
      issue: 'Píxeles muertos detectados',
      solution: 'Se cambió por unidad nueva del mismo modelo',
      status: 'resolved',
      timestamp: '10:00',
    },
  ];

  // Correction form
  showCorrectionForm: boolean = false;
  newCorrection = { itemName: '', issue: '', solution: '' };

  // Calculator
  cartItems: CartItem[] = [
    { name: 'Laptop Dell', price: 18000, quantity: 1 },
    { name: 'Mouse inalámbrico', price: 350, quantity: 2 },
  ];
  newItem = { name: '', price: 0, quantity: 1 };
  discount: number = 0;
  amountReceived: number = 0;
  selectedPaymentMethod: string = 'cash';

  paymentMethods: PaymentMethod[] = [
    { id: 'cash', name: 'Efectivo', icon: '💵' },
    { id: 'card', name: 'Tarjeta', icon: '💳' },
    { id: 'transfer', name: 'Transferencia', icon: '💸' },
    { id: 'check', name: 'Cheque', icon: '✓' },
  ];

  constructor() {}

  ngOnInit(): void {
    this.updateTime();
    this.timeInterval = setInterval(() => this.updateTime(), 1000);
  }

  ngOnDestroy(): void {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  updateTime(): void {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString('es-HN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    this.currentDate = new Date();
  }

  selectTab(tabId: string): void {
    this.activeTab = tabId;
  }

  // Sales methods
  get totalSales(): number {
    return this.salesList.filter(s => s.type === 'sale').reduce((sum, s) => sum + s.amount, 0);
  }

  get totalRefunds(): number {
    return Math.abs(this.salesList.filter(s => s.type === 'refund').reduce((sum, s) => sum + s.amount, 0));
  }

  get netSales(): number {
    return this.totalSales - this.totalRefunds;
  }

  get refundCount(): number {
    return this.salesList.filter(s => s.type === 'refund').length;
  }

  refreshSales(): void {
    console.log('✅ Ventas actualizadas');
    // Aquí iría la lógica de actualizar desde backend
  }

  editSale(sale: Sale): void {
    console.log('📝 Editando venta:', sale);
  }

  deleteSale(id: number): void {
    this.salesList = this.salesList.filter(s => s.id !== id);
    console.log('🗑️ Venta eliminada');
  }

  // Corrections methods
  openCorrectionForm(): void {
    this.showCorrectionForm = true;
    this.newCorrection = { itemName: '', issue: '', solution: '' };
  }

  saveCorrection(): void {
    if (this.newCorrection.itemName && this.newCorrection.issue && this.newCorrection.solution) {
      const correction: Correction = {
        id: this.corrections.length + 1,
        itemName: this.newCorrection.itemName,
        issue: this.newCorrection.issue,
        solution: this.newCorrection.solution,
        status: 'pending',
        timestamp: new Date().toLocaleTimeString('es-HN', { hour: '2-digit', minute: '2-digit' }),
      };
      this.corrections.unshift(correction);
      this.showCorrectionForm = false;
      console.log('✅ Corrección guardada');
    }
  }

  resolveCorrection(id: number): void {
    const correction = this.corrections.find(c => c.id === id);
    if (correction) {
      correction.status = 'resolved';
      console.log('✅ Corrección resuelta');
    }
  }

  // Calculator methods
  addToCart(): void {
    if (this.newItem.name && this.newItem.price > 0 && this.newItem.quantity > 0) {
      this.cartItems.push({ ...this.newItem });
      this.newItem = { name: '', price: 0, quantity: 1 };
      console.log('✅ Producto agregado al carrito');
    }
  }

  removeCartItem(index: number): void {
    const removed = this.cartItems[index];
    this.cartItems.splice(index, 1);
    console.log('🗑️ Producto eliminado:', removed.name);
  }

  getSubtotal(): number {
    return this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  getTax(): number {
    return this.getSubtotal() * 0.02;  // Impuesto del 2%
  }

  getDiscount(): number {
    return this.getSubtotal() * (this.discount / 100);
  }

  getTotal(): number {
    return this.getSubtotal() + this.getTax() - this.getDiscount();
  }

  getChange(): number {
    return this.amountReceived - this.getTotal();
  }

  processPayment(): void {
    if (this.cartItems.length === 0) {
      console.log('⚠️ Carrito vacío');
      return;
    }

    const payment = {
      total: this.getTotal(),
      method: this.selectedPaymentMethod,
      items: this.cartItems.length,
      timestamp: this.currentTime,
    };

    console.log('✅ PAGO PROCESADO:', payment);
    alert(`✅ Pago de HNL ${this.getTotal().toFixed(2)} procesado con éxito mediante ${this.getPaymentMethodName()}`);
    
    // Agregar a historial de ventas
    const newSale: Sale = {
      id: this.salesList.length + 1,
      time: this.currentTime,
      items: this.cartItems.map(item => item.name),
      amount: this.getTotal(),
      method: this.getPaymentMethodName(),
      type: 'sale',
    };
    this.salesList.unshift(newSale);

    // Limpiar
    this.cartItems = [];
    this.discount = 0;
    this.amountReceived = 0;
  }

  getPaymentMethodName(): string {
    const method = this.paymentMethods.find(m => m.id === this.selectedPaymentMethod);
    return method ? method.name : 'Desconocido';
  }

  // Reports methods
  getAverageTransaction(): number {
    if (this.salesList.length === 0) return 0;
    return this.totalSales / this.salesList.filter(s => s.type === 'sale').length;
  }

  getPaymentMethodBreakdown(): any[] {
    const breakdown: { [key: string]: { count: number; total: number } } = {};
    this.salesList.forEach(sale => {
      if (!breakdown[sale.method]) {
        breakdown[sale.method] = { count: 0, total: 0 };
      }
      breakdown[sale.method].count++;
      breakdown[sale.method].total += sale.amount;
    });

    return Object.keys(breakdown)
      .map(method => ({
        name: method,
        ...breakdown[method],
      }))
      .sort((a, b) => b.total - a.total);
  }
}
