import os

base_dir = "api/src/main/java/com/sih/api"
os.makedirs(f"{base_dir}/entity", exist_ok=True)
os.makedirs(f"{base_dir}/repository", exist_ok=True)
os.makedirs(f"{base_dir}/security", exist_ok=True)
os.makedirs(f"{base_dir}/service", exist_ok=True)
os.makedirs(f"{base_dir}/controller", exist_ok=True)
os.makedirs(f"{base_dir}/dto", exist_ok=True)

files = {
    "entity/User.java": """package com.sih.api.entity;
import jakarta.persistence.*;
@Entity @Table(name="users")
public class User {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    private String username;
    private String password;
    private String role; // INVESTIGATOR, ADMIN
    public Long getId() { return id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
""",
    "entity/Complaint.java": """package com.sih.api.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity
public class Complaint {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    private String ncrpComplaintId;
    private String walletAddress;
    private String chain;
    private String fraudType;
    private LocalDateTime createdAt = LocalDateTime.now();
    public Long getId() { return id; }
    public String getNcrpComplaintId() { return ncrpComplaintId; }
    public void setNcrpComplaintId(String ncrpComplaintId) { this.ncrpComplaintId = ncrpComplaintId; }
    public String getWalletAddress() { return walletAddress; }
    public void setWalletAddress(String walletAddress) { this.walletAddress = walletAddress; }
    public String getChain() { return chain; }
    public void setChain(String chain) { this.chain = chain; }
    public String getFraudType() { return fraudType; }
    public void setFraudType(String fraudType) { this.fraudType = fraudType; }
}
""",
    "entity/InvestigationCase.java": """package com.sih.api.entity;
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
""",
    "entity/WalletReport.java": """package com.sih.api.entity;
import jakarta.persistence.*;
@Entity
public class WalletReport {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne @JoinColumn(name="case_id") private InvestigationCase investigationCase;
    @Column(columnDefinition="TEXT") private String clusterDataJson;
    private String nearestVasp;
    private String riskTier;
    @Column(columnDefinition="TEXT") private String reasoning;
    public void setInvestigationCase(InvestigationCase c) { this.investigationCase = c; }
    public void setClusterDataJson(String s) { this.clusterDataJson = s; }
    public void setNearestVasp(String s) { this.nearestVasp = s; }
    public void setRiskTier(String s) { this.riskTier = s; }
    public void setReasoning(String s) { this.reasoning = s; }
}
""",
    "entity/AuditLogEntry.java": """package com.sih.api.entity;
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
    public void setUsername(String username) { this.username = username; }
    public void setAction(String action) { this.action = action; }
    public void setEntityType(String entityType) { this.entityType = entityType; }
    public void setEntityId(Long entityId) { this.entityId = entityId; }
}
""",
    "repository/UserRepository.java": """package com.sih.api.repository;
import com.sih.api.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}
""",
    "repository/ComplaintRepository.java": "package com.sih.api.repository;\nimport com.sih.api.entity.Complaint;\nimport org.springframework.data.jpa.repository.JpaRepository;\npublic interface ComplaintRepository extends JpaRepository<Complaint, Long> {}\n",
    "repository/InvestigationCaseRepository.java": "package com.sih.api.repository;\nimport com.sih.api.entity.InvestigationCase;\nimport org.springframework.data.jpa.repository.JpaRepository;\npublic interface InvestigationCaseRepository extends JpaRepository<InvestigationCase, Long> {}\n",
    "repository/WalletReportRepository.java": "package com.sih.api.repository;\nimport com.sih.api.entity.WalletReport;\nimport org.springframework.data.jpa.repository.JpaRepository;\npublic interface WalletReportRepository extends JpaRepository<WalletReport, Long> {}\n",
    "repository/AuditLogRepository.java": "package com.sih.api.repository;\nimport com.sih.api.entity.AuditLogEntry;\nimport org.springframework.data.jpa.repository.JpaRepository;\npublic interface AuditLogRepository extends JpaRepository<AuditLogEntry, Long> {}\n",
    "service/AuditLogService.java": """package com.sih.api.service;
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
""",
    "service/ClusteringClient.java": """package com.sih.api.service;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import java.util.Map;
import java.util.HashMap;
@Service
public class ClusteringClient {
    private final WebClient webClient;
    public ClusteringClient(WebClient.Builder webClientBuilder) {
        String baseUrl = System.getenv("CLUSTERING_URL");
        if(baseUrl == null) baseUrl = "http://localhost:8000";
        this.webClient = webClientBuilder.baseUrl(baseUrl).build();
    }
    public Map attribute(String address, String chain) {
        Map<String, String> body = new HashMap<>();
        body.put("wallet_address", address);
        body.put("chain", chain);
        return webClient.post().uri("/attribute").bodyValue(body)
            .retrieve().bodyToMono(Map.class).block();
    }
}
""",
    "controller/ComplaintController.java": """package com.sih.api.controller;
import com.sih.api.entity.*;
import com.sih.api.repository.*;
import com.sih.api.service.*;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {
    private final ComplaintRepository complaintRepo;
    private final InvestigationCaseRepository caseRepo;
    private final WalletReportRepository reportRepo;
    private final ClusteringClient clusteringClient;
    private final AuditLogService audit;
    
    public ComplaintController(ComplaintRepository cr, InvestigationCaseRepository icr, 
                               WalletReportRepository wrr, ClusteringClient cc, AuditLogService audit) {
        this.complaintRepo = cr; this.caseRepo = icr; this.reportRepo = wrr; this.clusteringClient = cc; this.audit = audit;
    }
    
    @PostMapping
    public InvestigationCase createComplaint(@RequestBody Complaint req) {
        Complaint saved = complaintRepo.save(req);
        audit.log("CREATE", "Complaint", saved.getId());
        
        InvestigationCase icase = new InvestigationCase();
        icase.setComplaint(saved);
        icase.setStatus("OPEN");
        InvestigationCase savedCase = caseRepo.save(icase);
        audit.log("CREATE", "Case", savedCase.getId());
        
        try {
            Map result = clusteringClient.attribute(req.getWalletAddress(), req.getChain());
            WalletReport report = new WalletReport();
            report.setInvestigationCase(savedCase);
            if(result.get("nearest_vasp") != null) {
                report.setNearestVasp(((Map)result.get("nearest_vasp")).get("name").toString());
            } else { report.setNearestVasp("Unknown"); }
            report.setRiskTier((String)result.get("risk_tier"));
            report.setReasoning((String)result.get("reasoning"));
            report.setClusterDataJson(result.toString());
            WalletReport savedReport = reportRepo.save(report);
            audit.log("CREATE", "WalletReport", savedReport.getId());
        } catch(Exception e) {
            System.err.println("Failed to reach clustering service: " + e.getMessage());
        }
        return savedCase;
    }
}
"""
}

for filepath, content in files.items():
    with open(f"{base_dir}/{filepath}", "w") as f:
        f.write(content)

print("Java boilerplate generated successfully.")
