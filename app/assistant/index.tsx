import React, { useState, useRef } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, View as DefaultView } from 'react-native';
import { Text, View, Card, ScreenContainer } from '../../components/Themed';
import { 
  ChevronLeft, 
  Send, 
  Sparkles, 
  User, 
  Info,
  ChevronRight,
  MessageSquare
} from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';

const SUGGESTIONS = [
  "When is the next clearance slot?",
  "Required docs for hostel allocation?",
  "Where is the Engineering Block LT 4?",
  "How to retrieve lost student ID?",
];

export default function AssistantScreen() {
  const [messages, setMessages] = useState([
    { id: '1', text: "Hello! I'm your SchoolI AI Assistant. How can I help you today?", sender: 'ai' },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];
  const scrollRef = useRef<ScrollView>(null);

  const handleSend = (text: string = input) => {
    if (!text.trim()) return;

    const newUserMsg = { id: Date.now().toString(), text, sender: 'user' };
    setMessages([...messages, newUserMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI Response
    setTimeout(() => {
      const aiResponse = { 
        id: (Date.now() + 1).toString(), 
        text: "Based on your university (UniUyo), the next clearance slot at the faculty is tomorrow between 9 AM and 12 PM. Don't forget your original JAMB result!", 
        sender: 'ai' 
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 1500);
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <View style={[styles.aiBadge, { backgroundColor: colors.primary }]}>
            <Sparkles size={14} color="#FFF" />
          </View>
          <View>
            <Text style={styles.headerTitle}>SchoolI Assistant</Text>
            <Text style={[styles.headerStatus, { color: colors.success }]}>Online & Ready</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={100}
      >
        <ScrollView 
          ref={scrollRef}
          contentContainerStyle={styles.chatArea}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((msg) => (
            <View 
              key={msg.id} 
              style={[
                styles.messageRow, 
                msg.sender === 'user' ? styles.userRow : styles.aiRow
              ]}
            >
              {msg.sender === 'ai' && (
                <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                  <Sparkles size={16} color="#FFF" />
                </View>
              )}
              <View 
                style={[
                  styles.bubble, 
                  msg.sender === 'user' ? 
                    { backgroundColor: colors.primary, borderBottomRightRadius: 4 } : 
                    { backgroundColor: colors.card, borderBottomLeftRadius: 4, borderColor: colors.border, borderWidth: 1 }
                ]}
              >
                <Text style={[styles.messageText, { color: msg.sender === 'user' ? '#FFF' : colors.text }]}>
                  {msg.text}
                </Text>
              </View>
            </View>
          ))}
          {isTyping && (
            <View style={styles.aiRow}>
              <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                <Sparkles size={16} color="#FFF" />
              </View>
              <View style={[styles.bubble, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}>
                <Text style={[styles.messageText, { color: colors.secondaryText }]}>AI is thinking...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          {messages.length < 3 && (
             <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestions}>
                {SUGGESTIONS.map((s, idx) => (
                  <TouchableOpacity 
                    key={idx} 
                    onPress={() => handleSend(s)}
                    style={[styles.suggestItem, { borderColor: colors.border }]}
                  >
                    <Text style={[styles.suggestText, { color: colors.secondaryText }]}>{s}</Text>
                  </TouchableOpacity>
                ))}
             </ScrollView>
          )}
          
          <View style={styles.inputRow}>
            <TextInput 
              placeholder="Ask me anything..."
              style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              placeholderTextColor={colors.secondaryText}
              value={input}
              onChangeText={setInput}
              multiline
            />
            <TouchableOpacity 
              onPress={() => handleSend()}
              disabled={!input.trim()}
              style={[styles.sendBtn, { backgroundColor: colors.primary, opacity: input.trim() ? 1 : 0.6 }]}
            >
              <Send size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  backBtn: {
    padding: 8,
    marginRight: 10,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  aiBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  headerStatus: {
    fontSize: 12,
    fontWeight: '700',
  },
  chatArea: {
    padding: 20,
    paddingBottom: 40,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 20,
    maxWidth: '85%',
  },
  userRow: {
    alignSelf: 'flex-end',
  },
  aiRow: {
    alignSelf: 'flex-start',
    gap: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  bubble: {
    padding: 14,
    borderRadius: 18,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
  },
  suggestions: {
    marginBottom: 16,
  },
  suggestItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
    borderWidth: 1,
    marginRight: 10,
  },
  suggestText: {
    fontSize: 13,
    fontWeight: '600',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  input: {
    flex: 1,
    minHeight: 50,
    maxHeight: 120,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 14,
    borderWidth: 1,
    fontSize: 15,
  },
  sendBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
