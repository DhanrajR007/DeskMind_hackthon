// src/api/api.js

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const request = async (path, { method = "GET", body, token } = {}) => {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...(body && { body: JSON.stringify(body) }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "API Error");
  }

  return data;
};

export const api = {
  // 🔐 auth
  signup: (data) => request("/auth/register", { method: "POST", body: data }),

  login: (data) => request("/auth/login", { method: "POST", body: data }),

  getMe: (token) => request("/auth/me", { token }),

  logout: (token) => request("/auth/logout", { method: "POST", token }),

  //   // 💬 chats (main feature 🔥)
  //   createChat: (token) =>
  //     request("/chats", { method: "POST", token }),

  //   getChats: (token) =>
  //     request("/chats", { token }),

  //   getMessages: (chatId, token) =>
  //     request(`/chats/${chatId}/messages`, { token }),

  //   sendMessage: (chatId, message, token) =>
  //     request(`/chats/${chatId}/messages`, {
  //       method: "POST",
  //       body: { message },
  //       token,
  //     }),

  //   // 🤖 AI response
  //   getAIReply: (chatId, message, token) =>
  //     request(`/ai/reply`, {
  //       method: "POST",
  //       body: { chatId, message },
  //       token,
  //     }),

  //   // 👨‍💼 human agent
  //   assignAgent: (chatId, token) =>
  //     request(`/chats/${chatId}/assign`, {
  //       method: "POST",
  //       token,
  //     }),

  //   closeChat: (chatId, token) =>
  //     request(`/chats/${chatId}/close`, {
  //       method: "PUT",
  //       token,
  //     }),
};
