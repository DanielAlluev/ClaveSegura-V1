import React, { useState } from 'react';
import {

    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Alert,
    SafeAreaView, StatusBar,
    ImageBackground,
    Image,
    NativeModules
} from 'react-native';

const Myscreen = () => {

}


export default function App() {
    const FondoLogin = require('../assets/FondoLogin.jpeg');

    const [usuario, setUsuario] = useState('');
    const [pass, setPass] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [correo, setCorreo] = useState('');
    const { CrearCuenta } = NativeModules;

    const handleRegistro = async () => {
        try {
            // Llamamos al método authenticate de tu archivo Kotlin
            const result = await CrearCuenta.authenticate(
                usuario,
                pass,
                nombre,
                apellidos,
                correo
            );
            const Insertar = await CrearCuenta.insertar(
                usuario,
                pass,
                nombre,
                apellidos,
                correo
            );
            Alert.alert("Éxito", "Usuario registrado correctamente");
        } catch (error: any) {
            // Aquí recibes el 'promise.reject' que configuramos en Kotlin
            Alert.alert("Error", error.message);
        }
    };

    const Logo = require('../assets/Logo.jpeg');

    return (
        <ImageBackground source={FondoLogin} style={styles.Fondo} resizeMode='cover'>
            <View style={styles.Contenedor}>

                <Text style={styles.Cabecera}>ClaveSegura</Text>

                <View style={styles.ContenedorCampos}>
                    <TextInput
                        style={styles.Campos}
                        placeholder="Usuario"
                        placeholderTextColor={"#666"}
                        value={usuario}
                        onChangeText={setUsuario}
                    />
                    <TextInput
                        style={styles.Campos}
                        placeholder="Contrseña"
                        placeholderTextColor={"#666"}
                        secureTextEntry={true}
                        value={pass}
                        onChangeText={setPass}
                    />
                    <TextInput
                        style={styles.Campos}
                        placeholder="Nombre"
                        placeholderTextColor={"#666"}
                        value={nombre}
                        onChangeText={setNombre}

                    />

                    <TextInput
                        style={styles.Campos}
                        placeholder="Apellidos"
                        placeholderTextColor={"#666"}
                        value={apellidos}
                        onChangeText={setApellidos}
                    />
                    <TextInput
                        style={styles.Campos}
                        placeholder="Correo"
                        placeholderTextColor={"#666"}
                        value={correo}
                        onChangeText={setCorreo}

                    />


                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={handleRegistro}>
                        <Text style={styles.btnPrimary}>Crear Cuenta</Text>
                    </TouchableOpacity>
                </View>

            </View>

        </ImageBackground>




    )


}

const styles = StyleSheet.create({
    Fondo: {
        flex: 1,

    },
    Contenedor: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingHorizontal: 50,
        marginTop: '20%'
    },
    Cabecera: {
        fontSize: 26,
        position: 'relative',
        top: 0,
        fontWeight: '300',
        color: '#082143'
    },
    Logocontenedor: {
        alignItems: 'center',
        top: 60

    },

    ContenedorCampos: {
        width: '100%',
        marginTop: 80,
    },
    Campos: {
        height: 45,
        borderBottomWidth: 1,
        marginBottom: 20,
        fontSize: 16,
    },

    buttonContainer: {
        alignItems: 'center',
        gap: 100,
        marginTop: 40,
    },
    btnPrimary: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#082143'
    },

});