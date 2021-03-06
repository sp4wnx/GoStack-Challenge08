import React, { useState, useMemo } from 'react';

import { useNavigation } from '@react-navigation/native';

import FeatherIcon from 'react-native-vector-icons/Feather';
import {
  Container,
  CartPricing,
  CartButton,
  CartButtonText,
  CartTotalPrice,
} from './styles';

import formatValue from '../../utils/formatValue';

import { useCart } from '../../hooks/cart';

const FloatingCart: React.FC = () => {
  const { products } = useCart();

  const navigation = useNavigation();

  const cartTotal = useMemo(() => {
    if (products.length < 1) {
      return 0;
    }

    const totalPrice = products.reduce(
      (total, product) => total + product.price * product.quantity,
      0,
    );

    return formatValue(totalPrice);
  }, [products]);

  const totalItensInCart = useMemo(() => {
    if (products.length < 1) {
      return 0;
    }

    const totalItens = products.reduce(
      (total, product) => total + product.quantity,
      0,
    );

    return totalItens;
  }, [products]);

  return (
    <Container>
      <CartButton
        testID="navigate-to-cart-button"
        onPress={() => {
          if (totalItensInCart > 0) {
            navigation.navigate('Cart');
          }
        }}
      >
        <FeatherIcon name="shopping-cart" size={24} color="#fff" />
        <CartButtonText>{`${totalItensInCart} itens`}</CartButtonText>
      </CartButton>

      <CartPricing>
        <CartTotalPrice>{cartTotal}</CartTotalPrice>
      </CartPricing>
    </Container>
  );
};

export default FloatingCart;
