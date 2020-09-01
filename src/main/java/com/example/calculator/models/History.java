package com.example.calculator.models;



import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class History {

    @Id
    @GeneratedValue
    private int id;
    private String resultString;

    public History() {
    }


    public History(String resultString) {
        this.resultString = resultString;
    }


    public String getResultString() {
        return resultString;
    }

    public void setResultString(String resultString) {
        this.resultString = resultString;
    }
}
