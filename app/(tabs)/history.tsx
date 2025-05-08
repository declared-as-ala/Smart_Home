import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Clock } from 'lucide-react-native';

// Mock data for fall history
// In a real app, this would come from a database or API
const mockFallEvents = [
  { id: '1', date: '2025-03-15', time: '09:32 AM', confidence: 0.92 },
  { id: '2', date: '2025-03-12', time: '02:47 PM', confidence: 0.88 },
  { id: '3', date: '2025-03-05', time: '11:20 AM', confidence: 0.95 },
  { id: '4', date: '2025-02-28', time: '04:15 PM', confidence: 0.83 },
];

type FallEvent = {
  id: string;
  date: string;
  time: string;
  confidence: number;
};

export default function HistoryScreen() {
  const [events] = useState<FallEvent[]>(mockFallEvents);

  const renderItem = ({ item }: { item: FallEvent }) => (
    <TouchableOpacity style={styles.eventCard}>
      <View style={styles.eventHeader}>
        <Text style={styles.eventTitle}>Fall Detected</Text>
        <View style={styles.confidenceTag}>
          <Text style={styles.confidenceText}>
            {(item.confidence * 100).toFixed(0)}% confidence
          </Text>
        </View>
      </View>
      
      <View style={styles.eventMeta}>
        <View style={styles.metaItem}>
          <Calendar size={16} color="#64748B" />
          <Text style={styles.metaText}>{item.date}</Text>
        </View>
        <View style={styles.metaItem}>
          <Clock size={16} color="#64748B" />
          <Text style={styles.metaText}>{item.time}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Fall Detection History</Text>
      </View>
      
      {events.length > 0 ? (
        <FlatList
          data={events}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>No Events Recorded</Text>
          <Text style={styles.emptyStateText}>
            Fall detection events will appear here once recorded.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
  },
  listContent: {
    padding: 16,
  },
  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  confidenceTag: {
    backgroundColor: '#ECFDF5',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  confidenceText: {
    fontSize: 12,
    color: '#065F46',
    fontWeight: '500',
  },
  eventMeta: {
    flexDirection: 'row',
    marginTop: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
});