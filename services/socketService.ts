import { io, Socket } from 'socket.io-client';

// For Android emulator, use 10.0.2.2. For iOS, use localhost.
const SOCKET_URL = 'http://localhost:3000'; 

class SocketService {
  private socket: Socket | null = null;

  connect() {
    if (this.socket) return;

    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
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
  }

  joinRoom(roomId: string) {
    if (this.socket) {
      this.socket.emit('join_room', roomId);
    }
  }

  sendMessage(roomId: string, text: string, role: string = 'user') {
    if (this.socket) {
      this.socket.emit('message', {
        roomId,
        text,
        role,
        sender: 'User', // In real app, use user name
      });
    }
  }

  onNewMessage(callback: (message: any) => void) {
    if (this.socket) {
      this.socket.on('new_message', callback);
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
