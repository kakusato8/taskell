import React, { useEffect, useState } from 'react';
import { StyleSheet, View, SafeAreaView, Text, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AddTaskForm } from './src/components/AddTaskForm';
import { TaskList } from './src/components/TaskList';
import firebase from './src/config/firebase';
import firestore from '@react-native-firebase/firestore';

// setImmediateのポリフィル
if (typeof setImmediate === 'undefined') {
  // @ts-ignore
  global.setImmediate = setTimeout;
}

export default function App() {
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPermissionError, setIsPermissionError] = useState(false);

  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        console.log('Starting Firebase initialization...');
        setIsLoading(true);
        setIsPermissionError(false);

        // Firestoreの接続テスト
        console.log('Testing Firestore connection...');
        try {
          const testCollection = firestore().collection('test');
          const testDoc = await testCollection.add({
            timestamp: firestore.FieldValue.serverTimestamp(),
            test: true
          });
          console.log('Firestore test successful:', testDoc.id);
          await testDoc.delete();
          
          setIsInitialized(true);
          setError(null);
          console.log('Firebase initialization complete');
        } catch (firestoreError: any) {
          console.error('Firestore test failed:', {
            code: firestoreError.code,
            message: firestoreError.message,
            details: firestoreError.details
          });
          if (firestoreError.code === 'firestore/permission-denied') {
            setIsPermissionError(true);
            throw new Error('Firestoreへのアクセス権限がありません。セキュリティルールを確認してください。');
          }
          throw new Error(`Firestore接続テストエラー: ${firestoreError.message || '不明なエラー'}`);
        }
      } catch (error: any) {
        console.error('Firebase initialization failed:', {
          name: error.name,
          message: error.message,
          code: error.code,
          stack: error.stack
        });
        setError(error instanceof Error ? error.message : 'Firebase初期化に失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    initializeFirebase();
  }, []);

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.errorText}>エラーが発生しました:</Text>
          <Text style={styles.errorDetail}>{error}</Text>
          {isPermissionError && (
            <View style={styles.permissionErrorContainer}>
              <Text style={styles.permissionErrorText}>
                Firestoreのセキュリティルールを更新する必要があります。
                以下のルールを設定してください：
              </Text>
              <View style={styles.codeBlock}>
                <Text style={styles.codeText}>
                  {`rules_version = '2';\nservice cloud.firestore {\n  match /databases/{database}/documents {\n    match /{document=**} {\n      allow read, write: if true;\n    }\n  }\n}`}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.firebaseConsoleButton}
                onPress={() => Linking.openURL('https://console.firebase.google.com')}
              >
                <Text style={styles.firebaseConsoleButtonText}>Firebaseコンソールを開く</Text>
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => {
              setError(null);
              setIsInitialized(false);
              setIsPermissionError(false);
              firebase.app().delete().then(() => {
                console.log('Firebase app deleted, retrying...');
                setIsLoading(true);
              });
            }}
          >
            <Text style={styles.retryButtonText}>再試行</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading || !isInitialized) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.loadingText}>読み込み中...</Text>
          <ActivityIndicator size="large" color="#007AFF" style={styles.spinner} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>タスク管理アプリ</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  errorText: {
    fontSize: 20,
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  errorDetail: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 6,
    marginTop: 20,
    alignSelf: 'center',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  spinner: {
    marginTop: 20,
  },
  permissionErrorContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ff6b6b',
  },
  permissionErrorText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  codeBlock: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 4,
    marginBottom: 16,
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#333',
  },
  firebaseConsoleButton: {
    backgroundColor: '#ff6b6b',
    padding: 12,
    borderRadius: 6,
    alignSelf: 'center',
  },
  firebaseConsoleButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
