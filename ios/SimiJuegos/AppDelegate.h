#import <RCTAppDelegate.h>
#import <UIKit/UIKit.h>
#import <UserNotifications/UserNotifications.h>

// UNUserNotificationCenterDelegate: avisos de los duelos (ver SimiAvisos en AppDelegate.mm)
@interface AppDelegate : RCTAppDelegate <UNUserNotificationCenterDelegate>

@end
