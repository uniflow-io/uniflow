package io.uniflow.bridges;

import com.eclipsesource.v8.V8;
import com.eclipsesource.v8.V8Object;
import com.intellij.notification.Notification;
import com.intellij.notification.NotificationType;
import com.intellij.notification.Notifications;
import com.intellij.openapi.diagnostic.Logger;

public class Console implements Bridge {

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

    public void register(V8 vm) {
        V8Object v8Console = new V8Object(vm);
        vm.add("console", v8Console);
        v8Console.registerJavaMethod(this, "log", "log", new Class<?>[] { String.class });
        v8Console.registerJavaMethod(this, "error", "error", new Class<?>[] { String.class });
        v8Console.release();
    }

    public void release() {

    }
}
