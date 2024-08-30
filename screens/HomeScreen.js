import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const fetchChats = async () => {
      const token = await AsyncStorage.getItem('token');
      console.log(token)
      try {
        const response = await axios.get('http://192.168.29.144:3000/chats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setChats(response.data);
      } catch (error) {
        console.error('Error fetching chats', error.response);
      }
    };

    fetchChats();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Chat List </Text>
      <FlatList
        data={chats}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('Chat', { chatId: item._id })}>
            <View style={styles.chatItem}>
              <Text>Chat with {item.customerId === 'customerId0001' ? item.staffId : item.customerId}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <Button title="Logout" onPress={async () => {
        await AsyncStorage.removeItem('token');
        navigation.replace('Login');
      }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  chatItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
