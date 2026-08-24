package com.sih.api.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity
public class InvestigationCase {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @OneToOne @JoinColumn(name="complaint_id") private Complaint complaint;
    private String status;
    private LocalDateTime createdAt = LocalDateTime.now();
    public Long getId() { return id; }
    public Complaint getComplaint() { return complaint; }
    public void setComplaint(Complaint complaint) { this.complaint = complaint; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
