import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

export default function BillingScreen() {
  const [billingFrequency, setBillingFrequency] = useState('monthly');

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: billingFrequency === 'monthly' ? 29 : 290,
      period: billingFrequency === 'monthly' ? 'month' : 'year',
      features: [
        'Post up to 5 jobs',
        'Basic analytics',
        'Email support',
        'Standard listing',
      ],
    },
    {
      id: 'pro',
      name: 'Pro',
      price: billingFrequency === 'monthly' ? 99 : 990,
      period: billingFrequency === 'monthly' ? 'month' : 'year',
      features: [
        'Post up to 20 jobs',
        'Advanced analytics',
        'Priority support',
        'Featured listing',
        'Custom branding',
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: billingFrequency === 'monthly' ? 299 : 2990,
      period: billingFrequency === 'monthly' ? 'month' : 'year',
      features: [
        'Unlimited job posts',
        'Full analytics suite',
        '24/7 support',
        'Premium listing',
        'Custom branding',
        'API access',
      ],
    },
  ];

  const handleSubscribe = (planId) => {
    // TODO: Implement subscription logic
    console.log('Subscribe to plan:', planId);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Billing</Text>
      </View>

      <View style={styles.toggle}>
        <TouchableOpacity
          style={[styles.toggleButton, billingFrequency === 'monthly' && styles.toggleButtonActive]}
          onPress={() => setBillingFrequency('monthly')}
        >
          <Text
            style={[
              styles.toggleButtonText,
              billingFrequency === 'monthly' && styles.toggleButtonTextActive,
            ]}
          >
            Monthly
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, billingFrequency === 'yearly' && styles.toggleButtonActive]}
          onPress={() => setBillingFrequency('yearly')}
        >
          <Text
            style={[
              styles.toggleButtonText,
              billingFrequency === 'yearly' && styles.toggleButtonTextActive,
            ]}
          >
            Yearly
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.plans}>
        {plans.map((plan) => (
          <View key={plan.id} style={styles.planCard}>
            <Text style={styles.planName}>{plan.name}</Text>
            <Text style={styles.planPrice}>
              ${plan.price}
              <Text style={styles.planPeriod}>/{plan.period}</Text>
            </Text>

            <View style={styles.features}>
              {plan.features.map((feature, index) => (
                <View key={index} style={styles.feature}>
                  <Text style={styles.featureText}>• {feature}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.subscribeButton}
              onPress={() => handleSubscribe(plan.id)}
            >
              <Text style={styles.subscribeButtonText}>Subscribe</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={styles.faq}>
        <Text style={styles.faqTitle}>Frequently Asked Questions</Text>

        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>Can I change my plan later?</Text>
          <Text style={styles.faqAnswer}>
            Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your
            next billing cycle.
          </Text>
        </View>

        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>What payment methods do you accept?</Text>
          <Text style={styles.faqAnswer}>
            We accept all major credit cards, including Visa, Mastercard, and American Express.
          </Text>
        </View>

        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>Is there a free trial?</Text>
          <Text style={styles.faqAnswer}>
            Yes, we offer a 14-day free trial for all plans. No credit card required.
          </Text>
        </View>

        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>How do I cancel my subscription?</Text>
          <Text style={styles.faqAnswer}>
            You can cancel your subscription at any time from your account settings. You'll continue to
            have access until the end of your billing period.
          </Text>
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
    fontSize: 16,
    color: '#666',
  },
  toggleButtonTextActive: {
    color: '#fff',
  },
  plans: {
    padding: 16,
  },
  planCard: {
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
  planName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  planPeriod: {
    fontSize: 16,
    color: '#666',
  },
  features: {
    marginBottom: 16,
  },
  feature: {
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#666',
  },
  subscribeButton: {
    backgroundColor: '#000',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  faq: {
    padding: 16,
  },
  faqTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  faqItem: {
    marginBottom: 16,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
}); 