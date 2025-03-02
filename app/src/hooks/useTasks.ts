import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  onSnapshot,
  Timestamp,
  where
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Task } from '../types/task';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, 'tasks'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tasksData: Task[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        tasksData.push({
          id: doc.id,
          title: data.title,
          description: data.description,
          completed: data.completed,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
          dueDate: data.dueDate ? data.dueDate.toDate() : undefined,
          priority: data.priority
        });
      });
      setTasks(tasksData);
      setLoading(false);
    }, (error) => {
      setError(error.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const now = Timestamp.now();
      await addDoc(collection(db, 'tasks'), {
        ...taskData,
        createdAt: now,
        updatedAt: now,
        completed: false
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : '不明なエラーが発生しました');
    }
  };

  const updateTask = async (taskId: string, taskData: Partial<Task>) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        ...taskData,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : '不明なエラーが発生しました');
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await deleteDoc(taskRef);
    } catch (error) {
      setError(error instanceof Error ? error.message : '不明なエラーが発生しました');
    }
  };

  const toggleTaskCompletion = async (taskId: string, completed: boolean) => {
    await updateTask(taskId, { completed });
  };

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion
  };
}; 