package com.example.ProgettoIngSW.repository;

import com.example.ProgettoIngSW.entity.Dipendente;
import com.example.ProgettoIngSW.entity.Organigramma;
import com.example.ProgettoIngSW.entity.UnitaOrganizzativa;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UnitaOrganizzativaRepository extends JpaRepository<UnitaOrganizzativa, String> {
    public List<UnitaOrganizzativa> findAll();
    public boolean existsByNome(String nome);
    public UnitaOrganizzativa findByNome(String nome);
    public UnitaOrganizzativa findByUnitaOrganizzativaPadre(UnitaOrganizzativa unitaOrganizzativaPadre);

    @Query("SELECT u FROM UnitaOrganizzativa u WHERE u.id = :id")
    UnitaOrganizzativa findUnitaOrganizzativaById(@Param("id") int id);

}
