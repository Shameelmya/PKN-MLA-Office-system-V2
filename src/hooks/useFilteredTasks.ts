import { useMemo } from 'react';
import { Task, GlobalFilters } from '../types';

export const useFilteredTasks = (
  allTasks: Task[],
  globalFilters: GlobalFilters,
  searchStr: string,
  catFilter: string | null = null,
  officerFilter: string | null = null
): Task[] => {
  return useMemo(() => {
    let result = allTasks;
    if (globalFilters.status === 'Active') {
      result = result.filter(t => t.status !== 'Completed' && t.status !== 'Unsolved');
    } else if (globalFilters.status !== 'All') {
      result = result.filter(t => t.status === globalFilters.status);
    }

    if (globalFilters.dateRange === 'custom') {
      if (globalFilters.customStartDate) {
        const start = new Date(globalFilters.customStartDate);
        start.setHours(0,0,0,0);
        result = result.filter(t => new Date(t.createdAt) >= start);
      }
      if (globalFilters.customEndDate) {
        const end = new Date(globalFilters.customEndDate);
        end.setHours(23,59,59,999);
        result = result.filter(t => new Date(t.createdAt) <= end);
      }
    } else if (globalFilters.dateRange !== 'all') {
      const cutoff = new Date();
      if (globalFilters.dateRange === '7days') cutoff.setDate(cutoff.getDate() - 7);
      else if (globalFilters.dateRange === '1month') cutoff.setMonth(cutoff.getMonth() - 1);
      else if (globalFilters.dateRange === '6months') cutoff.setMonth(cutoff.getMonth() - 6);
      else if (globalFilters.dateRange === '1year') cutoff.setFullYear(cutoff.getFullYear() - 1);
      result = result.filter(t => new Date(t.createdAt) >= cutoff);
    }

    if (globalFilters.applicationMode === 'Self') {
      result = result.filter(t => t.isSelfMode);
    } else if (globalFilters.applicationMode === 'Citizen') {
      result = result.filter(t => !t.isSelfMode && t.taskType !== 'direct');
    }

    if (globalFilters.followUpFrequency && globalFilters.followUpFrequency !== 'All') {
      result = result.filter(t => t.followUpFrequency === globalFilters.followUpFrequency);
    }

    if (catFilter && catFilter !== 'All') {
      if (catFilter === 'Direct Assignment') result = result.filter(t => t.taskType === 'direct');
      else result = result.filter(t => t.category === catFilter);
    }
    
    if (officerFilter && officerFilter !== 'All') {
      result = result.filter(t => t.assignedTo.includes(officerFilter));
    }

    if (searchStr) {
      const s = searchStr.toLowerCase();
      result = result.filter(
        t => t.id.toLowerCase().includes(s) ||
             (t.personalDetails?.name || '').toLowerCase().includes(s) ||
             (t.subject || '').toLowerCase().includes(s) ||
             (t.personalDetails?.mobileNumber || '').includes(s)
      );
    }
    return [...result].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [allTasks, globalFilters, searchStr, catFilter, officerFilter]);
};
