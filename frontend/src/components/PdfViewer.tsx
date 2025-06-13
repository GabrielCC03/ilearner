/**
 * Implementation of this was vibe coded for demo purposes of idea
 * 
 */

import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { 
  Box,
  Button, 
  Group, 
  Text, 
  Container, 
  LoadingOverlay, 
  Alert,
  ActionIcon,
  Stack,
  Card
} from '@mantine/core';
import { 
  IconChevronLeft, 
  IconChevronRight, 
  IconDownload, 
  IconZoomIn, 
  IconZoomOut,
  IconArrowLeft,
  IconMaximize,
  IconMinimize
} from '@tabler/icons-react';

// Import react-pdf styles
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

interface PdfViewerProps {
  fileUrl: string;
  fileName: string;
  onBack: () => void;
}

export default function PdfViewer({ fileUrl, fileName, onBack }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  }

  function onDocumentLoadError(error: Error): void {
    setError(`Failed to load PDF: ${error.message}`);
    setLoading(false);
  }

  function changePage(offset: number): void {
    setPageNumber(prevPageNumber => Math.max(1, Math.min(prevPageNumber + offset, numPages || 1)));
  }

  function previousPage(): void {
    changePage(-1);
  }

  function nextPage(): void {
    changePage(1);
  }

  function zoomIn(): void {
    setScale(prevScale => Math.min(prevScale + 0.2, 3.0));
  }

  function zoomOut(): void {
    setScale(prevScale => Math.max(prevScale - 0.2, 0.5));
  }

  function resetZoom(): void {
    setScale(1.0);
  }

  function downloadPdf(): void {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.click();
  }

  function toggleFullscreen(): void {
    setIsFullscreen(!isFullscreen);
  }

  const containerStyle = isFullscreen 
    ? { position: 'fixed' as const, top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, backgroundColor: 'white' }
    : {};

  return (
    <Box style={containerStyle}>
      <Container size="xl" p="md" style={{ position: 'relative', height: isFullscreen ? '100vh' : 'auto' }}>
        {/* Loading Overlay */}
        <LoadingOverlay visible={loading} />
        
        {/* Header with back button and controls */}
        <Card withBorder mb="md" p="md">
          <Group justify="space-between" align="center">
            <Group>
              <ActionIcon
                variant="subtle"
                onClick={onBack}
                size="lg"
              >
                <IconArrowLeft size={20} />
              </ActionIcon>
              <Box>
                <Text fw={500} size="sm">{fileName}</Text>
                <Text size="xs" c="dimmed">
                  {numPages ? `${numPages} pages` : 'Loading...'}
                </Text>
              </Box>
            </Group>

            <Group>
              <ActionIcon
                variant="subtle"
                onClick={toggleFullscreen}
                title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                {isFullscreen ? <IconMinimize size={16} /> : <IconMaximize size={16} />}
              </ActionIcon>
              <Button
                variant="subtle"
                onClick={downloadPdf}
                leftSection={<IconDownload size={16} />}
                size="sm"
              >
                Download
              </Button>
            </Group>
          </Group>
        </Card>
        
        {/* Error Alert */}
        {error && (
          <Alert color="red" mb="md">
            {error}
          </Alert>
        )}

        {/* Navigation Controls */}
        <Card withBorder mb="md" p="sm">
          <Group justify="space-between">
            <Group>
              <Button 
                variant="subtle" 
                onClick={previousPage} 
                disabled={pageNumber <= 1}
                leftSection={<IconChevronLeft size={14} />}
                size="sm"
              >
                Previous
              </Button>
              
              <Text size="sm" fw={500}>
                Page {pageNumber || '--'} of {numPages || '--'}
              </Text>
              
              <Button 
                variant="subtle" 
                onClick={nextPage} 
                disabled={pageNumber >= (numPages || 1)}
                rightSection={<IconChevronRight size={14} />}
                size="sm"
              >
                Next
              </Button>
            </Group>

            <Group>
              <Button 
                variant="subtle" 
                onClick={zoomOut}
                disabled={scale <= 0.5}
                leftSection={<IconZoomOut size={14} />}
                size="sm"
              >
                Zoom Out
              </Button>
              
              <Button
                variant="subtle"
                onClick={resetZoom}
                size="sm"
              >
                {Math.round(scale * 100)}%
              </Button>
              
              <Button 
                variant="subtle" 
                onClick={zoomIn}
                disabled={scale >= 3.0}
                leftSection={<IconZoomIn size={14} />}
                size="sm"
              >
                Zoom In
              </Button>
            </Group>
          </Group>
        </Card>

        {/* PDF Document */}
        <Box
          style={{ 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: '1px solid #dee2e6', 
            borderRadius: '8px',
            padding: '20px',
            backgroundColor: '#f8f9fa',
            minHeight: isFullscreen ? 'calc(100vh - 200px)' : '600px',
            maxHeight: isFullscreen ? 'calc(100vh - 200px)' : '80vh',
            overflow: 'auto'
          }}
        >
          <Box style={{ maxWidth: '100%', maxHeight: '100%' }}>
            <Document
              file={fileUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={
                <Stack align="center" gap="md" py="xl">
                  <LoadingOverlay visible />
                  <Text c="dimmed">Loading PDF...</Text>
                </Stack>
              }
            >
              <Page 
                pageNumber={pageNumber} 
                scale={scale}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                width={undefined}
                height={undefined}
              />
            </Document>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
