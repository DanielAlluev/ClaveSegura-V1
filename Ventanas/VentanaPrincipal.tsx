import React, { useRef, useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
    ImageBackground,
    Dimensions,
    Animated,
    Easing,
    FlatList,
    Image,
    Alert,
    NativeModules
} from 'react-native';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';




const Stack = createNativeStackNavigator();


export default function VentanaPrincipal() {

    const navigation = useNavigation<any>();
    const route = useRoute();
    const params = route.params as { idUsuario?: number } | undefined;
    const idUsuario = params?.idUsuario || 0;


    const FondoLogin = require('../assets/FondoLogin.jpeg');
    const [abierto, setAbierto] = useState(false);

    // Valor animado único para controlar todo el movimiento (0 a 1)
    const anim = useRef(new Animated.Value(0)).current;

    const ejecutarRuleta = () => {

        const toValue = abierto ? 0 : 1;
        Animated.timing(anim, {
            toValue: toValue,
            duration: 700,
            easing: Easing.out(Easing.back(1.2)), // Efecto de llegada suave
            useNativeDriver: true,
        }).start();
        setAbierto(!abierto);
    };

    // --- INTERPOLACIONES PARA BOTÓN IZQUIERDO (Lista) ---
    const moverIzquierdaX = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [-width * 0.5, -width * 0.25], // Viene de fuera de la pantalla
    });
    const moverIzquierdaY = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [100, 0], // Sube desde abajo
    });
    const rotarIzquierda = anim.interpolate({
        inputRange: [0, 1],
        outputRange: ['-360deg', '0deg'],
    });

    // --- INTERPOLACIONES PARA BOTÓN DERECHO (Generar) ---
    const moverDerechaX = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [width * 0.5, width * 0.25], // Viene del otro lado
    });
    const moverDerechaY = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [100, 0], // Sube desde abajo
    });
    const rotarDerecha = anim.interpolate({
        inputRange: [0, 1],
        outputRange: ['360deg', '0deg'],
    });

    // --- ANIMACIÓN BOTÓN CENTRAL (Giro de la flecha/icono) ---
    const rotarCentro = anim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '90deg'],
    });

    const [datos, setDatos] = useState([]);

    const [isGrid, setIsGrid] = useState(true);

    useEffect(() => {
        CargarDatos();


    }, []);

    const { VentanaPrincipal } = NativeModules;

    const CargarDatos = async () => {
        try {
            const CargarDatos = await VentanaPrincipal.CargarDatos(
                idUsuario,

            );
            console.log(CargarDatos);
            setDatos(JSON.parse(CargarDatos));
            Alert.alert("Éxito", "Datos cargados correctamente");
        } catch (error: any) {
            // Aquí recibes el 'promise.reject' que configuramos en Kotlin
            Alert.alert("Error", error.message);
        }
    };









    const MOCK_DATA = [
        { id: '1', nombre: 'IMG_20260115_124623', uri: 'https://picsum.photos/200/300?sig=1' },
        { id: '2', nombre: 'IMG_20260115_124723', uri: 'https://picsum.photos/200/300?sig=2' },
        { id: '3', nombre: 'IMG_20260304_192015', uri: 'https://picsum.photos/200/300?sig=3' },
        { id: '4', nombre: 'IMG_20260115_124633', uri: 'https://picsum.photos/200/300?sig=4' },
        { id: '5', nombre: 'IMG_20260115_124636', uri: 'https://picsum.photos/200/300?sig=5' },
        { id: '6', nombre: 'IMG_20260115_131217', uri: 'https://picsum.photos/200/300?sig=6' },
    ];

    // Renderizador de cada tarjeta
    const renderItem = ({ item }: { item: any }) => {
        return (
            <TouchableOpacity onPress={() => navigation.navigate('EditarPass', { item: item })}
                style={isGrid ? styles.gridItem : styles.listItem}>


                <View style={isGrid ? styles.gridItem : styles.listItem}>
                    <Image
                        source={item.rutaImagen ? { uri: item.rutaImagen } : require('../assets/favicon.png')}
                        style={isGrid ? styles.gridImage : styles.listImage}
                    />
                    <View style={styles.textContainer}>
                        <Text style={styles.fileName} numberOfLines={2}>
                            {item.titulo}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };
    return (
        <ImageBackground source={FondoLogin} style={styles.Fondo} resizeMode='cover'>

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Galería</Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => setIsGrid(false)} style={styles.iconButton}>
                        <Text style={{ color: !isGrid ? '#050000ff' : '#1504fdff', fontSize: 20 }}>☰</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setIsGrid(true)} style={styles.iconButton}>
                        <Text style={{ color: isGrid ? '#070000ff' : '#0430f5ff', fontSize: 20 }}>⊞</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* La lista que cambia de forma */}
            <FlatList
                data={datos}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                // IMPORTANTE: Cambiar la 'key' según 'isGrid' para que React refresque las columnas
                key={isGrid ? 'grid' : 'list'}
                numColumns={isGrid ? 2 : 1}
                contentContainerStyle={styles.listContent}
            />
            <View style={styles.contenidoSuperior}>
                <Text style={styles.tituloApp}>ClaveSegura</Text>
            </View>

            {/* Contenedor en la zona oscura de la foto */}
            <View style={styles.arcoOscuro}>

                {/* BOTÓN IZQUIERDO: Ver Lista */}
                <Animated.View style={[styles.botonLateral, {
                    transform: [
                        { translateX: moverIzquierdaX },
                        { translateY: moverIzquierdaY },
                        { rotate: rotarIzquierda }
                    ],
                    opacity: anim
                }]}>
                    <TouchableOpacity style={styles.botonAccion} onPress={() => { navigation.navigate('RegistroPass', { idUsuario }); }}>
                        <MaterialCommunityIcons name="format-list-bulleted" size={28} color="#C4FFF9" />
                        <Text style={styles.textoBotonSmall}>Añadir App</Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* BOTÓN DERECHO: Generar */}
                <Animated.View style={[styles.botonLateral, {
                    transform: [
                        { translateX: moverDerechaX },
                        { translateY: moverDerechaY },
                        { rotate: rotarDerecha }
                    ],
                    opacity: anim
                }]}>
                    <TouchableOpacity style={styles.botonAccion} onPress={() => console.log('Generar')}>
                        <FontAwesome5 name="key" size={24} color="#C4FFF9" />
                        <Text style={styles.textoBotonSmall}>Generar Clave</Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* BOTÓN CENTRAL: El disparador */}
                <TouchableOpacity style={styles.botonCentral} onPress={ejecutarRuleta}>
                    <Animated.View style={{ transform: [{ rotate: rotarCentro }] }}>
                        <MaterialCommunityIcons
                            name={abierto ? "close" : "plus-circle"}
                            size={50}
                            color="#C4FFF9"
                        />
                    </Animated.View>
                </TouchableOpacity>

            </View>


        </ImageBackground >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 30,
        backgroundColor: '#3498db', // Color azul como tu captura
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingTop: 40,
    },
    headerTitle: {
        fontSize: 24,
        color: 'white',
        fontWeight: '600',
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 15,
        backgroundColor: '#f3db05ff',
        borderRadius: 10,
    },
    iconButton: {
        padding: 5,
    },
    listContent: {
        paddingHorizontal: 10,

    },
    // Estilos modo GRID (Cuadrícula)
    gridItem: {
        flex: 1,
        margin: 8,
        maxWidth: (width / 2) - 20, // Dos columnas
    },
    gridImage: {
        width: '100%',
        height: 150,
        borderRadius: 4,
        backgroundColor: '#2c3e50',
    },
    // Estilos modo LISTA (Normal)
    listItem: {
        flexDirection: 'row',
        marginVertical: 5,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 8,
        padding: 10,
        alignItems: 'center',
    },
    listImage: {
        width: 80,
        height: 60,
        borderRadius: 4,
        backgroundColor: '#2c3e50',
    },
    textContainer: {
        flex: 1,
        marginLeft: 10,
    },
    fileName: {
        color: 'black',
        fontSize: 12,
    },


    Fondo: { flex: 1 },
    safeArea: { flex: 1 },
    contenidoSuperior: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tituloApp: {
        fontSize: 32,
        color: '#001F3F',
        fontWeight: '300',
    },
    arcoOscuro: {
        position: 'absolute',
        bottom: 40, // Ajuste para los botones del móvil
        width: width,
        height: 90,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    botonCentral: {
        zIndex: 10,
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
    },
    botonLateral: {
        position: 'absolute',
        zIndex: 5,
    },
    botonAccion: {
        width: 90,
        height: 90,
        borderRadius: 55,
        backgroundColor: 'rgba(255, 255, 255, 0.1)', // Fondo sutil para que se vea el botón
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 5
        ,
        borderColor: 'rgba(196, 255, 249, 0.3)',
    },
    textoBotonSmall: {
        color: '#C4FFF9',
        fontSize: 9,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginTop: 4,
        marginLeft: 0,
        textAlign: 'center',
    },
});