#[derive(Clone)]
pub struct Program {
  id: i64,
  data: String,
}

impl Program {
  pub fn new(id: i64, data: String) -> Program {
    Program { id, data }
  }

  pub fn get_id(self) -> i64 {
    self.id
  }

  pub fn get_data(self) -> String {
    self.data
  }
}