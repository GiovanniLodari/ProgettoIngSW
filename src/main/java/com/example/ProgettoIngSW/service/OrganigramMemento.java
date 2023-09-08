package com.example.ProgettoIngSW.service;

import lombok.Getter;

public class OrganigramMemento {
    @Getter
    private String state;
    public OrganigramMemento(String stato){state = stato;}

    public String toString(){
        return state;
    }

}
