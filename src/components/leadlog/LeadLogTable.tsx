'use client';

import { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getExpandedRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  PaginationState,
  ExpandedState,
} from '@tanstack/react-table';
import { ChevronDown, ChevronUp, Search, Filter, Download, Columns, MoreHorizontal, AlertTriangle, Calendar, DollarSign, Phone, Mail, User, Building2, Tag, ArrowRight } from 'lucide-react';
import { useLeads, useUpdateLead } from '../../hooks/useLeads';
import { formatDate, formatDateTime, formatCurrency, getStatusColor, getMeetingStatusColor, getCallTypeColor, getLossReasonColor, getRedFlagLabels } from '../../lib/computations';
import { LEAD_STATUSES, LOSS_REASONS, CALL_TYPES, MEETING_STATUSES, LEAD_SOURCES } from '../../lib/constants';
import type { Lead } from '../../types';
import { Button, Input, Select, Badge, Label } from '../ui/BaseComponents';
import { cn } from '../../lib/utils';

const columnHelper = createColumnHelper<Lead>();

export function LeadLogTable({ leads }: { leads: Lead[] | undefined }) {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'date_created', desc: true }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 25 });
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const updateLead = useUpdateLead();

  const allColumns = useMemo(() => [
    columnHelper.accessor('lead_name', {
      header: 'Lead Name',
      cell: info => <span className="font-medium">{info.getValue() || '—'}</span>,
      size: 180,
    }),
    columnHelper.accessor('company', {
      header: 'Company',
      cell: info => <span className="text-gray-600">{info.getValue() || '—'}</span>,
      size: 150,
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      cell: info => <span className="text-gray-600">{info.getValue() || '—'}</span>,
      size: 200,
    }),
    columnHelper.accessor('phone', {
      header: 'Phone',
      cell: info => <span className="text-gray-600">{info.getValue() || '—'}</span>,
      size: 140,
    }),
    columnHelper.accessor('source', {
      header: 'Source',
      cell: info => info.getValue() ? (
        <Badge variant="default" className="bg-gray-100 text-gray-700">{info.getValue()}</Badge>
      ) : '—',
      size: 110,
    }),
    columnHelper.accessor('setter_name', {
      header: 'Setter',
      cell: info => <span className="text-gray-600">{info.getValue() || '—'}</span>,
      size: 100,
    }),
    columnHelper.accessor('closer_name', {
      header: 'Closer',
      cell: info => <span className="text-gray-600">{info.getValue() || '—'}</span>,
      size: 100,
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => (
        <Badge className={getStatusColor(info.getValue())}>
          {info.getValue()}
        </Badge>
      ),
      size: 130,
    }),
    columnHelper.accessor('meeting_status', {
      header: 'Meeting',
      cell: info => info.getValue() ? (
        <Badge className={getMeetingStatusColor(info.getValue())}>
          {info.getValue()}
        </Badge>
      ) : '—',
      size: 120,
    }),
    columnHelper.accessor('offer_made', {
      header: 'Offer',
      cell: info => info.getValue() ? (
        <Badge variant="success">Yes</Badge>
      ) : (
        <Badge variant="gray">No</Badge>
      ),
      size: 70,
    }),
    columnHelper.accessor('call_type', {
      header: 'Call Type',
      cell: info => info.getValue() ? (
        <Badge className={getCallTypeColor(info.getValue())}>
          {info.getValue()}
        </Badge>
      ) : '—',
      size: 110,
    }),
    columnHelper.accessor('loss_reason', {
      header: 'Loss Reason',
      cell: info => info.getValue() ? (
        <Badge className={getLossReasonColor(info.getValue())}>
          {info.getValue()}
        </Badge>
      ) : '—',
      size: 120,
    }),
    columnHelper.accessor('date_created', {
      header: 'Created',
      cell: info => <span className="text-gray-600">{formatDateTime(info.getValue())}</span>,
      size: 140,
    }),
    columnHelper.accessor('first_contact_date', {
      header: 'First Contact',
      cell: info => <span className="text-gray-600">{info.getValue() ? formatDateTime(info.getValue()) : '—'}</span>,
      size: 140,
    }),
    columnHelper.accessor('date_meeting_booked', {
      header: 'Meeting Booked',
      cell: info => <span className="text-gray-600">{info.getValue() ? formatDate(info.getValue()) : '—'}</span>,
      size: 120,
    }),
    columnHelper.accessor('date_of_meeting', {
      header: 'Meeting Date',
      cell: info => <span className="text-gray-600">{info.getValue() ? formatDate(info.getValue()) : '—'}</span>,
      size: 120,
    }),
    columnHelper.accessor('last_touch_date', {
      header: 'Last Touch',
      cell: info => <span className="text-gray-600">{info.getValue() ? formatDate(info.getValue()) : '—'}</span>,
      size: 120,
    }),
    columnHelper.accessor('deposit_amount', {
      header: 'Deposit',
      cell: info => <span className="font-medium">{formatCurrency(info.getValue())}</span>,
      size: 100,
    }),
    columnHelper.accessor('total_deal_value', {
      header: 'Deal Value',
      cell: info => <span className="font-medium">{formatCurrency(info.getValue())}</span>,
      size: 100,
    }),
    columnHelper.accessor('cash_collected', {
      header: 'Collected',
      cell: info => <span className="font-medium text-success-600">{formatCurrency(info.getValue())}</span>,
      size: 100,
    }),
    columnHelper.accessor('refund_clawback_amount', {
      header: 'Refund',
      cell: info => <span className="font-medium text-danger-600">{formatCurrency(info.getValue())}</span>,
      size: 100,
    }),
    columnHelper.accessor('commission_pct', {
      header: 'Commission %',
      cell: info => <span className="text-gray-600">{info.getValue()}%</span>,
      size: 100,
    }),
    columnHelper.accessor('earnings', {
      header: 'Earnings',
      cell: info => <span className="font-medium text-primary-600">{formatCurrency(info.getValue())}</span>,
      size: 100,
    }),
    columnHelper.accessor('date_paid_in_full', {
      header: 'Paid in Full',
      cell: info => <span className="text-gray-600">{info.getValue() ? formatDate(info.getValue()) : '—'}</span>,
      size: 120,
    }),
    columnHelper.display({
      id: 'red_flags',
      header: 'Flags',
      cell: info => {
        const flags = getRedFlagLabels(info.row.original);
        if (flags.length === 0) return null;
        return (
          <div className="flex flex-wrap gap-1">
            {flags.map(flag => (
              <Badge key={flag} variant="danger" className="animate-pulse text-xs">
                <AlertTriangle className="w-3 h-3 mr-1" />
                {flag}
              </Badge>
            ))}
          </div>
        );
      },
      size: 100,
    }),
  ], []);

  const table = useReactTable({
    data: leads || [],
    columns: allColumns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination,
      columnVisibility,
      expanded,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  const handleCellEdit = async (row: any, columnId: string, value: any) => {
    await updateLead.mutateAsync({ id: row.original.id, [columnId]: value });
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 bg-white border-b border-gray-200">
        <div className="flex-1 max-w-md">
          <label className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search all columns..."
              value={globalFilter}
              onChange={e => setGlobalFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </label>
        </div>
        
        <div className="flex items-center gap-2">
          <Select
            value={pagination.pageSize}
            onChange={e => setPagination(prev => ({ ...prev, pageSize: parseInt(e.target.value) }))}
            className="w-auto"
          >
            <option value={10}>10 rows</option>
            <option value={25}>25 rows</option>
            <option value={50}>50 rows</option>
            <option value={100}>100 rows</option>
          </Select>
          
          <Button variant="outline" size="sm" onClick={() => setColumnVisibility(prev => ({
            ...prev,
            ...Object.fromEntries(allColumns.map(c => [c.id, true]))
          }))}>
            <Columns className="w-4 h-4 mr-1" />
            Columns
          </Button>
          
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-1" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Column Filters */}
      <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 overflow-x-auto">
        <div className="flex gap-2 min-w-max" style={{ minWidth: '100%' }}>
          {table.getAllColumns().map(column => {
            const filterValue = column.getFilterValue() as string | undefined;
            const canFilter = column.getCanFilter();
            
            if (!canFilter) return null;
            
            return (
              <div key={column.id} className="flex-1 min-w-[120px] max-w-[200px]">
                <Input
                  type="text"
                  placeholder={`Filter ${column.columnDef.header}`}
                  value={filterValue || ''}
                  onChange={e => column.setFilterValue(e.target.value)}
                  className="text-xs py-1.5"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full min-w-max text-sm">
          <thead className="sticky top-0 bg-white z-10 border-b border-gray-200">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="text-left text-gray-500">
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className={cn(
                      'px-3 py-2 font-medium whitespace-nowrap cursor-pointer select-none',
                      header.column.getCanSort() && 'hover:bg-gray-50'
                    )}
                    style={{ width: header.getSize() }}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-1">
                      <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                      {header.column.getIsSorted() && (
                        header.column.getIsSorted() === 'asc' ? (
                          <ChevronUp className="w-4 h-4 text-primary-600" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-primary-600" />
                        )
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-100">
            {table.getRowModel().rows.map(row => (
              <tr
                key={row.id}
                className={cn(
                  'transition-colors',
                  row.original.aging_flag && 'bg-warning-50',
                  row.original.booking_lag_flag && 'bg-warning-50',
                  row.original.deposit_unpaid_flag && 'bg-danger-50'
                )}
              >
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    className="px-3 py-2 whitespace-nowrap"
                    style={{ width: cell.column.getSize() }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            
            {table.getRowModel().rows.length === 0 && (
              <tr>
                <td colSpan={allColumns.length} className="px-3 py-8 text-center text-gray-500">
                  No leads found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 bg-white border-t border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}{' '}
          of {table.getFilteredRowModel().rows.length} leads
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}