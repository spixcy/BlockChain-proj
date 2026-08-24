package com.sih.api.repository;
import com.sih.api.entity.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {}
