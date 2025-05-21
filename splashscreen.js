import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable'; // Biblioteca para animações
import { useNavigation } from '@react-navigation/native'; // Para navegação

export default function SplashScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    // Navega para a tela Home após 3 segundos (tempo de duração da animação)
    const timer = setTimeout(() => {
      navigation.replace('Home'); // 'replace' substitui a tela atual, evitando voltar para a tela de splash
    }, 4000); // Ajuste o tempo conforme necessário

    return () => clearTimeout(timer); // Limpa o timer se o componente for desmontado
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Animação para a logo desaparecer */}
      <Animatable.View
        animation="fadeOut"
        duration={4000} // A duração da animação (2 segundos)
        iterationCount={1}
        style={styles.logoContainer}
      >
        <Image
          source={require('./assets/Imagem2.png')} // Imagem da logo
          style={styles.logo}
        />
      </Animatable.View>

      {/* Texto ou animação para a tela Home */}
      <Animatable.View
        animation="fadeIn"
        duration={1000} // A duração da animação para a tela Home aparecer (2 segundos)
        iterationCount={1}
        style={styles.homeTextContainer}
      >
      </Animatable.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Fundo branco para a tela de splash
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  homeTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

});
