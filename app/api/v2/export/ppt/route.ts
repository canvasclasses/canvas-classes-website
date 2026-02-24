import { NextRequest, NextResponse } from 'next/server';
import PptxGenJS from 'pptxgenjs';

export const runtime = 'nodejs';

type PptShapeType = 'rect' | 'line' | 'roundRect';

interface PptShapeOp {
  shape: PptShapeType;
  x: number;
  y: number;
  w: number;
  h: number;
  fillColor?: string;
  lineColor?: string;
  lineWidth?: number;
  rectRadius?: number;
}

interface PptTextRun {
  text: string;
  options?: { color?: string; fontSize?: number; bold?: boolean };
}

interface PptTextOp {
  text: string | PptTextRun[];
  x: number;
  y: number;
  w: number;
  h: number;
  fontSize?: number;
  bold?: boolean;
  color?: string;
  fontFace?: string;
  align?: 'left' | 'center' | 'right';
  valign?: 'top' | 'mid' | 'middle' | 'bottom';
  shape?: PptShapeType;
  fillColor?: string;
  rectRadius?: number;
}

interface PptImageOp {
  data: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface PptSlidePayload {
  backgroundColor: string;
  shapes: PptShapeOp[];
  texts: PptTextOp[];
  images: PptImageOp[];
}

interface PptExportRequest {
  title: string;
  slides: PptSlidePayload[];
}

function sanitizeFileName(name: string): string {
  return (name || 'Practice_Sheet').replace(/[^a-zA-Z0-9_\- ]/g, '').trim().replace(/\s+/g, '_') || 'Practice_Sheet';
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as PptExportRequest;
    const title = sanitizeFileName(body?.title || 'Practice Sheet');
    const slides = Array.isArray(body?.slides) ? body.slides : [];

    if (slides.length === 0) {
      return NextResponse.json({ success: false, error: 'No slides provided' }, { status: 400 });
    }

    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_WIDE';
    const shapeMap: Record<PptShapeType, any> = {
      rect: (pptx as any).ShapeType.rect,
      line: (pptx as any).ShapeType.line,
      roundRect: (pptx as any).ShapeType.roundRect,
    };

    for (const s of slides) {
      const slide = pptx.addSlide();
      slide.background = { color: s.backgroundColor || 'ffffff' };

      for (const sh of s.shapes || []) {
        slide.addShape(shapeMap[sh.shape] || shapeMap.rect, {
          x: sh.x,
          y: sh.y,
          w: sh.w,
          h: sh.h,
          fill: sh.fillColor ? { color: sh.fillColor } : undefined,
          line: sh.lineColor ? { color: sh.lineColor, width: sh.lineWidth ?? 0.75 } : undefined,
          rectRadius: sh.rectRadius,
        });
      }

      for (const t of s.texts || []) {
        const textOptions: any = {
          x: t.x,
          y: t.y,
          w: t.w,
          h: t.h,
          fontSize: t.fontSize,
          bold: t.bold,
          color: t.color,
          fontFace: t.fontFace,
          align: t.align,
          valign: t.valign === 'middle' ? 'mid' : t.valign,
          shape: t.shape ? shapeMap[t.shape] : undefined,
          fill: t.fillColor ? { color: t.fillColor } : undefined,
          rectRadius: t.rectRadius,
        };
        slide.addText(t.text as any, textOptions);
      }

      for (const img of s.images || []) {
        slide.addImage({
          data: img.data,
          x: img.x,
          y: img.y,
          w: img.w,
          h: img.h,
        });
      }
    }

    const out = (await pptx.write({ outputType: 'nodebuffer' })) as Buffer;

    return new NextResponse(new Uint8Array(out), {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'Content-Disposition': `attachment; filename="${title}.pptx"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('PPT export failed:', error);
    return NextResponse.json({ success: false, error: 'Failed to build PPT' }, { status: 500 });
  }
}
