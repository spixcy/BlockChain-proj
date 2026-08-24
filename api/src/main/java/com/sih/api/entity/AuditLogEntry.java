package com.sih.api.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity
public class AuditLogEntry {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    private String username;
    private String action;
    private String entityType;
    private Long entityId;
    private LocalDateTime timestamp = LocalDateTime.now();
    public Long getId() { return id; }
    public void setUsername(String username) { this.username = username; }
    public void setAction(String action) { this.action = action; }
    public void setEntityType(String entityType) { this.entityType = entityType; }
    public void setEntityId(Long entityId) { this.entityId = entityId; }
}
