import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Phone, Camera, Shield, Clock, Globe, ChevronRight } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [autoRecordEnabled, setAutoRecordEnabled] = React.useState(true);
  const [highAccuracyEnabled, setHighAccuracyEnabled] = React.useState(true);
  const { isDarkMode, colors } = useTheme();
  
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
            <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
          </View>
          
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.subtext }]}>Detection Settings</Text>
            
            <View style={styles.setting}>
              <View style={styles.settingInfo}>
                <View style={styles.iconContainer}>
                  <Camera size={20} color={colors.primary} />
                </View>
                <Text style={[styles.settingTitle, { color: colors.text }]}>Auto-record on fall</Text>
              </View>
              <Switch
                value={autoRecordEnabled}
                onValueChange={setAutoRecordEnabled}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.card}
              />
            </View>
            
            <View style={styles.setting}>
              <View style={styles.settingInfo}>
                <View style={styles.iconContainer}>
                  <Shield size={20} color={colors.primary} />
                </View>
                <Text style={[styles.settingTitle, { color: colors.text }]}>High accuracy mode</Text>
              </View>
              <Switch
                value={highAccuracyEnabled}
                onValueChange={setHighAccuracyEnabled}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.card}
              />
            </View>
            
            <View style={styles.setting}>
              <View style={styles.settingInfo}>
                <View style={styles.iconContainer}>
                  <Clock size={20} color={colors.primary} />
                </View>
                <Text style={[styles.settingTitle, { color: colors.text }]}>Detection frequency</Text>
                <Text style={[styles.settingDescription, { color: colors.subtext }]}>How often frames are analyzed</Text>
              </View>
              <TouchableOpacity style={styles.settingAction}>
                <Text style={[styles.settingActionText, { color: colors.subtext }]}>1 second</Text>
                <ChevronRight size={16} color={colors.subtext} />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.subtext }]}>Notifications</Text>
            
            <View style={styles.setting}>
              <View style={styles.settingInfo}>
                <View style={styles.iconContainer}>
                  <Bell size={20} color={colors.primary} />
                </View>
                <Text style={[styles.settingTitle, { color: colors.text }]}>Enable notifications</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.card}
              />
            </View>
            
            <View style={styles.setting}>
              <View style={styles.settingInfo}>
                <View style={styles.iconContainer}>
                  <Phone size={20} color={colors.primary} />
                </View>
                <Text style={[styles.settingTitle, { color: colors.text }]}>Emergency contacts</Text>
                <Text style={[styles.settingDescription, { color: colors.subtext }]}>Who to notify on fall detection</Text>
              </View>
              <TouchableOpacity style={styles.settingAction}>
                <Text style={[styles.settingActionText, { color: colors.subtext }]}>2 contacts</Text>
                <ChevronRight size={16} color={colors.subtext} />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.subtext }]}>About</Text>
            
            <View style={styles.setting}>
              <View style={styles.settingInfo}>
                <View style={styles.iconContainer}>
                  <Globe size={20} color={colors.primary} />
                </View>
                <Text style={[styles.settingTitle, { color: colors.text }]}>Server address</Text>
                <Text style={[styles.settingDescription, { color: colors.subtext }]}>Detection API endpoint</Text>
              </View>
              <TouchableOpacity style={styles.settingAction}>
                <Text style={[styles.settingActionText, { color: colors.subtext }]}>Change</Text>
                <ChevronRight size={16} color={colors.subtext} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.text }]}>Version</Text>
              <Text style={[styles.infoValue, { color: colors.subtext }]}>1.0.0</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.text }]}>Model</Text>
              <Text style={[styles.infoValue, { color: colors.subtext }]}>YOLOv8 Fall Detection</Text>
            </View>
          </View>
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
    fontSize: 20,
    fontWeight: '700',
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingInfo: {
    flex: 1,
    flexDirection: 'column',
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
  },
  settingAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingActionText: {
    fontSize: 14,
    marginRight: 4,
  },
  iconContainer: {
    position: 'absolute',
    left: -30,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoLabel: {
    fontSize: 16,
  },
  infoValue: {
    fontSize: 16,
  },
});