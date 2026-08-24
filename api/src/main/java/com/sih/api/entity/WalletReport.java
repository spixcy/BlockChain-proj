package com.sih.api.entity;
import jakarta.persistence.*;
@Entity
public class WalletReport {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne @JoinColumn(name="case_id") private InvestigationCase investigationCase;
    @Column(columnDefinition="TEXT") private String clusterDataJson;
    private String nearestVasp;
    private String riskTier;
    @Column(columnDefinition="TEXT") private String reasoning;
    public Long getId() { return id; }
    public void setInvestigationCase(InvestigationCase c) { this.investigationCase = c; }
    public void setClusterDataJson(String s) { this.clusterDataJson = s; }
    public void setNearestVasp(String s) { this.nearestVasp = s; }
    public void setRiskTier(String s) { this.riskTier = s; }
    public void setReasoning(String s) { this.reasoning = s; }
}
