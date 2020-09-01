package com.example.calculator.controller;

import java.util.ArrayList;
import java.util.List;

import com.example.calculator.message.Response;
import com.example.calculator.models.History;
import com.example.calculator.repositories.HistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;



@RestController
@RequestMapping("/api/history")
public class RestWebController {
    @Autowired
    HistoryRepository historyRepository;
    List<History> histories = new ArrayList<History>();

    @GetMapping(value = "/all")
    public Response getResource() {

        Response response = new Response("Done", histories);
        return response;
    }

    @PostMapping(value = "/save")
    public Response postCustomer(@RequestBody History history) {
        histories.add(history);
        historyRepository.save(history);
        // Create Response Object
        Response response = new Response("Done", history);
        return response;
    }

}
