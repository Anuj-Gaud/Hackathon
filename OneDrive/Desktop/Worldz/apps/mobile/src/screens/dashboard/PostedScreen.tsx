import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';

type PostedScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Posted'>;

export default function PostedScreen() {
  const navigation = useNavigation<PostedScreenNavigationProp>();
  const [activeTab, setActiveTab] = useState<'jobs' | 'internships'>('jobs');

  const postedJobs = [
    {
      id: '1',
      title: 'Senior Software Engineer',
      company: 'Tech Corp',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$120k - $150k',
      createdAt: '2024-03-20',
    },
    // Add more dummy jobs...
  ];

  const postedInternships = [
    {
      id: '1',
      title: 'Software Engineering Intern',
      company: 'Tech Corp',
      location: 'San Francisco, CA',
      duration: '3 months',
      stipend: '$5k/month',
      createdAt: '2024-03-20',
    },
    // Add more dummy internships...
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        if (activeTab === 'jobs') {
          navigation.navigate('JobDetails', { id: item.id });
        } else {
          navigation.navigate('InternshipDetails', { id: item.id });
        }
      }}
    >
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.company}>{item.company}</Text>
      <Text style={styles.location}>{item.location}</Text>
      {activeTab === 'jobs' ? (
        <>
          <Text style={styles.type}>{item.type}</Text>
          <Text style={styles.salary}>{item.salary}</Text>
        </>
      ) : (
        <>
          <Text style={styles.duration}>{item.duration}</Text>
          <Text style={styles.stipend}>{item.stipend}</Text>
        </>
      )}
      <Text style={styles.date}>Posted on {item.createdAt}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Posted</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'jobs' && styles.activeTab]}
          onPress={() => setActiveTab('jobs')}
        >
          <Text style={[styles.tabText, activeTab === 'jobs' && styles.activeTabText]}>Jobs</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'internships' && styles.activeTab]}
          onPress={() => setActiveTab('internships')}
        >
          <Text style={[styles.tabText, activeTab === 'internships' && styles.activeTabText]}>
            Internships
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={activeTab === 'jobs' ? postedJobs : postedInternships}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  tabs: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: '#f5f5f5',
  },
  activeTab: {
    backgroundColor: '#000',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  company: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  type: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  salary: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  duration: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  stipend: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
}); 