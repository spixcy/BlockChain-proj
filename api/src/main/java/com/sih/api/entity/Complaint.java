package com.sih.api.entity;
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
