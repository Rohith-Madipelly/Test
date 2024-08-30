import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { Client } from '@stomp/stompjs';

const ChatScreen = () => {
  const [stompClient, setStompClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userId, setUserId] = useState('user1'); // Replace with actual user ID or a dynamic value

  useEffect(() => {
    // STOMP client configuration
    const client = new Client({
      brokerURL: 'ws://192.168.29.138:8080/jonnas-chat', // Replace with your WebSocket URL
      connectHeaders: {},
      debug: str => console.log('STOMP: ' + str),
      reconnectDelay: 200,
      onConnect: frame => {
        console.log('Connected: ' + frame);
        client.subscribe(`/user/greetings`, message => {
          setMessages(prevMessages => [...prevMessages, JSON.parse(message.body)]);
        });
      },
      onStompError: frame => {
        console.log('STOMP Error: ' + frame.body);
      },
      onWebSocketError: error => {
        console.log('WebSocket Error: ' + error);
      }
    });
    setStompClient(client);
    client.activate();

    // Cleanup on component unmount
    return () => {
      if (client) {
        client.deactivate();
      }
    };
  }, [userId]);

  const sendMessage = () => {
    if (stompClient && stompClient.connected) {
      stompClient.publish({
        destination: `/app/greetings`,
        body: JSON.stringify({ content: newMessage })
      });
      setNewMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item }) => <Text style={styles.message}>{item.content}</Text>}
        keyExtractor={(item, index) => index.toString()}
      />
      <TextInput
        style={styles.input}
        value={newMessage}
        onChangeText={setNewMessage}
        placeholder="Type a message"
      />
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  message: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
});

export default ChatScreen;
