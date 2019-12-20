use std::collections::HashMap;

#[derive(Clone)]
pub struct Api {
    env: String,
    key: String,
}

impl Api {
    pub fn new(env: String, key: String) -> Api {
        Api { env, key }
    }

    pub fn endpoint(self, endpoint: &str, params: HashMap<&str, String>) -> String {
        let mut http_host: String = String::from("https://api.uniflow.io");
        if self.env == "dev" {
            http_host = String::from("https://127.0.0.1:8091");
        }

        let endpoints: HashMap<&str, String> = [
            ("program", String::from(["/api/program/me/list?client=rust&apiKey=", &self.key].concat())),
            ("program_data", String::from(["/api/program/getData/{id}?apiKey=", &self.key].concat())),
        ].iter().cloned().collect();

        let mut path: String = endpoints.get(endpoint).unwrap().to_string();
        for (key, value) in &params {
            path = path.replace(&["{", key, "}"].concat(), value)
        }

        return [http_host, path].concat();
    }
}
