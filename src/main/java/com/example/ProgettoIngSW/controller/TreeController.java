package com.example.ProgettoIngSW.controller;

import com.example.ProgettoIngSW.entity.Dipendente;
import com.example.ProgettoIngSW.entity.Organigramma;
import com.example.ProgettoIngSW.entity.Ruolo;
import com.example.ProgettoIngSW.entity.UnitaOrganizzativa;
import com.example.ProgettoIngSW.service.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Stack;

import static org.springframework.http.HttpStatus.OK;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class TreeController {
    OrganigrammaService organigrammaService;
    UnitaOrganizzativaService unitaOrganizzativaService;
    RuoloService ruoloService;
    DipendenteService dipendenteService;
    Stack<OrganigramMemento> stateStack;

    @Autowired
    public TreeController(OrganigrammaService organigrammaService, UnitaOrganizzativaService unitaOrganizzativaService, RuoloService ruoloService, DipendenteService dipendenteService) {
        this.organigrammaService = organigrammaService;
        this.unitaOrganizzativaService = unitaOrganizzativaService;
        this.ruoloService = ruoloService;
        this.dipendenteService = dipendenteService;
        stateStack = new Stack<OrganigramMemento>();

    }

    @GetMapping("/organigramDetails")
    public ResponseEntity<String> getOrganigram(@RequestParam String nomeOrganigramma) {
        Organigramma organigramma = organigrammaService.getByName(nomeOrganigramma);
        if (organigramma == null) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
        JSONObject organigrammaJson = new JSONObject();
        try {
            JSONArray listaUnitaJson = new JSONArray();
            UnitaOrganizzativa unita = organigramma.getRadice();
            if(unita == null) {
                String organigrammaJsonString = organigrammaJson.toString();
                return new ResponseEntity<>(organigrammaJsonString, OK);
            }
            JSONObject unitaJson = buildUnitaJson(unita);
            listaUnitaJson.put(unitaJson);
            organigrammaJson.put("listaUnita", listaUnitaJson);
            String organigrammaJsonString = organigrammaJson.toString();

            System.out.println("organigramma:\n"+organigrammaJsonString);
            return new ResponseEntity<>(organigrammaJsonString, OK);
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }
    }
    private JSONObject buildUnitaJson(UnitaOrganizzativa unita) throws JSONException {
        JSONObject unitaJson = new JSONObject();
        unitaJson.put("nome", unita.getNome());
        List<UnitaOrganizzativa> sottoUnita = unitaOrganizzativaService.getSottoUnita(unita);
        if (!sottoUnita.isEmpty()) {
            JSONArray sottoUnitaJson = new JSONArray();
            for (UnitaOrganizzativa sottoUnitaOrganizzativa : sottoUnita) {
                JSONObject sottoUnitaJsonObj = buildUnitaJson(sottoUnitaOrganizzativa);
                sottoUnitaJson.put(sottoUnitaJsonObj);
            }
            unitaJson.put("listaUnita", sottoUnitaJson);
        }
        List<Ruolo> ruoliAmmissibili = unita.getRuoliAmmissibili();
        if (!ruoliAmmissibili.isEmpty()) {
            JSONArray ruoliAmmissibiliJson = new JSONArray();
            for (Ruolo ruolo : ruoliAmmissibili) {
                JSONObject ruoloJson = new JSONObject();
                ruoloJson.put("nome", ruolo.getNome());
                ruoliAmmissibiliJson.put(ruoloJson);
            }
            unitaJson.put("ruoliAmmissibili", ruoliAmmissibiliJson);
        }
        List<Dipendente> listaDipendenti = unita.getListaDipendenti();
        if (!listaDipendenti.isEmpty()) {
            JSONArray dipendentiJson = new JSONArray();
            for (Dipendente dipendente : listaDipendenti) {
                JSONObject dipendenteJson = new JSONObject();
                dipendenteJson.put("nome", dipendente.getNome());
                dipendenteJson.put("cognome", dipendente.getCognome());
                dipendenteJson.put("cf", dipendente.getCF());
                dipendenteJson.put("email", dipendente.getEmail());
                List<Ruolo> listaRuoli = dipendente.getListaRuoli();
                if (!listaRuoli.isEmpty()) {
                    JSONArray ruoliJson = new JSONArray();
                    for (Ruolo ruolo : listaRuoli) {
                        JSONObject ruoloJson = new JSONObject();
                        ruoloJson.put("nome", ruolo.getNome());
                        ruoliJson.put(ruoloJson);
                    }
                    dipendenteJson.put("ruoli", ruoliJson);
                }
                List<UnitaOrganizzativa> unitaOrganizzative = dipendente.getUnitaOrganizzative();
                if (!unitaOrganizzative.isEmpty()) {
                    JSONArray unitaOrganizzativeJson = new JSONArray();
                    for (UnitaOrganizzativa unitaOrganizzativa : unitaOrganizzative) {
                        JSONObject unitaOrganizzativaJson = new JSONObject();
                        unitaOrganizzativaJson.put("nome", unitaOrganizzativa.getNome());
                        unitaOrganizzativeJson.put(unitaOrganizzativaJson);
                    }
                    dipendenteJson.put("unitaOrganizzative", unitaOrganizzativeJson);
                }
                dipendentiJson.put(dipendenteJson);
            }
            unitaJson.put("dipendenti", dipendentiJson);
        }
        return unitaJson;
    }

    @PostMapping("/saveOrganigramma")
    public ResponseEntity<String> salvaOrganigramma(@RequestBody String organigrammaJson) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode organigrammaNode = objectMapper.readTree(organigrammaJson);
            String nomeOrganigramma = organigrammaNode.get("nomeOrganigramma").asText();
            Organigramma o = organigrammaService.getByName(nomeOrganigramma);
            clearOrganigram(o);
            JsonNode unitaArray = organigrammaNode.get("organigramma");
            String unitList = unitaArray.toString();
            int first = unitList.indexOf("["); int last = unitList.lastIndexOf("]");
            String unita = unitList.substring(first+1, last);
            JsonNode listaUnitaJson =  objectMapper.readTree(unita);
            UnitaOrganizzativa radice = elaboraUnita(listaUnitaJson, null, o);
            o.setRadice(radice);
            radice.setOrganigramma(o);
            unitaOrganizzativaService.updateUnitaOrganizzativa(radice);
            stateStack.clear();
            Organigramma organigramma = organigrammaService.updateOrganigramma(o);
            if(organigramma != null) {
                return ResponseEntity.ok().build();
            }
            else
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Errore durante il salvataggio dell'organigramma");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Errore durante l'elaborazione della stringa JSON");
        }
    }

    private UnitaOrganizzativa elaboraUnita(JsonNode unitaNode, UnitaOrganizzativa padre, Organigramma o) {
        String nomeUnita = unitaNode.has("nome") ? unitaNode.get("nome").asText() : null;
        if (nomeUnita == null) {}
        UnitaOrganizzativa u = unitaOrganizzativaService.getByName(nomeUnita);
        u.setUnitaOrganizzativaPadre(padre);
        JsonNode listaSottoUnitaNode = unitaNode.get("listaUnita");
        if (listaSottoUnitaNode != null && listaSottoUnitaNode.isArray()) {
            List<UnitaOrganizzativa> listaSottoUnita = new ArrayList<>();
            for (JsonNode sottoUnitaNode : listaSottoUnitaNode) {
                UnitaOrganizzativa sottoUnita = elaboraUnita(sottoUnitaNode, u, o);
                listaSottoUnita.add(sottoUnita);
            }
            u.setListaSottoUnita(listaSottoUnita);
        }
        JsonNode listaDipendentiNode = unitaNode.get("listaDipendenti");
        if (listaDipendentiNode != null && listaDipendentiNode.isArray()) {
            List<Dipendente> listaDipendenti = new ArrayList<>();
            for (JsonNode dipendenteNode : listaDipendentiNode) {
                String cfDipendente = dipendenteNode.has("cf") ? dipendenteNode.get("cf").asText() : null;
                if (cfDipendente != null) {
                    Dipendente d = dipendenteService.getDipendenteByCF(cfDipendente);
                    if (d != null) {
                        listaDipendenti.add(d);
                        if (!d.getUnitaOrganizzative().contains(u)) {
                            d.getUnitaOrganizzative().add(u);
                            dipendenteService.updateEmployee(d);
                        }
                    }
                }
            }
            u.setListaDipendenti(listaDipendenti);
            //u.setOrganigramma(o);
            unitaOrganizzativaService.updateUnitaOrganizzativa(u);
        }
        return u;
    }

    public void clearOrganigram(Organigramma organigramma) {
        if (organigramma.getRadice() == null) {
            return;
        } else {
            for (UnitaOrganizzativa unita : organigramma.getRadice().getListaSottoUnita()) {
                removeDipendenti(unita);
            }
            removeUnitaOrganizzative(organigramma.getRadice());
        }
    }

    private void removeDipendenti(UnitaOrganizzativa unita) {
        if (unita.getListaSottoUnita() != null) {
            for (UnitaOrganizzativa sottoUnita : unita.getListaSottoUnita()) {
                removeDipendenti(sottoUnita);
            }
        }
        if (unita.getListaDipendenti() != null) {
            unita.getListaDipendenti().clear();
            unitaOrganizzativaService.updateUnitaOrganizzativa(unita);
        }
    }

    private void removeUnitaOrganizzative(UnitaOrganizzativa unita) {
        if (unita.getListaSottoUnita() != null) {
            for (UnitaOrganizzativa sottoUnita : unita.getListaSottoUnita()) {
                removeUnitaOrganizzative(sottoUnita);
            }
            unita.setUnitaOrganizzativaPadre(null);
            unita.setOrganigramma(null);
            unitaOrganizzativaService.deleteUnitaOrganizzativa(unita);
        }
    }

    @GetMapping("/getUnitaOrganizzative")
    public ResponseEntity<String> getOrganizationalUnits(@RequestParam String nomeOrganigramma) {
        Organigramma o = organigrammaService.getByName(nomeOrganigramma);
        List<UnitaOrganizzativa> unitaOrganizzativaList = unitaOrganizzativaService.getAll();
        JSONArray result = new JSONArray();

        for (UnitaOrganizzativa unita : unitaOrganizzativaList) {
            JSONObject unitaJson = new JSONObject();
            if(unita.getOrganigramma() == null && unita.getListaSottoUnita().size() == 0 && unita.getUnitaOrganizzativaPadre() == null) {
                try {
                    unitaJson.put("nome", unita.getNome());
                } catch (JSONException e) {
                    throw new RuntimeException(e);
                }
                List<Ruolo> ruoliAmmissibili = unita.getRuoliAmmissibili();
                if (!ruoliAmmissibili.isEmpty()) {
                    JSONArray ruoliAmmissibiliJson = new JSONArray();
                    for (Ruolo ruolo : ruoliAmmissibili) {
                        JSONObject ruoloJson = new JSONObject();
                        try {
                            ruoloJson.put("nome", ruolo.getNome());
                        } catch (JSONException e) {
                            throw new RuntimeException(e);
                        }
                        ruoliAmmissibiliJson.put(ruoloJson);
                    }
                    try {
                        unitaJson.put("ruoliAmmissibili", ruoliAmmissibiliJson);
                    } catch (JSONException e) {
                        throw new RuntimeException(e);
                    }
                }
                result.put(unitaJson);
            }
        }
        return new ResponseEntity<>(result.toString(), HttpStatus.OK);
    }

    @PostMapping("/saveState")
    public ResponseEntity<String> salvaStato(@RequestBody String organigramRequest) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode organigrammaNode = objectMapper.readTree(organigramRequest);
            String nomeOrganigramma = organigrammaNode.has("nomeOrganigramma") ? organigrammaNode.get("nomeOrganigramma").asText() : null;
            JsonNode statoJson = organigrammaNode.has("stato") ? organigrammaNode.get("stato") : null;
            String stato = statoJson.toString();
            stato = "{\"listaUnita\": "+stato+"}";
            Organigramma o = organigrammaService.getByName(nomeOrganigramma);
            stateStack.push(new OrganigramMemento(stato));
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (JsonMappingException e) {
            throw new RuntimeException(e);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/getOldState")
    public ResponseEntity<String> ottieniVecchioStato(@RequestParam String nomeOrganigramma) {
        Organigramma o = organigrammaService.getByName(nomeOrganigramma);
        String stato = "";
        String statoJson = "";
        String updatedJsonString = "";
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode jsonObject = null;
        OrganigramMemento om = stateStack.pop();
        stato = om.toString();
        stateStack.remove(om);
        if(stateStack.size()>0) {
            try {
                jsonObject = objectMapper.readValue(stato, ObjectNode.class);
                jsonObject.put("check", "false");
                updatedJsonString = objectMapper.writeValueAsString(jsonObject);
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }
        }else{
            try {
                jsonObject = objectMapper.readValue(stato, ObjectNode.class);
                jsonObject.put("check", "true");
                updatedJsonString = objectMapper.writeValueAsString(jsonObject);
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }
        }
        return new ResponseEntity<>(updatedJsonString, HttpStatus.OK);
    }

}

