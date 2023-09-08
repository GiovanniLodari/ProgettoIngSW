package com.example.ProgettoIngSW.service;

import com.example.ProgettoIngSW.entity.Organigramma;
import com.example.ProgettoIngSW.entity.UnitaOrganizzativa;
import com.example.ProgettoIngSW.repository.OrganigrammaRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Stack;

@Service
public class OrganigrammaService {
    OrganigrammaRepository organigrammaRepository;
    @Autowired
    public OrganigrammaService(OrganigrammaRepository organigrammaRepository){
        this.organigrammaRepository = organigrammaRepository;
    }
    public Organigramma createOrganigramma(String name){
        Organigramma organigramma = new Organigramma();
        organigramma.setNome(name);
        return organigrammaRepository.save(organigramma);
    }
    public Organigramma updateOrganigramma(Organigramma organigramma, UnitaOrganizzativa radice){
        organigramma.setRadice(radice);
        return organigrammaRepository.save(organigramma);
    }

    public Organigramma updateOrganigramma(Organigramma organigramma){
        return organigrammaRepository.save(organigramma);
    }

    public void deleteOrganigram(Organigramma o){
        organigrammaRepository.delete(o);
    }

    public Organigramma getByName(String name){
        return organigrammaRepository.findByNome(name);
    }

    public List<Organigramma> getAll(){
        return organigrammaRepository.findAll();
    }

    public Organigramma saveOrganigramma(Organigramma o){
        return organigrammaRepository.save(o);
    }
}
