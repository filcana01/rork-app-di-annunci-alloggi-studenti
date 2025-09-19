import React from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, Switch } from 'react-native';
import { useApp } from '../../hooks/use-app-context';
import { router } from 'expo-router';
import { LogOut, Globe, Plus, FileText, Settings } from 'lucide-react-native';
import { Colors, Shadows, Typography, Spacing, BorderRadius } from '../../constants/colors';

export default function ProfileScreen() {
  const { t, user, isAuthenticated, logout, language, setLanguage } = useApp();

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoText}>USI</Text>
            </View>
            <Text style={styles.title}>{t.dashboard.profile}</Text>
          </View>
        </View>
        <View style={styles.authContainer}>
          <View style={styles.logoPlaceholderLarge}>
            <Text style={styles.logoTextLarge}>USI</Text>
          </View>
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
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoText}>USI</Text>
            </View>
            <Text style={styles.title}>{t.dashboard.profile}</Text>
          </View>
        </View>

        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>USI</Text>
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
            <Plus size={20} color={Colors.text.primary} />
            <Text style={styles.menuItemText}>{t.dashboard.createListing}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <FileText size={20} color={Colors.text.secondary} />
            <Text style={styles.menuItemText}>I miei annunci</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Impostazioni</Text>
          
          <View style={styles.menuItem}>
            <Globe size={20} color={Colors.text.secondary} />
            <Text style={styles.menuItemText}>Lingua</Text>
            <View style={styles.languageToggle}>
              <Text style={styles.languageText}>IT</Text>
              <Switch
                value={language === 'en'}
                onValueChange={(value) => setLanguage(value ? 'en' : 'it')}
                trackColor={{ false: Colors.text.tertiary, true: Colors.text.primary }}
                thumbColor={Colors.background.primary}
              />
              <Text style={styles.languageText}>EN</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.menuItem}>
            <Settings size={20} color={Colors.text.secondary} />
            <Text style={styles.menuItemText}>Impostazioni account</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <LogOut size={20} color="#EF4444" />
          <Text style={styles.logoutText}>{t.auth.logout}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background.primary,
    borderBottomWidth: 2,
    borderBottomColor: Colors.border.black,
    ...Shadows.medium,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  logoPlaceholder: {
    width: 32,
    height: 32,
    backgroundColor: Colors.text.primary,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: Colors.text.inverse,
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
  },
  logoPlaceholderLarge: {
    width: 80,
    height: 80,
    backgroundColor: Colors.text.tertiary,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoTextLarge: {
    color: Colors.text.inverse,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
  },
  title: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    letterSpacing: 0.5,
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing['5xl'],
  },
  authText: {
    fontSize: Typography.fontSize.lg,
    color: Colors.text.secondary,
    marginTop: Spacing.lg,
    marginBottom: Spacing['5xl'],
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: Colors.text.primary,
    paddingHorizontal: Spacing['5xl'],
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    minWidth: 200,
    ...Shadows.medium,
  },
  loginButtonText: {
    color: Colors.text.inverse,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    textAlign: 'center',
  },
  registerButton: {
    borderWidth: 2,
    borderColor: Colors.text.primary,
    paddingHorizontal: Spacing['5xl'],
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    minWidth: 200,
  },
  registerButtonText: {
    color: Colors.text.primary,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    textAlign: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.background.primary,
    marginTop: Spacing.sm,
    gap: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.text.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border.black,
  },
  avatarText: {
    color: Colors.text.inverse,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
  },
  userName: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  userEmail: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  badge: {
    backgroundColor: Colors.text.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    marginTop: 4,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: Colors.border.black,
  },
  badgeText: {
    color: Colors.text.inverse,
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
  },
  section: {
    backgroundColor: Colors.background.primary,
    marginTop: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.secondary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  menuItemText: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  languageToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  languageText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.medium,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.primary,
    marginTop: Spacing.sm,
    padding: Spacing.lg,
    gap: Spacing.sm,
    borderWidth: 2,
    borderColor: '#EF4444',
    borderRadius: BorderRadius.lg,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  logoutText: {
    fontSize: Typography.fontSize.base,
    color: '#EF4444',
    fontWeight: Typography.fontWeight.semibold,
  },
});