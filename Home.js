import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
    const navigation = useNavigation();
    const [chats, setChats] = useState([]);

    useEffect(() => {
        // Fetch chats for the logged-in customer or staff
        const fetchChats = async () => {
            try {
                const response = await fetch('http://192.168.29.144:3000/chats/customerId0001');  // Replace with actual customer ID
                const data = await response.json();
                setChats(data);
            } catch (error) {
                console.error('Failed to fetch chats:', error);
            }
        };

        fetchChats();
    }, []);

    const handleChatPress = (chatId) => {
        navigation.navigate('ChatScreen', { chatId });
    };

    const renderChat = ({ item }) => (
        <TouchableOpacity onPress={() => handleChatPress(item._id)}>
            <View style={styles.chatContainer}>
                <Text>Chat with: {item.staffId}</Text>
                <Text>Last Message: {item.messages.length > 0 ? item.messages[item.messages.length - 1].message : 'No messages yet'}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Chats</Text>
            <FlatList
                data={chats}
                renderItem={renderChat}
                keyExtractor={(item) => item._id}
            />
        </View>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        fontSize: 24,
        marginBottom: 20,
    },
    chatContainer: {
        padding: 15,
        backgroundColor: '#f0f0f0',
        marginBottom: 10,
        borderRadius: 8,
    },
});
