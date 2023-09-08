package com.example.ProgettoIngSW.controller;

import com.example.ProgettoIngSW.entity.*;
import com.example.ProgettoIngSW.service.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.json.JSONArray;
import org.json.JSONObject;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class HomeController {
    OrganigrammaService organigrammaService;
    UnitaOrganizzativaService unitaOrganizzativaService;
    RuoloService ruoloService;
    DipendenteService dipendenteService;

    Organigramma editedOrganigram;
    UnitaOrganizzativa editedUnit;
    Dipendente editedEmployee;
    Ruolo editedRole;
    OrganigramComponent oc;

    @Autowired
    public HomeController(OrganigrammaService organigrammaService, UnitaOrganizzativaService unitaOrganizzativaService, RuoloService ruoloService, DipendenteService dipendenteService){
        this.organigrammaService = organigrammaService;
        this.unitaOrganizzativaService = unitaOrganizzativaService;
        this.ruoloService = ruoloService;
        this.dipendenteService = dipendenteService;
        this.oc = new OrganigramComponentImpl(this.dipendenteService, this.ruoloService, this.unitaOrganizzativaService, this.organigrammaService);
    }

    @GetMapping("/organigrams")
    public ResponseEntity<String> getOrganigrams(){
        List<Organigramma> organigrammaList = organigrammaService.getAll();
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            String organigrammaJson = objectMapper.writeValueAsString(organigrammaList);
            System.out.println(organigrammaJson);
            return new ResponseEntity<>(organigrammaJson, HttpStatus.OK);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/organigram")
    public ResponseEntity<String> createOrganigram(@RequestBody String organigramRequest){
        //Organigramma organigramma = organigrammaService.createOrganigramma(organigramRequest);
        Organigramma organigramma = (Organigramma) oc.creaOrganigramma(organigramRequest);

        if(organigramma != null)
            return new ResponseEntity<>(HttpStatus.OK);
        else
            return new ResponseEntity<>("Non è stato possibile creare l\'organigramma.", HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/getOrganigram")
    public ResponseEntity<String> getOrganigram(@RequestBody String organigramRequest){
        Organigramma organigramma = organigrammaService.getByName(organigramRequest);
        editedOrganigram = organigramma;
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            String organigrammaJson = objectMapper.writeValueAsString(organigramma);
            return new ResponseEntity<>(organigrammaJson, HttpStatus.OK);
        } catch (JsonProcessingException e) { throw new RuntimeException(e); }
    }

    @PostMapping("/edit-organigram")
    public ResponseEntity<String> updateOrganigram(@RequestBody String organigramRequest){
        Organigramma organigramma = editedOrganigram;
        editedOrganigram = null;
        organigramma.setNome(organigramRequest);
        organigrammaService.updateOrganigramma(organigramma);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/delete-organigram")
    public ResponseEntity<String> deleteOrganigram(@RequestBody String organigramRequest){
        Organigramma o = organigrammaService.getByName(organigramRequest);
        clearOrganigram(o);
        organigrammaService.deleteOrganigram(o);
        return new ResponseEntity<>(HttpStatus.OK);
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

    @GetMapping("/organizational-units")
    public ResponseEntity<String> getOrganizationalUnits() {
        List<UnitaOrganizzativa> unitaOrganizzativaList = unitaOrganizzativaService.getAll();
        JSONArray result = new JSONArray();

        for (UnitaOrganizzativa unita : unitaOrganizzativaList) {
            JSONObject unitaJson = new JSONObject();
            try { unitaJson.put("nome", unita.getNome()); }
            catch (JSONException e) { throw new RuntimeException(e); }
            List<Ruolo> ruoliAmmissibili = unita.getRuoliAmmissibili();
            if (!ruoliAmmissibili.isEmpty()) {
                JSONArray ruoliAmmissibiliJson = new JSONArray();
                for (Ruolo ruolo : ruoliAmmissibili) {
                    JSONObject ruoloJson = new JSONObject();
                    try { ruoloJson.put("nome", ruolo.getNome()); }
                    catch (JSONException e) { throw new RuntimeException(e); }
                    ruoliAmmissibiliJson.put(ruoloJson);
                }
                try { unitaJson.put("ruoliAmmissibili", ruoliAmmissibiliJson); }
                catch (JSONException e) { throw new RuntimeException(e); }
            }
            result.put(unitaJson);
        }
        return new ResponseEntity<>(result.toString(), HttpStatus.OK);
    }


    @PostMapping("/organizational-unit")
    public ResponseEntity<String> saveOrganizationalUnit(@RequestBody String unitRequest) {
        String[] array = unitRequest.split("\"");
        String name = array[3];
        List<Ruolo> ruoliAmmissibili = new ArrayList<>();
        for (int i = 7; i < array.length; i += 2) {
            Ruolo role;
            if (ruoloService.exists(array[i])) {
                role = ruoloService.getByName(array[i]);
                ruoliAmmissibili.add(role);
            }
        }
        //UnitaOrganizzativa unitaOrganizzativa = unitaOrganizzativaService.createUnitaOrganizzativa(name, ruoliAmmissibili);
        UnitaOrganizzativa unitaOrganizzativa = (UnitaOrganizzativa) oc.creaUnitaOrganizzativa(name, ruoliAmmissibili);
        for(Ruolo r : unitaOrganizzativa.getRuoliAmmissibili()){
            r.getUnitaOrganizzative().add(unitaOrganizzativa);
            ruoloService.updateRole(r);
        }
        if (unitaOrganizzativa != null)
            return new ResponseEntity<>("", HttpStatus.OK);
        else
            return new ResponseEntity<>("Il ruolo inserito esiste già.", HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/unitDetails")
    public ResponseEntity<String> getUnitDetails(@RequestBody String unitRequest) {
        UnitaOrganizzativa u = unitaOrganizzativaService.getByName(unitRequest);
        if (u != null) {
            List<Ruolo> roleList = unitaOrganizzativaService.getRuoliAmmissibili(u);
            String fileJson = "{\"listaRuoli\":[";
            for (int i = 0; i < roleList.size(); i++) {
                if (i < roleList.size() - 1) fileJson += "\"" + roleList.get(i).getNome() + "\",";
                else fileJson += "\"" + roleList.get(i).getNome() + "\"";
            }
            List<Dipendente> employeesList = u.getListaDipendenti();
            fileJson+="], \"listaDipendenti\":[";
            for(int i=0; i<employeesList.size(); i++){
                if (i < employeesList.size() - 1){
                    fileJson += "{\"nome\": \"" + employeesList.get(i).getNome() + "\",";
                    fileJson += "\"cognome\": \"" + employeesList.get(i).getCognome() + "\",";
                    fileJson += "\"cf\": \"" + employeesList.get(i).getCF() + "\"},";
                }
                else{
                    fileJson += "{\"nome\": \"" + employeesList.get(i).getNome() + "\",";
                    fileJson += "\"cognome\": \"" + employeesList.get(i).getCognome() + "\",";
                    fileJson += "\"cf\": \"" + employeesList.get(i).getCF() + "\"}";
                }
            }
            fileJson += "]}";
            return new ResponseEntity<>(fileJson, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("L\'unità selezionata non esiste.", HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/edit-unit")
    public ResponseEntity<String> updateOrganizationalUnit(@RequestBody String unitRequest) {
        String[] array = unitRequest.split("\"");
        String name = array[3];
        List<Ruolo> ruoliAmmissibili = new ArrayList<>();
        for (int i = 7; i < array.length; i += 2) {
            Ruolo role;
            if (ruoloService.exists(array[i])) {
                role = ruoloService.getByName(array[i]);
                ruoliAmmissibili.add(role);
            }
        }
        UnitaOrganizzativa unitaOrganizzativa = unitaOrganizzativaService.editUnitaOrganizzativa(editedUnit, name, ruoliAmmissibili);
        for(Ruolo r : unitaOrganizzativa.getRuoliAmmissibili()){
            r.getUnitaOrganizzative().add(unitaOrganizzativa);
        }
        editedUnit = null;
        if (unitaOrganizzativa != null)
            return new ResponseEntity<>("", HttpStatus.OK);
        else
            return new ResponseEntity<>("Il ruolo inserito esiste già.", HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/deleteUnit")
    public ResponseEntity<String> deleteOrganizationalUnit(@RequestBody String unitRequest){
        String[] array = unitRequest.split("\"");
        UnitaOrganizzativa unitaOrganizzativa = unitaOrganizzativaService.getByName(array[3]);
        if(unitaOrganizzativa != null){
            List<Dipendente> dipendenti = dipendenteService.getAll();
            for(Dipendente d : dipendenti){
                if(d.getListaRuoli().contains(unitaOrganizzativa)) {
                    d.getListaRuoli().remove(unitaOrganizzativa);
                    dipendenteService.updateEmployee(d);
                }
            }
            List<Ruolo> ruoli = ruoloService.getAll();
            for(Ruolo r : ruoli){
                if(r.getUnitaOrganizzative().size() != 0) {
                    for(UnitaOrganizzativa u: r.getUnitaOrganizzative()) {
                        if (u.equals(unitaOrganizzativa)) {
                            r.getUnitaOrganizzative().remove(u);
                            ruoloService.updateRole(r);
                        }
                    }
                }else continue;
            }
            unitaOrganizzativaService.deleteUnitaOrganizzativa(unitaOrganizzativa);
            return new ResponseEntity<>("", HttpStatus.OK);
        }
        else{
            return new ResponseEntity<>("L'unità selezionata non esiste.", HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/checkUnitDelete")
    public ResponseEntity<String> checkUnitDelete(@RequestBody String unitRequest) {
        UnitaOrganizzativa unitaOrganizzativa = unitaOrganizzativaService.getByName(unitRequest);
        if (unitaOrganizzativa != null) {
            System.out.println(unitaOrganizzativa.getUnitaOrganizzativaPadre().getNome());
            if (unitaOrganizzativa.getUnitaOrganizzativaPadre() != null || unitaOrganizzativa.getListaSottoUnita().size() > 0) {
                return new ResponseEntity<>("false", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("true", HttpStatus.OK);
            }
        } else {return new ResponseEntity<>("L'unità selezionata non esiste.", HttpStatus.BAD_REQUEST);}
    }

    @GetMapping("/employees")
    public ResponseEntity<String> getEmployees() {
        List<Dipendente> dipendenti = dipendenteService.getAll();
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            String dipendentiJson = objectMapper.writeValueAsString(dipendenti);
            return new ResponseEntity<>(dipendentiJson, HttpStatus.OK);
        }catch(JsonProcessingException e) { throw new RuntimeException(e); }
    }

    @PostMapping("/employee")
    public ResponseEntity<String> saveEmployee(@RequestBody String employeeRequest) {
        JSONObject jsonObject = null;
        String nome, cognome, codiceFiscale, email;
        JSONArray listaRuoli, unitaOrganizzative;
        try {
            jsonObject = new JSONObject(employeeRequest);
            nome = jsonObject.getString("nome");
            cognome = jsonObject.getString("cognome");
            codiceFiscale = jsonObject.getString("codiceFiscale");
            email = jsonObject.getString("email");
            listaRuoli = jsonObject.getJSONArray("listaRuoli");
            unitaOrganizzative = jsonObject.getJSONArray("unitaOrganizzative");
        } catch (JSONException e) { throw new RuntimeException(e); }
        List<Ruolo> roleList = new ArrayList<>();
        for (int i = 0; i < listaRuoli.length(); i++) {
            String ruolo = null;
            try {
                ruolo = listaRuoli.getString(i);
                Ruolo r = ruoloService.getByName(ruolo);
                roleList.add(r);
            } catch (JSONException e) { throw new RuntimeException(e); }
        }
        List<UnitaOrganizzativa> unitList = new ArrayList<>();
        for (int i = 0; i < unitaOrganizzative.length(); i++) {
            String unita = null;
            try {
                unita = unitaOrganizzative.getString(i);
                UnitaOrganizzativa u = unitaOrganizzativaService.getByName(unita);
                unitList.add(u);
            } catch (JSONException e) { throw new RuntimeException(e); }
        }
        //dipendenteService.saveEmployee(nome, cognome, codiceFiscale, email, roleList, unitList);
        oc.creaDipendente(nome, cognome, codiceFiscale, email, roleList, unitList);
        Dipendente d = dipendenteService.getDipendenteByCF(codiceFiscale);
        for(UnitaOrganizzativa u : d.getUnitaOrganizzative()){
            List<Dipendente> list = u.getListaDipendenti();
            list.add(d);
            u.setListaDipendenti(list);
            unitaOrganizzativaService.updateUnitaOrganizzativa(u);
        }
        return new ResponseEntity<>("", HttpStatus.OK);
    }

    @PostMapping("/updateEmployee")
    public ResponseEntity<String> updateEmployee(@RequestBody String employeeRequest) {
        JSONObject jsonObject = null;
        String cf;
        JSONArray listaRuoli, unitaOrganizzative;
        try {
            jsonObject = new JSONObject(employeeRequest);
            cf = jsonObject.getString("cf");
            listaRuoli = jsonObject.getJSONArray("listaRuoli");
            unitaOrganizzative = jsonObject.getJSONArray("listaUnita");
        } catch (JSONException e) { throw new RuntimeException(e); }
        List<Ruolo> roleList = new ArrayList<>();
        for (int i = 0; i < listaRuoli.length(); i++) {
            String ruolo = null;
            try {
                ruolo = listaRuoli.getString(i);
                Ruolo r = ruoloService.getByName(ruolo);
                roleList.add(r);
            } catch (JSONException e) { throw new RuntimeException(e); }
        }
        List<UnitaOrganizzativa> unitList = new ArrayList<>();
        for (int i = 0; i < unitaOrganizzative.length(); i++) {
            String unita = null;
            try {
                unita = unitaOrganizzative.getString(i);
                UnitaOrganizzativa u = unitaOrganizzativaService.getByName(unita);
                unitList.add(u);
            } catch (JSONException e) { throw new RuntimeException(e); }
        }
        dipendenteService.updateEmployee(cf, roleList, unitList);
        return new ResponseEntity<>("", HttpStatus.OK);
    }

    @PostMapping("/employeeDetails")
    public ResponseEntity<String> getEmployeeDetails(@RequestBody String employeeRequest) {
        Dipendente d = dipendenteService.getDipendenteByCF(employeeRequest);
        if(d != null){
            List<Ruolo> roleList = dipendenteService.getRoleList(d);
            List<UnitaOrganizzativa> unityList = dipendenteService.getUnita(d);
            String fileJson = "{\"listaRuoli\":[";
            for(int i=0; i<roleList.size(); i++){
                if(i<roleList.size()-1) fileJson += "\""+ roleList.get(i).getNome() + "\",";
                else fileJson += "\"" + roleList.get(i).getNome() + "\"";
            }
            fileJson += "], \"listaUnita\":[";
            for(int i=0; i<unityList.size(); i++){
                if(i<unityList.size()-1) fileJson += "\""+ unityList.get(i).getNome() + "\",";
                else fileJson += "\"" + unityList.get(i).getNome() + "\"";
            }
            fileJson += "]}";
            return new ResponseEntity<>(fileJson, HttpStatus.OK);
        }else{
            return new ResponseEntity<>("Il dipendente selezionato non esiste.", HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/deleteEmployee")
    public ResponseEntity<String> deleteEmployee(@RequestBody String roleRequest){
        Dipendente dipendente = dipendenteService.getDipendenteByCF(roleRequest);
        if(dipendente != null){
            List<UnitaOrganizzativa> unita = unitaOrganizzativaService.getAll();
            for(UnitaOrganizzativa u: unita){
                if(u.getListaDipendenti().contains(dipendente)) {
                    u.getListaDipendenti().remove(dipendente);
                    unitaOrganizzativaService.updateUnitaOrganizzativa(u);
                }
            }
            List<Ruolo> ruoli = ruoloService.getAll();
            for(Ruolo r : ruoli){
                List <Dipendente> employeeList = r.getListaDipendenti();
                if(employeeList.contains(dipendente)) {
                    employeeList.remove(dipendente);
                }
                ruoloService.updateRole(r);
            }
            dipendenteService.deleteDipendente(dipendente);
            return new ResponseEntity<>("", HttpStatus.OK);
        }
        else{
            return new ResponseEntity<>("L'unità selezionata non esiste.", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/roles")
    public ResponseEntity<String> getRoles(){
        List<Ruolo> roleList = ruoloService.getAll();
        JSONArray ruoliJson = new JSONArray();
        for (Ruolo ruolo : roleList) {
            JSONObject ruoloJson = new JSONObject();
            try {
                ruoloJson.put("nome", ruolo.getNome());
                ruoloJson.put("descrizione", ruolo.getDescrizione());
            } catch (JSONException e) { throw new RuntimeException(e); }
            ruoliJson.put(ruoloJson);
        }
        String ruoliJsonString = ruoliJson.toString();
        return new ResponseEntity<>(ruoliJsonString, HttpStatus.OK);
    }

    @PostMapping("/role")
    public ResponseEntity<String> saveRole(@RequestBody String roleRequest){
        String[] array = roleRequest.split("\"");
        String  name = array[3];
        String description = array[7];
        if(!ruoloService.exists(name)){
            Ruolo ruolo = new Ruolo();
            ruolo.setNome(array[3]);
            ruolo.setDescrizione(array[7]);
            //ruoloService.createRole(ruolo);
            oc.creaRuolo(ruolo);
            return new ResponseEntity<>("", HttpStatus.OK);
        }
        else{
            return new ResponseEntity<>("Il ruolo inserito esiste già.", HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/checkRoleDelete")
    public ResponseEntity<String> checkRoleDelete(@RequestBody String roleRequest) {
        Ruolo ruolo = ruoloService.getByName(roleRequest);
        if (ruolo != null) {
            if (ruolo.getListaDipendenti().size() > 0 || ruolo.getUnitaOrganizzative().size() > 0) {
                return new ResponseEntity<>("false", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("true", HttpStatus.OK);
            }
        } else {return new ResponseEntity<>("Il ruolo selezionato non esiste.", HttpStatus.BAD_REQUEST);}
    }

    @PostMapping("/deleteRole")
    public ResponseEntity<String> deleteRole(@RequestBody String roleRequest){
        Ruolo role = ruoloService.getByName(roleRequest);
        if(role != null){
            List<Dipendente> dipendenti = dipendenteService.getAll();
            for(Dipendente d : dipendenti){
                if(d.getListaRuoli().contains(role)) {
                    d.getListaRuoli().remove(role);
                    dipendenteService.updateEmployee(d);
                }
            }
            List<UnitaOrganizzativa> unitaOrganizzativaList = unitaOrganizzativaService.getAll();
            for(UnitaOrganizzativa u : unitaOrganizzativaList){
                List <Ruolo> roleList = u.getRuoliAmmissibili();
                if(roleList.contains(role)) {
                    roleList.remove(role);
                }
                unitaOrganizzativaService.editUnitaOrganizzativa(u, u.getNome(), roleList);
            }
            ruoloService.deleteRole(role);
            return new ResponseEntity<>("", HttpStatus.OK);
        }
        else{
            return new ResponseEntity<>("L'unità selezionata non esiste.", HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/file")
    public ResponseEntity<String> getFileDetails(@RequestBody String fileRequest){
        String[]array = fileRequest.split("\"");
        String fileName = array[3];
        String fileDataType = array[7];
        ObjectMapper objectMapper = new ObjectMapper();
        String fileJson;
        if(fileDataType.equals("Organigrammi")){
            Organigramma organigramma = organigrammaService.getByName(fileName);
            editedOrganigram = organigramma;
            try {
                fileJson = objectMapper.writeValueAsString(organigramma);
                return new ResponseEntity<>(fileJson, HttpStatus.OK);
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }
        } else if (fileDataType.equals("Unità Organizzative")) {
            UnitaOrganizzativa unitaOrganizzativa = unitaOrganizzativaService.getByName(fileName);
            editedUnit = unitaOrganizzativa;
            List<Ruolo> ruoliAmmissibili = unitaOrganizzativa.getRuoliAmmissibili();
            String[] admissibleRoles = new String[ruoliAmmissibili.size()];
            for(int i=0; i<ruoliAmmissibili.size(); i++){
                admissibleRoles[i] = ruoliAmmissibili.get(i).getNome();
            }
            List<Ruolo> ruoli = ruoloService.getAll();
            boolean[] ruoliSelezionati = new boolean[ruoli.size()];
            String[] roleNames = new String[ruoli.size()];
            for(int i=0; i<ruoli.size(); i++){
                roleNames[i] = ruoli.get(i).getNome();
                ruoliSelezionati[i]=false;
            }
            Arrays.sort(roleNames, (ruolo1, ruolo2) -> ruolo1.compareTo(ruolo2));
            fileJson = "{\"nome\": \""+unitaOrganizzativa.getNome()+"\"";
            fileJson += ", \"ruoliAmmissibili\":[";
            for(int i=0; i<admissibleRoles.length; i++){
                if(i<admissibleRoles.length-1) fileJson += "\""+ admissibleRoles[i] + "\",";
                else fileJson += "\"" + admissibleRoles[i] + "\"";
            }
            fileJson += "], \"ruoliSelezionati\":[";
            for(int i=0; i<ruoliSelezionati.length; i++){
                String nomeRuolo = roleNames[i];
                for (String role : admissibleRoles) {
                    if (role.equals(nomeRuolo)) {
                        ruoliSelezionati[i] = true;
                        break;
                    }
                }
                if(i<ruoliSelezionati.length-1) fileJson += "\""+ruoliSelezionati[i] + "\",";
                else fileJson += "\""+ruoliSelezionati[i] + "\"";
            }
            fileJson += "]}";
            return new ResponseEntity<>(fileJson, HttpStatus.OK);
        } else if (fileDataType.equals("Ruoli")) {
            Ruolo ruolo = ruoloService.getByName(fileName);
            editedRole = ruolo;
            try {
                fileJson = objectMapper.writeValueAsString(ruolo);
                return new ResponseEntity<>(fileJson, HttpStatus.OK);
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }
        } else if (fileDataType.equals("Dipendenti")) {
            Dipendente dipendente = dipendenteService.getDipendenteByCF(fileName);//ATTENTO
            editedEmployee = dipendente;
            try {
                fileJson = objectMapper.writeValueAsString(dipendente);
                return new ResponseEntity<>(fileJson, HttpStatus.OK);
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }
        } else {
            return new ResponseEntity<>("Non è stata trovata alcuna corrispondenza nel database", HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/files")
    public ResponseEntity<String> getFiles(@RequestBody String fileRequest){
        ObjectMapper objectMapper = new ObjectMapper();
        String fileJson;
        if(fileRequest.equals("Ruoli")){
            List<Ruolo> roleList = ruoloService.getAll();
            JSONArray ruoliJson = new JSONArray();
            for (Ruolo ruolo : roleList) {
                JSONObject ruoloJson = new JSONObject();
                try {
                    ruoloJson.put("nome", ruolo.getNome());
                    ruoloJson.put("descrizione", ruolo.getDescrizione());
                } catch (JSONException e) { throw new RuntimeException(e); }
                ruoliJson.put(ruoloJson);
            }
            String ruoliJsonString = ruoliJson.toString();
            return new ResponseEntity<>(ruoliJsonString, HttpStatus.OK);
        }else{
            List<Dipendente> listaDipendenti = dipendenteService.getAll();
            String dipendentiJson = "[";
            for(int i=0; i<listaDipendenti.size(); i++){
                if(i>0) dipendentiJson += ", ";
                dipendentiJson += dipendenteService.createJsonString(listaDipendenti.get(i));
            }
            dipendentiJson += "]";
            return new ResponseEntity<>(dipendentiJson, HttpStatus.OK);
        }
    }
}
