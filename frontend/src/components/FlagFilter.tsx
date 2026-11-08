import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Environment } from '../types';

interface FlagFilterProps {
  selectedEnvironment: Environment | 'all';
  onEnvironmentChange: (env: Environment | 'all') => void;
  selectedStatus: 'all' | 'enabled' | 'disabled';
  onStatusChange: (status: 'all' | 'enabled' | 'disabled') => void;
  searchQuery: string;
  onSearchChange: (search: string) => void;
  totalCount: number;
  filteredCount: number;
}

export const FlagFilter: React.FC<FlagFilterProps> = ({
  selectedEnvironment,
  onEnvironmentChange,
  selectedStatus,
  onStatusChange,
  searchQuery,
  onSearchChange,
  totalCount,
  filteredCount,
}) => {
  const isFiltered = selectedEnvironment !== 'all' || selectedStatus !== 'all' || searchQuery.length > 0;

  const handleReset = () => {
    onEnvironmentChange('all');
    onStatusChange('all');
    onSearchChange('');
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by flag key or description..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-4 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:border-blue-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-900 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Environment Filter Dropdown */}
          <div className="flex items-center space-x-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700">
            <label htmlFor="env-filter-select" className="text-slate-400 font-medium">
              Env:
            </label>
            <select
              id="env-filter-select"
              aria-label="Env:"
              value={selectedEnvironment}
              onChange={(e) => onEnvironmentChange(e.target.value as Environment | 'all')}
              className="bg-transparent font-semibold uppercase tracking-wider text-slate-800 outline-none cursor-pointer"
            >
              <option value="all">All Environments</option>
              <option value="dev">DEV</option>
              <option value="staging">STAGING</option>
              <option value="prod">PROD</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-1 rounded-lg border border-slate-200 bg-slate-50 p-1 text-xs">
            <span className="px-2 text-slate-400 font-medium">Status:</span>
            {(['all', 'enabled', 'disabled'] as const).map((status) => (
              <button
                key={status}
                onClick={() => onStatusChange(status)}
                className={`rounded-md px-2.5 py-1 font-semibold capitalize transition-all ${
                  selectedStatus === status
                    ? status === 'enabled'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : status === 'disabled'
                      ? 'bg-slate-600 text-white shadow-sm'
                      : 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {isFiltered && (
            <button
              onClick={handleReset}
              className="flex items-center space-x-1 rounded-lg border border-dashed border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:border-slate-400 hover:text-slate-700 transition-colors"
              title="Reset all filters"
            >
              <X className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2">
        <span className="flex items-center space-x-1">
          <Filter className="h-3 w-3 text-slate-400" />
          <span>Showing <strong>{filteredCount}</strong> of <strong>{totalCount}</strong> feature flags</span>
        </span>
        {isFiltered && <span className="text-orange-600 font-medium">Filtered view active</span>}
      </div>
    </div>
  );
};

