"use client"
import React, { useState, useEffect } from "react" // Import React for JSX types

// Define a type for the conversation object stored in state
interface Conversation {
  sid: string
  name: string
}

// Define a type for the message object
interface Message {
  sid: string
  author: string
  body: string
  dateCreated: string
  index: number
  participantSid?: string
}

// Define a type for the message sending payload
interface MessagePayload {
  author: string
  body?: string // For fallback/description when sending templates
  contentSid?: string
  contentVariables?: string
}

export default function ConversationsPage() {
  const [newConversationName, setNewConversationName] = useState<string>("")
  const [selectedConversationSid, setSelectedConversationSid] =
    useState<string>("")
  const [conversations, setConversations] = useState<Conversation[]>([])

  const [participantNumber, setParticipantNumber] = useState<string>("")
  const [participantFriendlyName, setParticipantFriendlyName] =
    useState<string>("")

  const [messageBody, setMessageBody] = useState<string>("") // For fallback/description
  const [messageAuthor, setMessageAuthor] = useState<string>("Admin")
  const [contentSid, setContentSid] = useState<string>("") // Template SID (HX...)
  const [contentVariables, setContentVariables] = useState<string>("") // JSON string for template variables

  const [messages, setMessages] = useState<Message[]>([])

  const [status, setStatus] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleCreateConversation = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()
    if (!newConversationName.trim()) {
      setStatus("Error: Conversation name cannot be empty.")
      return
    }
    setIsLoading(true)
    setStatus("Creating conversation...")
    try {
      const response = await fetch("/api/whatsapp/conversations/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ friendlyName: newConversationName }),
      })
      const data = await response.json()
      if (data.success) {
        setStatus(
          `Conversation created: ${data.conversationSid} (Friendly Name: ${data.friendlyName})`
        )
        setConversations((prev) => [
          ...prev,
          { sid: data.conversationSid, name: data.friendlyName },
        ])
        setSelectedConversationSid(data.conversationSid)
        setNewConversationName("")
        fetchMessages(data.conversationSid)
      } else {
        setStatus(
          `Error creating conversation: ${data.error || "Unknown error"}`
        )
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unknown client error occurred."
      setStatus(`Client error: ${errorMessage}`)
    }
    setIsLoading(false)
  }

  const handleAddParticipant = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // ... (implementation remains the same as previous version) ...
    if (!selectedConversationSid) {
      setStatus("Error: No conversation selected.")
      return
    }
    if (!participantNumber.trim()) {
      setStatus("Error: Participant WhatsApp number cannot be empty.")
      return
    }
    setIsLoading(true)
    setStatus("Adding participant...")
    try {
      const response = await fetch(
        `/api/whatsapp/conversations/${selectedConversationSid}/participants/add`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            participantWhatsAppNumber: `whatsapp:${
              participantNumber.startsWith("+") ? "" : "+"
            }${participantNumber.replace(/\D/g, "")}`,
            friendlyName:
              participantFriendlyName || `User-${participantNumber.slice(-4)}`,
          }),
        }
      )
      const data = await response.json()
      if (data.success) {
        setStatus(
          `Participant added: ${data.participantSid} (Identity: ${data.identity})`
        )
        setParticipantNumber("")
        setParticipantFriendlyName("")
      } else {
        setStatus(`Error adding participant: ${data.error || "Unknown error"}`)
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unknown client error occurred."
      setStatus(`Client error: ${errorMessage}`)
    }
    setIsLoading(false)
  }

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedConversationSid) {
      setStatus("Error: No conversation selected.")
      return
    }
    if (!contentSid.trim() && !messageBody.trim()) {
      setStatus(
        "Error: Template SID (for template message) or Message Body (for freeform) is required."
      )
      setIsLoading(false)
      return
    }
    if (contentSid.trim() && !/^HX[a-fA-F0-9]{32}$/.test(contentSid.trim())) {
      setStatus(
        "Error: Invalid Template SID format. Must start with HX and be 34 characters long."
      )
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setStatus("Sending message...")

    const payload: MessagePayload = {
      author: messageAuthor,
    }

    if (contentSid.trim()) {
      // Prioritize template
      payload.contentSid = contentSid.trim()
      if (contentVariables.trim()) {
        // Ensure contentVariables is valid JSON if provided
        try {
          JSON.parse(contentVariables.trim()) // Validate JSON
          payload.contentVariables = contentVariables.trim()
        } catch (jsonError) {
          setStatus("Error: Content Variables is not valid JSON.")
          setIsLoading(false)
          return
        }
      }
      if (messageBody.trim()) {
        // Fallback/description body
        payload.body = messageBody.trim()
      }
    } else if (messageBody.trim()) {
      // Fallback to freeform if no template SID
      payload.body = messageBody.trim()
    }
    // If neither, the initial check would have caught it.

    try {
      const response = await fetch(
        `/api/whatsapp/conversations/${selectedConversationSid}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      )
      const data = await response.json()
      if (data.success) {
        setStatus(`Message sent: ${data.messageSid}`)
        // Clear only template fields if a template was sent, or body if freeform was sent
        if (contentSid.trim()) {
          // setContentSid(''); // Optionally keep SID for resending with different vars
          setContentVariables("")
        }
        setMessageBody("") // Clear body in both cases, or if it was just a fallback
        fetchMessages(selectedConversationSid)
      } else {
        setStatus(`Error sending message: ${data.error || "Unknown error"}`)
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unknown client error occurred."
      setStatus(`Client error: ${errorMessage}`)
    }
    setIsLoading(false)
  }

  const fetchMessages = async (sid: string | null) => {
    // ... (implementation remains the same as previous version) ...
    if (!sid) {
      setMessages([])
      return
    }
    setIsLoading(true)
    setStatus(`Fetching messages for ${sid}...`)
    try {
      const response = await fetch(
        `/api/whatsapp/conversations/${sid}/messages`
      )
      const data = await response.json()
      if (data.success && Array.isArray(data.messages)) {
        const sortedMessages = data.messages.sort(
          (a: Message, b: Message) =>
            new Date(a.dateCreated).getTime() -
            new Date(b.dateCreated).getTime()
        )
        setMessages(sortedMessages)
        setStatus(`Messages loaded for ${sid}.`)
      } else {
        setStatus(
          `Error fetching messages: ${data.error || "Invalid data format"}`
        )
        setMessages([])
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unknown client error occurred."
      setStatus(`Client error fetching messages: ${errorMessage}`)
      setMessages([])
    }
    setIsLoading(false)
  }

  useEffect(() => {
    if (selectedConversationSid) {
      fetchMessages(selectedConversationSid)
    } else {
      setMessages([])
    }
  }, [selectedConversationSid])

  const commonInputStyle: React.CSSProperties = {
    padding: "8px",
    margin: "5px 0",
    border: "1px solid #ccc",
    borderRadius: "4px",
    width: "calc(100% - 18px)",
  }
  const commonButtonStyle: React.CSSProperties = {
    padding: "10px 15px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    margin: "10px 0",
  }
  const sectionStyle: React.CSSProperties = {
    border: "1px solid #eee",
    padding: "15px",
    marginBottom: "20px",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
  }

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "700px",
        margin: "30px auto",
        padding: "20px",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#333" }}>
        Twilio Conversations for WhatsApp
      </h1>

      {status && (
        <div
          style={{
            padding: "10px",
            margin: "10px 0",
            backgroundColor: status.startsWith("Error:")
              ? "#ffebee"
              : "#e8f5e9",
            border: `1px solid ${
              status.startsWith("Error:") ? "red" : "green"
            }`,
            borderRadius: "4px",
          }}
        >
          {status}
        </div>
      )}

      {/* Create Conversation (same as before) */}
      <section style={sectionStyle}>
        <h2>Create New Conversation</h2>
        <form onSubmit={handleCreateConversation}>
          <input
            type="text"
            value={newConversationName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewConversationName(e.target.value)
            }
            placeholder="Conversation Friendly Name"
            style={commonInputStyle}
          />
          <button type="submit" disabled={isLoading} style={commonButtonStyle}>
            {isLoading ? "Creating..." : "Create Conversation"}
          </button>
        </form>
      </section>

      {/* Select Conversation (same as before) */}
      {conversations.length > 0 && (
        <section style={sectionStyle}>
          <h2>Select Conversation</h2>
          <select
            value={selectedConversationSid}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setSelectedConversationSid(e.target.value)
            }
            style={{ ...commonInputStyle, width: "100%" }}
          >
            <option value="">-- Select a Conversation --</option>
            {conversations.map((convo) => (
              <option key={convo.sid} value={convo.sid}>
                {convo.name} ({convo.sid.slice(0, 8)}...)
              </option>
            ))}
          </select>
          <p style={{ fontSize: "0.8em", color: "#555" }}>
            Selected SID: {selectedConversationSid || "None"}
          </p>
        </section>
      )}

      {selectedConversationSid && (
        <>
          {/* Add Participant (same as before) */}
          <section style={sectionStyle}>
            <h2>
              Add Participant to "
              {conversations.find((c) => c.sid === selectedConversationSid)
                ?.name || selectedConversationSid}
              "
            </h2>
            <form onSubmit={handleAddParticipant}>
              <input
                type="text"
                value={participantNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setParticipantNumber(e.target.value)
                }
                placeholder="Participant WhatsApp Number (e.g., +15551234567)"
                style={commonInputStyle}
              />
              <input
                type="text"
                value={participantFriendlyName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setParticipantFriendlyName(e.target.value)
                }
                placeholder="Participant Friendly Name (Optional)"
                style={commonInputStyle}
              />
              <button
                type="submit"
                disabled={isLoading}
                style={commonButtonStyle}
              >
                {isLoading ? "Adding..." : "Add Participant"}
              </button>
            </form>
          </section>

          {/* Send Message - TEMPLATE FOCUSED */}
          <section style={sectionStyle}>
            <h2>
              Send Message to "
              {conversations.find((c) => c.sid === selectedConversationSid)
                ?.name || selectedConversationSid}
              "
            </h2>
            <form onSubmit={handleSendMessage}>
              <div style={{ marginBottom: "10px" }}>
                <label
                  htmlFor="author"
                  style={{ display: "block", fontWeight: "bold" }}
                >
                  Author:
                </label>
                <input
                  id="author"
                  type="text"
                  value={messageAuthor}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setMessageAuthor(e.target.value)
                  }
                  placeholder="Author (e.g., Admin, System)"
                  style={commonInputStyle}
                />
              </div>
              <hr style={{ margin: "15px 0" }} />
              <div style={{ marginBottom: "10px" }}>
                <label
                  htmlFor="contentSid"
                  style={{ display: "block", fontWeight: "bold" }}
                >
                  Template SID (HX...):
                </label>
                <input
                  id="contentSid"
                  type="text"
                  value={contentSid}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setContentSid(e.target.value)
                  }
                  placeholder="Your approved Template SID (e.g., HX...)"
                  style={commonInputStyle}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label
                  htmlFor="contentVars"
                  style={{ display: "block", fontWeight: "bold" }}
                >
                  Template Variables (JSON String):
                </label>
                <textarea
                  id="contentVars"
                  value={contentVariables}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setContentVariables(e.target.value)
                  }
                  placeholder='e.g., {"1": "Value1", "2": "Another Value"}'
                  rows={3}
                  style={{ ...commonInputStyle, height: "auto" }}
                />
              </div>
              <hr style={{ margin: "15px 0" }} />
              <div style={{ marginBottom: "10px" }}>
                <label
                  htmlFor="fallbackBody"
                  style={{ display: "block", fontWeight: "bold" }}
                >
                  Optional: Fallback/Description Body:
                </label>
                <textarea
                  id="fallbackBody"
                  value={messageBody}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setMessageBody(e.target.value)
                  }
                  placeholder="Fallback message or internal description"
                  rows={2}
                  style={{ ...commonInputStyle, height: "auto" }}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                style={commonButtonStyle}
              >
                {isLoading ? "Sending..." : "Send Template/Message"}
              </button>
            </form>
          </section>

          {/* Display Messages (same as before) */}
          <section style={sectionStyle}>
            <h2>
              Messages for "
              {conversations.find((c) => c.sid === selectedConversationSid)
                ?.name || selectedConversationSid}
              "
            </h2>
            <button
              onClick={() => fetchMessages(selectedConversationSid)}
              disabled={isLoading}
              style={{
                ...commonButtonStyle,
                backgroundColor: "#6c757d",
                marginBottom: "10px",
              }}
            >
              {isLoading ? "Refreshing..." : "Refresh Messages"}
            </button>
            <div
              style={{
                maxHeight: "400px",
                overflowY: "auto",
                border: "1px solid #ddd",
                padding: "10px",
                background: "white",
              }}
            >
              {messages.length === 0 && (
                <p>No messages yet, or an error occurred.</p>
              )}
              {messages.map((msg, index) => (
                <div
                  key={msg.sid || index}
                  style={{
                    marginBottom: "10px",
                    padding: "8px",
                    borderRadius: "4px",
                    backgroundColor:
                      msg.author === messageAuthor ||
                      msg.author === "Admin" ||
                      msg.author === "System"
                        ? "#d1e7dd"
                        : "#f8f9fa",
                    border: "1px solid #ccc",
                  }}
                >
                  <strong style={{ color: "#0056b3" }}>
                    {msg.author || "Unknown"}:
                  </strong>
                  <p style={{ margin: "5px 0 0" }}>{msg.body}</p>
                  <small style={{ fontSize: "0.75em", color: "#666" }}>
                    {new Date(msg.dateCreated).toLocaleString()} (Index:{" "}
                    {msg.index})
                  </small>
                  <br />
                  {msg.participantSid && (
                    <small style={{ fontSize: "0.75em", color: "#666" }}>
                      Participant SID: {msg.participantSid}
                    </small>
                  )}
                </div>
              ))}
            </div>
          </section>
        </>
      )}
      <footer
        style={{
          textAlign: "center",
          marginTop: "30px",
          fontSize: "0.8em",
          color: "#777",
        }}
      >
        <p>
          <strong>Webhook URL for Twilio (onMessageAdded etc.):</strong>{" "}
          `[your-ngrok-url]/api/conversations/webhook/incoming`
        </p>
        <p>
          Ensure your Twilio WhatsApp number is configured for Conversations and
          webhooks.
        </p>
      </footer>
    </div>
  )
}
