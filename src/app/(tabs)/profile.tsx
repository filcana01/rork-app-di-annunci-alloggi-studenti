import React from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, Switch, SafeAreaView } from 'react-native';
import { useApp } from '@/providers/AppProvider';
import { router } from 'expo-router';
import { User, LogOut, Globe, Plus, FileText, Settings } from 'lucide-react-native';

export default function ProfileScreen() {
  const { t, user, isAuthenticated, logout, language, setLanguage } = useApp();

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{t.dashboard.profile}</Text>
        </View>
        <View style={styles.authContainer}>
          <User size={64} color="#D1D5DB" />
          <Text style={styles.authText}>Non sei ancora registrato</Text>
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => router.push('/(auth)/login')}
          >
            <Text style={styles.loginButtonText}>{t.auth.login}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.registerButton}
            onPress={() => router.push('/(auth)/register')}
          >
            <Text style={styles.registerButtonText}>{t.auth.register}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>{t.dashboard.profile}</Text>
        </View>

        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            <User size={40} color="#FFF" />
          </View>
          <View>
            <Text style={styles.userName}>
              {user?.firstName} {user?.lastName}
            </Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            {user?.role === 'admin' && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Admin</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.dashboard.myListings}</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <Plus size={20} color="#2563EB" />
            <Text style={styles.menuItemText}>{t.dashboard.createListing}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <FileText size={20} color="#6B7280" />
            <Text style={styles.menuItemText}>I miei annunci</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Impostazioni</Text>
          
          <View style={styles.menuItem}>
            <Globe size={20} color="#6B7280" />
            <Text style={styles.menuItemText}>Lingua</Text>
            <View style={styles.languageToggle}>
              <Text style={styles.languageText}>IT</Text>
              <Switch
                value={language === 'en'}
                onValueChange={(value) => setLanguage(value ? 'en' : 'it')}
                trackColor={{ false: '#D1D5DB', true: '#2563EB' }}
                thumbColor="#FFF"
              />
              <Text style={styles.languageText}>EN</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.menuItem}>
            <Settings size={20} color="#6B7280" />
            <Text style={styles.menuItemText}>Impostazioni account</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <LogOut size={20} color="#EF4444" />
          <Text style={styles.logoutText}>{t.auth.logout}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  authText: {
    fontSize: 18,
    color: '#374151',
    marginTop: 16,
    marginBottom: 32,
  },
  loginButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    minWidth: 200,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  registerButton: {
    borderWidth: 1,
    borderColor: '#2563EB',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 200,
  },
  registerButtonText: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    marginTop: 8,
    gap: 12,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  badge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#FFF',
    marginTop: 8,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  languageToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  languageText: {
    fontSize: 14,
    color: '#6B7280',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    marginTop: 8,
    padding: 16,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    color: '#EF4444',
    fontWeight: '600',
  },
});