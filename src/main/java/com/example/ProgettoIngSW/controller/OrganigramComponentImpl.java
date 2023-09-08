package com.example.ProgettoIngSW.controller;

import com.example.ProgettoIngSW.entity.Component;
import com.example.ProgettoIngSW.entity.Ruolo;
import com.example.ProgettoIngSW.entity.UnitaOrganizzativa;
import com.example.ProgettoIngSW.service.DipendenteService;
import com.example.ProgettoIngSW.service.OrganigrammaService;
import com.example.ProgettoIngSW.service.RuoloService;
import com.example.ProgettoIngSW.service.UnitaOrganizzativaService;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

public class OrganigramComponentImpl extends OrganigramComponent{ //ConcreteCreator

    DipendenteService dipendenteService;
    RuoloService ruoloService;
    UnitaOrganizzativaService unitaOrganizzativaService;
    OrganigrammaService organigrammaService;
    @Autowired
    public OrganigramComponentImpl(DipendenteService dipendenteService, RuoloService ruoloService, UnitaOrganizzativaService unitaOrganizzativaService, OrganigrammaService organigrammaService){
        this.dipendenteService = dipendenteService;
        this.ruoloService = ruoloService;
        this.unitaOrganizzativaService = unitaOrganizzativaService;
        this.organigrammaService = organigrammaService;
    }
    @Override
    protected Component creaUnitaOrganizzativa(String name, List<Ruolo> ruoliAmmissibili) {
        return unitaOrganizzativaService.createUnitaOrganizzativa(name, ruoliAmmissibili);
    }

    @Override
    protected Component creaDipendente(String nome, String cognome, String CF, String email, List<Ruolo> listaRuoli, List<UnitaOrganizzativa> listaUnitaOrganizzativa) {
        return dipendenteService.saveEmployee(nome, cognome, CF, email, listaRuoli, listaUnitaOrganizzativa);
    }

    @Override
    protected Component creaRuolo(Ruolo ruolo) {
        return ruoloService.createRole(ruolo);
    }

    @Override
    protected Component creaOrganigramma(String nome) {
        return organigrammaService.createOrganigramma(nome);
    }
}
