package com.example.ProgettoIngSW.repository;

import com.example.ProgettoIngSW.entity.Organigramma;
import com.example.ProgettoIngSW.entity.Ruolo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RuoloRepository extends JpaRepository<Ruolo, String> {
    public List<Ruolo> findAll();
    public boolean existsByNome(String name);
    public Ruolo findByNome(String name);

}
