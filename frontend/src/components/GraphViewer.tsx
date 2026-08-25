'use client';
import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

const GraphViewer = forwardRef(({ graphData }: { graphData: any }, ref) => {
  const fgRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });
  const containerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    pauseAnimation: () => {
      if (fgRef.current) fgRef.current.pauseAnimation();
    },
    resumeAnimation: () => {
      if (fgRef.current) fgRef.current.resumeAnimation();
    },
    zoomToFit: () => {
      if (fgRef.current) fgRef.current.zoomToFit(400, 50);
    }
  }));

  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight || 400
      });
    }
    
    // Auto zoom to fit after load
    setTimeout(() => {
      if (fgRef.current) {
        fgRef.current.zoomToFit(400, 50);
      }
    }, 500);
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[400px]">
      <ForceGraph2D
        ref={fgRef}
        width={dimensions.width}
        height={dimensions.height}
        graphData={graphData}
        nodeLabel="label"
        nodeColor={(node: any) => {
          if (node.group === 1) return '#ef4444'; // Red for target
          if (node.group === 2) return '#3b82f6'; // Blue for VASP
          return '#e8cbb1'; // Cream for intermediaries
        }}
        linkColor={() => 'rgba(212, 195, 184, 0.4)'}
        nodeRelSize={6}
        linkDirectionalArrowLength={3.5}
        linkDirectionalArrowRelPos={1}
        linkCurvature={0.2}
        backgroundColor="rgba(0,0,0,0)"
      />
    </div>
  );
});

GraphViewer.displayName = 'GraphViewer';
export default GraphViewer;
