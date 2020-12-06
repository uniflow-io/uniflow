package io.uniflow.models;

import com.google.gson.JsonArray;
import com.google.gson.JsonParser;

public class Program {
    private String id;
    private String title;
    private String data;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public JsonArray deserializeFlowsData()
    {
        return new JsonParser().parse(this.data).getAsJsonArray();
   }
}
