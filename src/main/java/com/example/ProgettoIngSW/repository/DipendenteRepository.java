package com.example.ProgettoIngSW.repository;

import com.example.ProgettoIngSW.entity.Dipendente;
import com.example.ProgettoIngSW.entity.Ruolo;
import com.example.ProgettoIngSW.entity.UnitaOrganizzativa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DipendenteRepository extends JpaRepository<Dipendente, String> {
    public List<Dipendente> findAll();
    public boolean existsByCF(String CF);
    public Dipendente findByCF(String CF);
    public List<Dipendente> findByNome(String nome);
    public List<Dipendente> findByCognome(String cognome);
    public List<Dipendente> findByListaRuoliIn(List<Ruolo> listaRuoli);
    public Dipendente findByEmail(String email);

}
