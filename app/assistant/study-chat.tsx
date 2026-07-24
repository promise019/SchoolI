import React, { useState, useRef, useEffect } from 'react';
import { API_URL } from '../../utils/config';
import * as FileSystem from 'expo-file-system/legacy';
import { StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Image, View as DefaultView, ActivityIndicator, Alert, Clipboard } from 'react-native';
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
  User,
  Copy,
  Edit3,
  File,
  Paperclip
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { imageToBase64, audioToBase64, ChatMessage } from '../../services/aiService';
import { loadChatHistory, saveChatHistory, clearCache } from '../../services/aiCache';
import { ResourceCard } from '../../components/ResourceCard';
import { Resource } from '../../constants/Resources';
import { notificationService } from '../../services/notificationService';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  image?: string;
  audio?: string;
  file?: { uri: string; name: string; type: string };
  resources?: Resource[];
  edits?: string[];
  editIndex?: number;
}

type PendingFile = {
  uri: string;
  name: string;
  mimeType: string;
  kind: 'image' | 'audio' | 'file';
};

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
  const [editingMsgId, setEditingMsgId] = useState<string | null>(null);
  const [editingAiReplyId, setEditingAiReplyId] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const [pendingAudio, setPendingAudio] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingUri, setPlayingUri] = useState<string | null>(null);
  const [playbackPos, setPlaybackPos] = useState(0);
  const [playbackDur, setPlaybackDur] = useState(0);
  const [pendingFile, setPendingFile] = useState<PendingFile | null>(null);
  const [pendingCaption, setPendingCaption] = useState('');
  
  const [roomId, setRoomId] = useState<string>(Date.now().toString());
  const [historyVisible, setHistoryVisible] = useState(false);
  const [chatSessions, setChatSessions] = useState<any[]>([]);
  
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];
  const scrollRef = useRef<ScrollView>(null);

  // Socket Connection
  useEffect(() => {
    const initSocket = async () => {
      await socketService.connect();
      socketService.joinRoom(roomId);
    };
    initSocket();
    
    socketService.onMessageEdited((data) => {
      setMessages(prev => {
        return prev.map(m => {
          if (m.id === data.originalMsgId) {
            const edits = m.edits ? [...m.edits, data.newText] : [m.text, data.newText];
            return { ...m, text: data.newText, edits, editIndex: edits.length - 1 };
          }
          if (data.aiReplyId && m.id === data.aiReplyId) {
            return null; // Remove the old AI reply
          }
          return m;
        }).filter(Boolean) as Message[];
      });
    });

    socketService.onNewMessage((msg) => {
      if (msg.roomId === roomId && msg.role === 'ai') {
        setMessages(prev => {
          if (prev.find(m => m.id === msg._id || m.text === msg.text)) return prev;
          
          // Detect Reminders/Suggestions in AI response
          handleAIReminders(msg.text);
          
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
    const BASE = API_URL;
    try {
      const token = await AsyncStorage.getItem('jwt_token');
      const response = await fetch(`${BASE}/chat`, {
        headers: { 'Authorization': `Bearer ${token}` } 
      });
      const data = await response.json();
      setChatSessions(data);
    } catch (error) {
      console.error("Error fetching sessions", error);
    }
  };

  const handleAIReminders = (text: string) => {
    const LowerText = text.toLowerCase();
    
    // Logic to detect if AI is setting a reminder or giving a strong suggestion
    if (LowerText.includes('remind') || LowerText.includes("don't forget") || LowerText.includes('remember to')) {
       // Schedule a test reminder for 10 seconds later for immediate demonstration
       notificationService.scheduleAIReminder(
         text.length > 100 ? text.substring(0, 97) + "..." : text, 
         10
       );
       console.log('AI Reminder scheduled!');
    }

    if (LowerText.includes('recommend') || LowerText.includes('suggest') || LowerText.includes('try looking at')) {
       // Send an instant suggestion notification
       notificationService.sendAISuggestion(
         "New Study Material",
         "The AI has found some resources that might help your current topic."
       );
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
    const BASE = API_URL;
    try {
      const token = await AsyncStorage.getItem('jwt_token');
      const response = await fetch(`${BASE}/chat/${sid}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setMessages(data.map((m: any) => ({
        id: m._id,
        text: m.text,
        sender: m.role || 'user',
        timestamp: m.timestamp,
        edits: m.edits,
        editIndex: m.edits ? m.edits.length - 1 : undefined
      })));
    } catch (error) {
      console.error("Error loading session:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = async (text: string = input, imageUri?: string, audioUri?: string, fileAttachment?: PendingFile) => {
    if (!text.trim() && !imageUri && !audioUri && !fileAttachment) return;

    const userMsgId = Date.now().toString();
    const newUserMsg: Message = { 
      id: userMsgId, 
      text: text, 
      sender: 'user', 
      image: imageUri,
      audio: audioUri,
      file: fileAttachment && fileAttachment.kind === 'file' ? { uri: fileAttachment.uri, name: fileAttachment.name, type: fileAttachment.mimeType } : undefined,
    };
    
    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setIsTyping(true);

    // Convert file to Base64 so Study AI receives full file content (Images, Audio, PDF/Documents)
    let fileData: { mimeType: string; base64: string; name?: string } | undefined = undefined;
    const targetUri = imageUri || audioUri || (fileAttachment ? fileAttachment.uri : undefined);
    const targetMime = imageUri ? 'image/jpeg' : audioUri ? 'audio/mp4' : (fileAttachment ? fileAttachment.mimeType : undefined);
    const targetName = fileAttachment ? fileAttachment.name : (imageUri ? 'photo.jpg' : 'recording.m4a');

    if (targetUri && targetMime) {
      try {
        const base64 = await FileSystem.readAsStringAsync(targetUri, { encoding: 'base64' });
        if (base64) {
          fileData = { mimeType: targetMime, base64, name: targetName };
        }
      } catch (err) {
        console.error('Failed to convert attached file to base64 for AI:', err);
      }
    }

    const socketText = text.trim() || (targetName ? `Please examine this attached file: ${targetName}` : '');
    
    if (editingMsgId) {
      socketService.editMessage(roomId, editingMsgId, editingAiReplyId || undefined, socketText, fileData);
      setEditingMsgId(null);
      setEditingAiReplyId(null);
    } else {
      socketService.sendMessage(roomId, socketText, 'user', fileData);
    }
  };

  const handleLongPressMessage = (msg: Message) => {
    if (msg.sender !== 'user') return;
    const options = ['Copy Text', 'Edit Message', 'Cancel'];
    Alert.alert('Message Options', undefined, [
      {
        text: 'Copy Text',
        onPress: () => {
          Clipboard.setString(msg.text);
          Alert.alert('Copied', 'Message text copied to clipboard.');
        },
      },
      {
        text: 'Edit Message',
        onPress: () => {
          setInput(msg.text);
          setEditingMsgId(msg.id);
          // Find the AI reply right after this message
          const idx = messages.findIndex(m => m.id === msg.id);
          if (idx !== -1 && idx + 1 < messages.length && messages[idx + 1].sender === 'ai') {
            setEditingAiReplyId(messages[idx + 1].id);
          } else {
            setEditingAiReplyId(null);
          }
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const cycleEdit = (msg: Message, direction: 'prev' | 'next') => {
    if (!msg.edits || msg.edits.length <= 1) return;
    const currentIndex = msg.editIndex ?? msg.edits.length - 1;
    let newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex >= 0 && newIndex < msg.edits.length) {
      setMessages(prev => prev.map(m => 
        m.id === msg.id ? { ...m, editIndex: newIndex, text: m.edits![newIndex] } : m
      ));
    }
  };

  const sendPendingFile = () => {
    if (!pendingFile) return;
    stopSound();
    const caption = pendingCaption.trim();
    if (pendingFile.kind === 'audio') {
      handleSend(caption || 'Analyze this audio lecture for me and provide a summary.', undefined, pendingFile.uri);
    } else if (pendingFile.kind === 'image') {
      handleSend(caption || 'Analyze this study material.', pendingFile.uri);
    } else {
      handleSend(caption || `Please analyze this file: ${pendingFile.name}`, undefined, undefined, pendingFile);
    }
    setPendingFile(null);
    setPendingCaption('');
    setPlaybackPos(0);
  };

  const discardPendingFile = () => {
    stopSound();
    setPendingFile(null);
    setPendingCaption('');
    setPlaybackPos(0);
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
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Microphone access is required to record audio.');
        return;
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await newRecording.startAsync();
      recordingRef.current = newRecording;
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Recording Error', 'Could not start the microphone. Please try again.');
    }
  };

  const stopRecording = async () => {
    if (!recordingRef.current) return;
    setIsRecording(false);
    try {
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      if (uri) setPendingAudio(uri);
    } catch (e) {
      console.error('Stop recording error:', e);
    } finally {
      recordingRef.current = null;
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
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
      const asset = result.assets[0];
      setPendingFile({ uri: asset.uri, name: asset.name, mimeType: asset.mimeType || 'audio/*', kind: 'audio' });
    }
  };

  const scanDocument = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      const asset = result.assets[0];
      setPendingFile({ uri: asset.uri, name: 'Scanned Document', mimeType: 'image/jpeg', kind: 'image' });
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      const asset = result.assets[0];
      setPendingFile({ uri: asset.uri, name: asset.fileName || 'Image', mimeType: asset.mimeType || 'image/*', kind: 'image' });
    }
  };

  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory: true,
    });
    if (!result.canceled) {
      const asset = result.assets[0];
      const isAudio = (asset.mimeType || '').startsWith('audio');
      const isImage = (asset.mimeType || '').startsWith('image');
      const kind: PendingFile['kind'] = isAudio ? 'audio' : isImage ? 'image' : 'file';
      setPendingFile({ uri: asset.uri, name: asset.name, mimeType: asset.mimeType || 'application/octet-stream', kind });
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
            <TouchableOpacity
              key={msg.id}
              activeOpacity={msg.sender === 'user' ? 0.85 : 1}
              onLongPress={() => handleLongPressMessage(msg)}
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
                {msg.file && (
                  <View style={[styles.fileBadge, { backgroundColor: msg.sender === 'user' ? 'rgba(255,255,255,0.2)' : colors.primary + '15' }]}>
                    <File size={18} color={msg.sender === 'user' ? '#FFF' : colors.primary} />
                    <Text style={[styles.fileNameText, { color: msg.sender === 'user' ? '#FFF' : colors.primary }]} numberOfLines={1}>
                      {msg.file.name}
                    </Text>
                  </View>
                )}
                <Text style={[styles.messageText, { color: msg.sender === 'user' ? '#FFF' : colors.text }]}>
                  {msg.text}
                </Text>
                {msg.sender === 'user' && (
                  <View style={styles.msgActions}>
                    {msg.edits && msg.edits.length > 1 && (
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 'auto', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, paddingHorizontal: 6, paddingVertical: 2 }}>
                        <TouchableOpacity onPress={() => cycleEdit(msg, 'prev')} style={{ padding: 4 }}>
                          <Text style={{ color: '#FFF', fontSize: 10, fontWeight: 'bold' }}>{'<'}</Text>
                        </TouchableOpacity>
                        <Text style={{ color: '#FFF', fontSize: 10, marginHorizontal: 4 }}>
                          {(msg.editIndex ?? msg.edits.length - 1) + 1}/{msg.edits.length}
                        </Text>
                        <TouchableOpacity onPress={() => cycleEdit(msg, 'next')} style={{ padding: 4 }}>
                          <Text style={{ color: '#FFF', fontSize: 10, fontWeight: 'bold' }}>{'>'}</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                    <TouchableOpacity onPress={() => { Clipboard.setString(msg.text); Alert.alert('Copied!', 'Message copied to clipboard.'); }} style={styles.msgActionBtn}>
                      <Copy size={11} color="rgba(255,255,255,0.6)" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        setInput(msg.text);
                        setEditingMsgId(msg.id);
                        const idx = messages.findIndex(m => m.id === msg.id);
                        if (idx !== -1 && idx + 1 < messages.length && messages[idx + 1].sender === 'ai') {
                          setEditingAiReplyId(messages[idx + 1].id);
                        } else {
                          setEditingAiReplyId(null);
                        }
                    }} style={styles.msgActionBtn}>
                      <Edit3 size={11} color="rgba(255,255,255,0.6)" />
                    </TouchableOpacity>
                  </View>
                )}
                {msg.resources && msg.resources.length > 0 && (
                  <View style={styles.resourcesContainer}>
                    <Text style={[styles.recTitle, { color: colors.secondaryText }]}>Recommended for you:</Text>
                    {msg.resources.map(res => (
                      <ResourceCard key={res.id} resource={res} />
                    ))}
                  </View>
                )}
              </View>
            </TouchableOpacity>
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
          {editingMsgId && (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.primary + '15', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Edit3 size={14} color={colors.primary} />
                <Text style={{ color: colors.primary, fontSize: 12, fontWeight: '600' }}>Editing message...</Text>
              </View>
              <TouchableOpacity onPress={() => { setEditingMsgId(null); setEditingAiReplyId(null); setInput(''); }}>
                <Text style={{ color: colors.primary, fontSize: 12, fontWeight: '700' }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
          {pendingFile ? (
            <View style={[styles.pendingFileContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {/* Top row: icon + file info + discard */}
              <View style={styles.pendingFileRow}>
                <View style={[styles.pendingFileIcon, { backgroundColor: colors.primary + '15' }]}>
                  {pendingFile.kind === 'image' ? (
                    <Image source={{ uri: pendingFile.uri }} style={styles.pendingImageThumb} />
                  ) : pendingFile.kind === 'audio' ? (
                    <Music size={22} color={colors.primary} />
                  ) : (
                    <File size={22} color={colors.primary} />
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.pendingText, { color: colors.text }]} numberOfLines={1}>{pendingFile.name}</Text>
                  <Text style={[styles.pendingSubText, { color: colors.secondaryText }]}>
                    {pendingFile.kind === 'audio' ? 'Audio file' : pendingFile.kind === 'image' ? 'Image' : 'Document'}
                  </Text>
                </View>
                <TouchableOpacity onPress={discardPendingFile} style={[styles.actionRound, { backgroundColor: colors.error + '15' }]}>
                  <Trash2 size={18} color={colors.error} />
                </TouchableOpacity>
              </View>
              {/* Caption input + send */}
              <View style={styles.captionRow}>
                <TextInput
                  placeholder="Add a message (optional)..."
                  placeholderTextColor={colors.secondaryText}
                  style={[styles.captionInput, { color: colors.text, borderColor: colors.border }]}
                  value={pendingCaption}
                  onChangeText={setPendingCaption}
                  multiline
                />
                <TouchableOpacity onPress={sendPendingFile} style={[styles.actionRound, { backgroundColor: colors.primary }]}>
                  <Send size={18} color="#FFF" />
                </TouchableOpacity>
              </View>
            </View>
          ) : pendingAudio ? (
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

            <TouchableOpacity onPress={pickFile} style={styles.iconBtn}>
              <Paperclip size={22} color={colors.primary} />
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
  msgActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 6,
    marginTop: 6,
    opacity: 0.8,
  },
  msgActionBtn: {
    padding: 4,
  },
  fileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
    gap: 8,
    maxWidth: 220,
  },
  fileNameText: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  pendingFileContainer: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 14,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  pendingFileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pendingFileIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  pendingImageThumb: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  pendingSubText: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: '500',
  },
  captionRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  captionInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    maxHeight: 80,
    fontWeight: '500',
  },
});
