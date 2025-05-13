import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons, Entypo } from '@expo/vector-icons';
import * as Clipboard from 'react-native'; // Para copiar chave Pix
import { Linking } from 'react-native';

export default function CartScreen({ route, navigation }) {
  const { cartItems: initialCartItems } = route.params;
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [selectedPayments, setSelectedPayments] = useState({
    cartao: false,
    pix: false,
    dinheiro: false,
  });

  useEffect(() => {
    const groupedItems = [];

    initialCartItems.forEach(item => {
      const existingIndex = groupedItems.findIndex(
        i => i.id === item.id && i.tamanho === item.tamanho
      );

      if (existingIndex >= 0) {
        groupedItems[existingIndex].quantidade += 1;
      } else {
        groupedItems.push({ ...item, quantidade: 1 });
      }
    });

    setCartItems(groupedItems);
  }, []);

  useEffect(() => {
    const total = cartItems.reduce((sum, item) => {
      const precoNumerico = parseFloat(item.preco.replace('R$ ', '').replace(',', '.'));
      return sum + precoNumerico * item.quantidade;
    }, 0);
    setTotalPrice(total);
  }, [cartItems]);

  const removeItem = (indexToRemove) => {
    const newCart = cartItems.filter((_, index) => index !== indexToRemove);
    setCartItems(newCart);
  };

  const increaseQuantity = (index) => {
    const newCart = [...cartItems];
    newCart[index].quantidade += 1;
    setCartItems(newCart);
  };

  const decreaseQuantity = (index) => {
    const newCart = [...cartItems];
    if (newCart[index].quantidade > 1) {
      newCart[index].quantidade -= 1;
    } else {
      newCart.splice(index, 1);
    }
    setCartItems(newCart);
  };

  const handlePaymentToggle = (paymentMethod) => {
    setSelectedPayments(prevState => ({
      ...prevState,
      [paymentMethod]: !prevState[paymentMethod],
    }));
  };

  const handleFinalizePurchase = async () => {
    try {
      setIsSending(true);

      let message = `*Novo Pedido!*\n\n`;

      cartItems.forEach(item => {
        message += `• *${item.nome}* (Tamanho: ${item.tamanho})\nQuantidade: ${item.quantidade}\n\n`;
      });

      message += `*Total:* R$ ${totalPrice.toFixed(2)}\n\nObrigado!`;

      const phoneNumber = '5521991588137'; 
      const url = `https://wa.me/${5521991588137}?text=${encodeURIComponent(message)}`;

      await Linking.openURL(url);

      setTimeout(() => {
        setIsSending(false);
        navigation.navigate('Home');
      }, 3000);

    } catch (error) {
      console.error('Erro ao abrir WhatsApp:', error);
      setIsSending(false);
    }
  };

  const copyPixKey = async () => {
    const pixKey = '21991588137'; 
    await Clipboard.setStringAsync(pixKey);
    Alert.alert('Pix copiado', 'Chave Pix copiada para a área de transferência.');
  };

  return (
    <ImageBackground
      source={{ uri: 'https://i.postimg.cc/HW7MWNP7/temp-Imageqgq4-A6.avif' }}
      style={styles.backgroundImage}
      imageStyle={{ opacity: 0.08 }}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Image source={require('./assets/Imagem2.png')} style={styles.logo} />
        <View style={{ width: 28 }} />
      </View>

      <FlatList
        data={cartItems}
        renderItem={({ item, index }) => (
          <View style={styles.itemContainer}>
            <Image source={item.imagem} style={styles.image} />
            <View style={styles.details}>
              <Text style={styles.name}>{item.nome}</Text>
              <Text style={styles.price}>{item.preco}</Text>
              {item.tamanho && (
                <Text style={styles.tamanho}>Tamanho: {item.tamanho}</Text>
              )}
              <View style={styles.quantityContainer}>
                <TouchableOpacity onPress={() => decreaseQuantity(index)} style={styles.qtdButton}>
                  <Entypo name="minus" size={20} color="#000" />
                </TouchableOpacity>
                <Text style={styles.quantidade}>{item.quantidade}</Text>
                <TouchableOpacity onPress={() => increaseQuantity(index)} style={styles.qtdButton}>
                  <Entypo name="plus" size={20} color="#000" />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity onPress={() => removeItem(index)} style={styles.removeButton}>
              <Ionicons name="trash" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        contentContainerStyle={styles.listContainer}
      />

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total: R$ {totalPrice.toFixed(2)}</Text>
      </View>

      {/* Formas de Pagamento */}
      <View style={styles.paymentContainer}>
        <Text style={styles.paymentTitle}>forma(s) de pagamento:</Text>
        <View style={styles.paymentOptions}>
          <TouchableOpacity 
            style={[styles.paymentOptionButton, selectedPayments.cartao && styles.selectedPayment]}
            onPress={() => handlePaymentToggle('cartao')}
          >
            <Image source={require('./assets/visa.png')} style={styles.paymentOptionImage} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.paymentOptionButton, selectedPayments.cartao && styles.selectedPayment]}
            onPress={() => handlePaymentToggle('cartao')}
          >
            <Image source={require('./assets/mastercard.png')} style={styles.paymentOptionImage} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.paymentOptionButton, selectedPayments.pix && styles.selectedPayment]}
            onPress={() => handlePaymentToggle('pix')}
          >
            <Image source={require('./assets/pix.png')} style={styles.paymentOptionImage} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.paymentOptionButton, selectedPayments.dinheiro && styles.selectedPayment]}
            onPress={() => handlePaymentToggle('dinheiro')}
          >
            <Image source={require('./assets/dinheiro.png')} style={styles.paymentOptionImage} />
          </TouchableOpacity>
        </View>

        {selectedPayments.pix && (
          <TouchableOpacity
            style={styles.copyPixButton}
            onPress={copyPixKey}
          >
            <Text style={styles.copyPixButtonText}>Copiar chave Pix</Text>
          </TouchableOpacity>
        )}

        <View style={styles.selectedPaymentsContainer}>
          {selectedPayments.cartao && <Text style={styles.selectedPaymentText}>Cartão</Text>}
          {selectedPayments.pix && <Text style={styles.selectedPaymentText}>Pix</Text>}
          {selectedPayments.dinheiro && <Text style={styles.selectedPaymentText}>Dinheiro</Text>}
        </View>
      </View>

      <TouchableOpacity style={styles.finalizeButton} onPress={handleFinalizePurchase} disabled={isSending}>
        {isSending ? (
          <>
            <ActivityIndicator size="small" color="#fff" />
            <Text style={styles.finalizeButtonText}> Enviando...</Text>
          </>
        ) : (
          <Text style={styles.finalizeButtonText}>Finalizar Compra</Text>
        )}
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  listContainer: {
    padding: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  image: {
    width: 100,
    height: 140,
    borderRadius: 8,
  },
  details: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
  },
  price: {
    fontWeight: 'bold',
    marginTop: 5,
  },
  tamanho: {
    marginTop: 4,
    fontSize: 14,
    color: '#333',
  },
  removeButton: {
    padding: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  qtdButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
  },
  quantidade: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
    marginTop: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  finalizeButton: {
    backgroundColor: '#000',
    paddingVertical: 30,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  finalizeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
  paymentContainer: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 20,
    borderRadius: 8,
  },
  paymentTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  paymentOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentOptionButton: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    width: '22%',
    alignItems: 'center',
  },
  paymentOptionImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  selectedPayment: {
    borderWidth: 2,
    borderColor: '#000',
  },
  copyPixButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#000',
    borderRadius: 8,
    alignItems: 'center',
  },
  copyPixButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  selectedPaymentsContainer: {
    marginTop: 10,
  },
  selectedPaymentText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});