package com.sih.api.config;

import com.sih.api.entity.*;
import com.sih.api.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.password.PasswordEncoder;

@Component
public class DataLoader implements CommandLineRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ComplaintRepository complaintRepo;
    private final InvestigationCaseRepository caseRepo;
    private final WalletReportRepository reportRepo;

    public DataLoader(UserRepository userRepository, PasswordEncoder passwordEncoder,
                      ComplaintRepository complaintRepo, InvestigationCaseRepository caseRepo,
                      WalletReportRepository reportRepo) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.complaintRepo = complaintRepo;
        this.caseRepo = caseRepo;
        this.reportRepo = reportRepo;
    }

    @Override
    public void run(String... args) throws Exception {
        // Seed Users
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("ADMIN");
            userRepository.save(admin);

            User investigator = new User();
            investigator.setUsername("investigator");
            investigator.setPassword(passwordEncoder.encode("investigator123"));
            investigator.setRole("INVESTIGATOR");
            userRepository.save(investigator);
        }

        // Seed Demo Cases for the Hackathon Pitch
        if (complaintRepo.count() == 0) {
            // Case 1: Bitcoin
            Complaint c1 = new Complaint();
            c1.setNcrpComplaintId("NCRP-2026-BTC01");
            c1.setWalletAddress("1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa");
            c1.setChain("bitcoin");
            c1.setFraudType("investment_scam");
            Complaint savedC1 = complaintRepo.save(c1);

            InvestigationCase case1 = new InvestigationCase();
            case1.setComplaint(savedC1);
            case1.setStatus("ANALYZED");
            InvestigationCase savedCase1 = caseRepo.save(case1);

            WalletReport rep1 = new WalletReport();
            rep1.setInvestigationCase(savedCase1);
            rep1.setNearestVasp("Satoshi (Mixer proxy demo)");
            rep1.setRiskTier("High");
            rep1.setReasoning("0 hops to a known mixer. High risk of illicit fund obfuscation. (Adjusted confidence: 0.95)");
            rep1.setClusterDataJson("{\"hops_traced\": 2, \"cluster\": [\"1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa\"]}");
            reportRepo.save(rep1);

            // Case 2: Tron
            Complaint c2 = new Complaint();
            c2.setNcrpComplaintId("NCRP-2026-TRX99");
            c2.setWalletAddress("TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t");
            c2.setChain("tron");
            c2.setFraudType("task_fraud");
            Complaint savedC2 = complaintRepo.save(c2);

            InvestigationCase case2 = new InvestigationCase();
            case2.setComplaint(savedC2);
            case2.setStatus("ANALYZED");
            InvestigationCase savedCase2 = caseRepo.save(case2);

            WalletReport rep2 = new WalletReport();
            rep2.setInvestigationCase(savedCase2);
            rep2.setNearestVasp("Binance");
            rep2.setRiskTier("High");
            rep2.setReasoning("Direct match to Exchange Binance (Deposit address). Potential immediate cash-out. (Confidence: 0.99)");
            rep2.setClusterDataJson("{\"hops_traced\": 0, \"cluster\": [\"TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t\", \"1NDyJtNTjmwk5xPNhjgAMu4HDHigtobu1s\"]}");
            reportRepo.save(rep2);
            
            System.out.println("Hackathon Demo Cases Seeded Successfully!");
        }
    }
}
