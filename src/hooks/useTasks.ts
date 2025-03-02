import { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import { Task } from '../types/task';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Setting up Firestore listener...');
    
    const tasksCollection = firestore().collection('tasks');

    // 初期データの確認
    tasksCollection.get().then(snapshot => {
      console.log('Initial collection size:', snapshot.size);
      console.log('Collection is empty:', snapshot.empty);
      snapshot.docs.forEach(doc => {
        console.log('Document data:', { id: doc.id, data: doc.data() });
      });
    }).catch(err => {
      console.error('Error checking collection:', err);
    });

    const unsubscribe = tasksCollection
      .onSnapshot(
        snapshot => {
          try {
            console.log('Received Firestore update:', {
              size: snapshot.size,
              empty: snapshot.empty,
              metadata: snapshot.metadata
            });

            const newTasks = snapshot.docs.map(doc => {
              const data = doc.data();
              console.log('Document data:', { id: doc.id, data });
              
              return {
                id: doc.id,
                title: data.title || '',
                completed: !!data.completed,
                timestamp: data.createdAt || data.timestamp || firestore.Timestamp.now(),
                userId: data.userId || 'unknown'
              } as Task;
            });

            console.log('Processed tasks:', newTasks.length, newTasks);
            setTasks(newTasks);
            setError(null);
          } catch (err) {
            console.error('Error processing tasks update:', err);
            setError('タスクの更新中にエラーが発生しました');
          }
        },
        error => {
          console.error('Firestore subscription error:', error);
          setError('Firestoreの監視中にエラーが発生しました');
        }
      );

    return () => {
      console.log('Cleaning up Firestore listener...');
      unsubscribe();
    };
  }, []);

  const addTask = async (title: string) => {
    try {
      console.log('Adding new task:', title);
      const now = firestore.Timestamp.now();
      const newTask = {
        title,
        completed: false,
        createdAt: now,
        timestamp: now, // 互換性のために両方のフィールドを設定
        updatedAt: now,
        userId: 'test-user'
      };
      
      console.log('Creating new task with data:', newTask);
      const docRef = await firestore().collection('tasks').add(newTask);
      console.log('Task added successfully:', docRef.id);

      // 追加したドキュメントを確認
      const doc = await docRef.get();
      console.log('Added document data:', { id: doc.id, data: doc.data() });

      return docRef.id;
    } catch (error) {
      console.error('Error adding task:', error);
      setError('タスクの追加に失敗しました');
      throw error;
    }
  };

  const toggleTask = async (taskId: string, completed: boolean) => {
    try {
      console.log('Toggling task:', taskId, completed);
      const taskRef = firestore().collection('tasks').doc(taskId);
      
      const updateData = {
        completed,
        updatedAt: firestore.Timestamp.now()
      };
      
      console.log('Updating task with data:', updateData);
      await taskRef.update(updateData);

      // 更新後のドキュメントを確認
      const doc = await taskRef.get();
      console.log('Updated document data:', { id: doc.id, data: doc.data() });

      console.log('Task updated successfully:', taskId);
    } catch (error) {
      console.error('Error updating task:', error);
      setError('タスクの更新に失敗しました');
      throw error;
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      console.log('Deleting task:', taskId);
      const taskRef = firestore().collection('tasks').doc(taskId);

      // 削除前のドキュメントを確認
      const doc = await taskRef.get();
      console.log('Deleting document data:', { id: doc.id, data: doc.data() });

      await taskRef.delete();
      console.log('Task deleted successfully:', taskId);
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('タスクの削除に失敗しました');
      throw error;
    }
  };

  // デバッグ用の情報を追加
  console.log('Current tasks state:', {
    count: tasks.length,
    tasks: tasks.map(t => ({ id: t.id, title: t.title }))
  });

  return {
    tasks,
    error,
    addTask,
    toggleTask,
    deleteTask,
  };
}; 