import { Injectable } from '@angular/core';
import { CompraDetalle } from '../models/compra-detalle.model';
import { Insumo, InsumoDetalle } from '../models/insumo.model';

@Injectable({
  providedIn: 'root',
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

  addToCart(detalle: CompraDetalle) {


    this.cart.push(detalle);
    this.saveCart();
  }

  isInCart(item: CompraDetalle): boolean {
    return this.cart.some((i) => i.insumo_id === item.insumo_id);
  }

  getQty(item: CompraDetalle): number {
    const found = this.cart.find((i) => i.insumo_id === item.insumo_id);
    return found?.cantidad || 0;
  }

  increaseQty(item: CompraDetalle) {
    const found = this.cart.find((i) => i.insumo_id === item.insumo_id);
    if (found) {
      found.cantidad++;
      this.saveCart();
    }
  }

  decreaseQty(item: Insumo) {
    const index = this.cart.findIndex((i) => i.insumo_id === item.insumo_id);

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

  updateQty(item: any, qty: number) {
    const cartItem = this.cart.find((i) => i.insumo_id === item.insumo_id);

    if (!cartItem) return;

    const quantity = Number(qty);

    if (quantity <= 0) {
      this.cart = this.cart.filter((i) => i.insumo_id !== item.insumo_id);
    } else {
      cartItem.cantidad = quantity;
    }

    this.saveCart();
  }

  // ================================================================
}
