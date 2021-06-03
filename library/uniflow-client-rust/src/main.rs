extern crate clap;
extern crate reqwest;

use clap::{Arg, App};
use serde_json::Value;

use std::error::Error;
use std::collections::HashMap;

mod models;
mod bridges;
use models::api::Api;
use models::program::Program;
use models::runner::Runner;

fn main() -> Result<(), Box<dyn Error>> {
    let matches = App::new("RustClient")
        .version("1.0")
        .about("Rust Client for Uniflow")
        .arg(Arg::with_name("api_key")
            .long("api-key")
            .required(true)
            .takes_value(true))
            .help("You must provide an api key : use --api_key=[Your Api Key]")
        .arg(Arg::with_name("identifier")
            .required(true)
            .takes_value(true))
            .help("You must provide an identifier")
        .arg(Arg::with_name("env")
            .long("env")
            .takes_value(true))
    .get_matches();

    let mut env: String = String::from("prod");
    if matches.is_present("env") {
        env = matches.values_of("env").unwrap().collect();
    }

    let api_key: String = matches.values_of("api_key").unwrap().collect();
    let api = Api::new(env, api_key);
    let identifier: String = matches.values_of("identifier").unwrap().collect();
    //let command_args: String = String::from("");

    let mut program: Program = Program::new(0, String::from(""));
    let program_list_params: HashMap<&str, String> = [].iter().cloned().collect();
    let program_list_url: String = api.clone().endpoint("program", program_list_params).to_string();
    let program_list_data: Vec<Value> = reqwest::get(&program_list_url)?.json()?;
    for program_data in program_list_data.iter() {
        if program_data["slug"] == identifier {
            let params: HashMap<&str, String> = [
                ("id", program_data["id"].to_string())
            ].iter().cloned().collect();
            let url: String = api.clone().endpoint("program_data", params).to_string();
            let data: String = reqwest::get(&url)?.text()?;
            let data_json: Value = serde_json::from_str(&data.to_string())?;
            program = Program::new(
                program_data["id"].as_i64().unwrap(),
                data_json["data"].to_string()
            );
        }
    }
    if program.clone().get_id() == 0 {
        panic!("Not such process [{}]", identifier);
    }

    let flows_string_data = program.get_data().to_string();
    let flows_string: String = serde_json::from_str(&flows_string_data)?;
    let flows: Vec<Value> = serde_json::from_str(&flows_string)?;
    let runner = Runner::new(/*command_args*/);
    runner.run(flows);

    Ok(())
}
