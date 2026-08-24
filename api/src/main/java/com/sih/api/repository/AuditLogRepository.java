package com.sih.api.repository;
import com.sih.api.entity.AuditLogEntry;
import org.springframework.data.jpa.repository.JpaRepository;
public interface AuditLogRepository extends JpaRepository<AuditLogEntry, Long> {}
