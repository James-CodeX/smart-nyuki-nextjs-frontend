'use client'

import React, { useState, useEffect } from 'react';
import { useSettingsStore } from '@/store/settings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { AlertTriangle, Globe, Hexagon } from 'lucide-react';
import { UpdateAlertThresholdsRequest, AvailableHive } from '@/types';

interface FormData {
  temperature_min: number;
  temperature_max: number;
  humidity_min: number;
  humidity_max: number;
  weight_change_threshold: number;
  sound_level_threshold: number;
  battery_warning_level: number;
  inspection_reminder_days: number;
}

const DEFAULT_THRESHOLDS: FormData = {
  temperature_min: 32.0,
  temperature_max: 38.0,
  humidity_min: 40.0,
  humidity_max: 70.0,
  weight_change_threshold: 2.0,
  sound_level_threshold: 85,
  battery_warning_level: 20,
  inspection_reminder_days: 7,
};

export const AlertThresholds: React.FC = () => {
  const {
    globalThresholds,
    availableHives,
    alertThresholds,
    isLoading,
    fetchGlobalThresholds,
    setGlobalThresholds,
    fetchAvailableHives,
    fetchAlertThresholds,
    createAlertThreshold,
    updateAlertThreshold,
  } = useSettingsStore();

  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'global' | 'hive'>('global');
  const [globalFormData, setGlobalFormData] = useState<FormData>(DEFAULT_THRESHOLDS);
  const [hiveFormData, setHiveFormData] = useState<FormData>(DEFAULT_THRESHOLDS);
  const [selectedHive, setSelectedHive] = useState<AvailableHive | null>(null);
  const [currentHiveThreshold, setCurrentHiveThreshold] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchGlobalThresholds(),
          fetchAvailableHives(),
          fetchAlertThresholds(),
        ]);
      } catch (error) {
        console.error('Failed to load alert thresholds data:', error);
      }
    };

    loadData();
  }, []);

  // Update global form when global thresholds change
  useEffect(() => {
    if (globalThresholds) {
      setGlobalFormData({
        temperature_min: globalThresholds.temperature_min,
        temperature_max: globalThresholds.temperature_max,
        humidity_min: globalThresholds.humidity_min,
        humidity_max: globalThresholds.humidity_max,
        weight_change_threshold: globalThresholds.weight_change_threshold,
        sound_level_threshold: globalThresholds.sound_level_threshold,
        battery_warning_level: globalThresholds.battery_warning_level,
        inspection_reminder_days: globalThresholds.inspection_reminder_days,
      });
    }
  }, [globalThresholds]);

  // Update hive form when selected hive changes
  useEffect(() => {
    if (selectedHive) {
      const hiveThreshold = alertThresholds.find(
        (threshold) => threshold.hive === selectedHive.id
      );
      
      if (hiveThreshold) {
        setCurrentHiveThreshold(hiveThreshold);
        setHiveFormData({
          temperature_min: hiveThreshold.temperature_min,
          temperature_max: hiveThreshold.temperature_max,
          humidity_min: hiveThreshold.humidity_min,
          humidity_max: hiveThreshold.humidity_max,
          weight_change_threshold: hiveThreshold.weight_change_threshold,
          sound_level_threshold: hiveThreshold.sound_level_threshold,
          battery_warning_level: hiveThreshold.battery_warning_level,
          inspection_reminder_days: hiveThreshold.inspection_reminder_days,
        });
      } else {
        setCurrentHiveThreshold(null);
        // Use global thresholds as default if available
        setHiveFormData(globalThresholds ? {
          temperature_min: globalThresholds.temperature_min,
          temperature_max: globalThresholds.temperature_max,
          humidity_min: globalThresholds.humidity_min,
          humidity_max: globalThresholds.humidity_max,
          weight_change_threshold: globalThresholds.weight_change_threshold,
          sound_level_threshold: globalThresholds.sound_level_threshold,
          battery_warning_level: globalThresholds.battery_warning_level,
          inspection_reminder_days: globalThresholds.inspection_reminder_days,
        } : DEFAULT_THRESHOLDS);
      }
    }
  }, [selectedHive, alertThresholds, globalThresholds]);

  const validateForm = (data: FormData): boolean => {
    if (data.temperature_min >= data.temperature_max) {
      toast({
        title: 'Validation Error',
        description: 'Temperature minimum must be less than maximum.',
        variant: 'destructive',
      });
      return false;
    }

    if (data.humidity_min >= data.humidity_max) {
      toast({
        title: 'Validation Error',
        description: 'Humidity minimum must be less than maximum.',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  const handleGlobalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm(globalFormData)) {
      return;
    }

    try {
      await setGlobalThresholds(globalFormData);
      toast({
        title: 'Success',
        description: 'Global thresholds updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update global thresholds.',
        variant: 'destructive',
      });
    }
  };

  const handleHiveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedHive) {
      toast({
        title: 'Error',
        description: 'Please select a hive first.',
        variant: 'destructive',
      });
      return;
    }

    if (!validateForm(hiveFormData)) {
      return;
    }

    try {
      const requestData: UpdateAlertThresholdsRequest = {
        hive: selectedHive.id,
        ...hiveFormData,
      };

      if (currentHiveThreshold) {
        await updateAlertThreshold(currentHiveThreshold.id, requestData);
      } else {
        await createAlertThreshold(requestData);
      }

      toast({
        title: 'Success',
        description: `Thresholds for ${selectedHive.name} ${currentHiveThreshold ? 'updated' : 'created'} successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save hive thresholds.',
        variant: 'destructive',
      });
    }
  };

  const renderForm = (
    formData: FormData,
    setFormData: React.Dispatch<React.SetStateAction<FormData>>,
    onSubmit: (e: React.FormEvent) => void,
    submitLabel: string
  ) => (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Temperature Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <h3 className="text-lg font-semibold">Temperature Settings (°C)</h3>
          </div>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="temperature_min">Minimum Temperature</Label>
              <Input
                id="temperature_min"
                type="number"
                step="0.1"
                value={formData.temperature_min}
                onChange={(e) => setFormData({
                  ...formData,
                  temperature_min: parseFloat(e.target.value) || 0
                })}
                placeholder="e.g., 32.0"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="temperature_max">Maximum Temperature</Label>
              <Input
                id="temperature_max"
                type="number"
                step="0.1"
                value={formData.temperature_max}
                onChange={(e) => setFormData({
                  ...formData,
                  temperature_max: parseFloat(e.target.value) || 0
                })}
                placeholder="e.g., 38.0"
                required
              />
            </div>
          </div>
        </div>

        {/* Humidity Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold">Humidity Settings (%)</h3>
          </div>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="humidity_min">Minimum Humidity</Label>
              <Input
                id="humidity_min"
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={formData.humidity_min}
                onChange={(e) => setFormData({
                  ...formData,
                  humidity_min: parseFloat(e.target.value) || 0
                })}
                placeholder="e.g., 40.0"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="humidity_max">Maximum Humidity</Label>
              <Input
                id="humidity_max"
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={formData.humidity_max}
                onChange={(e) => setFormData({
                  ...formData,
                  humidity_max: parseFloat(e.target.value) || 0
                })}
                placeholder="e.g., 70.0"
                required
              />
            </div>
          </div>
        </div>

        {/* Weight & Sound Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-green-500" />
            <h3 className="text-lg font-semibold">Weight & Sound Settings</h3>
          </div>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="weight_change_threshold">Weight Change Threshold (kg)</Label>
              <Input
                id="weight_change_threshold"
                type="number"
                step="0.1"
                min="0"
                value={formData.weight_change_threshold}
                onChange={(e) => setFormData({
                  ...formData,
                  weight_change_threshold: parseFloat(e.target.value) || 0
                })}
                placeholder="e.g., 2.0"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sound_level_threshold">Sound Level Threshold (dB)</Label>
              <Input
                id="sound_level_threshold"
                type="number"
                min="0"
                max="150"
                value={formData.sound_level_threshold}
                onChange={(e) => setFormData({
                  ...formData,
                  sound_level_threshold: parseInt(e.target.value) || 0
                })}
                placeholder="e.g., 85"
                required
              />
            </div>
          </div>
        </div>

        {/* Battery & Inspection Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-purple-500" />
            <h3 className="text-lg font-semibold">Battery & Inspection Settings</h3>
          </div>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="battery_warning_level">Battery Warning Level (%)</Label>
              <Input
                id="battery_warning_level"
                type="number"
                min="0"
                max="100"
                value={formData.battery_warning_level}
                onChange={(e) => setFormData({
                  ...formData,
                  battery_warning_level: parseInt(e.target.value) || 0
                })}
                placeholder="e.g., 20"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inspection_reminder_days">Inspection Reminder (days)</Label>
              <Input
                id="inspection_reminder_days"
                type="number"
                min="1"
                max="365"
                value={formData.inspection_reminder_days}
                onChange={(e) => setFormData({
                  ...formData,
                  inspection_reminder_days: parseInt(e.target.value) || 0
                })}
                placeholder="e.g., 7"
                required
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : submitLabel}
        </Button>
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-6 w-6 text-orange-500" />
        <h2 className="text-2xl font-bold">Alert Thresholds</h2>
      </div>
      
      <p className="text-muted-foreground">
        Configure alert thresholds for your hives. Global thresholds apply to all hives unless specific thresholds are set for individual hives.
      </p>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'global' | 'hive')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="global" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Global Thresholds
          </TabsTrigger>
          <TabsTrigger value="hive" className="flex items-center gap-2">
            <Hexagon className="h-4 w-4" />
            Hive Specific
          </TabsTrigger>
        </TabsList>

        <TabsContent value="global" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Global Alert Thresholds
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                These thresholds will apply to all hives unless overridden by hive-specific settings.
              </p>
            </CardHeader>
            <CardContent>
              {renderForm(
                globalFormData,
                setGlobalFormData,
                handleGlobalSubmit,
                'Save Global Thresholds'
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hive" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hexagon className="h-5 w-5" />
                Hive-Specific Alert Thresholds
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Override global thresholds for specific hives with custom settings.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="hive-select">Select Hive</Label>
                <Select
                  value={selectedHive?.id || ''}
                  onValueChange={(value) => {
                    const hive = availableHives.find((h) => h.id === value);
                    setSelectedHive(hive || null);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a hive..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableHives.map((hive) => (
                      <SelectItem key={hive.id} value={hive.id}>
                        {hive.name} - {hive.apiary_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedHive && (
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold">Settings for {selectedHive.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {currentHiveThreshold
                        ? 'This hive has custom thresholds. Changes will update the existing settings.'
                        : 'This hive uses global thresholds. Saving will create custom settings for this hive.'}
                    </p>
                  </div>

                  {renderForm(
                    hiveFormData,
                    setHiveFormData,
                    handleHiveSubmit,
                    currentHiveThreshold ? 'Update Hive Thresholds' : 'Create Hive Thresholds'
                  )}
                </div>
              )}

              {!selectedHive && availableHives.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No hives available. Please add hives to set specific thresholds.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AlertThresholds;
