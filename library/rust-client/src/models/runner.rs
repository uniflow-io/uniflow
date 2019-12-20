extern crate mini_v8;

use serde_json::Value;
use mini_v8::{MiniV8};
use crate::models::bridges::console::console_bridge;

pub struct Runner {
  //command_args: String
}

impl Runner {
  pub fn new(/*command_args: String*/) -> Runner {
    Runner { /*command_args*/ }
  }

  pub fn run(self, rail: Vec<Value>) {
    let mv8 = MiniV8::new();
    mv8.global().set("console", console_bridge(&mv8)).unwrap();

    for flow in rail.iter() {
      let code_data: String = flow["codes"]["rust"].to_string();
      let code: String = serde_json::from_str(&code_data).unwrap();
      let _value: String = mv8.eval(&*code).unwrap();
      //println!("{}", _value);
    }
  }
}
