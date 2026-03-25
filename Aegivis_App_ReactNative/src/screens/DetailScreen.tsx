import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Image, Animated, SafeAreaView } from 'react-native';
import { Feather, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

export default function DetailScreen({ route, navigation }: any) {
  const { siteName, level, status, location } = route.params;
  const [dispatchState, setDispatchState] = useState('IDLE'); // IDLE, SENDING, EN_ROUTE
  const [showGPSBar, setShowGPSBar] = useState(false);
  const fadeAnim = new Animated.Value(0);

  const isCritical = status === '위험';

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleDispatch = () => {
    setDispatchState('SENDING');
    
    // Simulate HQ Handshake (3-Tier Logic)
    setTimeout(() => {
      setDispatchState('EN_ROUTE');
      setShowGPSBar(true);
      Alert.alert(
        "🚔 [Aegivis HQ - 교신 성공]", 
        `현장: ${siteName}\n승인요원: AGENT-77\n\n통합상황실에서 요원님의 실시간 GPS 동선을 확보하였습니다. 현장에 도착할 때까지 GPS 트래킹이 유지됩니다. 안전하게 이동하십시오.`
      );
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* GPS Tracking Bar (Handshake Feedback) */}
      {showGPSBar && (
        <View style={styles.gpsBar}>
          <Animated.View style={{ opacity: fadeAnim, flexDirection: 'row', alignItems: 'center' }}>
            <Feather name="activity" size={10} color="#fff" />
            <Text style={styles.gpsBarText}>상황실 실시간 위성 추적 활성화됨 (HQ ACK COMPLETED)</Text>
          </Animated.View>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* CCTV Area (Vision-First) */}
        <View style={styles.cctvContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1545147986-a9d6f210df99?q=80&w=1000&auto=format&fit=crop' }} 
            style={styles.cctvImage}
            blurRadius={dispatchState === 'IDLE' ? 0 : 2}
          />
          <View style={styles.cctvOverlay}>
            <View style={styles.cctvLabel}>
              <View style={styles.liveDot} />
              <Text style={styles.cctvLabelText}>LIVE • {siteName} CH 01</Text>
            </View>
            
            {/* AI Object Detection Overlay */}
            {isCritical && (
              <View style={styles.aiDetectionBox}>
                <Text style={styles.aiDetectionText}>ZONE ALPHA ⚠️</Text>
              </View>
            )}

            {/* AI Vision Metadata */}
            <View style={styles.visionMeta}>
              <Text style={styles.visionMetaText}>4K VISION ENGINE SYNCED</Text>
              <Text style={styles.visionMetaSub}>{new Date().toLocaleTimeString()}</Text>
            </View>
          </View>
        </View>

        <View style={{ padding: 20 }}>
          {/* Status Header */}
          <View style={styles.statusRow}>
            <View>
              <Text style={styles.siteName}>{siteName}</Text>
              <Text style={styles.siteLocation}>{location} | {status === '위험' ? 'CRITICAL CRISIS' : 'NORMAL MONITORING'}</Text>
            </View>
            <View style={[styles.statusBadge, isCritical ? styles.statusBadgeRed : styles.statusBadgeGreen]}>
              <Text style={styles.statusBadgeText}>{status === '위험' ? '위험 수준 4' : '정상'}</Text>
            </View>
          </View>

          {/* Stats Grid */}
          <View style={styles.grid}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>현재 강수량</Text>
              <View style={styles.statContent}>
                <Text style={styles.statValueBlue}>12.5</Text>
                <Text style={styles.statUnit}>mm/h</Text>
              </View>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>수위 (레이더)</Text>
              <View style={styles.statContent}>
                <Text style={isCritical ? styles.statValueRed : styles.statValueGreen}>{level}</Text>
                <Text style={styles.statUnit}>m</Text>
              </View>
            </View>
          </View>

          {/* AI Critical Alert Box */}
          {isCritical && (
            <View style={styles.etaBox}>
              <View style={styles.etaIconRow}>
                <Feather name="alert-triangle" size={14} color="#ef4444" />
                <Text style={styles.etaLabel}>AI 예측 임계 도달</Text>
              </View>
              <Text style={styles.etaValue}>약 14분 후 <Text style={styles.etaUnit}>침수 구역 도달 예상</Text></Text>
            </View>
          )}

          {/* AI Decision Box */}
          <View style={[styles.decisionBox, isCritical && styles.decisionBoxRed]}>
            <View style={styles.decisionHeader}>
              <MaterialCommunityIcons name="brain" size={16} color={isCritical ? "#f87171" : "#4ade80"} />
              <Text style={[styles.decisionTitle, { color: isCritical ? "#f87171" : "#4ade80" }]}>AI 의사결정 지원</Text>
            </View>
            <Text style={styles.decisionDesc}>
              {isCritical 
                ? `수위 상승 패턴이 임계점에 근접했습니다. HQ 통보 후 즉각 출동하여 현장 차단막 수동 확보 및 오작동 여부를 육안 검수하십시오.` 
                : `현재 데이터상 위협 요인이 발견되지 않았습니다. 실시간 비전 센서 파이프라인에서 수시로 이상 징후를 추적 중입니다.`}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Dispatch Action Panel (Fail-safe Sequence) */}
      <View style={styles.actionPanel}>
        {dispatchState === 'IDLE' ? (
          <TouchableOpacity 
            style={[styles.btnAction, isCritical ? styles.btnActionRed : styles.btnActionBlue]} 
            onPress={handleDispatch}
          >
            <FontAwesome5 name={isCritical ? "paper-plane" : "check"} size={16} color="#fff" />
            <Text style={styles.btnActionText}>
              {isCritical ? '[출동 수락] 상황실 통보 및 이동' : '현장 모니터링 승인'}
            </Text>
          </TouchableOpacity>
        ) : dispatchState === 'SENDING' ? (
          <View style={[styles.btnAction, styles.btnActionGrey]}>
            <MaterialCommunityIcons name="satellite-variant" size={20} color="#fff" style={styles.rotateIcon} />
            <Text style={styles.btnActionText}>상황실 교신 중 (SENDING HANDSHAKE...)</Text>
          </View>
        ) : (
          <TouchableOpacity 
            style={[styles.btnAction, styles.btnActionGreen]} 
            onPress={() => navigation.navigate('QRScanner', { siteName })}
          >
            <MaterialCommunityIcons name="qrcode-scan" size={20} color="#fff" />
            <Text style={styles.btnActionText}>현장 도착 인증 (QR SCAN)</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020408' },
  gpsBar: { backgroundColor: '#22c55e', paddingVertical: 4, alignItems: 'center' },
  gpsBarText: { color: '#fff', fontSize: 9, fontWeight: '900', marginLeft: 6, letterSpacing: 0.5 },
  
  cctvContainer: { width: '100%', height: 260, backgroundColor: '#000', position: 'relative' },
  cctvImage: { width: '100%', height: '100%', opacity: 0.6 },
  cctvOverlay: { ...StyleSheet.absoluteFillObject, padding: 20, justifyContent: 'space-between' },
  cctvLabel: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 4 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#ef4444', marginRight: 8 },
  cctvLabelText: { color: '#fff', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  
  aiDetectionBox: { alignSelf: 'center', width: 150, height: 100, borderStyle: 'dotted', borderWidth: 1, borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.1)', padding: 4 },
  aiDetectionText: { color: '#ef4444', fontSize: 8, fontWeight: '900', backgroundColor: 'rgba(0,0,0,0.5)', alignSelf: 'flex-start', padding: 2 },
  
  visionMeta: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  visionMetaText: { color: 'rgba(255,255,255,0.4)', fontSize: 7, fontWeight: 'bold' },
  visionMetaSub: { color: 'rgba(255,255,255,0.2)', fontSize: 6 },

  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, paddingVertical: 10 },
  siteName: { color: '#fff', fontSize: 24, fontWeight: '900', marginBottom: 4 },
  siteLocation: { color: '#475569', fontSize: 11, fontWeight: 'bold' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  statusBadgeRed: { backgroundColor: '#ef4444' },
  statusBadgeGreen: { backgroundColor: 'rgba(34,197,94,0.1)' },
  statusBadgeText: { color: '#fff', fontSize: 10, fontWeight: '900' },

  grid: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  statBox: { flex: 1, backgroundColor: 'rgba(255,255,255,0.03)', padding: 16, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  statLabel: { color: '#64748b', fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 8 },
  statContent: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  statValueBlue: { color: '#60a5fa', fontSize: 32, fontWeight: '900' },
  statValueGreen: { color: '#4ade80', fontSize: 32, fontWeight: '900' },
  statValueRed: { color: '#ef4444', fontSize: 32, fontWeight: '900' },
  statUnit: { fontSize: 12, color: '#475569', fontWeight: 'bold' },

  etaBox: { backgroundColor: 'rgba(239,68,68,0.05)', padding: 20, borderRadius: 24, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)' },
  etaIconRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  etaLabel: { color: '#ef4444', fontSize: 10, fontWeight: '900', textTransform: 'uppercase' },
  etaValue: { color: '#fff', fontSize: 24, fontWeight: '900' },
  etaUnit: { fontSize: 12, color: '#64748b', fontWeight: 'bold' },

  decisionBox: { padding: 24, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.02)', borderLeftWidth: 4, borderLeftColor: '#22c55e' },
  decisionBoxRed: { borderLeftColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.03)' },
  decisionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  decisionTitle: { fontSize: 14, fontWeight: '900', textTransform: 'uppercase' },
  decisionDesc: { color: '#cbd5e1', fontSize: 13, lineHeight: 22, fontWeight: '600' },

  actionPanel: { padding: 20, paddingBottom: 40, backgroundColor: 'rgba(2,4,8,0.8)' },
  btnAction: { height: 64, borderRadius: 32, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
  btnActionBlue: { backgroundColor: '#2563eb' },
  btnActionRed: { backgroundColor: '#ef4444' },
  btnActionGreen: { backgroundColor: '#22c55e' },
  btnActionGrey: { backgroundColor: '#1e293b' },
  btnActionText: { color: '#fff', fontSize: 15, fontWeight: '900' },
  rotateIcon: { opacity: 0.8 },
});
