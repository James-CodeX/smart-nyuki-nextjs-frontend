'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useSmartDeviceStore } from '@/store/smart-device';
import { useHiveStore } from '@/store/hive';
import { Apiary, Hive, CreateSmartDeviceRequest } from '@/types';
import { useToast } from '@/components/ui/use-toast';

interface AddSmartDeviceModalProps {
  apiaries: Apiary[];
  children: React.ReactNode;
}

export function AddSmartDeviceModal({ apiaries, children }: AddSmartDeviceModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<CreateSmartDeviceRequest>({
    serial_number: '',
    hive: undefined,
    device_type: '',
    battery_level: 100,
    is_active: true,
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const { createDevice, isLoading } = useSmartDeviceStore();
  const { hives, fetchHives } = useHiveStore();
  const [selectedApiary, setSelectedApiary] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    if (selectedApiary) {
      fetchHives({ apiary: selectedApiary }).catch(console.error);
    }
  }, [selectedApiary, fetchHives]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: [],
      }));
    }
  };

  const handleSelectChange = (value: string | undefined, name: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user makes a selection
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: [],
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string[]> = {};

    if (!formData.serial_number.trim()) {
      newErrors.serial_number = ['Serial number is required'];
    }

    if (!formData.device_type.trim()) {
      newErrors.device_type = ['Device type is required'];
    }

    // Hive is now optional - devices can be registered without assignment
    // if (!formData.hive) {
    //   newErrors.hive = ['Please select a hive'];
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await createDevice(formData);
      handleSuccess();
    } catch (error: any) {
      console.error('Failed to add smart device:', error);
      toast({
        title: 'Error',
        description: 'Failed to add smart device. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      serial_number: '',
      hive: undefined,
      device_type: '',
      battery_level: 100,
      is_active: true,
    });
    setErrors({});
    setSelectedApiary('');
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const handleSuccess = () => {
    handleClose();
    const wasAssigned = formData.hive;
    toast({
      title: 'Success',
      description: wasAssigned 
        ? 'Smart device registered and assigned to hive successfully.'
        : 'Smart device registered successfully. You can assign it to a hive later.',
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Add Smart-nyuki Device</DialogTitle>
          <DialogDescription>
            Register a smart device. You can assign it to a hive now or later.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <Label htmlFor='serial_number'>Serial Number <span className='text-red-500'>*</span></Label>
            <Input
              id='serial_number'
              name='serial_number'
              type='text'
              value={formData.serial_number}
              onChange={handleChange}
              className={errors.serial_number ? 'border-red-500' : ''}
            />
            {errors.serial_number && (
              <p className='text-sm text-red-500 mt-1'>
                {errors.serial_number[0]}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor='device_type'>Device Type <span className='text-red-500'>*</span></Label>
            <Input
              id='device_type'
              name='device_type'
              type='text'
              value={formData.device_type}
              onChange={handleChange}
              className={errors.device_type ? 'border-red-500' : ''}
            />
            {errors.device_type && (
              <p className='text-sm text-red-500 mt-1'>
                {errors.device_type[0]}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor='apiary'>Select Apiary</Label>
            <Select
              value={selectedApiary}
              onValueChange={setSelectedApiary}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select an apiary' />
              </SelectTrigger>
              <SelectContent>
                {apiaries.map((apiary) => (
                  <SelectItem key={apiary.id} value={apiary.id}>
                    {apiary.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor='hive'>Select Hive (Optional)</Label>
            <Select
              value={formData.hive || ''}
              onValueChange={(value) => handleSelectChange(value === 'none' ? undefined : value, 'hive')}
              disabled={!selectedApiary}
            >
              <SelectTrigger className={errors.hive ? 'border-red-500' : ''}>
                <SelectValue placeholder={selectedApiary ? 'Select a hive or leave unassigned' : 'Select an apiary first'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='none'>Leave unassigned</SelectItem>
                {hives
                  .filter(hive => hive.apiary.id === selectedApiary)
                  .map((hive) => (
                  <SelectItem key={hive.id} value={hive.id}>
                    {hive.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!selectedApiary && (
              <p className='text-sm text-gray-500 mt-1'>
                Select an apiary to see available hives
              </p>
            )}
            {errors.hive && (
              <p className='text-sm text-red-500 mt-1'>
                {errors.hive[0]}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type='submit' disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Device'}
            </Button>
            <DialogClose asChild>
              <Button type='button' variant='outline'>Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

