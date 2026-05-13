import React, { useState } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Image,
  NativeModules,
} from 'react-native';

// Importa tu otra pantalla aquí
import CrearCuenta from './Crear_Cuenta';
import VentanaPrincipal from './VentanaPrincipal';
import Prueba from './Prueba';
import RegistroPass from './RegistroPass';
import GenerarPass from './GenerarPass';

// 1. CREAMOS EL STACK (La "hoja de ruta")
const Stack = createNativeStackNavigator();

// 2. TU PANTALLA DE LOGIN (Ahora como un componente separado)
function LoginScreen() {
  const navigation = useNavigation<any>();
  const FondoLogin = require('../assets/FondoLogin.jpeg');
  const Logo = require('../assets/Logo.jpeg');
  const [usuario, setUsuario] = useState('');
  const [pass, setPass] = useState('');

  const { LoginClave } = NativeModules;

  const handleLogin = async () => {
    try {
      // Llamamos al método authenticate de tu archivo Kotlin
      const result = await LoginClave.authenticate(
        usuario,
        pass,

      );
      const Insertar = await LoginClave.Login(
        usuario,
        pass,

      );
      Alert.alert("Éxito", "Login Correcto");

      navigation.navigate('VentanaPrincipal', { idUsuario: Insertar });
    } catch (error: any) {
      // Aquí recibes el 'promise.reject' que configuramos en Kotlin
      Alert.alert("Error", error.message);
      navigation.navigate('GenerarPass');
    }
  };

  return (
    <ImageBackground source={FondoLogin} style={styles.Fondo} resizeMode='cover'>
      <View style={styles.Contenedor}>
        <Text style={styles.Cabecera}>ClaveSegura</Text>

        <View style={styles.Logocontenedor}>
          <Image source={Logo} style={styles.logoImage} />
        </View>

        <View style={styles.ContenedorCampos}>
          <TextInput
            style={styles.Campos}
            placeholder="Usuario/Email"
            placeholderTextColor={"#666"}
            value={usuario}
            onChangeText={setUsuario}
          />
          <TextInput
            style={styles.Campos}
            placeholder="Pass"
            placeholderTextColor={"#666"}
            value={pass}
            onChangeText={setPass}
            secureTextEntry={true}
          />
          <TouchableOpacity>
            <Text style={styles.campoolvido}>¿Olvidaste la contraseña?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleLogin}>
            <Text style={styles.btnPrimary}>Iniciar sesión</Text>
          </TouchableOpacity>

          {/* CORRECCIÓN DEL BOTÓN NAVEGAR */}
          <TouchableOpacity
            onPress={() => {

              navigation.navigate('CrearCuenta');

            }}
          >
            <Text style={styles.btnSecondary}>Crear Cuenta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

// 3. COMPONENTE PRINCIPAL (El que arranca la App)
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="VentanaPrincipal" component={VentanaPrincipal} />
        <Stack.Screen name="CrearCuenta" component={CrearCuenta} />
        <Stack.Screen name="Prueba" component={Prueba} />
        <Stack.Screen name="RegistroPass" component={RegistroPass} />
        <Stack.Screen name="GenerarPass" component={GenerarPass} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// 4. TUS ESTILOS (Se quedan igual)
const styles = StyleSheet.create({
  Fondo: { flex: 1 },
  Contenedor: { flex: 1, alignItems: 'center', justifyContent: 'flex-start', paddingHorizontal: 50, marginTop: '20%' },
  Cabecera: { fontSize: 26, fontWeight: '300', color: '#082143' },
  Logocontenedor: { alignItems: 'center', top: 60 },
  logoImage: { width: 150, height: 100, resizeMode: 'cover', marginBottom: 10 },
  ContenedorCampos: { width: '100%', marginTop: 80 },
  Campos: { height: 45, borderBottomWidth: 1, marginBottom: 20, fontSize: 16 },
  campoolvido: { textAlign: 'center', fontSize: 14, color: '#082143' },
  buttonContainer: { alignItems: 'center', gap: 100, marginTop: 40 },
  btnPrimary: { fontSize: 18, fontWeight: 'bold', color: '#082143' },
  btnSecondary: { fontSize: 16, color: '#fdfeffff', fontWeight: 'bold', marginTop: 100 },
});
