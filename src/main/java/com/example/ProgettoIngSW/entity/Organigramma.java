package com.example.ProgettoIngSW.entity;

import com.example.ProgettoIngSW.service.OrganigramMemento;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Stack;

@Entity
@Table(name = "organigramma")
public class Organigramma implements Component{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id", nullable = false)
    @Getter
    private int id;

    @Column(name = "nome", nullable = false, length = 30, unique = true)
    @Getter @Setter
    private String nome;

    @OneToOne(mappedBy = "organigramma", fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @Getter @Setter
    private UnitaOrganizzativa radice;
}
