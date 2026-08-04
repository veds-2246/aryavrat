import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

type Props = {
  title: string;
  subtitle: string;
  onContinue: () => void;
};

const EmptyOrders: React.FC<Props> = ({title, subtitle, onContinue}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconBox}>
        <Text style={styles.emoji}>🥛</Text>
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      <TouchableOpacity style={styles.button} onPress={onContinue} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Continue Shopping</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EmptyOrders;

const styles = StyleSheet.create({
  container: {alignItems: 'center', paddingTop: 85, paddingHorizontal: 35},
  iconBox: {width: 78, height: 78, borderRadius: 39, backgroundColor: '#EAF5EF', justifyContent: 'center', alignItems: 'center'},
  emoji: {fontSize: 35},
  title: {color: '#25352B', fontSize: 17, fontWeight: '700', marginTop: 20, textAlign: 'center'},
  subtitle: {color: '#89938D', fontSize: 12, lineHeight: 19, textAlign: 'center', marginTop: 7},
  button: {backgroundColor: '#16794B', borderRadius: 10, paddingVertical: 12, paddingHorizontal: 20, marginTop: 20},
  buttonText: {color: '#FFFFFF', fontSize: 13, fontWeight: '800'},
});