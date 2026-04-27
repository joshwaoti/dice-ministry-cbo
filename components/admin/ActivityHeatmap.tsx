'use client';

import React from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';

interface HeatmapData {
  date: string;
  count: number;
}

export function ActivityHeatmap({ data }: { data: HeatmapData[] }) {
  // Generate 52 weeks x 7 days grid
  const cols = 52;
  const rows = 7;
  
  const [cells] = React.useState<{id: number, count: number}[]>(() => 
    Array.from({ length: cols * rows }).map((_, i) => ({
      id: i,
      count: Math.random() > 0.8 ? Math.floor(Math.random() * 5) + 1 : 0
    }))
  );

  const getColor = (count: number) => {
    if (count === 0) return '#ebedf0'; // gray-100
    if (count === 1) return '#c6e48b'; // light green
    if (count === 2) return '#7bc96f';
    if (count === 3) return '#239a3b';
    return '#196127'; // dark green
  };

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-1" style={{ width: 'max-content' }}>
        <Tooltip.Provider delayDuration={100}>
          {Array.from({ length: cols }).map((_, colIndex) => (
            <div key={colIndex} className="flex flex-col gap-1">
              {Array.from({ length: rows }).map((_, rowIndex) => {
                const cell = cells[colIndex * rows + rowIndex];
                return (
                  <Tooltip.Root key={rowIndex}>
                    <Tooltip.Trigger asChild>
                      <div 
                        className="w-3 h-3 rounded-[2px]" 
                        style={{ backgroundColor: getColor(cell.count) }}
                      />
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content 
                        className="bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg"
                        sideOffset={5}
                      >
                        {cell.count} submissions
                        <Tooltip.Arrow className="fill-gray-900" />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                );
              })}
            </div>
          ))}
        </Tooltip.Provider>
      </div>
    </div>
  );
}
