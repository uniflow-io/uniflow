package fr.darkwood.uniflow.bridges;

import com.intellij.notification.Notification;
import com.intellij.notification.NotificationType;
import com.intellij.notification.Notifications;
import com.intellij.openapi.diagnostic.Logger;

public class Console {

    private static final Logger log = Logger.getInstance(Console.class);

    public void log(final String message) {
        Console.log.info(message);

        System.out.println("[INFO] " + message);

        Notifications.Bus.notify(new Notification(
                "Uniflow", "uniflow", message, NotificationType.INFORMATION));
    }
    public void error(final String message) {
        Console.log.error(message);

        System.out.println("[ERROR] " + message);

        Notifications.Bus.notify(new Notification(
                "Uniflow", "uniflow", message, NotificationType.ERROR));
    }
}
