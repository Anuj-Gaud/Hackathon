import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function UploadScreen() {
  const navigation = useNavigation();
  const [postType, setPostType] = useState('job');
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    requirements: [''],
    salary: '',
    duration: '',
    stipend: '',
  });

  const handleSubmit = async () => {
    // TODO: Implement form submission
    navigation.goBack();
  };

  const addRequirement = () => {
    setFormData({
      ...formData,
      requirements: [...formData.requirements, ''],
    });
  };

  const removeRequirement = (index) => {
    const newRequirements = formData.requirements.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      requirements: newRequirements,
    });
  };

  const updateRequirement = (index, value) => {
    const newRequirements = [...formData.requirements];
    newRequirements[index] = value;
    setFormData({
      ...formData,
      requirements: newRequirements,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Post a {postType === 'job' ? 'Job' : 'Internship'}</Text>
      </View>

      <View style={styles.toggle}>
        <TouchableOpacity
          style={[styles.toggleButton, postType === 'job' && styles.toggleButtonActive]}
          onPress={() => setPostType('job')}
        >
          <Text
            style={[styles.toggleButtonText, postType === 'job' && styles.toggleButtonTextActive]}
          >
            Job
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, postType === 'internship' && styles.toggleButtonActive]}
          onPress={() => setPostType('internship')}
        >
          <Text
            style={[
              styles.toggleButtonText,
              postType === 'internship' && styles.toggleButtonTextActive,
            ]}
          >
            Internship
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={formData.title}
          onChangeText={(text) => setFormData({ ...formData, title: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Company"
          value={formData.company}
          onChangeText={(text) => setFormData({ ...formData, company: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Location"
          value={formData.location}
          onChangeText={(text) => setFormData({ ...formData, location: text })}
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Description"
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
          multiline
          numberOfLines={4}
        />

        {postType === 'job' ? (
          <TextInput
            style={styles.input}
            placeholder="Salary"
            value={formData.salary}
            onChangeText={(text) => setFormData({ ...formData, salary: text })}
          />
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder="Duration"
              value={formData.duration}
              onChangeText={(text) => setFormData({ ...formData, duration: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Stipend"
              value={formData.stipend}
              onChangeText={(text) => setFormData({ ...formData, stipend: text })}
            />
          </>
        )}

        <Text style={styles.sectionTitle}>Requirements</Text>
        {formData.requirements.map((requirement, index) => (
          <View key={index} style={styles.requirementContainer}>
            <TextInput
              style={[styles.input, styles.requirementInput]}
              placeholder="Requirement"
              value={requirement}
              onChangeText={(text) => updateRequirement(index, text)}
            />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeRequirement(index)}
            >
              <Text style={styles.removeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={styles.addButton} onPress={addRequirement}>
          <Text style={styles.addButtonText}>+ Add Requirement</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Post {postType === 'job' ? 'Job' : 'Internship'}</Text>
        </TouchableOpacity>
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
  toggle: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: '#f5f5f5',
  },
  toggleButtonActive: {
    backgroundColor: '#000',
  },
  toggleButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  toggleButtonTextActive: {
    color: '#fff',
  },
  form: {
    padding: 16,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#000',
  },
  requirementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  requirementInput: {
    flex: 1,
    marginBottom: 0,
    marginRight: 8,
  },
  removeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    fontSize: 24,
    color: '#666',
  },
  addButton: {
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  addButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#000',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 