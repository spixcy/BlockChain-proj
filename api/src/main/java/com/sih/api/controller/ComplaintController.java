package com.sih.api.controller;
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
        icase.setStatus("PROCESSING");
        InvestigationCase savedCase = caseRepo.save(icase);
        audit.log("CREATE", "Case", savedCase.getId());
        
        try {
            Map result = clusteringClient.attribute(req.getWalletAddress(), req.getChain());
            if (result == null) {
                // If it timed out, leave it as PROCESSING for async background resolution (or manual retry)
                return savedCase;
            }
            savedCase.setStatus("ANALYZED");
            caseRepo.save(savedCase);
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

