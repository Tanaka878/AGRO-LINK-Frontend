interface Message {
  _id?: string;
  senderEmail: string;   // Who posted the message
  content: string;       // Message text
  timestamp: Date;       // When the message was posted
}

export default Message;