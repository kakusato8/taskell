import { registerRootComponent } from 'expo';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { AddTaskForm } from './components/AddTaskForm';
import { TaskList } from './components/TaskList';

function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <AddTaskForm />
        <TaskList />
        <StatusBar style="auto" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  container: {
    flex: 1,
    padding: 16,
  },
});

registerRootComponent(App); 