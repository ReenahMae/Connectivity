package com.appdevg4.phishers.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.appdevg4.phishers.Entity.ActivityLogEntity;

public interface ActivityLogRepository extends JpaRepository<ActivityLogEntity, Integer> {

}
