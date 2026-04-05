import { io } from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_API_URL as string, {
  transports: ['websocket', 'polling'],
  autoConnect: true,
});

export default socket;