package com.appdevg4.phishers.Service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.appdevg4.phishers.Entity.FolderEntity;
import com.appdevg4.phishers.Entity.NoteEntity;
import com.appdevg4.phishers.Repository.FolderRepository;
import com.appdevg4.phishers.Repository.NoteRepository;

@Service
public class FolderService {
    @Autowired
    FolderRepository folderrepo;

    @Autowired
    NoteRepository noterepo;

    public FolderService(){
       super();
    }

    public FolderEntity saveFolder(FolderEntity folder){
        return folderrepo.save(folder);
    }

    public List<FolderEntity> getAllFolder(){
        return folderrepo.findAll();
    }

    public FolderEntity getFolderById(int folder_id){
        return folderrepo.findById(folder_id)
            .orElseThrow(() -> new NoSuchElementException("Folder " + folder_id + " does not exist!"));
    }

    public FolderEntity updateFolder(int folder_id, FolderEntity newFolder){
        FolderEntity folder = new FolderEntity();

        try{
            folder = folderrepo.findById(folder_id).get();
            folder.setFolderName(newFolder.getFolderName());
        } catch(NoSuchElementException ex){
            throw new NoSuchElementException("Folder " + folder_id + " does not exist!");
        }
        return folderrepo.save(folder);
    }

    @Transactional
    public String deleteFolder(int folder_id){
        String msg = "";

        if(folderrepo.findById(folder_id).isPresent()){
            folderrepo.deleteById(folder_id);
            msg = "Folder " + folder_id + " is successfully deleted.";
        } else{
            msg = "Folder " + folder_id + " does not exist!";
        }
        return msg;
    }

    @Transactional
    public void addNotesToFolder(Long folderId, List<Long> noteIds){
        for(Long noteId : noteIds){
            NoteEntity note = noterepo.findById(noteId)
                    .orElseThrow(() -> new RuntimeException("Note not found: " + noteId));
            
            note.setFolderId(folderId);
            noterepo.save(note);
        }
    }

    public List<NoteEntity> getNotesInFolder(Long folderId){
        List<NoteEntity> allNotes = noterepo.findAll();
        List<NoteEntity> folderNotes = new java.util.ArrayList<>();
        
        for(NoteEntity note : allNotes){
            if(note.getFolderId() != null && note.getFolderId().equals(folderId)){
                folderNotes.add(note);
            }
        }
        
        return folderNotes;
    }

    @Transactional
    public void removeNoteFromFolder(Long folderId, Long noteId){
        NoteEntity note = noterepo.findById(noteId)
                .orElseThrow(() -> new RuntimeException("Note not found"));
        
        note.setFolderId(null);
        noterepo.save(note);
    }
}