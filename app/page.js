"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Box, TextField, Button, Stack, Typography } from "@mui/material";

export default function Home() {
  const [showChatbot, setShowChatbot] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi, how can I help you today?" },
  ]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;
    setIsLoading(true);
    setMessage("");

    const userMessage = { role: "user", content: message };
    const assistantMessage = { role: "assistant", content: "" };

    setMessages((prevMessages) => [
      ...prevMessages,
      userMessage,
      assistantMessage,
    ]);

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
        throw new Error(`Error: ${response.statusText}`);
      }
      const myReadableStream = response.body;
      const reader = myReadableStream.getReader();
      const decoder = new TextDecoder();

      return reader.read().then(function processText({ done, value }) {
        if (done) {
          console.log("Stream complete");
          setIsLoading(false);
          return;
        }
        const chunk = decoder.decode(value, { stream: true });

        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let remainingMessages = messages.slice(0, messages.length - 1);
          return [
            ...remainingMessages,
            { ...lastMessage, content: lastMessage.content + chunk },
          ];
        });

        return reader.read().then(processText);
      });
    } catch (error) {
      setIsLoading(false);
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

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  if (showChatbot) {
    return (
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Stack
          direction={"column"}
          width="500px"
          height="700px"
          border="1px solid #4A4A4A" // Slightly dark border
          p={2}
          spacing={3}
          sx={{ backgroundColor: "#12002F", borderRadius: "10px" }} // Darker container background
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
                bgcolor={message.role === "assistant" ? "#6825E3" : "#4401D6"} // Colors matching the 2nd design screenshot
                color="white"
                borderRadius={8}
                p={2}
                sx={{
                  alignSelf:
                    message.role === "assistant" ? "flex-start" : "flex-end",
                }}
              >
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </Box>
            ))}
          </Stack>
          <Stack direction={"row"} spacing={2}>
            <TextField
              label="Message"
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
              sx={{
                backgroundColor: "#2C003D", // Input background color
                color: "white",
                borderRadius: "4px",
                input: { color: "white" },
              }}
            />
            <Button
              variant="contained"
              onClick={sendMessage}
              disabled={isLoading}
              sx={{
                backgroundColor: "#7F00FF",
                color: "white",
                "&:hover": { backgroundColor: "#5500CC" },
              }}
            >
              {isLoading ? "Sending..." : "Send"}
            </Button>
          </Stack>
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      width="100vw"
      height="100vh"
      sx={{
        background: "radial-gradient(circle, #6825E3 0%, #0c011c 40%)",
      }}
    >
      <Stack
        direction="row"
        spacing={4}
        position="absolute"
        top={20}
        width="100%" // Ensures the entire width is used
        alignItems="center"
      >
        <Box flex={1} sx={{ paddingLeft: "20px" }}>
          <Typography variant="h6" color="white">
            AI Support
          </Typography>
        </Box>
        <Box flex={1} display="flex" justifyContent="center">
          <Stack direction="row" spacing={4}>
            <Typography variant="h6" color="white">
              <a href="/" style={{ color: "white", textDecoration: "none" }}>
                Home
              </a>
            </Typography>
            <Typography variant="h6" color="white">
              <a
                href="#"
                onClick={() => setShowChatbot(true)}
                style={{ color: "white", textDecoration: "none" }}
              >
                Chatbot
              </a>
            </Typography>
          </Stack>
        </Box>
        <Box flex={1} /> {/* Empty box to balance the layout */}
      </Stack>

      <Typography variant="h3" color="white" textAlign="center" mb={3}>
        Ask questions,
        <br />
        get answers
      </Typography>

      <Button
        variant="contained"
        onClick={() => setShowChatbot(true)}
        sx={{
          bgcolor: "#7f00ff",
          color: "white",
          borderRadius: 4,
          padding: "10px 20px",
          "&:hover": { bgcolor: "#5500cc" },
        }}
      >
        Get Started
      </Button>

      <Typography
        variant="body2"
        color="white"
        position="absolute"
        bottom={20}
        textAlign="center"
      >
        &copy; 2024 AI Support. All rights reserved
      </Typography>
    </Box>
  );
}
