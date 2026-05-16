import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Image, View as DefaultView, ActivityIndicator, Alert } from 'react-native';
import { Text, View, Card, ScreenContainer } from '../../components/Themed';
import { 
  ChevronLeft, 
  Send, 
  Sparkles, 
  BookOpen,
  Camera,
  Image as ImageIcon,
  RotateCcw,
  Plus,
  Mic,
  MicOff,
  Music,
  ScanLine,
  FileAudio,
  FileSearch,
  Play,
  Pause,
  Trash2,
  MoreVertical,
  History,
  MessageSquare,
  User
} from 'lucide-react-native';
import { router } from 'expo-router';
import { socketService } from '../../services/socketService';
import { Modal, FlatList } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';
import { useApp } from '../../store/appContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Audio } from 'expo-av';
import { chatWithStudyAI, imageToBase64, audioToBase64, ChatMessage } from '../../services/aiService';
import { loadChatHistory, saveChatHistory, clearCache } from '../../services/aiCache';
import { ResourceCard } from '../../components/ResourceCard';
import { Resource } from '../../constants/Resources';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  image?: string;
  audio?: string;
  resources?: Resource[];
}

function AudioWaveform({ color, progress = 0 }: { color: string; progress?: number }) {
  return (
    <View style={styles.waveformContainer}>
      {[0.4, 0.7, 1, 0.6, 0.9, 0.5, 0.8, 0.4, 0.6, 1, 0.4, 0.7, 0.5].map((v, i) => {
        const isActive = (i / 13) < progress;
        return (
          <View 
            key={i} 
            style={[
              styles.waveBar, 
              { height: 20 * v, backgroundColor: isActive ? color : color + '40' }
            ]} 
          />
        );
      })}
    </View>
  );
}

const formatTime = (millis: number) => {
  if (!millis || millis < 0) return "0:00";
  const minutes = Math.floor(millis / 60000);
  const seconds = Math.floor((millis % 60000) / 1000);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

import logoImg from '../../assets/images/splash-icon.png';

const WELCOME_MESSAGE: Message = { 
  id: '1', 
  text: "Welcome to Study-Chat! I'm your dedicated academic assistant. I can help you understand complex topics, recommend videos/PDFs, or even summarize your book pages if you scan them! What are we studying today?", 
  sender: 'ai' 
};

export default function StudyChatScreen() {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [pendingAudio, setPendingAudio] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingUri, setPlayingUri] = useState<string | null>(null);
  const [playbackPos, setPlaybackPos] = useState(0);
  const [playbackDur, setPlaybackDur] = useState(0);
  
  const [roomId, setRoomId] = useState<string>(Date.now().toString());
  const [historyVisible, setHistoryVisible] = useState(false);
  const [chatSessions, setChatSessions] = useState<any[]>([]);
  
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];
  const scrollRef = useRef<ScrollView>(null);

  // Socket Connection
  useEffect(() => {
    socketService.connect();
    socketService.joinRoom(roomId);
    
    socketService.onNewMessage((msg) => {
      // Only add message if it's from AI (user messages are added optimistically)
      // or if it matches the current roomId
      if (msg.roomId === roomId && msg.role === 'ai') {
        setMessages(prev => {
          // Avoid duplicate messages if already added
          if (prev.find(m => m.id === msg._id || m.text === msg.text)) return prev;
          return [...prev, {
            id: msg._id || Date.now().toString(),
            text: msg.text,
            sender: 'ai',
            timestamp: msg.timestamp
          }];
        });
        setIsTyping(false);
      }
    });

    return () => {
      socketService.disconnect();
    };
  }, [roomId]);

  const fetchSessions = async () => {
    try {
      // In a real app, use auth token
      const response = await fetch('http://localhost:3000/api/chat', {
        headers: { 'Authorization': 'Bearer YOUR_TOKEN' } // Placeholder
      });
      const data = await response.json();
      setChatSessions(data);
    } catch (error) {
      console.error("Error fetching sessions", error);
    }
  };

  const startNewChat = () => {
    setRoomId(Date.now().toString());
    setMessages([WELCOME_MESSAGE]);
    setHistoryVisible(false);
  };

  const loadSession = async (sid: string) => {
    setRoomId(sid);
    setHistoryVisible(false);
    setIsTyping(true);
    
    try {
      const response = await fetch(`http://localhost:3000/api/chat/${sid}`, {
        headers: { 'Authorization': 'Bearer YOUR_TOKEN' }
      });
      const data = await response.json();
      setMessages(data.map((m: any) => ({
        id: m._id,
        text: m.text,
        sender: m.role || 'user',
        timestamp: m.timestamp
      })));
    } catch (error) {
      console.error("Error loading session:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = async (text: string = input, imageUri?: string, audioUri?: string) => {
    if (!text.trim() && !imageUri && !audioUri) return;

    const userMsgId = Date.now().toString();
    const newUserMsg: Message = { 
      id: userMsgId, 
      text: text, 
      sender: 'user', 
      image: imageUri,
      audio: audioUri
    };
    
    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setIsTyping(true);

    // Send to Socket Backend
    socketService.sendMessage(roomId, text);

    // Fallback/Parallel: Multimodal still uses local Gemini for now if needed, 
    // or we could update backend to handle multimodal.
    // For this task, focusing on the menu and history.
  };

  const playSound = async (uri: string) => {
    try {
      if (sound) {
        await sound.unloadAsync().catch(() => {});
      }
      
      setPlayingUri(uri);
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );
      setSound(newSound);
    } catch (err) {
      console.error('Error playing sound', err);
      setPlayingUri(null);
    }
  };

  const stopSound = async () => {
    if (sound) {
      try {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          await sound.stopAsync();
          await sound.unloadAsync();
        }
      } catch (err) {
        console.log("Audio notice: Stop failed as sound was already unloaded");
      }
      setSound(null);
      setIsPlaying(false);
      setPlayingUri(null);
    }
  };

  const togglePlayback = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
    } else if (pendingAudio) {
      playSound(pendingAudio);
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setIsPlaying(status.isPlaying);
      setPlaybackPos(status.positionMillis);
      setPlaybackDur(status.durationMillis || 0);
      if (status.didJustFinish) {
        setIsPlaying(false);
        setPlayingUri(null);
        setPlaybackPos(0);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync().catch(() => {});
      }
    };
  }, [sound]);

  useEffect(() => {
    // Save chat history whenever messages update
    if (messages.length > 1) { // Only save if there's more than the welcome message 
      saveChatHistory(messages);
    }
  }, [messages]);

  useEffect(() => {
    // Load chat history on mount
    const fetchHistory = async () => {
      const history = await loadChatHistory();
      if (history && history.length > 0) {
        setMessages(history);
      }
    };
    fetchHistory();
  }, []);

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status === 'granted') {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        const { recording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        setRecording(recording);
        setIsRecording(true);
      }
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
    setIsRecording(false);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecording(null);
    if (uri) {
      setPendingAudio(uri);
    }
  };

  const discardPendingAudio = () => {
    stopSound();
    setPendingAudio(null);
    setPlaybackPos(0);
  };

  const sendPendingAudio = () => {
    if (pendingAudio) {
      stopSound();
      handleSend("Analyze this audio lecture for me and provide a summary.", undefined, pendingAudio);
      setPendingAudio(null);
      setPlaybackPos(0);
    }
  };

  const pickAudioFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'audio/*',
      copyToCacheDirectory: true
    });

    if (!result.canceled) {
      handleSend("Explain the core concepts in this audio file.", undefined, result.assets[0].uri);
    }
  };

  const scanDocument = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      handleSend("Summarize this document/book page and highlight key terms.", result.assets[0].uri);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      handleSend("Analyze this study material.", result.assets[0].uri);
    }
  };

  const handleRefresh = () => {
    Alert.alert(
      "Clear Chat",
      "Are you sure you want to clear your study history? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Clear", 
          style: "destructive",
          onPress: async () => {
            await clearCache();
            setMessages([WELCOME_MESSAGE]);
          }
        }
      ]
    );
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
             <View style={styles.titleIcon}>
                <Image source={logoImg} style={styles.logoIconImage} resizeMode="contain" />
             </View>
             <View>
                <Text style={styles.headerTitle}>Study-Chat</Text>
                <Text style={[styles.headerSubtitle, { color: colors.success }]}>Academic Mode Active</Text>
             </View>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.menuBtn} 
          onPress={() => {
            fetchSessions();
            setHistoryVisible(true);
          }}
        >
          <MoreVertical size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <Modal
        visible={historyVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setHistoryVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chat History</Text>
              <TouchableOpacity onPress={() => setHistoryVisible(false)}>
                <Text style={{ color: colors.primary, fontWeight: '700' }}>Close</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={[styles.newChatBtn, { backgroundColor: colors.primary }]}
              onPress={startNewChat}
            >
              <Plus size={20} color="#FFF" />
              <Text style={styles.newChatBtnText}>Start New Chat</Text>
            </TouchableOpacity>

            <FlatList
              data={chatSessions}
              keyExtractor={(item) => item._id}
              ListEmptyComponent={() => (
                <View style={styles.emptyHistory}>
                  <History size={40} color={colors.border} />
                  <Text style={{ color: colors.secondaryText, marginTop: 10 }}>No previous chats found</Text>
                </View>
              )}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[styles.historyItem, { borderBottomColor: colors.border }]}
                  onPress={() => loadSession(item._id)}
                >
                  <View style={[styles.historyIcon, { backgroundColor: colors.primary + '15' }]}>
                    <MessageSquare size={18} color={colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.historyText} numberOfLines={1}>
                      {item.firstMessage || "Empty Chat"}
                    </Text>
                    <Text style={[styles.historyDate, { color: colors.secondaryText }]}>
                      {new Date(item.lastTimestamp).toLocaleDateString()}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          ref={scrollRef}
          contentContainerStyle={styles.chatArea}
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
              <View 
                style={[
                  styles.bubble, 
                  msg.sender === 'user' ? 
                    { backgroundColor: colors.primary, borderBottomRightRadius: 4 } : 
                    { backgroundColor: colors.card, borderBottomLeftRadius: 4, borderColor: colors.border, borderWidth: 1 }
                ]}
              >
                {msg.image && (
                  <View style={styles.imagePreviewContainer}>
                    <Image source={{ uri: msg.image }} style={styles.imagePreview} />
                    {isScanning && (
                       <View style={styles.scanOverlay}>
                          <ActivityIndicator color={colors.primary} />
                          <Text style={styles.scanText}>Scanning Resource...</Text>
                       </View>
                    )}
                  </View>
                )}
                {msg.audio && (
                  <TouchableOpacity 
                    onPress={() => (isPlaying && playingUri === msg.audio) ? stopSound() : playSound(msg.audio!)}
                    style={[styles.audioBadge, { backgroundColor: msg.sender === 'user' ? 'rgba(255,255,255,0.2)' : colors.primary + '15' }]}
                  >
                    {(isPlaying && playingUri === msg.audio) && sound && playbackDur > 0 ? (
                      <Pause size={18} color={msg.sender === 'user' ? '#FFF' : colors.primary} fill={msg.sender === 'user' ? '#FFF' : colors.primary} />
                    ) : (
                      <Play size={18} color={msg.sender === 'user' ? '#FFF' : colors.primary} fill={msg.sender === 'user' ? '#FFF' : colors.primary} />
                    )}
                    <AudioWaveform 
                      color={msg.sender === 'user' ? '#FFF' : colors.primary} 
                      progress={(isPlaying && playingUri === msg.audio) ? (playbackPos / (playbackDur || 1)) : 0}
                    />
                    <Text style={[styles.durationText, { color: msg.sender === 'user' ? '#FFF' : colors.primary }]}>
                      {(isPlaying && playingUri === msg.audio) ? formatTime(playbackPos) : "Voice"}
                    </Text>
                  </TouchableOpacity>
                )}
                <Text style={[styles.messageText, { color: msg.sender === 'user' ? '#FFF' : colors.text }]}>
                  {msg.text}
                </Text>
                
                {msg.resources && msg.resources.length > 0 && (
                  <View style={styles.resourcesContainer}>
                    <Text style={[styles.recTitle, { color: colors.secondaryText }]}>Recommended for you:</Text>
                    {msg.resources.map(res => (
                      <ResourceCard key={res.id} resource={res} />
                    ))}
                  </View>
                )}
              </View>
            </View>
          ))}
          {isTyping && (
            <View style={styles.aiRow}>
              <View style={[styles.bubble, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderBottomLeftRadius: 4 }]}>
                <View style={styles.typingIndicator}>
                   <ActivityIndicator size="small" color={colors.primary} />
                   <Text style={[styles.messageText, { color: colors.secondaryText, marginLeft: 8 }]}>AI is analyzing...</Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        <View style={[styles.inputWrapper, { borderTopColor: colors.border }]}>
          {pendingAudio ? (
             <View style={[styles.pendingContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <TouchableOpacity onPress={discardPendingAudio} style={[styles.actionRound, { backgroundColor: colors.error + '15' }]}>
                  <Trash2 size={20} color={colors.error} />
                </TouchableOpacity>
                 <TouchableOpacity onPress={togglePlayback} style={styles.pendingInfo}>
                   {(isPlaying && playingUri === pendingAudio) ? <Pause size={18} color={colors.primary} /> : <Play size={18} color={colors.primary} />}
                   <View style={{ flex: 1 }}>
                     <Text style={[styles.pendingText, { color: colors.text }]}>
                       {(isPlaying && playingUri === pendingAudio) ? "Reviewing..." : "Voice Note Recorded"}
                     </Text>
                     <AudioWaveform 
                        color={colors.primary} 
                        progress={(isPlaying && playingUri === pendingAudio) ? (playbackPos / (playbackDur || 1)) : 0}
                     />
                   </View>
                   <Text style={[styles.durationText, { color: colors.primary }]}>
                     {formatTime((isPlaying && playingUri === pendingAudio) ? playbackPos : 0)}
                   </Text>
                 </TouchableOpacity>
                <TouchableOpacity onPress={sendPendingAudio} style={[styles.actionRound, { backgroundColor: colors.primary }]}>
                  <Send size={20} color="#FFF" />
                </TouchableOpacity>
             </View>
          ) : (
            <View style={styles.inputContainer}>
            <TouchableOpacity onPress={scanDocument} style={styles.iconBtn}>
              <ScanLine size={22} color={colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity onPress={pickAudioFile} style={styles.iconBtn}>
              <Music size={22} color={colors.primary} />
            </TouchableOpacity>
            
            <TextInput 
              placeholder={isRecording ? "Listening to lecture..." : "Ask or scan study material..."}
              style={[styles.input, { color: colors.text }]}
              placeholderTextColor={colors.secondaryText}
              value={input}
              onChangeText={setInput}
              multiline
            />

            {input.trim() || isRecording ? (
              <TouchableOpacity 
                onPress={isRecording ? stopRecording : () => handleSend()}
                style={[styles.sendBtn, { backgroundColor: isRecording ? '#EF4444' : colors.primary }]}
              >
                {isRecording ? <MicOff size={18} color="#FFF" /> : <Send size={18} color="#FFF" />}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                onPress={startRecording}
                style={[styles.sendBtn, { backgroundColor: colors.primary }]}
              >
                <Mic size={18} color="#FFF" />
              </TouchableOpacity>
            )}
            </View>
          )}
        </View>

      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
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
  titleIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoIconImage: {
    width: '100%',
    height: '100%',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: '700',
  },
  menuBtn: {
    padding: 8,
  },
  chatArea: {
    padding: 20,
    paddingBottom: 40,
  },
  messageRow: {
    marginBottom: 20,
    maxWidth: '90%',
  },
  userRow: {
    alignSelf: 'flex-end',
  },
  aiRow: {
    alignSelf: 'flex-start',
  },
  bubble: {
    padding: 16,
    borderRadius: 20,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
  },
  imagePreviewContainer: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  scanOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 8,
  },
  audioBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 20,
    marginBottom: 10,
    gap: 12,
    minWidth: 180,
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  waveBar: {
    width: 3,
    borderRadius: 1.5,
  },
  durationText: {
    fontSize: 10,
    fontWeight: '800',
    minWidth: 35,
    textAlign: 'right',
  },
  pendingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 28,
    borderWidth: 1,
    gap: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  pendingInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pendingText: {
    fontSize: 13,
    fontWeight: '700',
  },
  actionRound: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resourcesContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  recTitle: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputWrapper: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    paddingTop: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 30,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: 15,
    maxHeight: 100,
    paddingTop: 0,
    paddingBottom: 0,
  },
  iconBtn: {
    padding: 8,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: '70%',
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  newChatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    gap: 10,
  },
  newChatBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    gap: 16,
  },
  historyIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyText: {
    fontSize: 16,
    fontWeight: '600',
  },
  historyDate: {
    fontSize: 12,
    marginTop: 4,
  },
  emptyHistory: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
});
