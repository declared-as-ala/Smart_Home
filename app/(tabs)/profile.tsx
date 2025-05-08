import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTheme } from '@/contexts/ThemeContext';
import { User, Moon, Bell, Shield, CircleHelp as HelpCircle, LogOut } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, signOut } = useAuthStore();
  const router = useRouter();
  const { isDarkMode, toggleTheme, colors } = useTheme();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/login');
  };

  return (
    <ImageBackground
      source={{ 
        uri: isDarkMode 
          ? 'https://images.pexels.com/photos/3075993/pexels-photo-3075993.jpeg'
          : 'https://images.pexels.com/photos/3255245/pexels-photo-3255245.jpeg'
      }}
      style={styles.container}
    >
      <View style={[styles.overlay, { backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.8)' }]}>
        <SafeAreaView edges={['top']}>
          <View style={[styles.header, { backgroundColor: 'transparent' }]}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
          </View>

          <View style={[styles.userInfo, { backgroundColor: 'transparent' }]}>
            <View style={[styles.avatar, { backgroundColor: colors.card }]}>
              <User size={32} color={colors.primary} />
            </View>
            <Text style={[styles.userName, { color: colors.text }]}>{user?.name}</Text>
            <Text style={[styles.userEmail, { color: colors.subtext }]}>{user?.email}</Text>
          </View>

          <View style={[styles.section, { backgroundColor: 'transparent' }]}>
            <View style={styles.setting}>
              <View style={styles.settingInfo}>
                <Moon size={20} color={colors.primary} />
                <Text style={[styles.settingTitle, { color: colors.text }]}>Dark Mode</Text>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.card}
              />
            </View>

            <TouchableOpacity style={styles.setting}>
              <View style={styles.settingInfo}>
                <Bell size={20} color={colors.primary} />
                <Text style={[styles.settingTitle, { color: colors.text }]}>Notifications</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.setting}>
              <View style={styles.settingInfo}>
                <Shield size={20} color={colors.primary} />
                <Text style={[styles.settingTitle, { color: colors.text }]}>Privacy</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.setting}>
              <View style={styles.settingInfo}>
                <HelpCircle size={20} color={colors.primary} />
                <Text style={[styles.settingTitle, { color: colors.text }]}>Help & Support</Text>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.signOutButton, { backgroundColor: colors.error + '20' }]} 
            onPress={handleSignOut}
          >
            <LogOut size={20} color={colors.error} />
            <Text style={[styles.signOutText, { color: colors.error }]}>Sign Out</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  },
  header: {
    padding: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  userInfo: {
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  setting: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingTitle: {
    fontSize: 16,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 'auto',
    marginBottom: 20,
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
  },
});