import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    Image,
    TouchableOpacity,
    Dimensions,
    SafeAreaView
} from 'react-native';

// Obtenemos el ancho de la pantalla para calcular las columnas
const { width } = Dimensions.get('window');

// 1. Simulación de datos que vendrían de tu base de datos
const MOCK_DATA = [
    { id: '1', nombre: 'IMG_20260115_124623', uri: 'https://picsum.photos/200/300?sig=1' },
    { id: '2', nombre: 'IMG_20260115_124723', uri: 'https://picsum.photos/200/300?sig=2' },
    { id: '3', nombre: 'IMG_20260304_192015', uri: 'https://picsum.photos/200/300?sig=3' },
    { id: '4', nombre: 'IMG_20260115_124633', uri: 'https://picsum.photos/200/300?sig=4' },
    { id: '5', nombre: 'IMG_20260115_124636', uri: 'https://picsum.photos/200/300?sig=5' },
    { id: '6', nombre: 'IMG_20260115_131217', uri: 'https://picsum.photos/200/300?sig=6' },
];

const App = () => {
    // Estado para controlar si es cuadrícula (true) o lista (false)
    const [isGrid, setIsGrid] = useState(true);

    // Renderizador de cada tarjeta
    const renderItem = ({ item }: { item: any }) => {
        return (
            <View style={isGrid ? styles.gridItem : styles.listItem}>
                <Image
                    source={{ uri: item.uri }}
                    style={isGrid ? styles.gridImage : styles.listImage}
                />
                <View style={styles.textContainer}>
                    <Text style={styles.fileName} numberOfLines={2}>
                        {item.nombre}.jpg
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Cabecera con título y botones de alternancia */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Galería</Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => setIsGrid(false)} style={styles.iconButton}>
                        <Text style={{ color: !isGrid ? '#fff' : '#ccc', fontSize: 20 }}>☰</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setIsGrid(true)} style={styles.iconButton}>
                        <Text style={{ color: isGrid ? '#fff' : '#ccc', fontSize: 20 }}>⊞</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* La lista que cambia de forma */}
            <FlatList
                data={MOCK_DATA}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                // IMPORTANTE: Cambiar la 'key' según 'isGrid' para que React refresque las columnas
                key={isGrid ? 'grid' : 'list'}
                numColumns={isGrid ? 2 : 1}
                contentContainerStyle={styles.listContent}
            />
        </SafeAreaView>
    );
};

// --- ESTILOS ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
        backgroundColor: '#3498db', // Color azul como tu captura
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
    },
    headerTitle: {
        fontSize: 24,
        color: 'white',
        fontWeight: '600',
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 15,
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
        height: 120,
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
        color: 'white',
        fontSize: 12,
    },
});

export default App;