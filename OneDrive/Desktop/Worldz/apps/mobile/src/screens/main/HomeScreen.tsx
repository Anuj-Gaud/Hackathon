import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Find Your Next Opportunity</Text>
        <Text style={styles.subtitle}>Discover jobs and internships that match your skills</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured Jobs</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[1, 2, 3].map((job) => (
            <TouchableOpacity
              key={job}
              style={styles.card}
              onPress={() => navigation.navigate('JobDetails', { id: job })}
            >
              <Text style={styles.cardTitle}>Software Engineer</Text>
              <Text style={styles.cardCompany}>Tech Corp</Text>
              <Text style={styles.cardLocation}>San Francisco, CA</Text>
              <Text style={styles.cardSalary}>$120k - $150k</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured Internships</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[1, 2, 3].map((internship) => (
            <TouchableOpacity
              key={internship}
              style={styles.card}
              onPress={() => navigation.navigate('InternshipDetails', { id: internship })}
            >
              <Text style={styles.cardTitle}>Summer Intern</Text>
              <Text style={styles.cardCompany}>Startup Inc</Text>
              <Text style={styles.cardLocation}>New York, NY</Text>
              <Text style={styles.cardSalary}>$5k/month</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Upload')}
          >
            <Text style={styles.actionButtonText}>Post a Job</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Upload')}
          >
            <Text style={styles.actionButtonText}>Post an Internship</Text>
          </TouchableOpacity>
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
    backgroundColor: '#000',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#000',
  },
  card: {
    width: 280,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: '#000',
  },
  cardCompany: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  cardLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  cardSalary: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 