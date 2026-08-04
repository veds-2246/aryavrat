import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

type Filter = 'all' | 'buyOnce' | 'subscription';

type Props = {
  active: Filter;
  onChange: (filter: Filter) => void;
};

const labels: Record<Filter, string> = {
  all: 'All',
  buyOnce: 'Buy Once',
  subscription: 'Subscription',
};

const OrderFilterTabs: React.FC<Props> = ({active, onChange}) => {
  return (
    <View style={styles.container}>
      {(['all', 'buyOnce', 'subscription'] as Filter[]).map(key => {
        const isActive = active === key;
        return (
          <TouchableOpacity
            key={key}
            style={[styles.tab, isActive ? styles.activeTab : undefined]}
            onPress={() => onChange(key)}
            activeOpacity={0.8}>
            <Text style={[styles.tabText, isActive ? styles.activeText : undefined]}>{labels[key]}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default OrderFilterTabs;

const styles = StyleSheet.create({
  container: {flexDirection: 'row', backgroundColor: '#EAF0EC', borderRadius: 11, padding: 4, marginTop: 25},
  tab: {flex: 1, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 8},
  activeTab: {backgroundColor: '#FFFFFF'},
  tabText: {color: '#7A867E', fontSize: 11, fontWeight: '600'},
  activeText: {color: '#16794B', fontWeight: '800'},
});