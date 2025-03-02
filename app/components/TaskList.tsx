import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export const TaskList = () => {
  const tasks: Task[] = [
    { id: '1', title: 'サンプルタスク1', completed: false },
    { id: '2', title: 'サンプルタスク2', completed: true },
  ];

  const renderItem = ({ item }: { item: Task }) => (
    <View style={styles.taskItem}>
      <TouchableOpacity
        style={[
          styles.checkbox,
          item.completed && styles.checkboxChecked
        ]}
      >
        <Text style={styles.checkmark}>{item.completed ? '✓' : ''}</Text>
      </TouchableOpacity>
      <Text style={[
        styles.taskTitle,
        item.completed && styles.taskTitleCompleted
      ]}>
        {item.title}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {tasks.length === 0 ? (
        <Text style={styles.emptyText}>タスクがありません</Text>
      ) : (
        <FlatList
          data={tasks}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
  },
}); 