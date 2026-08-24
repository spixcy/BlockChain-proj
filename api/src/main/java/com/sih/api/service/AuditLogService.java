package com.sih.api.service;
import com.sih.api.entity.AuditLogEntry;
import com.sih.api.repository.AuditLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.core.context.SecurityContextHolder;
@Service
public class AuditLogService {
    private final AuditLogRepository repo;
    public AuditLogService(AuditLogRepository repo) { this.repo = repo; }
    public void log(String action, String entityType, Long entityId) {
        AuditLogEntry entry = new AuditLogEntry();
        entry.setAction(action);
        entry.setEntityType(entityType);
        entry.setEntityId(entityId);
        String username = "system";
        if(SecurityContextHolder.getContext().getAuthentication() != null) {
            username = SecurityContextHolder.getContext().getAuthentication().getName();
        }
        entry.setUsername(username);
        repo.save(entry);
    }
}
