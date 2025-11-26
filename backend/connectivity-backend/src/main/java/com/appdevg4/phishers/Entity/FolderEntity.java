package com.appdevg4.phishers.Entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "tblFolder")
public class FolderEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    
    @Column(name="folder_id")
    private int folder_id;

    @Column(name="foldername")
    private String folderName;

    @Column(name="dateCreated")
    private LocalDate dateCreated;

    public FolderEntity(){
        super();
    }

    public FolderEntity(int folder_id, String folderName, LocalDate dateCreated){
        super();
        this.folder_id = folder_id;
        this.folderName = folderName;
        this.dateCreated = dateCreated;
    }

     public int getFolderId(){
        return folder_id;
    }

    public void setFolderId(int folder_id){
        this.folder_id = folder_id;
    }

    public String getFolderName(){
        return folderName;
    }

    public void setFolderName(String folderName){
        this.folderName = folderName;
    }

    public LocalDate getDateCreated(){
        return dateCreated;
    }

    public void setDateCreated(LocalDate dateCreated){
        this.dateCreated = dateCreated;
    }
}