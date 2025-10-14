// app/api/messages/route.ts
import { NextResponse } from 'next/server';
import Message from '../messaging/Message';
import { connectToDatabase } from '../lib/mongodb';

export async function GET() {
  await connectToDatabase();
  const messages = await Message.find().sort({ timestamp: -1 }); // latest first
  return NextResponse.json(messages);
}

export async function POST(request: Request) {
  const { senderEmail, content } = await request.json();
  await connectToDatabase();

  const newMessage = await Message.create({
    senderEmail,
    content,
    timestamp: new Date(),
  });

  return NextResponse.json(newMessage, { status: 201 });
}
