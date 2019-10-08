package fr.darkwood.uniflow.models;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;

public class Api {
    private String key;
    private String env;

    public Api(String env, String key) {
        this.env = env;
        this.key = key;
    }

    private String getHttpHost()
    {
        String httpHost = "https://uniflow.io";
        if(this.env.equals("dev")) {
            httpHost  = "http://127.0.0.1:8091";
        }

        return httpHost;
    }

    public ArrayList<Program> getProgram() throws IOException {
        String httpHost = this.getHttpHost();
        String path = "/api/program/me/list?client=phpstorm";

        URL url = new URL(httpHost + path + "&apiKey=" + this.key);
        URLConnection con = url.openConnection();
        BufferedReader in = new BufferedReader(
                new InputStreamReader(con.getInputStream()));
        String inputLine;
        StringBuffer response = new StringBuffer();

        while ((inputLine = in.readLine()) != null) {
            response.append(inputLine);
        }
        in.close();

        ArrayList<Program> list = new  ArrayList<Program>();
        JsonArray data = new JsonParser().parse(response.toString()).getAsJsonArray();
        for(int i = 0; i < data.size(); i++) {
            JsonObject item = data.get(i).getAsJsonObject();

            Program program = new Program();
            program.setId(item.get("id").getAsString());
            program.setTitle(item.get("title").getAsString());

            list.add(program);
        }

        return list;
    }

    public String getProgramData(String id) throws IOException {
        String httpHost = this.getHttpHost();
        String path = "/api/program/getData/" + id;

        URL url = new URL(httpHost + path + "?apiKey=" + this.key);
        URLConnection con = url.openConnection();
        BufferedReader in = new BufferedReader(
                new InputStreamReader(con.getInputStream()));
        String inputLine;
        StringBuffer response = new StringBuffer();

        while ((inputLine = in.readLine()) != null) {
            response.append(inputLine);
        }
        in.close();

        JsonObject data = new JsonParser().parse(response.toString()).getAsJsonObject();
        return data.get("data").getAsString();
    }
}
