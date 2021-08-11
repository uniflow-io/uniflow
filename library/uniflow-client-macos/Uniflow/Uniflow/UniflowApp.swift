import Cocoa
import SwiftUI

@main
struct UniflowApp: App {
    @NSApplicationDelegateAdaptor(AppDelegate.self) var appDelegate
    
    var body: some Scene {
        Settings{
            EmptyView()
        }
    }
}

class AppDelegate: NSObject, NSApplicationDelegate {
    
    var statusBar: StatusBarController?
    var popover = NSPopover.init()

    func applicationDidFinishLaunching(_ aNotification: Notification) {
        let contentView = StatusBarView()
        popover.contentSize = NSSize(width: 360, height: 360)
        popover.contentViewController = NSHostingController(rootView: contentView)
        statusBar = StatusBarController.init(popover)
    }
}
