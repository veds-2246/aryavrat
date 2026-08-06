import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Pressable,
  Linking,
  ScrollView,
} from 'react-native';

const HelpSupportScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F8FBF9"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        <Text style={styles.title}>
          Help & Support
        </Text>

        <View style={styles.card}>

          <Text style={styles.sectionTitle}>
            Need help?
          </Text>

          <Pressable
            style={styles.row}
            onPress={() =>
              Linking.openURL('tel:+917798021414')
            }>

            <Text style={styles.label}>
              📞 Call Support
            </Text>

            <Text style={styles.value}>
              +91 77980 21414
            </Text>

          </Pressable>

          <Pressable
            style={styles.row}
            onPress={() =>
              Linking.openURL(
                'mailto:support@aryavrat.in',
              )
            }>

            <Text style={styles.label}>
              ✉ Email
            </Text>

            <Text style={styles.value}>
              support@aryavrat.in
            </Text>

          </Pressable>

          <View style={styles.row}>

            <Text style={styles.label}>
              🕘 Working Hours
            </Text>

            <Text style={styles.value}>
              8:00 AM - 8:00 PM
            </Text>

          </View>

        </View>

        <View style={styles.card}>

          <Text style={styles.sectionTitle}>
            Frequently Asked Questions
          </Text>

          <Text style={styles.faq}>
            • How do I skip tomorrow's delivery?
          </Text>

          <Text style={styles.faq}>
            • How do I change my delivery address?
          </Text>

          <Text style={styles.faq}>
            • How do I cancel my subscription?
          </Text>

          <Text style={styles.faq}>
            • How do I contact Aryavrat support?
          </Text>

        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default HelpSupportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FBF9',
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#17231C',
    marginBottom: 20,
  },

  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E4EBE7',
    padding: 18,
    marginBottom: 18,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#17231C',
    marginBottom: 14,
  },

  row: {
    marginBottom: 16,
  },

  label: {
    color: '#16794B',
    fontWeight: '700',
    fontSize: 15,
  },

  value: {
    marginTop: 4,
    color: '#58645C',
    fontSize: 14,
  },

  faq: {
    fontSize: 14,
    color: '#58645C',
    lineHeight: 24,
    marginBottom: 10,
  },
});