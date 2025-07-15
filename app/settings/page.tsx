'use client'

import React, { useEffect, useState } from 'react';
import { useSettingsStore } from '@/store/settings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Settings, User, Bell, Database, Shield, AlertTriangle } from 'lucide-react';
import { AlertThresholds } from '@/components/settings/AlertThresholds';

const SettingsPage: React.FC = () => {
  const {
    userSettings,
    notificationSettings,
    dataSyncSettings,
    privacySettings,
    isLoading,
    fetchUserSettings,
    fetchNotificationSettings,
    fetchDataSyncSettings,
    fetchPrivacySettings,
    updateUserSettings,
    updateNotificationSettings,
    updateDataSyncSettings,
    updatePrivacySettings,
  } = useSettingsStore();

  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('user');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        await Promise.all([
          fetchUserSettings(),
          fetchNotificationSettings(),
          fetchDataSyncSettings(),
          fetchPrivacySettings(),
        ]);
      } catch (error) {
        console.error('Failed to load settings:', error);
        toast({
          title: 'Error',
          description: 'Failed to load settings. Please try again.',
          variant: 'destructive',
        });
      }
    };

    loadSettings();
  }, []);

  const handleUserSettingsUpdate = async (updates: any) => {
    try {
      await updateUserSettings(updates);
      toast({
        title: 'Success',
        description: 'User settings updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update user settings.',
        variant: 'destructive',
      });
    }
  };

  const handleNotificationSettingsUpdate = async (updates: any) => {
    try {
      await updateNotificationSettings(updates);
      toast({
        title: 'Success',
        description: 'Notification settings updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update notification settings.',
        variant: 'destructive',
      });
    }
  };

  const handleDataSyncSettingsUpdate = async (updates: any) => {
    try {
      await updateDataSyncSettings(updates);
      toast({
        title: 'Success',
        description: 'Data sync settings updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update data sync settings.',
        variant: 'destructive',
      });
    }
  };

  const handlePrivacySettingsUpdate = async (updates: any) => {
    try {
      await updatePrivacySettings(updates);
      toast({
        title: 'Success',
        description: 'Privacy settings updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update privacy settings.',
        variant: 'destructive',
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="h-8 w-8" />
            Settings
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your account settings and preferences.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="user" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              User
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Alerts
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="sync" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Data Sync
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Privacy
            </TabsTrigger>
          </TabsList>

          <TabsContent value="user" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {userSettings ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Time Zone</Label>
                      <Select
                        value={userSettings.timezone}
                        onValueChange={(value) => handleUserSettingsUpdate({ timezone: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTC">UTC</SelectItem>
                          <SelectItem value="America/New_York">Eastern Time</SelectItem>
                          <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                          <SelectItem value="Europe/London">London</SelectItem>
                          <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select
                        value={userSettings.language}
                        onValueChange={(value) => handleUserSettingsUpdate({ language: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="temperature_unit">Temperature Unit</Label>
                      <Select
                        value={userSettings.temperature_unit}
                        onValueChange={(value) => handleUserSettingsUpdate({ temperature_unit: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select temperature unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Celsius">Celsius (°C)</SelectItem>
                          <SelectItem value="Fahrenheit">Fahrenheit (°F)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="weight_unit">Weight Unit</Label>
                      <Select
                        value={userSettings.weight_unit}
                        onValueChange={(value) => handleUserSettingsUpdate({ weight_unit: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select weight unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Kilograms">Kilograms (kg)</SelectItem>
                          <SelectItem value="Pounds">Pounds (lbs)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date_format">Date Format</Label>
                      <Select
                        value={userSettings.date_format}
                        onValueChange={(value) => handleUserSettingsUpdate({ date_format: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select date format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Loading user settings...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

<TabsContent value="alerts" className="space-y-6">
            <AlertThresholds />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {notificationSettings ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="push_notifications">Push Notifications</Label>
                      <Select
                        value={notificationSettings.push_notifications.toString()}
                        onValueChange={(value) => 
                          handleNotificationSettingsUpdate({ push_notifications: value === 'true' })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Enabled</SelectItem>
                          <SelectItem value="false">Disabled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email_notifications">Email Notifications</Label>
                      <Select
                        value={notificationSettings.email_notifications.toString()}
                        onValueChange={(value) => 
                          handleNotificationSettingsUpdate({ email_notifications: value === 'true' })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Enabled</SelectItem>
                          <SelectItem value="false">Disabled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sms_notifications">SMS Notifications</Label>
                      <Select
                        value={notificationSettings.sms_notifications.toString()}
                        onValueChange={(value) => 
                          handleNotificationSettingsUpdate({ sms_notifications: value === 'true' })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Enabled</SelectItem>
                          <SelectItem value="false">Disabled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="alert_sound">Alert Sound</Label>
                      <Select
                        value={notificationSettings.alert_sound.toString()}
                        onValueChange={(value) => 
                          handleNotificationSettingsUpdate({ alert_sound: value === 'true' })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Enabled</SelectItem>
                          <SelectItem value="false">Disabled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Loading notification settings...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sync" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Synchronization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {dataSyncSettings ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="auto_sync_enabled">Auto Sync</Label>
                      <Select
                        value={dataSyncSettings.auto_sync_enabled.toString()}
                        onValueChange={(value) => 
                          handleDataSyncSettingsUpdate({ auto_sync_enabled: value === 'true' })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Enabled</SelectItem>
                          <SelectItem value="false">Disabled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sync_frequency">Sync Frequency</Label>
                      <Select
                        value={dataSyncSettings.sync_frequency}
                        onValueChange={(value) => 
                          handleDataSyncSettingsUpdate({ sync_frequency: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Real-time">Real-time</SelectItem>
                          <SelectItem value="Hourly">Hourly</SelectItem>
                          <SelectItem value="Daily">Daily</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="wifi_only_sync">WiFi Only Sync</Label>
                      <Select
                        value={dataSyncSettings.wifi_only_sync.toString()}
                        onValueChange={(value) => 
                          handleDataSyncSettingsUpdate({ wifi_only_sync: value === 'true' })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Enabled</SelectItem>
                          <SelectItem value="false">Disabled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="backup_enabled">Backup Enabled</Label>
                      <Select
                        value={dataSyncSettings.backup_enabled.toString()}
                        onValueChange={(value) => 
                          handleDataSyncSettingsUpdate({ backup_enabled: value === 'true' })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Enabled</SelectItem>
                          <SelectItem value="false">Disabled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="backup_frequency">Backup Frequency</Label>
                      <Select
                        value={dataSyncSettings.backup_frequency}
                        onValueChange={(value) => 
                          handleDataSyncSettingsUpdate({ backup_frequency: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Daily">Daily</SelectItem>
                          <SelectItem value="Weekly">Weekly</SelectItem>
                          <SelectItem value="Monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="data_retention_days">Data Retention (Days)</Label>
                      <Input
                        type="number"
                        min="30"
                        max="3650"
                        value={dataSyncSettings.data_retention_days}
                        onChange={(e) => 
                          handleDataSyncSettingsUpdate({ data_retention_days: parseInt(e.target.value) })
                        }
                      />
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Loading data sync settings...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {privacySettings ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="location_sharing">Location Sharing</Label>
                      <Select
                        value={privacySettings.location_sharing.toString()}
                        onValueChange={(value) => 
                          handlePrivacySettingsUpdate({ location_sharing: value === 'true' })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Enabled</SelectItem>
                          <SelectItem value="false">Disabled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="analytics_enabled">Analytics</Label>
                      <Select
                        value={privacySettings.analytics_enabled.toString()}
                        onValueChange={(value) => 
                          handlePrivacySettingsUpdate({ analytics_enabled: value === 'true' })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Enabled</SelectItem>
                          <SelectItem value="false">Disabled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="crash_reporting">Crash Reporting</Label>
                      <Select
                        value={privacySettings.crash_reporting.toString()}
                        onValueChange={(value) => 
                          handlePrivacySettingsUpdate({ crash_reporting: value === 'true' })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Enabled</SelectItem>
                          <SelectItem value="false">Disabled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="data_sharing_research">Data Sharing for Research</Label>
                      <Select
                        value={privacySettings.data_sharing_research.toString()}
                        onValueChange={(value) => 
                          handlePrivacySettingsUpdate({ data_sharing_research: value === 'true' })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Enabled</SelectItem>
                          <SelectItem value="false">Disabled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="profile_visibility">Profile Visibility</Label>
                      <Select
                        value={privacySettings.profile_visibility}
                        onValueChange={(value) => 
                          handlePrivacySettingsUpdate({ profile_visibility: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Private">Private</SelectItem>
                          <SelectItem value="Public">Public</SelectItem>
                          <SelectItem value="Community">Community</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Loading privacy settings...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
