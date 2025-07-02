import React from 'react';
import { useForm } from 'react-hook-form';
import { useInspectionStore } from '@/store/inspection';
import { CreateInspectionScheduleRequest } from '@/types';

export const InspectionForm = () => {
  const { createSchedule } = useInspectionStore();
  const { register, handleSubmit, reset } = useForm<CreateInspectionScheduleRequest>();

  const onSubmit = handleSubmit(async (data) => {
    await createSchedule(data);
    reset();
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="hive" className="block text-sm font-medium text-gray-700">
          Hive
        </label>
        <input
          {...register('hive', { required: true })}
          type="text"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <div>
        <label htmlFor="scheduled_date" className="block text-sm font-medium text-gray-700">
          Scheduled Date
        </label>
        <input
          {...register('scheduled_date', { required: true })}
          type="date"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notes
        </label>
        <textarea
          {...register('notes')}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <button
        type="submit"
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
      >
        Schedule Inspection
      </button>
    </form>
  );
};

