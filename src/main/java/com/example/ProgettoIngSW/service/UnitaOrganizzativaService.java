package com.example.ProgettoIngSW.service;

import com.example.ProgettoIngSW.entity.Dipendente;
import com.example.ProgettoIngSW.entity.Organigramma;
import com.example.ProgettoIngSW.entity.Ruolo;
import com.example.ProgettoIngSW.entity.UnitaOrganizzativa;
import com.example.ProgettoIngSW.repository.UnitaOrganizzativaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UnitaOrganizzativaService {
    UnitaOrganizzativaRepository unitaOrganizzativaRepository;
    @Autowired
    public UnitaOrganizzativaService(UnitaOrganizzativaRepository unitaOrganizzativaRepository){
        this.unitaOrganizzativaRepository = unitaOrganizzativaRepository;
    }

    public UnitaOrganizzativa createUnitaOrganizzativa(String name, List<Ruolo> ruoliAmmissibili){
        UnitaOrganizzativa unita = new UnitaOrganizzativa();
        unita.setNome(name);
        unita.setRuoliAmmissibili(ruoliAmmissibili);
        for(int i=0; i<unita.getRuoliAmmissibili().size(); i++){
            System.out.println(unita.getRuoliAmmissibili().get(i).getNome());
        }
        return unitaOrganizzativaRepository.save(unita);
    }

    public void deleteUnitaOrganizzativa(UnitaOrganizzativa unita){unitaOrganizzativaRepository.delete(unita);}

    public UnitaOrganizzativa editUnitaOrganizzativa(UnitaOrganizzativa unita, String nome, List<Ruolo> listaRuoli){
        unita.setNome(nome);
        unita.setRuoliAmmissibili(listaRuoli);
        return unitaOrganizzativaRepository.save(unita);
    }
    public UnitaOrganizzativa updateUnitaOrganizzativa(UnitaOrganizzativa unita, Organigramma organigramma, List<UnitaOrganizzativa> listaSottoUnita, UnitaOrganizzativa unitaPadre, List<Dipendente> listaDipendente){
        unita.setOrganigramma(organigramma);
        unita.setListaSottoUnita(listaSottoUnita);
        unita.setUnitaOrganizzativaPadre(unitaPadre);
        unita.setListaDipendenti(listaDipendente);
        return unitaOrganizzativaRepository.save(unita);
    }

    public List<UnitaOrganizzativa> getAll(){
        List<UnitaOrganizzativa> unitaOrganizzativaList = unitaOrganizzativaRepository.findAll();
        for(UnitaOrganizzativa u : unitaOrganizzativaList){
            u.setListaDipendenti(unitaOrganizzativaRepository.findUnitaOrganizzativaById(u.getId()).getListaDipendenti());
        }
        //return unitaOrganizzativaRepository.findAll();
        return unitaOrganizzativaList;
    }

    public boolean exists(UnitaOrganizzativa unitaOrganizzativa){
        return unitaOrganizzativaRepository.existsByNome(unitaOrganizzativa.getNome());
    }
    public UnitaOrganizzativa getByName(String name){
        return unitaOrganizzativaRepository.findByNome(name);
    }
    public UnitaOrganizzativa getByPadre(UnitaOrganizzativa unitaOrganizzativaPadre){
        return unitaOrganizzativaRepository.findByUnitaOrganizzativaPadre(unitaOrganizzativaPadre);
    }

    public void updateUnitaOrganizzativa(UnitaOrganizzativa unitaOrganizzativa) {
        unitaOrganizzativaRepository.save(unitaOrganizzativa);
    }

    public List<Ruolo> getRuoliAmmissibili(UnitaOrganizzativa u){
        return u.getRuoliAmmissibili();
    }

    public List<UnitaOrganizzativa> getSottoUnita(UnitaOrganizzativa u){
        return u.getListaSottoUnita();
    }

}
