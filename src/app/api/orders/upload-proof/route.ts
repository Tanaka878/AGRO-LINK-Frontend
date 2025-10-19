import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { connectToDatabase } from '@/app/lib/mongodb';
import Proof from '@/app/views/Interface/ProofSchema';

export async function POST(req: NextRequest) {
  console.log('✅ POST request to /api/orders/upload-proof');
  
  try {
    await connectToDatabase();
    console.log('✅ Connected to database');

    const formData = await req.formData();
    const orderId = formData.get('orderId') as string;
    const file = formData.get('file') as File;

    console.log('📦 Received orderId:', orderId);
    console.log('📦 Received file:', file?.name);

    if (!orderId || !file) {
      console.log('❌ Missing orderId or file');
      return NextResponse.json(
        { message: 'Missing orderId or file' },
        { status: 400 }
      );
    }

    // Create upload folder if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log('✅ Created upload directory:', uploadDir);
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
    const filePath = path.join(uploadDir, fileName);
    
    // Write file to uploads directory
    fs.writeFileSync(filePath, buffer);
    console.log('✅ File saved:', fileName);

    const proofUrl = `/uploads/${fileName}`;

    // Store or update proof in separate collection
    const proof = await Proof.findOneAndUpdate(
      { orderId: parseInt(orderId) },
      { proofUrl: proofUrl, uploadedAt: new Date() },
      { upsert: true, new: true }
    );

    console.log('✅ Proof stored successfully for order:', orderId);

    return NextResponse.json({
      message: 'Proof uploaded successfully',
      proofUrl: proofUrl,
      orderId: orderId
    });
  } catch (error: any) {
    console.error('❌ Upload error:', error);
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  console.log('✅ GET request to /api/orders/upload-proof');
  
  try {
    await connectToDatabase();
    console.log('✅ Connected to database');

    // Get orderId from query parameters
    const url = new URL(req.url);
    const orderId = url.searchParams.get('orderId');

    if (!orderId) {
      console.log('❌ Missing orderId parameter');
      return NextResponse.json(
        { message: 'Missing orderId parameter' },
        { status: 400 }
      );
    }

    console.log('🔍 Fetching proof for order:', orderId);

    // Find proof in database
    const proof = await Proof.findOne({ orderId: parseInt(orderId) });

    if (!proof) {
      console.log('❌ Proof not found for order:', orderId);
      return NextResponse.json(
        { message: 'Proof not found' },
        { status: 404 }
      );
    }

    console.log('✅ Proof found:', proof.proofUrl);
    return NextResponse.json({
      proofUrl: proof.proofUrl,
      orderId: parseInt(orderId)
    });
  } catch (error: any) {
    console.error('❌ Error fetching proof:', error);
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}