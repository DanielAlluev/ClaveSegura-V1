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
} from 'react-native';
import Slider from '@react-native-community/slider';

const C = {
    bg: '#0f1117',
    card: '#1a1d27',
    cardInner: '#13151e',
    text: '#ffffff',
    sub: '#8890a4',
    accent: '#4f8ef7',
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
        { icon: 'A↑', label: 'Uppercase', sub: 'A-Z', key: 'uppercase' },
        { icon: 'a↓', label: 'Lowercase', sub: 'a-z', key: 'lowercase' },
        { icon: '123', label: 'Numbers', sub: '0-9', key: 'numbers' },
        { icon: '@', label: 'Symbols', sub: '!@#', key: 'symbols' },
    ] as const;

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView style={styles.container} contentContainerStyle={styles.content}>

                {/* Header */}
                <Text style={styles.title}>Generator</Text>
                <Text style={styles.subtitle}>Create cryptographically strong passwords</Text>

                {/* Password Display Card */}
                <View style={styles.card}>
                    <Text style={styles.cardLabel}>GENERATED PASSWORD</Text>
                    <View style={styles.passwordBox}>
                        <Text style={styles.passwordText}>Xy9#mP2$Lq</Text>
                    </View>
                    <TouchableOpacity style={styles.copyButton}>
                        <Text style={styles.copyIcon}>⧉</Text>
                        <Text style={styles.copyText}>Copy password</Text>
                    </TouchableOpacity>
                    <View style={styles.divider} />
                    <View style={styles.strengthRow}>
                        <Text style={styles.strengthLabel}>Security</Text>
                        <Text style={styles.strengthValue}>Very Strong</Text>
                    </View>
                    <View style={styles.progressBg}>
                        <View style={[styles.progressFill, { width: '100%', backgroundColor: C.teal }]} />
                    </View>
                </View>

                {/* Options Card */}
                <View style={styles.card}>

                    {/* Length */}
                    <View style={styles.lengthRow}>
                        <Text style={styles.optionLabel}>Length</Text>
                        <View style={styles.lengthBadge}>
                            <Text style={styles.lengthBadgeText}>{length}</Text>
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

                    {/* Aviso si se pasan los mínimos */}
                    {exceeded && (
                        <View style={styles.warningBox}>
                            <Text style={styles.warningText}>
                                ⚠️ Los mínimos ({totalMin}) superan la longitud ({length})
                            </Text>
                        </View>
                    )}

                    {/* Toggles */}
                    {ITEMS.map((item) => {
                        const opt = options[item.key];
                        return (
                            <View key={item.label}>
                                <View style={styles.toggleRow}>
                                    <View style={styles.toggleIcon}>
                                        <Text style={styles.toggleIconText}>{item.icon}</Text>
                                    </View>
                                    <View style={styles.toggleInfo}>
                                        <Text style={styles.toggleLabel}>{item.label}</Text>
                                        <Text style={styles.toggleSub}>{item.sub}</Text>
                                    </View>
                                    <Switch
                                        value={opt.on}
                                        onValueChange={() => toggleOption(item.key)}
                                        trackColor={{ false: C.border, true: C.accent }}
                                        thumbColor={C.text}
                                    />
                                </View>

                                {/* Input de mínimo — solo visible si el switch está ON */}
                                {opt.on && (
                                    <View style={styles.minRow}>
                                        <Text style={styles.minLabel}>Mínimo de {item.label.toLowerCase()}</Text>
                                        <View style={styles.minControls}>
                                            <TouchableOpacity
                                                style={styles.minBtn}
                                                onPress={() => setMin(item.key, String(Math.max(0, opt.min - 1)))}
                                            >
                                                <Text style={styles.minBtnText}>−</Text>
                                            </TouchableOpacity>
                                            <TextInput
                                                style={styles.minInput}
                                                value={String(opt.min)}
                                                onChangeText={(val) => setMin(item.key, val)}
                                                keyboardType="numeric"
                                                maxLength={2}
                                            />
                                            <TouchableOpacity
                                                style={styles.minBtn}
                                                onPress={() => setMin(item.key, String(opt.min + 1))}
                                            >
                                                <Text style={styles.minBtnText}>+</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}

                            </View>
                        );
                    })}
                </View>

            </ScrollView>

            {/* Generate Button */}
            <View style={styles.footer}>
                <TouchableOpacity style={[styles.generateButton, exceeded && styles.generateButtonDisabled]}>
                    <Text style={styles.generateIcon}>↻</Text>
                    <Text style={styles.generateText}>Generate Password</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
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
    passwordText: { fontSize: 22, color: C.text, fontFamily: 'monospace', letterSpacing: 2 },

    copyButton: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        backgroundColor: C.cardInner, borderRadius: 24, paddingVertical: 12, gap: 8
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
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: 20, backgroundColor: C.bg
    },
    generateButton: {
        backgroundColor: C.accent, borderRadius: 14, paddingVertical: 16,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10
    },
    generateButtonDisabled: { backgroundColor: '#2a3a5a', opacity: 0.6 },
    generateIcon: { fontSize: 18, color: C.text },
    generateText: { fontSize: 16, color: C.text, fontWeight: '700' },
});