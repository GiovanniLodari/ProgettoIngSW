package com.example.ProgettoIngSW.controller;

import com.example.ProgettoIngSW.entity.Component;
import com.example.ProgettoIngSW.entity.Dipendente;
import com.example.ProgettoIngSW.entity.Ruolo;
import com.example.ProgettoIngSW.entity.UnitaOrganizzativa;

import java.util.List;

public abstract class OrganigramComponent{ //Creator
    abstract protected Component creaUnitaOrganizzativa(String name, List<Ruolo> ruoliAmmissibili);

    protected Component creaDipendente(String nome, String cognome, String CF, String email, List<Ruolo> listaRuoli, List<UnitaOrganizzativa> listaUnitaOrganizzativa){
        return null;
    }

    abstract protected Component creaRuolo(Ruolo ruolo);
    abstract protected Component creaOrganigramma(String nome);
}
