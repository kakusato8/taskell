import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useTasks } from '../hooks/useTasks';
import { Task } from '../types/task';

export const TaskList = () => {
  const { tasks, error, toggleTask, deleteTask } = useTasks();

  useEffect(() => {
    console.log('TaskList rendered with tasks:', {
      count: tasks.length,
      tasks: tasks.map(t => ({
        id: t.id,
        title: t.title,
        completed: t.completed
      }))
    });
  }, [tasks]);

  if (error) {
    console.error('TaskList error:', error);
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const handleToggleTask = async (task: Task) => {
    try {
      console.log('Toggling task:', {
        id: task.id,
        title: task.title,
        currentCompleted: task.completed
      });
      await toggleTask(task.id, !task.completed);
    } catch (error) {
      console.error('Error toggling task:', error);
      Alert.alert('エラー', 'タスクの更新に失敗しました');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      console.log('Deleting task:', taskId);
      await deleteTask(taskId);
    } catch (error) {
      console.error('Error deleting task:', error);
      Alert.alert('エラー', 'タスクの削除に失敗しました');
    }
  };

  const renderItem = ({ item }: { item: Task }) => {
    console.log('Rendering task item:', {
      id: item.id,
      title: item.title,
      completed: item.completed,
      timestamp: item.timestamp
    });

    return (
      <View style={styles.taskItem}>
        <TouchableOpacity
          style={[
            styles.checkbox,
            item.completed && styles.checkboxChecked
          ]}
          onPress={() => handleToggleTask(item)}
        >
          <Text style={styles.checkmark}>{item.completed ? '✓' : ''}</Text>
        </TouchableOpacity>
        <View style={styles.taskContent}>
          <Text style={[
            styles.taskTitle,
            item.completed && styles.taskTitleCompleted
          ]}>
            {item.title}
          </Text>
          {item.timestamp && (
            <Text style={styles.timestamp}>
              {new Date(item.timestamp.toDate()).toLocaleString()}
            </Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteTask(item.id)}
        >
          <Text style={styles.deleteButtonText}>削除</Text>
        </TouchableOpacity>
      </View>
    );
  };

  console.log('TaskList rendering with:', {
    taskCount: tasks.length,
    hasError: !!error
  });

  return (
    <View style={styles.container}>
      {tasks.length === 0 ? (
        <View>
          <Text style={styles.emptyText}>タスクがありません</Text>
          <Text style={styles.debugText}>
            {`Debug Info:\nTasks: ${tasks.length}\nError: ${error || 'none'}`}
          </Text>
        </View>
      ) : (
        <>
          <Text style={styles.taskCount}>タスク数: {tasks.length}</Text>
          <FlatList
            data={tasks}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            style={styles.list}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  taskContent: {
    flex: 1,
    marginRight: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 12,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
  },
  taskTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
  },
  taskCount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    textAlign: 'right',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    padding: 8,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  debugText: {
    fontSize: 12,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
}); 