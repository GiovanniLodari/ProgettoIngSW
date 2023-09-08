package com.example.ProgettoIngSW.service;

import com.example.ProgettoIngSW.entity.Dipendente;
import com.example.ProgettoIngSW.entity.Ruolo;
import com.example.ProgettoIngSW.entity.UnitaOrganizzativa;
import com.example.ProgettoIngSW.repository.DipendenteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DipendenteService{
    DipendenteRepository dipendenteRepository;
    @Autowired
    public DipendenteService(DipendenteRepository dipendenteRepository){
        this.dipendenteRepository = dipendenteRepository;
    }
    public Dipendente creaDipendente(String CF, String email, String password, String nome, String cognome, List<Ruolo> listaRuoli, List<UnitaOrganizzativa> unita){
        Dipendente dipendente = new Dipendente();
        dipendente.setCF(CF);
        dipendente.setEmail(email);
        dipendente.setPassword(password);
        dipendente.setNome(nome);
        dipendente.setCognome(cognome);
        dipendente.setListaRuoli(listaRuoli);
        dipendente.setUnitaOrganizzative(unita);
        return dipendenteRepository.save(dipendente);
    }
    public void deleteDipendente(Dipendente dipendente){
        dipendenteRepository.delete(dipendente);
    }
    public List<Dipendente> getAll(){ return dipendenteRepository.findAll(); }
    public Dipendente getDipendenteByCF(String CF){
        return dipendenteRepository.findByCF(CF);
    }
    public List<Dipendente> getByName(String name){
        return dipendenteRepository.findByNome(name);
    }
    public List<Dipendente> getBySurname(String surname){
        return dipendenteRepository.findByCognome(surname);
    }
    public List<Dipendente> getByRoleList(List<Ruolo> roleList){
        return dipendenteRepository.findByListaRuoliIn(roleList);
    }

    public Dipendente getByEmail(String email){
        return dipendenteRepository.findByEmail(email);
    }
    public void updatePassword(Dipendente dipendente, String password){
        dipendente.setPassword(password);
        dipendenteRepository.save(dipendente);
    }

    public void updateEmployee(Dipendente d){
        dipendenteRepository.save(d);
    }

    public void updateEmployee(String CF, List<Ruolo> listaRuoli, List<UnitaOrganizzativa> listaUnitaOrganizzativa){
        Dipendente d = dipendenteRepository.findByCF(CF);
        d.setListaRuoli(listaRuoli);
        d.setUnitaOrganizzative(listaUnitaOrganizzativa);
        dipendenteRepository.save(d);
    }

    public Dipendente saveEmployee(String nome, String cognome, String CF, String email, List<Ruolo> listaRuoli, List<UnitaOrganizzativa> listaUnitaOrganizzativa){
        Dipendente d = new Dipendente();
        d.setNome(nome);
        d.setCognome(cognome);
        d.setCF(CF);
        d.setEmail(email);
        d.setListaRuoli(listaRuoli);
        d.setUnitaOrganizzative(listaUnitaOrganizzativa);
        return dipendenteRepository.save(d);
    }

    public List<Ruolo> getRoleList(Dipendente d){
        return d.getListaRuoli();
    }

    public List<UnitaOrganizzativa> getUnita(Dipendente d){
        return d.getUnitaOrganizzative();
    }

    public String createJsonString(Dipendente dipendente) {
        StringBuilder jsonBuilder = new StringBuilder();
        jsonBuilder.append("{");
        jsonBuilder.append("\"nome\":\"").append(dipendente.getNome()).append("\",");
        jsonBuilder.append("\"cognome\":\"").append(dipendente.getCognome()).append("\",");
        jsonBuilder.append("\"cf\":\"").append(dipendente.getCF()).append("\",");
        jsonBuilder.append("\"email\":\"").append(dipendente.getEmail()).append("\",");
        jsonBuilder.append("\"listaRuoli\":[");
        for (int i = 0; i < dipendente.getListaRuoli().size(); i++) {
            String ruolo = dipendente.getListaRuoli().get(i).getNome();
            jsonBuilder.append("{\"nome\":\"").append(ruolo).append("\"}");
            if (i < dipendente.getListaRuoli().size() - 1) {
                jsonBuilder.append(",");
            }
        }
        jsonBuilder.append("],");
        jsonBuilder.append("\"listaUnita\":[");
        for (int i = 0; i < dipendente.getUnitaOrganizzative().size(); i++) {
            String unita = dipendente.getUnitaOrganizzative().get(i).getNome();
            jsonBuilder.append("{\"nome\":\"").append(unita).append("\"}");
            if (i < dipendente.getUnitaOrganizzative().size() - 1) {
                jsonBuilder.append(",");
            }
        }
        jsonBuilder.append("]");
        jsonBuilder.append("}");
        return jsonBuilder.toString();
    }
}
