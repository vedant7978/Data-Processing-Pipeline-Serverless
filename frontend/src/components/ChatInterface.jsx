import React, { useState, useEffect, useRef } from "react";
import { db } from "../utils/firebase";
import {
  collection,
  doc,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  setDoc,
} from "firebase/firestore";

const ChatInterface = ({ concernId, customerName, agentName }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userRole, setUserRole] = useState("");
  const messagesEndRef = useRef(null); // Ref to track the end of the chat messages

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "Admin") {
      setUserRole("Admin");
    } else if (role === "Customer") {
      setUserRole("Customer");
    } else {
      console.error("Unknown role: Please check the role in localStorage.");
    }
  }, []);

  useEffect(() => {
    const fetchMessages = () => {
      if (!concernId) return;

      const q = query(
        collection(db, `Chats/${concernId}/Messages`),
        orderBy("timestamp", "asc")
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(fetchedMessages);

        // Automatically scroll to the last message when messages update
        setTimeout(() => {
          if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      });

      return unsubscribe;
    };

    fetchMessages();
  }, [concernId]);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    try {
      const chatDocRef = doc(db, "Chats", concernId);

      await setDoc(
        chatDocRef,
        {
          concernId,
          customerName,
          agentName,
          createdAt: new Date(),
        },
        { merge: true }
      );

      const messagesRef = collection(chatDocRef, "Messages");
      await addDoc(messagesRef, {
        text: newMessage,
        sender: userRole,
        timestamp: new Date(),
      });

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-bold mb-4">
        Chat with {userRole === "Customer" ? agentName : customerName}
      </h2>

      <div className="overflow-y-auto max-h-96 border p-4 mb-4 rounded">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-2 ${
              message.sender === userRole
                ? "text-right"
                : "text-left text-gray-700"
            }`}
          >
            <p
              className={`p-2 rounded inline-block ${
                message.sender === userRole
                  ? "bg-teal-500 text-white"
                  : "bg-gray-100"
              }`}
            >
              {message.text}
            </p>
            <span className="block text-sm text-gray-400">
              {message.sender} •{" "}
              {new Date(message.timestamp?.toDate()).toLocaleString()}
            </span>
          </div>
        ))}
        {/* This empty div is used as a scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-grow border rounded-lg p-2 focus:outline-none"
          placeholder="Type a message"
        />
        <button
          type="submit"
          className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;