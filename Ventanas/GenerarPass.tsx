import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Switch,
    ScrollView,
    SafeAreaView,
    TextInput,
    ImageBackground,
    NativeModules,
    Alert,

} from 'react-native';
import Slider from '@react-native-community/slider';

const C = {
    bg: 'transparent',
    card: 'transparent',
    cardInner: '#121f5aff',
    text: '#ffffff',
    sub: '#080808ff',
    accent: '#0d2652ff',
    border: '#262a38',
    teal: '#00e5c3',
    red: '#ff4d4d',
};
 
export default function GeneratorScreen() {

    const [length, setLength] = useState(12);

    const [options, setOptions] = useState({
        uppercase: { on: true, min: 1 },
        lowercase: { on: true, min: 1 },
        numbers: { on: true, min: 1 },
        symbols: { on: false, min: 1 },
    });
   
    const toggleOption = (key: keyof typeof options) => {
        setOptions(prev => ({
            ...prev,
            [key]: { ...prev[key], on: !prev[key].on }
        }));
    };

    const setMin = (key: keyof typeof options, value: string) => {
        const num = parseInt(value) || 0;
        setOptions(prev => ({
            ...prev,
            [key]: { ...prev[key], min: num }
        }));
    };

    // Total de mínimos pedidos vs longitud
    const totalMin = Object.values(options)
        .filter(o => o.on)
        .reduce((acc, o) => acc + o.min, 0);
    const exceeded = totalMin > length;

    const ITEMS = [
        { icon: 'A↑', label: 'Mayusculas', sub: 'A-Z', key: 'uppercase' },
        { icon: 'a↓', label: 'Minusculas', sub: 'a-z', key: 'lowercase' },
        { icon: '1', label: 'Numeros', sub: '0-9', key: 'numbers' },
        { icon: '@', label: 'Simbolos', sub: '!@#', key: 'symbols' },
    ] as const;
    const FondoLogin = require('../assets/FondoLogin.jpeg');
    const { GenerarPass } = NativeModules;
    const [password,  setPassword]  = useState('');
const [fortaleza, setFortaleza] = useState('');
    const GenerarPasse = async () => {



      
    try {
      const Insertar = await GenerarPass.generarContrasena(
        length,               
        options.uppercase.on,options.uppercase.min, 
        options.lowercase.on,options.lowercase.min, 
        options.numbers.on,options.numbers.min,   
        options.symbols.on,options.symbols.min
      );
      Alert.alert("Éxito", "Login Correcto");
      setPassword(Insertar.contrasena);
      setFortaleza(Insertar.fortaleza);
      
    } catch (error: any) {
      // Aquí recibes el 'promise.reject' que configuramos en Kotlin
      Alert.alert("Error", error.message);
      
    }
  };

   const BarraProg: Record<string, { color: string; width: string }> = {
        'Muy débil':  { color: '#ff4d4d', width: '15%'  },
        'Débil':      { color: '#ff4d4d', width: '35%'  },
        'Media':      { color: '#f5a623', width: '55%'  },
        'Fuerte':     { color: '#00e5c3', width: '80%'  },
        'Muy fuerte': { color: '#00e5c3', width: '100%' },
    };
    const fort = BarraProg[fortaleza] ?? null;
    return (

        <ImageBackground
            source={FondoLogin} 
            style={styles.Fondo}
            resizeMode="cover"
        >
            <ScrollView style={styles.container} contentContainerStyle={styles.content}>
                {/* Header */}
                <Text style={styles.title}>Generador de Contraseñas</Text>


                {/* Password Display Card */}
                <View style={styles.card}>

                    <View style={styles.passwordBox}>
                        <Text style={styles.passwordText}>{password ? password : '· · · · · · · · ·'}</Text>
                    </View>
                    <TouchableOpacity style={styles.copyButton}>
                        <Text style={styles.copyIcon}>⧉</Text>
                        <Text style={styles.copyText}>Copy password</Text>
                    </TouchableOpacity>
                    <View style={styles.divider} />
                    <View style={styles.strengthRow}>
                        <Text style={styles.strengthLabel}>Security</Text>
                        <Text style={styles.strengthValue}>{fortaleza ? fortaleza : '—'}</Text>
                    </View>
                   <View style={styles.progressBg}>
                        <View style={[styles.progressFill, {
                            width: (fort?.width ?? 0) as any,
                            backgroundColor: fort?.color ?? 'transparent',
                        }]} />
                    </View>
                </View>

                {/* Options Card */}
                <View style={styles.card}>
                    {/* Length */}
                    <View style={styles.lengthRow}>
                        <Text style={styles.optionLabel}>Length</Text>
                        <View style={[styles.lengthBadge, exceeded && styles.lengthBadgeWarning]}>
                            <Text style={styles.lengthBadgeText}>
                                {exceeded ? `⚠️ Mín: ${totalMin}` : length}
                            </Text>
                        </View>
                    </View>
                    <Slider
                        style={styles.slider}
                        minimumValue={4}
                        maximumValue={32}
                        step={1}
                        value={length}
                        onValueChange={(val) => setLength(val)}
                        minimumTrackTintColor={C.accent}
                        maximumTrackTintColor={C.border}
                        thumbTintColor={C.accent}
                    />
                    <View style={styles.sliderRange}>
                        <Text style={styles.rangeText}>4</Text>
                        <Text style={styles.rangeText}>32</Text>
                    </View>


                    {ITEMS.reduce((rows, _, index) => {
                        if (index % 2 === 0) rows.push([ITEMS[index], ITEMS[index + 1]]);
                        return rows;
                    }, []).map((pair, rowIndex) => (
                        <View key={`row-${rowIndex}`} style={styles.gridRow}>
                            {pair.map((item) => {
                                if (!item) return null;
                                const opt = options[item.key];

                                return (
                                    <View key={item.label} style={styles.gridColumn}>
                                        {/* Switch e Info */}
                                        <View style={styles.toggleRowInline}>
                                            <View style={styles.toggleInfoInline}>
                                                <Text style={styles.toggleIconTextInline}>{item.icon}</Text>
                                                <Text
                                                    style={styles.toggleLabelInline}
                                                    numberOfLines={1}
                                                    ellipsizeMode="tail"
                                                >
                                                    {item.label}
                                                </Text>
                                            </View>
                                            <Switch
                                                value={opt.on}
                                                onValueChange={() => toggleOption(item.key)}
                                                trackColor={{ false: C.border, true: C.accent }}
                                                thumbColor={C.text}
                                                style={{ transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }] }}
                                            />
                                        </View>

                                        {/* Mínimos */}
                                        {opt.on && (
                                            <View style={styles.minContainerInline}>
                                                <Text style={styles.minLabelInline}>Min:</Text>
                                                <View style={styles.minControlsInline}>
                                                    <TouchableOpacity
                                                        style={styles.minBtnInline}
                                                        onPress={() => setMin(item.key, String(Math.max(0, opt.min - 1)))}
                                                    >
                                                        <Text style={styles.minBtnTextInline}>−</Text>
                                                    </TouchableOpacity>
                                                    <TextInput
                                                        style={styles.minInputInline}
                                                        value={String(opt.min)}
                                                        onChangeText={(val) => setMin(item.key, val)}
                                                        keyboardType="numeric"
                                                        maxLength={2}
                                                    />
                                                    <TouchableOpacity
                                                        style={styles.minBtnInline}
                                                        onPress={() => setMin(item.key, String(opt.min + 1))}
                                                    >
                                                        <Text style={styles.minBtnTextInline}>+</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        )}
                                    </View>
                                );
                            })}
                        </View>
                    ))}

                </View>
                <View style={styles.footer}>
                    <TouchableOpacity style={[styles.generateButton, exceeded && styles.generateButtonDisabled]} onPress={GenerarPasse}>
                        <Text style={styles.generateIcon}>↻</Text>
                        <Text style={styles.generateText}>Generate Password</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </ImageBackground>
    );

}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: C.bg },
    container: { flex: 1 },
    content: { padding: 20, paddingBottom: 100 },

    title: { fontSize: 26, fontWeight: '700', color: C.text, marginTop: 12 },
    subtitle: { fontSize: 13, color: C.sub, marginTop: 4, marginBottom: 20 },

    card: { backgroundColor: C.card, borderRadius: 16, padding: 18, marginBottom: 16 },
    cardLabel: { fontSize: 11, color: C.sub, letterSpacing: 1.5, textAlign: 'center', marginBottom: 14 },

    passwordBox: { backgroundColor: C.cardInner, borderRadius: 10, padding: 18, alignItems: 'center', marginBottom: 14 },
    passwordText: { fontSize: 18, color: C.text, fontFamily: 'monospace', letterSpacing: 2 },

    copyButton: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        backgroundColor: C.cardInner, borderRadius: 20, paddingVertical: 6, gap: 4
    },
    copyIcon: { fontSize: 16, color: C.text },
    copyText: { fontSize: 15, color: C.text, fontWeight: '500' },

    divider: { height: 1, backgroundColor: C.border, marginVertical: 16 },
    strengthRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    strengthLabel: { fontSize: 14, color: C.sub },
    strengthValue: { fontSize: 14, color: C.teal, fontWeight: '600' },
    progressBg: { height: 6, backgroundColor: C.border, borderRadius: 3 },
    progressFill: { height: 6, borderRadius: 3 },

    lengthRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    optionLabel: { fontSize: 16, color: C.text, fontWeight: '600' },
    lengthBadge: { backgroundColor: C.cardInner, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 4 },
    lengthBadgeText: { color: C.text, fontWeight: '700', fontSize: 15 },
    slider: { marginVertical: 8 },
    sliderRange: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
    rangeText: { fontSize: 12, color: C.sub },

    warningBox: {
        backgroundColor: '#2a1a1a', borderRadius: 8, padding: 10, marginBottom: 12,
        borderWidth: 1, borderColor: C.red
    },
    warningText: { color: C.red, fontSize: 12, textAlign: 'center' },

    toggleRow: {
        flexDirection: 'row', alignItems: 'center', paddingVertical: 12,
        borderTopWidth: 1, borderTopColor: C.border
    },
    toggleIcon: {
        width: 38, height: 38, borderRadius: 10, backgroundColor: C.cardInner,
        alignItems: 'center', justifyContent: 'center', marginRight: 14
    },
    toggleIconText: { color: C.text, fontSize: 13, fontWeight: '700' },
    toggleInfo: { flex: 1 },
    toggleLabel: { color: C.text, fontSize: 15, fontWeight: '500' },
    toggleSub: { color: C.sub, fontSize: 12, marginTop: 2 },

    // Mínimos
    minRow: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: C.cardInner, borderRadius: 10, padding: 10, marginBottom: 8
    },
    minLabel: { color: C.sub, fontSize: 13, flex: 1 },
    minControls: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    minBtn: {
        width: 30, height: 30, borderRadius: 8, backgroundColor: C.border,
        alignItems: 'center', justifyContent: 'center'
    },
    minBtnText: { color: C.text, fontSize: 18, fontWeight: '700', lineHeight: 22 },
    minInput: {
        width: 36, height: 30, backgroundColor: C.border, borderRadius: 6,
        color: C.text, textAlign: 'center', fontSize: 14, fontWeight: '700'
    },

    footer: {
        position: 'absolute', bottom: 50, left: 0, right: 0,
        padding: 20, backgroundColor: C.bg
    },
    generateButton: {
        backgroundColor: C.accent, borderRadius: 14, paddingVertical: 16,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10
    },
    generateButtonDisabled: { backgroundColor: '#2a3a5a', opacity: 0.6 },
    generateIcon: { fontSize: 18, color: C.text },
    generateText: { fontSize: 16, color: C.text, fontWeight: '700' },
    Fondo: { flex: 1 },
    gridRow: {
        flexDirection: 'row',
        justifyContent: 'center', // Cambiado de 'space-between' a 'center' para que se unan en el medio
        marginBottom: 12,
        gap: 0, // Espacio fijo y pequeño entre la columna izquierda y derecha
        width: '105%',
    },
    gridColumn: {
        flex: 1,
        maxWidth: '148%', // Evita que se estiren de más hacia los lados

        paddingVertical: 8,
        paddingHorizontal: 2, // Padding interno más ajustado para aprovechar el ancho
        borderRadius: 8,
        overflow: 'hidden',
    },
    toggleRowInline: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    toggleInfoInline: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 2, // Espacio mínimo de seguridad antes del Switch
        overflow: 'hidden',
    },
    toggleIconTextInline: {
        fontSize: 14,
        marginRight: 3,
        color: '#0c0c0cff',
    },
    toggleLabelInline: {
        fontSize: 12, // Tamaño ideal para que nombres como "Uppercase" no se tapen
        fontWeight: '500',
        color: '#030303ff', // Ajusta según tu paleta de colores
        flex: 1,
    },
    minContainerInline: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 6,
        borderTopWidth: 2,
        borderTopColor: 'rgba(255,255,255,0.1)',
        paddingTop: 4,
    },
    minLabelInline: {
        fontSize: 11,
        color: '#0f0f0fff',
    },
    minControlsInline: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    minBtnInline: {
        width: 25, // Más compacto para que no empuje los márgenes externos
        height: 25,
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    minBtnTextInline: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#000',
    },
    minInputInline: {
        width: 20,
        textAlign: 'center',
        fontSize: 11,
        padding: 0,
        marginHorizontal: 2,
        color: '#070707ff',
    },
});