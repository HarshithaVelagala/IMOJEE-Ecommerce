import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const publicPath = path.join(process.cwd(), 'public');
    const graphicsPath = path.join(publicPath, 'graphics');
    
    if (!fs.existsSync(graphicsPath)) {
      return NextResponse.json({});
    }

    const categories = fs.readdirSync(graphicsPath);
    const data: Record<string, string[]> = {};

    categories.forEach((cat) => {
      const catPath = path.join(graphicsPath, cat);
      if (fs.statSync(catPath).isDirectory()) {
        const files = fs.readdirSync(catPath);
        data[cat] = files
          .filter((file) => file.endsWith('.svg'))
          .map((file) => `/graphics/${cat}/${file}`);
      }
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to read graphics', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
