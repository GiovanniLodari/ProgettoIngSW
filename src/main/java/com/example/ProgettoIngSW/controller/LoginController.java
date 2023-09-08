package com.example.ProgettoIngSW.controller;

import com.example.ProgettoIngSW.entity.Dipendente;
import com.example.ProgettoIngSW.entity.Ruolo;
import com.example.ProgettoIngSW.service.DipendenteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class LoginController {
    DipendenteService dipendenteService;
    @Autowired
    public LoginController(DipendenteService dipendenteService){
        this.dipendenteService = dipendenteService;
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestParam String email, @RequestParam String password) {
        Dipendente dipendente = dipendenteService.getByEmail(email);
        if (dipendente != null) {
            String pass = dipendente.getPassword();
            if (password.equals(pass)) {
                List<Ruolo> listaRuoli = dipendente.getListaRuoli();
                boolean check = false;
                for(int i=0; i<listaRuoli.size(); i++) {
                    if ((listaRuoli.get(i).getNome().equals("Amministratore")) || (listaRuoli.get(i).getNome().equals("Responsabile risorse umane"))){
                        check = true;
                        break;
                    }
                }
                if(check)
                    return ResponseEntity.ok().build();
                else
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Password non corretta");
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Password non corretta");
            }
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Email non trovata");
        }
    }
}

