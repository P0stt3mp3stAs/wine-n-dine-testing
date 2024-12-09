'use client';

import { CartProvider } from './CartContext';
import { ReactNode } from 'react';

export default function CartWrapper({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}