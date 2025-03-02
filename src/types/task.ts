import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  timestamp: FirebaseFirestoreTypes.Timestamp;
  userId: string;
} 