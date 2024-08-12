"use client";
import { useState } from "react";
import { Box, TextField, Button, Stack } from "@mui/material";

export default function Home() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi, how can I help you today?" },
  ]);

  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    if (!message.trim()) return;
    setMessage("");

    const userMessage = { role: "user", content: message };
    const assistantMessage = { role: "assistant", content: "" };
    // update the state of messages by appending a new message to the existing array of messages
    setMessages((prevMessages) => [
      ...prevMessages,
      userMessage,
      assistantMessage, // placeholder for the response
    ]);

    console.log("Sending message:", userMessage);
    console.log(messages);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([...messages, userMessage]),
      });

      if (!response.ok) {
        throw new Error(`Error:  ${response.statusText}`);
      }
      const myReadableStream = response.body;
      const reader = myReadableStream.getReader();
      const decoder = new TextDecoder();

      return reader.read().then(function processText({ done, value }) {
        if (done) {
          console.log("Stream complete");
          return;
        }
        const chunk = decoder.decode(value, { stream: true });
        console.log(chunk);

        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1]; // last message (assistant's placeholder)
          let remainingMessages = messages.slice(0, messages.length - 1); // get messages from index 0 to messages.length-1
          return [
            ...remainingMessages,
            { ...lastMessage, content: lastMessage.content + chunk },
          ]; // append the decoded text to the assistant's message
        });

        return reader.read().then(processText);
      });
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((messages) => [
        ...messages,
        {
          role: "assistant",
          content:
            "I'm sorry, but I encountered an error. Please try again later.",
        },
      ]);
    }
  };

  return (
    <Box
      width="100vw"
      height="100vw"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        direction={"column"}
        width="500px"
        height="700px"
        border="1px solid black"
        p={2}
        spacing={3}
      >
        <Stack
          direction={"column"}
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              bgcolor={
                message.role === "assistant" ? "primary.main" : "secondary.main"
              }
              color="white"
              borderRadius={16}
              p={3}
            >
              {message.content}
            </Box>
          ))}
        </Stack>
        <Stack direction={"row"} spacing={2}>
          <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button variant="contained" onClick={sendMessage}>
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
