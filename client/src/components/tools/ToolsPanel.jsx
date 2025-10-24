import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useToast } from '../ui/Toast';
import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib';
import {
  Layers,
  Scissors,
  RotateCw,
  Type,
  Hash,
  ImageDown,
  Wand2,
  Droplets,
  FileText as FileTextIcon,
  Search as SearchIcon,
  X as CloseIcon,
} from 'lucide-react';

// Shared helpers
const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

const ToolCard = ({ icon: Icon, title, desc, onClick }) => (
  <Motion.button
    onClick={onClick}
    className="group text-left"
    whileHover={{ y: -4 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-lg transition-shadow">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 to-cyan-50/40 dark:from-blue-500/5 dark:to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="p-5">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-md">
          <Icon size={22} />
        </div>
        <h4 className="mt-4 text-base md:text-lg font-semibold text-gray-900 dark:text-white">{title}</h4>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{desc}</p>
      </div>
    </div>
  </Motion.button>
);


const Modal = ({ title, open, onClose, children, size = "xl" }) => {
  if (!open) return null;

  const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-3xl",
    "2xl": "max-w-5xl",
  };

  return (
    <AnimatePresence>
      {open && (
        <Motion.div
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <Motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-md"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal container */}
          <Motion.div
            initial={{ y: 50, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`relative w-full ${sizes[size]} max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl border border-blue-200/30 dark:border-blue-800/30 bg-gradient-to-br from-white/80 to-blue-50/70 dark:from-blue-950/80 dark:to-gray-900/70 backdrop-blur-xl text-blue-500`}
          >
            {/* Header */}
            <div className="sticky top-0 flex items-center justify-between px-5 py-3 border-b border-blue-200/20 dark:border-blue-800/30 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-800 transition-all"
                aria-label="Close modal"
              >
                <CloseIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 overflow-y-auto max-h-[70vh] scrollbar-thin scrollbar-thumb-blue-300 dark:scrollbar-thumb-blue-700">
              {children}
            </div>
          </Motion.div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
};



export default function ToolsPanel() {
  const { toast } = useToast();

  // Global UI state
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeTool, setActiveTool] = useState(null);

  // PDF Merger state
  const [pdfFiles, setPdfFiles] = useState([]);
  const [merging, setMerging] = useState(false);

  // Images to PDF state
  const [imageFiles, setImageFiles] = useState([]);
  const [imgToPdfLoading, setImgToPdfLoading] = useState(false);

  // Image converter state
  const [convertFiles, setConvertFiles] = useState([]);
  const [targetFormat, setTargetFormat] = useState('png');
  const [quality, setQuality] = useState(0.92);
  const [converting, setConverting] = useState(false);

  // Image resize state
  const [resizeFiles, setResizeFiles] = useState([]);
  const [maxW, setMaxW] = useState(1280);
  const [maxH, setMaxH] = useState(1280);
  const [resizeQuality, setResizeQuality] = useState(0.9);
  const [resizing, setResizing] = useState(false);

  // PDF Split state
  const [splitFile, setSplitFile] = useState(null);
  const [splitRanges, setSplitRanges] = useState('1-3,5');

  // PDF Page Manager state
  const [manageFile, setManageFile] = useState(null);
  const [pagePlan, setPagePlan] = useState([]); // [{index, keep, rotateDeg}]
  const [managing, setManaging] = useState(false);

  // Watermark state
  const [wmFile, setWmFile] = useState(null);
  const [wmText, setWmText] = useState('CONFIDENTIAL');
  const [wmOpacity, setWmOpacity] = useState(0.15);
  const [wmFontSize, setWmFontSize] = useState(48);
  const [wmAngle, setWmAngle] = useState(-45);
  const [wmProcessing, setWmProcessing] = useState(false);

  // Page numbers state
  const [pnFile, setPnFile] = useState(null);
  const [pnStart, setPnStart] = useState(1);
  const [pnFontSize, setPnFontSize] = useState(12);
  const [pnProcessing, setPnProcessing] = useState(false);

  // Text to PDF state
  const [txtContent, setTxtContent] = useState('Hello Zanly!');
  const [txtFontSize, setTxtFontSize] = useState(12);
  const [txtCreating, setTxtCreating] = useState(false);

  // Tools config
  const tools = [
    { id: 'pdf-merge', category: 'PDF', title: 'PDF Merge', desc: 'Combine multiple PDFs into one', icon: Layers },
    { id: 'pdf-split', category: 'PDF', title: 'PDF Split', desc: 'Extract pages or ranges into a new PDF', icon: Scissors },
    { id: 'pdf-page-manager', category: 'PDF', title: 'Page Manager', desc: 'Reorder, delete, and rotate pages', icon: RotateCw },
    { id: 'pdf-watermark', category: 'PDF', title: 'Watermark', desc: 'Add a diagonal text watermark', icon: Type },
    { id: 'pdf-page-numbers', category: 'PDF', title: 'Page Numbers', desc: 'Stamp page numbers on your PDF', icon: Hash },
    { id: 'text-to-pdf', category: 'PDF', title: 'Text → PDF', desc: 'Create a PDF from your text', icon: FileTextIcon },

    { id: 'img-to-pdf', category: 'Images', title: 'Images → PDF', desc: 'Turn images into a PDF', icon: ImageDown },
    { id: 'image-convert', category: 'Images', title: 'Convert Images', desc: 'JPG ↔ PNG ↔ WEBP', icon: Wand2 },
    { id: 'image-resize', category: 'Images', title: 'Resize & Compress', desc: 'Resize images and adjust quality', icon: Droplets },
  ];

  const categories = ['All', 'PDF', 'Images'];

  const filteredTools = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tools.filter(t =>
      (activeCategory === 'All' || t.category === activeCategory) &&
      (!q || t.title.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q))
    );
  }, [tools, query, activeCategory]);

  // Common helpers
  const parseRanges = (text, totalPages) => {
    // text: "1-3,5,7-9" -> [0,1,2,4,6,7,8]
    const set = new Set();
    const parts = text.split(',').map(s => s.trim()).filter(Boolean);
    for (const part of parts) {
      if (part.includes('-')) {
        const [a, b] = part.split('-').map(n => parseInt(n, 10));
        if (Number.isFinite(a) && Number.isFinite(b)) {
          const start = Math.max(1, Math.min(a, b));
          const end = Math.min(totalPages, Math.max(a, b));
          for (let i = start; i <= end; i++) set.add(i - 1);
        }
      } else {
        const n = parseInt(part, 10);
        if (Number.isFinite(n) && n >= 1 && n <= totalPages) set.add(n - 1);
      }
    }
    return [...set].sort((x, y) => x - y);
  };

  const readImage = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  // Implementations
  const handleAddPdfs = (files) => {
    const arr = Array.from(files).filter((f) => f.type === 'application/pdf');
    setPdfFiles((prev) => [...prev, ...arr]);
  };
  const movePdf = (index, dir) => {
    setPdfFiles((prev) => {
      const copy = [...prev];
      const newIndex = index + dir;
      if (newIndex < 0 || newIndex >= copy.length) return prev;
      const [item] = copy.splice(index, 1);
      copy.splice(newIndex, 0, item);
      return copy;
    });
  };
  const removePdf = (index) => setPdfFiles((prev) => prev.filter((_, i) => i !== index));
  const mergePdfs = async () => {
    if (pdfFiles.length < 2) return toast.warning('Add at least two PDFs', 'Please select at least two PDF files to merge.');
    try {
      setMerging(true);
      const mergedPdf = await PDFDocument.create();
      for (const file of pdfFiles) {
        const bytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach((p) => mergedPdf.addPage(p));
      }
      const out = await mergedPdf.save();
      downloadBlob(new Blob([out], { type: 'application/pdf' }), 'merged.pdf');
      toast.success('Merged', 'Your merged PDF has been downloaded.');
    } catch (e) {
      console.error(e);
      toast.error('Merge failed', 'Could not merge PDFs.');
    } finally {
      setMerging(false);
    }
  };

  const handleAddImages = (files) => {
    const arr = Array.from(files).filter((f) => f.type.startsWith('image/'));
    setImageFiles((prev) => [...prev, ...arr]);
  };
  const removeImage = (index) => setImageFiles((prev) => prev.filter((_, i) => i !== index));
  const imagesToPdf = async () => {
    if (imageFiles.length === 0) return toast.warning('No images', 'Add at least one image.');
    try {
      setImgToPdfLoading(true);
      const pdfDoc = await PDFDocument.create();
      const A4 = { width: 595.28, height: 841.89 };
      for (const imgFile of imageFiles) {
        const bytes = await imgFile.arrayBuffer();
        const isJpeg = imgFile.type === 'image/jpeg' || imgFile.type === 'image/jpg';
        const embedded = isJpeg ? await pdfDoc.embedJpg(bytes) : await pdfDoc.embedPng(bytes);
        const imgW = embedded.width;
        const imgH = embedded.height;
        const page = pdfDoc.addPage([A4.width, A4.height]);
        const margin = 36;
        const maxW = A4.width - margin * 2;
        const maxH = A4.height - margin * 2;
        const ratio = Math.min(maxW / imgW, maxH / imgH);
        const drawW = imgW * ratio;
        const drawH = imgH * ratio;
        const x = (A4.width - drawW) / 2;
        const y = (A4.height - drawH) / 2;
        page.drawImage(embedded, { x, y, width: drawW, height: drawH });
      }
      const out = await pdfDoc.save();
      downloadBlob(new Blob([out], { type: 'application/pdf' }), 'images.pdf');
      toast.success('Created', 'Your images were turned into a PDF.');
    } catch (e) {
      console.error(e);
      toast.error('Failed', 'Could not create PDF from images.');
    } finally {
      setImgToPdfLoading(false);
    }
  };

  const handleAddConvertFiles = (files) => {
    const arr = Array.from(files).filter((f) => f.type.startsWith('image/'));
    setConvertFiles((prev) => [...prev, ...arr]);
  };
  const convertImages = async () => {
    if (convertFiles.length === 0) return toast.warning('No images', 'Add at least one image to convert.');
    try {
      setConverting(true);
      for (const file of convertFiles) {
        const img = await readImage(file);
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const type = targetFormat === 'jpg' ? 'image/jpeg' : targetFormat === 'png' ? 'image/png' : 'image/webp';
        const blob = await new Promise((resolve) => canvas.toBlob(resolve, type, quality));
        const baseName = file.name.replace(/\.[^.]+$/, '');
        const ext = targetFormat === 'jpg' ? 'jpg' : targetFormat;
        downloadBlob(blob, `${baseName}.${ext}`);
      }
      toast.success('Converted', 'Your images have been converted.');
    } catch (e) {
      console.error(e);
      toast.error('Conversion failed', 'Could not convert images.');
    } finally {
      setConverting(false);
    }
  };

  const handleAddResizeFiles = (files) => {
    const arr = Array.from(files).filter((f) => f.type.startsWith('image/'));
    setResizeFiles((prev) => [...prev, ...arr]);
  };
  const resizeImages = async () => {
    if (resizeFiles.length === 0) return toast.warning('No images', 'Add images to resize.');
    try {
      setResizing(true);
      for (const file of resizeFiles) {
        const img = await readImage(file);
        const ratio = Math.min(maxW / img.width, maxH / img.height, 1);
        const outW = Math.round(img.width * ratio);
        const outH = Math.round(img.height * ratio);
        const canvas = document.createElement('canvas');
        canvas.width = outW;
        canvas.height = outH;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, outW, outH);
        const type = 'image/jpeg';
        const blob = await new Promise((resolve) => canvas.toBlob(resolve, type, resizeQuality));
        const base = file.name.replace(/\.[^.]+$/, '');
        downloadBlob(blob, `${base}-${outW}x${outH}.jpg`);
      }
      toast.success('Done', 'Resized images have been downloaded.');
    } catch (e) {
      console.error(e);
      toast.error('Resize failed', 'Could not resize images.');
    } finally {
      setResizing(false);
    }
  };

  const splitPdf = async () => {
    if (!splitFile) return toast.warning('No PDF', 'Select a PDF first.');
    try {
      const bytes = await splitFile.arrayBuffer();
      const src = await PDFDocument.load(bytes);
      const indices = parseRanges(splitRanges, src.getPageCount());
      if (indices.length === 0) return toast.warning('Invalid ranges', 'Provide valid page numbers.');
      const outDoc = await PDFDocument.create();
      const copied = await outDoc.copyPages(src, indices);
      copied.forEach(p => outDoc.addPage(p));
      const out = await outDoc.save();
      downloadBlob(new Blob([out], { type: 'application/pdf' }), 'split.pdf');
      toast.success('Split created', 'Your selected pages were extracted.');
    } catch (e) {
      console.error(e);
      toast.error('Split failed', 'Could not split PDF.');
    }
  };

  const loadPageManager = async (file) => {
    if (!file) return;
    setManageFile(file);
    try {
      const bytes = await file.arrayBuffer();
      const src = await PDFDocument.load(bytes);
      const count = src.getPageCount();
      setPagePlan(Array.from({ length: count }, (_, i) => ({ index: i, keep: true, rotateDeg: 0 })));
      toast.success('Loaded', `${count} pages ready to manage.`);
    } catch (e) {
      console.error(e);
      toast.error('Load failed', 'Could not read PDF.');
    }
  };
  const movePage = (i, dir) => {
    setPagePlan(prev => {
      const arr = [...prev];
      const ni = i + dir;
      if (ni < 0 || ni >= arr.length) return prev;
      const [item] = arr.splice(i, 1);
      arr.splice(ni, 0, item);
      return arr;
    });
  };
  const toggleKeep = (i) => setPagePlan(prev => prev.map((p, idx) => idx === i ? { ...p, keep: !p.keep } : p));
  const rotatePage = (i) => setPagePlan(prev => prev.map((p, idx) => idx === i ? { ...p, rotateDeg: (p.rotateDeg + 90) % 360 } : p));
  const exportManaged = async () => {
    if (!manageFile) return;
    try {
      setManaging(true);
      const bytes = await manageFile.arrayBuffer();
      const src = await PDFDocument.load(bytes);
      const order = pagePlan.filter(p => p.keep).map(p => p.index);
      if (order.length === 0) return toast.warning('No pages', 'Keep at least one page.');
      const outDoc = await PDFDocument.create();
      const copied = await outDoc.copyPages(src, order);
      copied.forEach((page, idx) => {
        outDoc.addPage(page);
      });
      // Apply rotations in the same order
      const pages = outDoc.getPages();
      let j = 0;
      for (const plan of pagePlan) {
        if (!plan.keep) continue;
        const pg = pages[j];
        if (pg && plan.rotateDeg) pg.setRotation(degrees(plan.rotateDeg));
        j++;
      }
      const out = await outDoc.save();
      downloadBlob(new Blob([out], { type: 'application/pdf' }), 'managed.pdf');
      toast.success('Exported', 'Your managed PDF has been downloaded.');
    } catch (e) {
      console.error(e);
      toast.error('Export failed', 'Could not export managed PDF.');
    } finally {
      setManaging(false);
    }
  };

  const addWatermark = async () => {
    if (!wmFile || !wmText.trim()) return toast.warning('Missing input', 'Select a PDF and enter watermark text.');
    try {
      setWmProcessing(true);
      const bytes = await wmFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(bytes);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const pages = pdfDoc.getPages();
      for (const page of pages) {
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(wmText, wmFontSize);
        const x = (width - textWidth) / 2;
        const y = height / 2;
        page.drawText(wmText, {
          x,
          y,
          size: wmFontSize,
          font,
          color: rgb(0.2, 0.2, 0.2),
          rotate: degrees(wmAngle),
          opacity: wmOpacity,
        });
      }
      const out = await pdfDoc.save();
      downloadBlob(new Blob([out], { type: 'application/pdf' }), 'watermarked.pdf');
      toast.success('Watermarked', 'Watermark added to all pages.');
    } catch (e) {
      console.error(e);
      toast.error('Failed', 'Could not apply watermark.');
    } finally {
      setWmProcessing(false);
    }
  };

  const addPageNumbers = async () => {
    if (!pnFile) return toast.warning('No PDF', 'Select a PDF first.');
    try {
      setPnProcessing(true);
      const bytes = await pnFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(bytes);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const pages = pdfDoc.getPages();
      pages.forEach((page, idx) => {
        const { width } = page.getSize();
        const text = String(pnStart + idx);
        const textWidth = font.widthOfTextAtSize(text, pnFontSize);
        const x = (width - textWidth) / 2;
        const y = 24; // bottom margin
        page.drawText(text, { x, y, size: pnFontSize, font, color: rgb(0.2, 0.2, 0.2) });
      });
      const out = await pdfDoc.save();
      downloadBlob(new Blob([out], { type: 'application/pdf' }), 'page-numbered.pdf');
      toast.success('Done', 'Page numbers added.');
    } catch (e) {
      console.error(e);
      toast.error('Failed', 'Could not add page numbers.');
    } finally {
      setPnProcessing(false);
    }
  };

  const textToPdf = async () => {
    if (!txtContent.trim()) return toast.warning('No text', 'Enter some text.');
    try {
      setTxtCreating(true);
      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const page = pdfDoc.addPage([595.28, 841.89]); // A4
      const margin = 48;
      const maxWidth = page.getWidth() - margin * 2;
      const lineHeight = txtFontSize * 1.4;
      const words = txtContent.replace(/\r/g, '').split(/\s+/);
      let lines = [];
      let current = '';
      for (const w of words) {
        const test = current ? current + ' ' + w : w;
        const width = font.widthOfTextAtSize(test, txtFontSize);
        if (width <= maxWidth) {
          current = test;
        } else {
          if (current) lines.push(current);
          current = w;
        }
      }
      if (current) lines.push(current);
      let y = page.getHeight() - margin - txtFontSize;
      for (const line of lines) {
        if (y < margin) {
          // new page
          const p = pdfDoc.addPage([595.28, 841.89]);
          y = p.getHeight() - margin - txtFontSize;
          p.drawText(line, { x: margin, y, size: txtFontSize, font, color: rgb(0, 0, 0) });
          y -= lineHeight;
          continue;
        }
        page.drawText(line, { x: margin, y, size: txtFontSize, font, color: rgb(0, 0, 0) });
        y -= lineHeight;
      }
      const out = await pdfDoc.save();
      downloadBlob(new Blob([out], { type: 'application/pdf' }), 'text.pdf');
      toast.success('Created', 'Text converted to PDF.');
    } catch (e) {
      console.error(e);
      toast.error('Failed', 'Could not create PDF.');
    } finally {
      setTxtCreating(false);
    }
  };

  // UI Blocks for each tool (render inside modal)
  const UiPdfMerge = () => (
    <div className="space-y-4">
      <input type="file" accept="application/pdf" multiple onChange={(e) => handleAddPdfs(e.target.files)} className="w-full" />
      {pdfFiles.length > 0 && (
        <div className="space-y-2">
          {pdfFiles.map((f, i) => (
            <div key={i} className="flex items-center justify-between p-2 border rounded-lg dark:border-gray-700">
              <span className="text-sm truncate max-w-[60%]" title={f.name}>{f.name}</span>
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" onClick={() => movePdf(i, -1)} disabled={i===0}>Up</Button>
                <Button variant="secondary" size="sm" onClick={() => movePdf(i, 1)} disabled={i===pdfFiles.length-1}>Down</Button>
                <Button variant="danger" size="sm" onClick={() => removePdf(i)}>Remove</Button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-end">
        <Button onClick={mergePdfs} disabled={merging || pdfFiles.length < 2}>{merging ? 'Merging...' : 'Merge PDFs'}</Button>
      </div>
    </div>
  );

  const UiPdfSplit = () => (
    <div className="space-y-4">
      <input type="file" accept="application/pdf" onChange={(e) => setSplitFile(e.target.files?.[0] || null)} className="w-full" />
      <div className="flex items-center gap-3 flex-wrap">
        <label className="text-sm text-gray-600 dark:text-gray-300">Pages (e.g., 1-3,5,7-9)</label>
        <input value={splitRanges} onChange={(e)=>setSplitRanges(e.target.value)} className="flex-1 min-w-[220px] p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700" />
      </div>
      <div className="flex justify-end">
        <Button onClick={splitPdf}>Extract Pages</Button>
      </div>
    </div>
  );

  const UiPdfManager = () => (
    <div className="space-y-4">
      <input type="file" accept="application/pdf" onChange={(e) => loadPageManager(e.target.files?.[0] || null)} className="w-full" />
      {pagePlan.length > 0 && (
        <div className="space-y-2 max-h-[50vh] overflow-y-auto">
          {pagePlan.map((p, i) => (
            <div key={i} className="flex items-center justify-between p-2 border rounded-lg dark:border-gray-700">
              <div className="flex items-center gap-3">
                <span className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800">Page {p.index + 1}</span>
                <span className={`text-xs px-2 py-1 rounded ${p.keep ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{p.keep ? 'Keep' : 'Remove'}</span>
                <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">Rotate {p.rotateDeg}°</span>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="secondary" onClick={() => movePage(i, -1)} disabled={i===0}>Up</Button>
                <Button size="sm" variant="secondary" onClick={() => movePage(i, 1)} disabled={i===pagePlan.length-1}>Down</Button>
                <Button size="sm" variant="secondary" onClick={() => rotatePage(i)}>Rotate +90°</Button>
                <Button size="sm" variant={p.keep ? 'danger' : 'secondary'} onClick={() => toggleKeep(i)}>{p.keep ? 'Remove' : 'Keep'}</Button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-end">
        <Button onClick={exportManaged} disabled={managing || pagePlan.filter(p=>p.keep).length===0}>{managing ? 'Exporting...' : 'Export Managed PDF'}</Button>
      </div>
    </div>
  );

  const UiWatermark = () => (
    <div className="space-y-4">
      <input type="file" accept="application/pdf" onChange={(e) => setWmFile(e.target.files?.[0] || null)} className="w-full" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input value={wmText} onChange={(e)=>setWmText(e.target.value)} placeholder="Watermark text" className="p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700" />
        <div className="flex items-center gap-2">
          <label className="text-sm">Font</label>
          <input type="number" min="8" max="200" value={wmFontSize} onChange={(e)=>setWmFontSize(parseInt(e.target.value||'0',10))} className="w-24 p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700" />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm">Opacity</label>
          <input type="range" min="0.05" max="0.6" step="0.01" value={wmOpacity} onChange={(e)=>setWmOpacity(parseFloat(e.target.value))} />
          <span className="text-xs">{Math.round(wmOpacity*100)}%</span>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm">Angle</label>
          <input type="number" min="-90" max="90" value={wmAngle} onChange={(e)=>setWmAngle(parseInt(e.target.value||'0',10))} className="w-24 p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700" />
        </div>
      </div>
      <div className="flex justify-end">
        <Button onClick={addWatermark} disabled={wmProcessing}>{wmProcessing ? 'Applying...' : 'Apply Watermark'}</Button>
      </div>
    </div>
  );

  const UiPageNumbers = () => (
    <div className="space-y-4">
      <input type="file" accept="application/pdf" onChange={(e) => setPnFile(e.target.files?.[0] || null)} className="w-full" />
      <div className="flex items-center gap-3 flex-wrap">
        <label className="text-sm">Start number</label>
        <input type="number" min="0" value={pnStart} onChange={(e)=>setPnStart(parseInt(e.target.value||'0',10))} className="w-24 p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700" />
        <label className="text-sm">Font size</label>
        <input type="number" min="8" max="48" value={pnFontSize} onChange={(e)=>setPnFontSize(parseInt(e.target.value||'0',10))} className="w-24 p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700" />
      </div>
      <div className="flex justify-end">
        <Button onClick={addPageNumbers} disabled={pnProcessing}>{pnProcessing ? 'Stamping...' : 'Add Numbers'}</Button>
      </div>
    </div>
  );

  const UiTextToPdf = () => (
    <div className="space-y-4">
      <textarea rows={10} value={txtContent} onChange={(e)=>setTxtContent(e.target.value)} className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700" placeholder="Type or paste your text here..." />
      <div className="flex items-center gap-3">
        <label className="text-sm">Font size</label>
        <input type="number" min="8" max="24" value={txtFontSize} onChange={(e)=>setTxtFontSize(parseInt(e.target.value||'0',10))} className="w-24 p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700" />
      </div>
      <div className="flex justify-end">
        <Button onClick={textToPdf} disabled={txtCreating}>{txtCreating ? 'Creating...' : 'Create PDF'}</Button>
      </div>
    </div>
  );

  const UiImagesToPdf = () => (
    <div className="space-y-4">
      <input type="file" accept="image/*" multiple onChange={(e)=>handleAddImages(e.target.files)} className="w-full" />
      {imageFiles.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {imageFiles.map((f, i) => (
            <div key={i} className="relative">
              <div className="aspect-video w-full rounded-lg overflow-hidden border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                <img src={URL.createObjectURL(f)} alt="preview" className="object-cover w-full h-full" />
              </div>
              <button onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-0.5 rounded">Remove</button>
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-end">
        <Button onClick={imagesToPdf} disabled={imgToPdfLoading || imageFiles.length === 0}>{imgToPdfLoading ? 'Creating...' : 'Create PDF'}</Button>
      </div>
    </div>
  );

  const UiImageConvert = () => (
    <div className="space-y-4">
      <input type="file" accept="image/*" multiple onChange={(e)=>handleAddConvertFiles(e.target.files)} className="w-full" />
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm">Target:</label>
        <select className="p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700" value={targetFormat} onChange={(e)=>setTargetFormat(e.target.value)}>
          <option value="png">PNG</option>
          <option value="jpg">JPG</option>
          <option value="webp">WEBP</option>
        </select>
        {targetFormat !== 'png' && (
          <>
            <label className="text-sm">Quality:</label>
            <input type="range" min="0.4" max="1" step="0.02" value={quality} onChange={(e)=>setQuality(parseFloat(e.target.value))} />
            <span className="text-xs">{Math.round(quality * 100)}%</span>
          </>
        )}
      </div>
      <div className="flex justify-end">
        <Button onClick={convertImages} disabled={converting || convertFiles.length === 0}>{converting ? 'Converting...' : 'Convert & Download'}</Button>
      </div>
    </div>
  );

  const UiImageResize = () => (
    <div className="space-y-4">
      <input type="file" accept="image/*" multiple onChange={(e)=>handleAddResizeFiles(e.target.files)} className="w-full" />
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm">Max W</label>
        <input type="number" min="100" value={maxW} onChange={(e)=>setMaxW(parseInt(e.target.value||'0',10))} className="w-24 p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700" />
        <label className="text-sm">Max H</label>
        <input type="number" min="100" value={maxH} onChange={(e)=>setMaxH(parseInt(e.target.value||'0',10))} className="w-24 p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700" />
        <label className="text-sm">Quality</label>
        <input type="range" min="0.4" max="1" step="0.02" value={resizeQuality} onChange={(e)=>setResizeQuality(parseFloat(e.target.value))} />
        <span className="text-xs">{Math.round(resizeQuality*100)}%</span>
      </div>
      <div className="flex justify-end">
        <Button onClick={resizeImages} disabled={resizing || resizeFiles.length === 0}>{resizing ? 'Processing...' : 'Resize & Download'}</Button>
      </div>
    </div>
  );

  const renderToolContent = () => {
    switch (activeTool) {
      case 'pdf-merge': return <UiPdfMerge />;
      case 'pdf-split': return <UiPdfSplit />;
      case 'pdf-page-manager': return <UiPdfManager />;
      case 'pdf-watermark': return <UiWatermark />;
      case 'pdf-page-numbers': return <UiPageNumbers />;
      case 'text-to-pdf': return <UiTextToPdf />;
      case 'img-to-pdf': return <UiImagesToPdf />;
      case 'image-convert': return <UiImageConvert />;
      case 'image-resize': return <UiImageResize />;
      default: return null;
    }
  };

  return (
    <>
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10" />
        <div className="relative p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-500 dark:text-blue-500">Document & Image Tools</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-2xl">Fast, privacy-friendly, and 100% in your browser. Merge, split, reorder, watermark PDFs, convert and resize images — no server uploads.</p>
          <div className="mt-6 flex flex-col md:flex-row gap-3 items-stretch md:items-center">
            <div className="relative flex-1 min-w-[240px]">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search tools..." className="w-full pl-8 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800" />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <button key={cat} onClick={()=>setActiveCategory(cat)} className={`px-3 py-1.5 rounded-full text-sm border ${activeCategory===cat ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 dark:border-gray-700 dark:text-gray-200'}`}>{cat}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTools.map(t => (
          <ToolCard key={t.id} icon={t.icon} title={t.title} desc={t.desc} onClick={()=>setActiveTool(t.id)} />
        ))}
      </div>

      <Modal title={tools.find(t=>t.id===activeTool)?.title || ''} open={!!activeTool} onClose={()=>setActiveTool(null)} size={activeTool==='pdf-page-manager' ? '2xl' : 'xl'}>
        {renderToolContent()}
      </Modal>
    </div>
    </>
  );
}
