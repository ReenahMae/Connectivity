package com.appdevg4.phishers.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.appdevg4.phishers.Entity.FolderEntity;

public interface FolderRepository extends JpaRepository<FolderEntity, Integer> {

}
