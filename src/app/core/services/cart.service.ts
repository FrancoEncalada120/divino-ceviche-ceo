import { Injectable } from '@angular/core';
import { CompraDetalle } from '../models/compra-detalle.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {


  private storageKey = 'cartItems';
  private cart: CompraDetalle[] = [];

  constructor() {

    const stored = localStorage.getItem(this.storageKey);
    this.cart = stored ? JSON.parse(stored) : [];

  }


  private saveCart() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.cart));
  }

  // -------------

  addToCart(item: any) {

    const cant = item.stock - item.stock_ideal;

    this.cart.push({
      ...item,
      cantidad: cant > 0 ? cant : cant * -1 // 🔥 solo agrega si hay stock disponibl e
    });

    this.saveCart();

  }

  isInCart(item: any): boolean {
    return this.cart.some(i => i.insumo_id === item.insumo_id);
  }

  getQty(item: any): number {
    const found = this.cart.find(i => i.insumo_id === item.insumo_id);
    return found?.cantidad || 0;
  }

  increaseQty(item: any) {
    const found = this.cart.find(i => i.insumo_id === item.insumo_id);
    if (found) {
      found.cantidad++;
      this.saveCart();
    }
  }

  decreaseQty(item: any) {
    const index = this.cart.findIndex(i => i.insumo_id === item.insumo_id);

    if (index !== -1) {
      this.cart[index].cantidad--;

      if (this.cart[index].cantidad <= 0) {
        this.cart.splice(index, 1); // 🔥 lo quita del carrito
      }

      this.saveCart();

    }
  }

  getCart(): CompraDetalle[] {
    return this.cart;
  }

  clearCart() {
    this.cart = [];
    this.saveCart();
  }

  // ================================================================


}
