import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SHA256 from 'crypto-js/sha256';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importando AsyncStorage

export default function LoginScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');

  // Senha original: '1234'
  const usuarioFixo = 'THsport';
  const senhaHashFixa = SHA256('1234').toString(); // Hash da senha '1234'

  // Função para salvar as credenciais do admin no AsyncStorage
  const salvarCredenciais = async () => {
    try {
      await AsyncStorage.setItem('usuario', usuarioFixo);
      await AsyncStorage.setItem('senha', senhaHashFixa);
    } catch (error) {
      console.error('Erro ao salvar as credenciais:', error);
    }
  };

  // Função para fazer o login e comparar as credenciais
  const handleLogin = async () => {
    const senhaDigitadaHash = SHA256(senha).toString();
  
    const usuarioSalvo = await AsyncStorage.getItem('usuario');
    const senhaSalva = await AsyncStorage.getItem('senha');
  
    if (nome === usuarioSalvo && senhaDigitadaHash === senhaSalva) {
      // Salvar o status de login do admin
      await AsyncStorage.setItem('adminLogado', 'true'); // Marcar como admin
      navigation.navigate('Admin');
    } else {
      Alert.alert('Erro', 'Nome ou senha incorretos!');
    }
  };
  

  // Função chamada quando o app é iniciado (para salvar as credenciais do admin)
  useEffect(() => {
    salvarCredenciais(); // Apenas faz isso uma vez para salvar as credenciais
  }, []);

  return (
    <ImageBackground
      source={{ uri: 'https://i.postimg.cc/HW7MWNP7/temp-Imageqgq4-A6.avif' }}
      style={styles.backgroundImage}
      imageStyle={{ opacity: 0.08 }}
    >
      <View style={styles.topBar}>
        <View style={{ width: 28 }} />
        <View />
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Ionicons name="arrow-forward" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.logoContainer}>
        <Image source={require('./assets/Imagem2.png')} style={styles.logo} />
      </View>

      <View style={styles.container}>
        <Text style={styles.adminTitle}>ADMIN</Text>

        <Text style={styles.label}>NOME</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu nome"
          placeholderTextColor="#999"
          value={nome}
          onChangeText={setNome}
        />

        <Text style={styles.label}>SENHA</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite sua senha"
          placeholderTextColor="#999"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  topBar: {
    paddingTop: 60,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 0,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: -10,
  },
  container: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
  },
  adminTitle: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    marginTop: 10,
    fontSize: 14,
    color: '#000',
  },
  input: {
    backgroundColor: '#ccc',
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 15,
    color: '#000',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#001400',
    padding: 15,
    borderRadius: 16,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
