"use client";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { FixedSizeGrid as Grid } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

interface ReactWindowVirtualGridProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor?: (item: T, index: number) => string | number;

  containerHeight?: number;
  itemHeight?: number;
  itemWidth?: number;
  gap?: number;
  breakpoints?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

function ReactWindowVirtualGrid<T>({
  items,
  renderItem,
  keyExtractor,
  containerHeight = 600,
  itemHeight = 300,
  itemWidth = 250,
  gap = 16,
  breakpoints = { sm: 1, md: 2, lg: 3, xl: 4 },
}: ReactWindowVirtualGridProps<T>) {
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate responsive grid layout
  const getItemsPerRow = useCallback(
    (width: number) => {
      if (width >= 1280) return breakpoints.xl || 4; // xl
      if (width >= 1024) return breakpoints.lg || 3; // lg
      if (width >= 768) return breakpoints.md || 2; // md
      return breakpoints.sm || 1; // sm
    },
    [breakpoints]
  );

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setContainerWidth(width);
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Calculate grid layout
  const itemsPerRow = useMemo(
    () => getItemsPerRow(containerWidth),
    [containerWidth, getItemsPerRow]
  );
  const totalRows = Math.ceil(items.length / itemsPerRow);

  // Calculate actual item dimensions
  const actualItemWidth = useMemo(() => {
    if (containerWidth === 0) return itemWidth;
    return (containerWidth - gap * (itemsPerRow - 1)) / itemsPerRow;
  }, [containerWidth, itemsPerRow, gap, itemWidth]);

  const actualItemHeight = itemHeight + gap;

  // Cell renderer for react-window
  const cellRenderer = useCallback(
    ({
      columnIndex,
      rowIndex,
      style,
    }: {
      columnIndex: number;
      rowIndex: number;
      style: React.CSSProperties;
    }) => {
      const itemIndex = rowIndex * itemsPerRow + columnIndex;

      if (itemIndex >= items.length) {
        return <div style={style} />;
      }

      const item = items[itemIndex];

      return (
        <div
          style={{
            ...style,
            padding: gap / 2,
          }}
        >
          {renderItem(item, itemIndex)}
        </div>
      );
    },
    [items, itemsPerRow, gap, renderItem]
  );

  if (containerWidth === 0) {
    return (
      <div
        ref={containerRef}
        style={{
          height: containerHeight,
          overflow: "auto",
          position: "relative",
        }}
      >
        <div style={{ padding: "20px", textAlign: "center" }}>Loading...</div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{
        height: containerHeight,
        width: "100%",
      }}
    >
      <AutoSizer>
        {({ height, width }) => (
          <Grid
            columnCount={itemsPerRow}
            columnWidth={actualItemWidth}
            height={height}
            rowCount={totalRows}
            rowHeight={actualItemHeight}
            width={width}
            itemData={items}
            itemKey={({ columnIndex, rowIndex, data }) => {
              const idx = rowIndex * itemsPerRow + columnIndex;
              const item = data[idx];
              return keyExtractor ? keyExtractor(item, idx) : idx;
            }}
          >
            {cellRenderer}
          </Grid>
        )}
      </AutoSizer>
    </div>
  );
}

export default ReactWindowVirtualGrid;
