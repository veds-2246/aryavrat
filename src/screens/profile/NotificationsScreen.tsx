import React from 'react';

import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
} from 'react-native';

import {
  useNotifications,
} from '../../context/NotificationContext';

const NotificationsScreen = () => {

  const {
    notifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearNotifications,
  } = useNotifications();

  React.useEffect(() => {
  if (
    notifications.some(
      notification => !notification.isRead,
    )
  ) {
    markAllAsRead();
  }
}, [notifications]);

  return (
    <SafeAreaView style={styles.container}>

      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F8FBF9"
      />

      <View style={styles.content}>

        <Text style={styles.title}>
          Notifications
        </Text>

        {notifications.length === 0 ? (

          <View style={styles.emptyContainer}>

            <Text style={styles.emptyEmoji}>
              🔔
            </Text>

            <Text style={styles.emptyTitle}>
              No Notifications
            </Text>

            <Text style={styles.emptySubtitle}>
              You're all caught up.
            </Text>

          </View>

        ) : (

          <FlatList
            data={notifications}
            keyExtractor={item => item.id}
            renderItem={({item}) => (

              <Pressable
                style={[
                  styles.card,
                  !item.isRead &&
                    styles.unreadCard,
                ]}
                onPress={() =>
                  markAsRead(item.id)
                }>

                <Text style={styles.cardTitle}>
                  {item.title}
                </Text>

                <Text style={styles.cardMessage}>
                  {item.message}
                </Text>

                <Text style={styles.cardDate}>
                  {item.createdAt}
                </Text>

                <Pressable
                  onPress={() =>
                    deleteNotification(item.id)
                  }>

                  <Text style={styles.delete}>
                    Delete
                  </Text>

                </Pressable>

              </Pressable>

            )}
          />

        )}

      </View>

    </SafeAreaView>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FBF9',
  },

  content: {
    flex: 1,
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#17231C',
    marginBottom: 20,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyEmoji: {
    fontSize: 60,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 20,
  },

  emptySubtitle: {
    marginTop: 8,
    color: '#7A877F',
    fontSize: 15,
  },

  card: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E4EBE7',
  },

  unreadCard: {
    borderColor: '#16794B',
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#17231C',
  },

  cardMessage: {
    marginTop: 8,
    color: '#5B675F',
    lineHeight: 22,
  },

  cardDate: {
    marginTop: 12,
    fontSize: 12,
    color: '#96A29A',
  },

  delete: {
    marginTop: 12,
    color: '#C0392B',
    fontWeight: '700',
  },
});