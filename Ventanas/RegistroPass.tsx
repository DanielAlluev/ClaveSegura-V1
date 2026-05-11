import React, { useState, useRef } from 'react';
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
    NativeModules,

} from 'react-native';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
const Myscreen = () => {

}


export default function App() {
    const FondoLogin = require('../assets/FondoLogin.jpeg');
    const route = useRoute();
    const params = route.params as { idUsuario?: number } | undefined;
    const idUsuario = params?.idUsuario || 0;

    const [titulo, setTitulo] = useState('');
    const [urlpag, seturlpag] = useState('');
    const [AppName, setappName] = useState('');
    const [UsuarioCredencial, setUsuarioCredencial] = useState('');
    const [PassCredencial, setPassCredencial] = useState('');
    const [Notas, setNotas] = useState('');
    const { RegistrarPass } = NativeModules;

    const urlpagRef = useRef<TextInput>(null);
    const AppNameRef = useRef<TextInput>(null);
    const UsuarioCredencialRef = useRef<TextInput>(null);
    const PassCredencialRef = useRef<TextInput>(null);
    const NotasRef = useRef<TextInput>(null);

    const handleRegistro = async () => {
        try {
            // Llamamos al método authenticate de tu archivo Kotlin
            const result = await RegistrarPass.authenticate(

                titulo,
                urlpag,
                AppName,
                UsuarioCredencial,
                PassCredencial,
                Notas
            );
            const Insertar = await RegistrarPass.insertar(
                idUsuario,
                titulo,
                urlpag,
                AppName,
                UsuarioCredencial,
                PassCredencial,
                Notas
            );
            Alert.alert("Éxito", "Usuario registrado correctamente");
        } catch (error: any) {
            // Aquí recibes el 'promise.reject' que configuramos en Kotlin
            Alert.alert("Error", error.message);
        }
    };

    const Logo = require('../assets/Logo.jpeg');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    return (
        <ImageBackground source={FondoLogin} style={styles.Fondo} resizeMode='cover'>
            <View style={styles.Contenedor}>



                <View style={styles.ContenedorCampos}>
                    <TextInput
                        style={styles.Campos}
                        placeholder="Titulo"
                        placeholderTextColor={"#666"}
                        value={titulo}
                        returnKeyType='next'
                        onSubmitEditing={() => urlpagRef.current?.focus()}
                        blurOnSubmit={false}
                        onChangeText={setTitulo}
                    />
                    <TextInput
                        ref={urlpagRef}
                        style={styles.Campos}
                        placeholder="URL Pagina"
                        placeholderTextColor={"#666"}
                        value={urlpag}
                        onChangeText={seturlpag}
                        returnKeyType='next'
                        onSubmitEditing={() => AppNameRef.current?.focus()}
                    />
                    <TextInput
                        ref={AppNameRef}
                        style={styles.Campos}
                        placeholder="Nombre de la Aplicacion"
                        placeholderTextColor={"#666"}
                        value={AppName}
                        onChangeText={setappName}
                        returnKeyType='next'
                        onSubmitEditing={() => UsuarioCredencialRef.current?.focus()}
                    />

                    <TextInput
                        ref={UsuarioCredencialRef}
                        style={styles.Campos}
                        placeholder="Usuario de la App"
                        placeholderTextColor={"#666"}
                        value={UsuarioCredencial}
                        onChangeText={setUsuarioCredencial}
                        returnKeyType='next'
                        onSubmitEditing={() => PassCredencialRef.current?.focus()}
                    />
                    <TextInput
                        ref={PassCredencialRef}
                        style={styles.Campos}
                        placeholder="Contraseña de Usuario"
                        placeholderTextColor={"#666"}
                        value={PassCredencial}
                        onChangeText={setPassCredencial}
                        secureTextEntry={!isPasswordVisible}
                        returnKeyType='next'
                        onSubmitEditing={() => NotasRef.current?.focus()}

                    />

                    {PassCredencial.length > 0 && (
                        <TouchableOpacity
                            style={styles.botonOjoAbsoluto}
                            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                        >
                            <Text style={{ fontSize: 20 }}>
                                {isPasswordVisible ? '👁️' : '🙈'}
                            </Text>
                        </TouchableOpacity>
                    )}
                    <TextInput
                        ref={NotasRef}
                        style={styles.Campos}
                        placeholder="Notas"
                        placeholderTextColor={"#666"}
                        value={Notas}
                        onChangeText={setNotas}
                        returnKeyType='done'
                        onSubmitEditing={() => { }}
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
    botonOjoAbsoluto: {
        position: 'absolute',
        right: 20,          // Distancia desde el borde derecho
        top: 285,            // Ajusta esto según la altura de tu input para centrarlo
        zIndex: 1,          // Asegura que esté por encima del input para poder tocarlo
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
        marginTop: 2,
        gap: 5,
    },
    Campos: {
        borderWidth: 1,
        borderColor: "#082143",
        height: 45,
        borderRadius: 50,
        borderBottomWidth: 1,
        borderCurve: "continuous",
        textAlign: "center",
        marginBottom: 20,
        fontSize: 16,
    },

    buttonContainer: {
        alignItems: 'center',
        gap: 100,
        marginTop: 230,
    },
    btnPrimary: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#082143'
    },

});