package com.example.ProgettoIngSW.service;

import com.example.ProgettoIngSW.entity.Ruolo;
import com.example.ProgettoIngSW.repository.RuoloRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RuoloService {
    RuoloRepository ruoloRepository;
    @Autowired
    public RuoloService(RuoloRepository ruoloRepository){
        this.ruoloRepository = ruoloRepository;
    }
    public List<Ruolo> getAll(){return ruoloRepository.findAll();}
    public Ruolo getByName(String name){return ruoloRepository.findByNome(name);}
    public boolean exists(String name){return ruoloRepository.existsByNome(name);}

    public Ruolo createRole(Ruolo ruolo){
        return ruoloRepository.save(ruolo);
    }
    public void deleteRole(Ruolo role){ruoloRepository.delete(role);}

    public void updateRole(Ruolo ruolo){ruoloRepository.save(ruolo);}
}
