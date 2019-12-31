package io.uniflow.bridges;

import com.eclipsesource.v8.V8;
import com.intellij.notification.Notification;
import com.intellij.notification.NotificationType;
import com.intellij.notification.Notifications;
import com.intellij.openapi.diagnostic.Logger;

public interface Bridge {
    public void register(V8 vm);
    public void release();
}
