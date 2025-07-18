package com.chatapp.model;

import java.time.LocalDateTime;

public class User {
    private String id;
    private String username;
    private String sessionId;
    private LocalDateTime lastActive;
    private boolean online;

    public User() {}

    public User(String id, String username, String sessionId) {
        this.id = id;
        this.username = username;
        this.sessionId = sessionId;
        this.lastActive = LocalDateTime.now();
        this.online = true;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }

    public LocalDateTime getLastActive() { return lastActive; }
    public void setLastActive(LocalDateTime lastActive) { this.lastActive = lastActive; }

    public boolean isOnline() { return online; }
    public void setOnline(boolean online) { this.online = online; }
}
