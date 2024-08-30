import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import io from 'socket.io-client';
import { useRoute } from '@react-navigation/native';

const socket = io('http://192.168.29.144:3000');  // Replace with your server URL

export default function ChatScreen() {
  const route = useRoute();
  const { chatId } = route.params;  // Retrieve the chatId from navigation params

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [customerId] = useState('customerId0001');  // Replace with actual customer ID
  const [staffId] = useState('staff1');  // Replace with actual staff ID

  useEffect(() => {
    // Join the chat room
    socket.emit('join', { customerId, staffId });

    // Fetch existing chat messages
    const fetchChatMessages = async () => {
      try {
        const response = await fetch(`http://192.168.29.144:3000/chats/${chatId}`);
        const chatData = await response.json();
        setMessages(chatData.messages);
      } catch (error) {
        console.error('Failed to fetch chat messages:', error);
      }
    };

    fetchChatMessages();

    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => socket.off('receiveMessage');
  }, [chatId]);

  const sendMessage = () => {
    
    socket.emit('sendMessage', { senderId: customerId, receiverId: staffId, message, chatId });
    setMessage('');
  };

  const renderMessage = ({ item }) => {
    const isCustomer = item.senderId === customerId;

    return (
      <View
        style={[
          styles.messageContainer,
          isCustomer ? styles.customerMessage : styles.staffMessage,
          { alignSelf: isCustomer ? 'flex-end' : 'flex-start', marginHorizontal: 10 }
        ]}
      >
        <Text style={styles.messageText}>{item.message}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
      />
      <View style={{ flexDirection: 'row', backgroundColor: 'pink' }}>
        <TextInput
          style={[styles.input, { flex: 0.8 }]}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message"
        />
        <View style={{ flex: 0.2, height: '100%' }}>
          <Button title="Send" onPress={sendMessage} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginTop: 20,
  },
  messageContainer: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: '75%',
  },
  customerMessage: {
    backgroundColor: '#DCF8C6',
  },
  staffMessage: {
    backgroundColor: '#ECECEC',
  },
  messageText: {
    fontSize: 16,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
  },
});
