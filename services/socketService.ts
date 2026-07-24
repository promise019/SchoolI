import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from '../utils/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

class SocketService {
  private socket: Socket | null = null;

  async connect() {
    if (this.socket) return;

    try {
      const token = await AsyncStorage.getItem('jwt_token');

      this.socket = io(SOCKET_URL, {
        transports: ['websocket'],
        auth: { token }
      });

      this.socket.on('connect', () => {
        console.log('Connected to backend socket');
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from backend socket');
      });

      this.socket.on('error', (error) => {
        console.error('Socket error:', error);
      });
    } catch (e) {
      console.error('Failed to get token for socket auth:', e);
    }
  }

  joinRoom(roomId: string) {
    if (this.socket) {
      this.socket.emit('join_room', roomId);
    }
  }

  sendMessage(roomId: string, text: string, role: string = 'user', fileData?: { mimeType: string; base64: string; name?: string }) {
    if (this.socket) {
      this.socket.emit('message', {
        roomId,
        text,
        role,
        sender: 'User',
        fileData
      });
    }
  }

  editMessage(roomId: string, originalMsgId: string, aiReplyId: string | undefined, newText: string, fileData?: { mimeType: string; base64: string; name?: string }) {
    if (this.socket) {
      this.socket.emit('edit_message', {
        roomId,
        originalMsgId,
        aiReplyId,
        newText,
        fileData
      });
    }
  }

  onNewMessage(callback: (message: any) => void) {
    if (this.socket) {
      this.socket.on('new_message', callback);
    }
  }

  onMessageEdited(callback: (data: { originalMsgId: string; aiReplyId?: string; newText: string }) => void) {
    if (this.socket) {
      this.socket.on('message_edited', callback);
    }
  }
  
  onHostelUpdate(callback: (hostel: any) => void) {
    if (this.socket) {
      this.socket.on('hostel_updated', callback);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();
