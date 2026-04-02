package com.sgp.erp.repository;

import com.sgp.erp.model.ActionLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ActionLogRepository extends JpaRepository<ActionLog, Long> {
    List<ActionLog> findByActorEmailOrderByTimestampDesc(String email);
    List<ActionLog> findAllByOrderByTimestampDesc();
}
