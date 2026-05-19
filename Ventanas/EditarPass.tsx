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
    ActionSheetIOS,
    Platform,
    Modal,
    ScrollView,
    KeyboardAvoidingView,
    Animated,
    Keyboard,
    Button,



} from 'react-native';
import { NavigationContainer, useNavigation, useRoute, } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';
const Myscreen = () => {

}


export default function App() {
    const FondoLogin = require('../assets/FondoLogin.jpeg');



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
    const [imagenUri, setImagenUri] = useState(null);
    const [menuVisible, setMenuVisible] = useState(false);
    const InsertarPass = async () => {
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
                item.id,
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
    const AbrirGaleria = async () => {
        try {
            // Llamamos al método authenticate de tu archivo Kotlin
            const uri = await RegistrarPass.abrirGaleria();
            Alert.alert("¡Llegó la URI!", uri ? uri : "La URI vino vacía");
            if (uri) {
                setImagenUri(uri);
            }
        } catch (error: any) {
            // Aquí recibes el 'promise.reject' que configuramos en Kotlin
            Alert.alert("Error", error.message);
        }
    };


    const Logo = require('../assets/Logo.jpeg');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const route = useRoute();
    const { datos } = route.params;

    const copiarAlPortapapeles = async (texto, campo) => {
        if (!texto) {
            Alert.alert("Vacío", `No hay nada que copiar en el campo ${campo}`);
            return;
        }
        await Clipboard.setStringAsync(texto); // Con "Async" al final
        Alert.alert("Copiado", `${campo} copiado al portapapeles`);
    };

    const abrirMenuOpciones = () => {
        if (Platform.OS === 'ios') {
            // Menú nativo de iOS que sube desde abajo
            ActionSheetIOS.showActionSheetWithOptions(
                {
                    options: ['Cancelar', 'Editar', 'Eliminar'],
                    destructiveButtonIndex: 2, // Pone el botón Eliminar en rojo
                    cancelButtonIndex: 0,
                },
                (buttonIndex) => {
                    if (buttonIndex === 1) {
                        // Acción de Editar (puedes navegar a EditarPass)
                        console.log('Editar pulsado');
                    } else if (buttonIndex === 2) {
                        // Acción de Eliminar
                        console.log('Eliminar pulsado');
                    }
                }
            );
        } else {
            // En Android usamos un Alert con múltiples opciones
            Alert.alert(
                "Opciones",
                "¿Qué deseas hacer?",
                [
                    { text: "Cancelar", style: "cancel" },
                    { text: "Editar", onPress: () => console.log("Editar pulsado") },
                    { text: "Eliminar", onPress: () => console.log("Eliminar pulsado"), style: "destructive" }
                ],
                { cancelable: true }
            );
        }
    };


    return (
        <ImageBackground source={FondoLogin} style={styles.Fondo} resizeMode='cover'>


            <TouchableOpacity
                style={styles.botonTresPuntos}
                onPress={() => setMenuVisible(true)}
            >
                <Text style={{ fontSize: 24, color: '#082143', fontWeight: 'bold' }}>⋮</Text>
            </TouchableOpacity>

            <View style={styles.Contenedor}>

                <View style={styles.ContenedorCampos}>

                    {/* Botón de la Foto */}
                    <TouchableOpacity style={styles.botonFoto} onPress={() => AbrirGaleria()}>
                        {imagenUri ? (
                            <Image source={{ uri: imagenUri }} style={{ width: 200, height: 200, backgroundColor: 'transparent', resizeMode: 'stretch' }} />
                        ) : (
                            <Text>+</Text>
                        )}
                    </TouchableOpacity>

                    {/* 1. INPUT TITULO */}
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.Campos}
                            placeholder="Titulo"
                            placeholderTextColor={"#666"}
                            value={datos.titulo}
                            returnKeyType='next'
                            onSubmitEditing={() => urlpagRef.current?.focus()}
                            blurOnSubmit={false}
                            onChangeText={setTitulo}
                        />
                        <TouchableOpacity style={styles.botonCopiar} onPress={() => copiarAlPortapapeles(titulo, "Título")}>
                            <Text style={styles.iconoCopiar}>📋</Text>
                        </TouchableOpacity>
                    </View>

                    {/* 2. INPUT URL PAGINA */}
                    <View style={styles.inputContainer}>
                        <TextInput
                            ref={urlpagRef}
                            style={styles.Campos}
                            placeholder="URL Pagina"
                            placeholderTextColor={"#666"}
                            value={datos.urlPagina}
                            onChangeText={seturlpag}
                            returnKeyType='next'
                            onSubmitEditing={() => AppNameRef.current?.focus()}
                        />
                        <TouchableOpacity style={styles.botonCopiar} onPress={() => copiarAlPortapapeles(urlpag, "URL")}>
                            <Text style={styles.iconoCopiar}>📋</Text>
                        </TouchableOpacity>
                    </View>

                    {/* 3. INPUT NOMBRE APP */}
                    <View style={styles.inputContainer}>
                        <TextInput
                            ref={AppNameRef}
                            style={styles.Campos}
                            placeholder="Nombre de la Aplicacion"
                            placeholderTextColor={"#666"}
                            value={datos.appName}
                            onChangeText={setappName}
                            returnKeyType='next'
                            onSubmitEditing={() => UsuarioCredencialRef.current?.focus()}
                        />
                        <TouchableOpacity style={styles.botonCopiar} onPress={() => copiarAlPortapapeles(AppName, "Nombre de App")}>
                            <Text style={styles.iconoCopiar}>📋</Text>
                        </TouchableOpacity>
                    </View>

                    {/* 4. INPUT USUARIO */}
                    <View style={styles.inputContainer}>
                        <TextInput
                            ref={UsuarioCredencialRef}
                            style={styles.Campos}
                            placeholder="Usuario de la App"
                            placeholderTextColor={"#666"}
                            value={datos.usuarioCredenciales}
                            onChangeText={setUsuarioCredencial}
                            returnKeyType='next'
                            onSubmitEditing={() => PassCredencialRef.current?.focus()}
                        />
                        <TouchableOpacity style={styles.botonCopiar} onPress={() => copiarAlPortapapeles(UsuarioCredencial, "Usuario")}>
                            <Text style={styles.iconoCopiar}>📋</Text>
                        </TouchableOpacity>
                    </View>

                    {/* 5. INPUT CONTRASEÑA */}
                    <View style={styles.inputContainer}>
                        <TextInput
                            ref={PassCredencialRef}
                            style={styles.Campos}
                            placeholder="Contraseña de Usuario"
                            placeholderTextColor={"#666"}
                            value={datos.passCredenciales}
                            onChangeText={setPassCredencial}
                            secureTextEntry={!isPasswordVisible}
                            returnKeyType='next'
                            onSubmitEditing={() => NotasRef.current?.focus()}
                        />
                        {/* Contenedor de acciones para la contraseña (Ojo y Copiar) */}
                        <View style={styles.accionesPassword}>
                            {PassCredencial.length > 0 && (
                                <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                                    <Text style={{ fontSize: 18 }}>{isPasswordVisible ? '👁️' : '🙈'}</Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity onPress={() => copiarAlPortapapeles(PassCredencial, "Contraseña")}>
                                <Text style={styles.iconoCopiar}>📋</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* 6. INPUT NOTAS */}
                    <View style={styles.inputContainer}>
                        <TextInput
                            ref={NotasRef}
                            style={styles.Campos}
                            placeholder="Notas"
                            placeholderTextColor={"#666"}
                            value={datos.notas}
                            onChangeText={setNotas}
                            returnKeyType='done'
                        />
                        <TouchableOpacity style={styles.botonCopiar} onPress={() => copiarAlPortapapeles(Notas, "Notas")}>
                            <Text style={styles.iconoCopiar}>📋</Text>
                        </TouchableOpacity>
                    </View>

                </View>
                <Modal
                    visible={menuVisible}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setMenuVisible(false)}
                >
                    {/* Este Touchable invisible permite cerrar el menú si el usuario toca fuera de él */}
                    <TouchableOpacity
                        style={styles.modalOverlay}
                        activeOpacity={1}
                        onPress={() => setMenuVisible(false)}
                    >
                        <View style={styles.menuFlotante}>
                            <TouchableOpacity
                                style={styles.opcionMenu}
                                onPress={() => { setMenuVisible(false); /* Tu lógica de editar aquí */ }}
                            >
                                <Text style={styles.textoOpcion}>✏️ Editar</Text>
                            </TouchableOpacity>

                            <View style={styles.separador} />

                            <TouchableOpacity
                                style={styles.opcionMenu}
                                onPress={() => { setMenuVisible(false); /* Tu lógica de eliminar aquí */ }}
                            >
                                <Text style={[styles.textoOpcion, { color: 'red' }]}>🗑️ Eliminar</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>


            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.1)', // Fondo muy sutilmente oscuro
    },
    menuFlotante: {
        position: 'absolute',
        top: 80,       // Ajusta la distancia desde arriba (debajo de tu botón de tres puntos)
        right: 25,     // Alineado con tu botón de tres puntos
        backgroundColor: '#fff',
        borderRadius: 8,
        width: 150,
        paddingVertical: 5,
        // Sombras para dar efecto de flotado
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    opcionMenu: {
        paddingVertical: 12,
        paddingHorizontal: 15,
    },
    textoOpcion: {
        fontSize: 16,
        color: '#333',
    },
    separador: {
        height: 1,
        backgroundColor: '#eaeaea',
        width: '100%',
    },
    Fondo: {
        flex: 1,
    },
    // Nuevos estilos para el botón de tres puntos de arriba
    botonTresPuntos: {
        position: 'absolute',
        top: 50, // Ajusta según el notch/safe area de tu dispositivo
        right: 25,
        zIndex: 10,
        padding: 10,
    },
    Contenedor: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingHorizontal: 30, // Reducido un poco para dar espacio a los botones laterales
        marginTop: '20%'
    },
    ContenedorCampos: {
        width: '100%',
        marginTop: 2,
        gap: 15, // Aumentado el gap para separar los bloques
    },
    // Contenedor fila para meter el Input y el Botón de copiar juntos
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        position: 'relative',
    },
    Campos: {
        flex: 1, // Hace que el input ocupe todo el espacio disponible dejando el botón al final
        borderWidth: 1,
        borderColor: "#082143",
        height: 45,
        borderRadius: 50,
        textAlign: "center",
        paddingRight: 50, // Espacio interno para que el texto largo no se tape con el botón
        paddingLeft: 20,
        fontSize: 16,
    },
    botonCopiar: {
        position: 'absolute',
        right: 15,
        height: '100%',
        justifyContent: 'center',
    },
    accionesPassword: {
        position: 'absolute',
        right: 15,
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        height: '100%',
    },
    iconoCopiar: {
        fontSize: 18,
    },
    botonFoto: {
        width: 200,
        height: 200,
        alignSelf: 'center',
        marginBottom: 20,
        borderWidth: 2,
        borderColor: '#000000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        alignItems: 'center',
        marginTop: 30,
    },
    btnPrimary: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#082143' // Cambiado a oscuro por si el fondo es claro, edítalo a tu gusto
    },
});