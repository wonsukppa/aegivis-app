import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const mockSites = [
  { id: '1', name: '세종로 지하차도', level: 0.86, status: '위험', location: 'Seoul Central' },
  { id: '2', name: '노량진 1 지하차도', level: 0.42, status: '주의', location: 'Dongjak-gu' },
  { id: '3', name: '사당 지하차도', level: 0.05, status: '정상', location: 'Dongjak-gu' },
  { id: '4', name: '양재 지하차도', level: 0.04, status: '정상', location: 'Gangnam-gu' },
];

export default function DashboardScreen({ navigation }: any) {
  const [filter, setFilter] = useState('ALL');

  const urgentSites = mockSites.filter(s => s.status === '위험');
  const warningSites = mockSites.filter(s => s.status === '주의');
  const normalSites = mockSites.filter(s => s.status === '정상');

  const renderCard = (site: any) => {
    const isCrisis = site.status === '위험';
    const isWarning = site.status === '주의';
    const accentColor = isCrisis ? '#ef4444' : isWarning ? '#eab308' : '#22c55e';
    const bgColor = isCrisis ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.03)';

    return (
      <TouchableOpacity 
        key={site.id} 
        style={[styles.card, { borderLeftColor: accentColor, backgroundColor: bgColor }]}
        onPress={() => navigation.navigate('Detail', { siteName: site.name, level: site.level, status: site.status, location: site.location })}
      >
        <View style={{ flex: 1 }}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{site.name}</Text>
            {isCrisis && <View style={styles.urgentBadge}><Text style={styles.urgentBadgeText}>IMMEDIATE</Text></View>}
          </View>
          <Text style={styles.cardSubtitle}>ID: {site.location.charAt(0).toUpperCase()}-{Math.floor(Math.random()*9000+1000)}</Text>
          
          <View style={styles.cardInfoRow}>
            <View style={styles.cardStat}>
              <Text style={styles.cardStatLabel}>현재 수위</Text>
              <Text style={[styles.cardStatValue, { color: accentColor }]}>{site.level}<Text style={styles.cardStatUnit}>m</Text></Text>
            </View>
            <View style={styles.cardStat}>
              <Text style={styles.cardStatLabel}>강수량</Text>
              <Text style={styles.cardStatValueWhite}>12.5<Text style={styles.cardStatUnit}>mm/h</Text></Text>
            </View>
            <View style={styles.cardStat}>
              <Text style={styles.cardStatLabel}>위험확률</Text>
              <Text style={styles.cardStatValueWhite}>{isCrisis ? '94.2' : '15'}%</Text>
            </View>
          </View>
        </View>
        <Feather name="chevron-right" size={20} color="#475569" />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView stickyHeaderIndices={[1]} showsVerticalScrollIndicator={false}>
        {/* Stats Summary Grid */}
        <View style={styles.summaryGrid}>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>전체 현장</Text>
            <Text style={styles.summaryValue}>138</Text>
          </View>
          <View style={[styles.summaryBox, { borderColor: 'rgba(239,68,68,0.2)' }]}>
            <Text style={[styles.summaryLabel, { color: '#ef4444' }]}>긴급 출동</Text>
            <Text style={[styles.summaryValue, { color: '#ef4444' }]}>{urgentSites.length}</Text>
          </View>
          <View style={[styles.summaryBox, { borderColor: 'rgba(234,179,8,0.2)' }]}>
            <Text style={[styles.summaryLabel, { color: '#eab308' }]}>주의 관찰</Text>
            <Text style={[styles.summaryValue, { color: '#eab308' }]}>{warningSites.length}</Text>
          </View>
        </View>

        {/* Search & Filter (Sticky) */}
        <View style={styles.headerBox}>
          <View style={styles.searchContainer}>
            <Feather name="search" size={16} color="#64748b" style={styles.searchIcon} />
            <TextInput 
              placeholder="지하차도 명칭 검색" 
              placeholderTextColor="#64748b"
              style={styles.searchInput} 
            />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
            <TouchableOpacity style={[styles.chip, filter==='ALL' && styles.chipActive]} onPress={() => setFilter('ALL')}>
              <Text style={styles.chipTextWhite}>전체 현장</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.chip, filter==='CRITICAL' && styles.chipActiveRed]} onPress={() => setFilter('CRITICAL')}>
              <Text style={[styles.chipTextWhite, filter!=='CRITICAL' && {color: '#ef4444'}]}>위험 ({urgentSites.length})</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.chip, filter==='WARNING' && styles.chipActiveYellow]} onPress={() => setFilter('WARNING')}>
              <Text style={[styles.chipTextWhite, filter!=='WARNING' && {color: '#eab308'}]}>주의 ({warningSites.length})</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Site Cards List */}
        <View style={{ padding: 20 }}>
          {urgentSites.length > 0 && (filter === 'ALL' || filter === 'CRITICAL') && (
            <View style={{ marginBottom: 24 }}>
              <View style={styles.sectionHeaderRow}>
                <View style={styles.dotRed} />
                <Text style={styles.sectionHeaderRed}>긴급 대응 요망 (CRITICAL)</Text>
              </View>
              {urgentSites.map(renderCard)}
            </View>
          )}

          {warningSites.length > 0 && (filter === 'ALL' || filter === 'WARNING') && (
            <View style={{ marginBottom: 24 }}>
              <View style={styles.sectionHeaderRow}>
                <View style={styles.dotYellow} />
                <Text style={styles.sectionHeaderYellow}>주의 관찰 단계 (WARNING)</Text>
              </View>
              {warningSites.map(renderCard)}
            </View>
          )}
          
          {filter === 'ALL' && (
            <View>
              <View style={styles.sectionHeaderRowBetween}>
                <Text style={styles.sectionHeaderGrey}>일반 관할 지하차도</Text>
                <Text style={styles.sectionHeaderSub}>서울시설공단 <MaterialCommunityIcons name="check-decagram" size={10} color="#64748b" /></Text>
              </View>
              {normalSites.map(renderCard)}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Footer Sync Status */}
      <View style={styles.footer}>
        <Feather name="refresh-cw" size={12} color="#475569" />
        <Text style={styles.footerText}>데이터 서버 마지막 수신: 방금 전</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020408' },
  summaryGrid: { flexDirection: 'row', gap: 10, padding: 20, paddingTop: 10 },
  summaryBox: { flex: 1, backgroundColor: 'rgba(255,255,255,0.03)', padding: 12, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  summaryLabel: { fontSize: 8, color: '#64748b', fontWeight: 'bold', marginBottom: 4, textTransform: 'uppercase' },
  summaryValue: { fontSize: 18, fontWeight: '900', color: '#fff' },
  
  headerBox: { paddingVertical: 15, paddingHorizontal: 20, backgroundColor: '#020408', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, paddingHorizontal: 15, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, paddingVertical: 12, color: '#fff', fontSize: 13 },
  
  chipScroll: { flexDirection: 'row', gap: 8 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)' },
  chipActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  chipActiveRed: { backgroundColor: '#ef4444', borderColor: '#ef4444' },
  chipActiveYellow: { backgroundColor: '#eab308', borderColor: '#eab308' },
  chipTextWhite: { color: '#fff', fontWeight: '800', fontSize: 10 },

  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  sectionHeaderRowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  dotRed: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#ef4444', marginRight: 8 },
  dotYellow: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#eab308', marginRight: 8 },
  sectionHeaderRed: { color: '#ef4444', fontWeight: '900', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase' },
  sectionHeaderYellow: { color: '#eab308', fontWeight: '900', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase' },
  sectionHeaderGrey: { color: '#64748b', fontWeight: '900', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase' },
  sectionHeaderSub: { color: '#475569', fontSize: 9, fontWeight: 'bold' },

  card: { padding: 20, borderRadius: 24, borderLeftWidth: 6, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  cardTitle: { color: '#fff', fontSize: 16, fontWeight: '800' },
  urgentBadge: { backgroundColor: 'rgba(239,68,68,0.1)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  urgentBadgeText: { color: '#ef4444', fontSize: 8, fontWeight: '900' },
  cardSubtitle: { color: '#475569', fontSize: 9, marginBottom: 12 },
  
  cardInfoRow: { flexDirection: 'row', gap: 20 },
  cardStat: { alignItems: 'center' },
  cardStatLabel: { fontSize: 8, color: '#475569', fontWeight: 'bold', marginBottom: 2 },
  cardStatValue: { fontSize: 16, fontWeight: '900' },
  cardStatValueWhite: { fontSize: 16, fontWeight: '900', color: '#fff' },
  cardStatUnit: { fontSize: 8, fontWeight: 'normal', marginLeft: 1 },

  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 20, backgroundColor: 'rgba(2,4,8,0.8)' },
  footerText: { color: '#475569', fontSize: 9, fontWeight: 'bold' },
});
