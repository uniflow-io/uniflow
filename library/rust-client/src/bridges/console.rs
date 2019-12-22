use mini_v8::{MiniV8, Object, Invocation, Error as MV8Error};

fn console_log(inv: Invocation) -> Result<&'static str, MV8Error> {
    let message: &str = &*inv.args.get(0).as_string().unwrap().to_string();
    println!("{}", &message);

    return Ok("");
}

pub fn console_bridge(mv8: &MiniV8) -> Object {
    let console: Object = mv8.create_object();
    console.set("log", mv8.create_function(console_log).clone()).unwrap();

    return console;
}