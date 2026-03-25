import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Animated, SafeAreaView } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

export default function QRScannerScreen({ route, navigation }: any) {
  const { siteName } = route.params || { siteName: '현장' };
  const scanAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, { toValue: 280, duration: 2000, useNativeDriver: true }),
        Animated.timing(scanAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  
  const handleScanSuccess = () => {
    Alert.alert(
      "✅ [Aegivis 3.0 도착 인증 성공]", 
      `현장: ${siteName}\n인증 시각: ${new Date().toLocaleTimeString()}\n\n장비 고유 QR 코드가 정상 인식되었습니다. 상황실 관제 시스템에 요원님의 상태가 [근무지 배치됨]으로 최우선 공유되었습니다.\n\n이제 현장 제어 함체의 모든 물리적 잠금이 해제되며, 수동 제어 권한이 활성화됩니다. 안전 매뉴얼에 따라 작업을 수행하십시오.`,
      [{ text: "통합 관제로 복귀", onPress: () => navigation.navigate('Dashboard') }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <Feather name="x" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>현장 함체 인증</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>QR 코드 스캔</Text>
        <Text style={styles.subtitle}>Aegivis Unit 본체에 부착된\n보안 QR 코드를 인식 구역에 맞춰주세요.</Text>
        
        {/* Scanner Frame */}
        <View style={styles.cameraFrame}>
          <View style={styles.cornerTL} />
          <View style={styles.cornerTR} />
          <View style={styles.cornerBL} />
          <View style={styles.cornerBR} />
          
          <Animated.View style={[styles.scanLine, { transform: [{ translateY: scanAnim }] }]} />
          
          <View style={styles.centerBox}>
            <MaterialCommunityIcons name="qrcode-scan" size={80} color="rgba(255,255,255,0.05)" />
          </View>
        </View>

        <View style={styles.infoBox}>
          <MaterialCommunityIcons name="shield-check" size={16} color="#22c55e" />
          <Text style={styles.infoBoxText}>Fail-safe 3-Tier Security Active</Text>
        </View>

        <TouchableOpacity style={styles.simulateBtn} onPress={handleScanSuccess}>
          <Text style={styles.btnText}>스캔 시뮬레이션 (개발용)</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020408' },
  header: { height: 60, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  closeBtn: { padding: 5 },
  headerTitle: { color: '#fff', fontSize: 16, fontWeight: '800', marginLeft: 15, letterSpacing: 1 },
  
  content: { flex: 1, alignItems: 'center', padding: 20, paddingTop: 40 },
  title: { color: '#fff', fontSize: 28, fontWeight: '900', marginBottom: 12 },
  subtitle: { color: '#64748b', fontSize: 14, marginBottom: 50, textAlign: 'center', lineHeight: 22, fontWeight: '600' },
  
  cameraFrame: { width: 280, height: 280, marginBottom: 50, position: 'relative', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 32, overflow: 'hidden' },
  centerBox: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  
  scanLine: { position: 'absolute', top: 0, left: 20, right: 20, height: 2, backgroundColor: '#22c55e', shadowColor: '#22c55e', shadowOffset: {width: 0, height: 0}, shadowOpacity: 1, shadowRadius: 10, elevation: 5 },
  
  cornerTL: { position: 'absolute', top: 20, left: 20, width: 40, height: 40, borderTopWidth: 4, borderLeftWidth: 4, borderColor: '#22c55e', borderTopLeftRadius: 16 },
  cornerTR: { position: 'absolute', top: 20, right: 20, width: 40, height: 40, borderTopWidth: 4, borderRightWidth: 4, borderColor: '#22c55e', borderTopRightRadius: 16 },
  cornerBL: { position: 'absolute', bottom: 20, left: 20, width: 40, height: 40, borderBottomWidth: 4, borderLeftWidth: 4, borderColor: '#22c55e', borderBottomLeftRadius: 16 },
  cornerBR: { position: 'absolute', bottom: 20, right: 20, width: 40, height: 40, borderBottomWidth: 4, borderRightWidth: 4, borderColor: '#22c55e', borderBottomRightRadius: 16 },
  
  infoBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(34,197,94,0.1)', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, marginBottom: 40 },
  infoBoxText: { color: '#22c55e', fontSize: 11, fontWeight: '900', letterSpacing: 1, textTransform: 'uppercase' },

  simulateBtn: { backgroundColor: 'rgba(255,255,255,0.05)', paddingVertical: 18, paddingHorizontal: 40, borderRadius: 32, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  btnText: { color: '#fff', fontWeight: '800', fontSize: 13, letterSpacing: 0.5 }
});
