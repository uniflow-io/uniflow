package fr.darkwood.uniflow.bridges;

import com.intellij.openapi.diagnostic.Logger;

public class Console {

    private static final Logger log = Logger.getInstance(Console.class);

    public void log(final String message) {
        Console.log.info(message);

        System.out.println("[INFO] " + message);
    }
    public void error(final String message) {
        Console.log.error(message);

        System.out.println("[ERROR] " + message);
    }
}
