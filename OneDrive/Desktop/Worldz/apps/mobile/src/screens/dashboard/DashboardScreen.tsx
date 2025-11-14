import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function DashboardScreen() {
  const navigation = useNavigation();
  const [timeRange, setTimeRange] = useState('30');

  const stats = [
    { label: 'Total Applications', value: '156' },
    { label: 'Active Jobs', value: '12' },
    { label: 'Active Internships', value: '8' },
    { label: 'Views (30 days)', value: '1,234' },
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'application',
      title: 'Software Engineer',
      company: 'Tech Corp',
      applicant: 'John Doe',
      date: '2 hours ago',
    },
    {
      id: 2,
      type: 'view',
      title: 'Product Manager',
      company: 'Startup Inc',
      views: 45,
      date: '5 hours ago',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
      </View>

      <View style={styles.stats}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.timeRange}>
            <TouchableOpacity
              style={[styles.timeButton, timeRange === '30' && styles.timeButtonActive]}
              onPress={() => setTimeRange('30')}
            >
              <Text
                style={[styles.timeButtonText, timeRange === '30' && styles.timeButtonTextActive]}
              >
                30 Days
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.timeButton, timeRange === '90' && styles.timeButtonActive]}
              onPress={() => setTimeRange('90')}
            >
              <Text
                style={[styles.timeButtonText, timeRange === '90' && styles.timeButtonTextActive]}
              >
                90 Days
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.activityList}>
          {recentActivity.map((activity) => (
            <TouchableOpacity
              key={activity.id}
              style={styles.activityCard}
              onPress={() =>
                navigation.navigate(
                  activity.type === 'application' ? 'ApplicationDetails' : 'JobDetails',
                  { id: activity.id }
                )
              }
            >
              <View style={styles.activityHeader}>
                <Text style={styles.activityType}>
                  {activity.type === 'application' ? 'New Application' : 'Job Viewed'}
                </Text>
                <Text style={styles.activityDate}>{activity.date}</Text>
              </View>

              <Text style={styles.activityTitle}>{activity.title}</Text>
              <Text style={styles.activityCompany}>{activity.company}</Text>

              {activity.type === 'application' ? (
                <Text style={styles.activityApplicant}>Applicant: {activity.applicant}</Text>
              ) : (
                <Text style={styles.activityViews}>{activity.views} views</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  stats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
  },
  statCard: {
    width: '50%',
    padding: 16,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  timeRange: {
    flexDirection: 'row',
  },
  timeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 8,
    backgroundColor: '#f5f5f5',
  },
  timeButtonActive: {
    backgroundColor: '#000',
  },
  timeButtonText: {
    fontSize: 14,
    color: '#666',
  },
  timeButtonTextActive: {
    color: '#fff',
  },
  activityList: {
    marginTop: 16,
  },
  activityCard: {
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
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityType: {
    fontSize: 14,
    color: '#666',
  },
  activityDate: {
    fontSize: 14,
    color: '#666',
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  activityCompany: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  activityApplicant: {
    fontSize: 14,
    color: '#000',
  },
  activityViews: {
    fontSize: 14,
    color: '#000',
  },
}); 