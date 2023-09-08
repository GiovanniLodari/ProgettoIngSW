package com.example.ProgettoIngSW.repository;

import com.example.ProgettoIngSW.entity.Organigramma;
import org.aspectj.weaver.ast.Or;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrganigrammaRepository extends JpaRepository<Organigramma, String> {
    public List<Organigramma> findAll();
    public Organigramma findByNome(String nome);
}
