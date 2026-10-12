#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
// Enlaces que abren la app (duelos): simijuegos://reto?... y https://<sitio>/reto?...
#import <React/RCTLinkingManager.h>
// react-native-orientation-locker: sin esto, en iPhone la app no puede girar la pantalla por su
// cuenta (cada juego pide vertical u horizontal) y el jugador tendría que girar el teléfono.
#import "Orientation.h"
#import <React/RCTEventEmitter.h>
#import <UserNotifications/UserNotifications.h>

// ---------- Avisos en el teléfono (notificaciones de los duelos) ----------
// Andrés, 12 oct 2026: con la app cerrada no llegaba nada. La web le pide a la app (WebShell.tsx) el permiso
// y la dirección de este teléfono (token de Apple) y la registra en el servicio simijuegos-avisos, que es el
// que manda los avisos. Al tocar un aviso, la app abre el duelo (campo `url` del aviso).
// Va en este archivo para no tocar el proyecto de Xcode.
#if DEBUG
static NSString *const kEntorno = @"sandbox";
#else
static NSString *const kEntorno = @"produccion";
#endif

@interface SimiAvisos : RCTEventEmitter <RCTBridgeModule>
+ (void)tokenListo:(NSString *)token;
+ (void)tocado:(NSString *)url;
@end

static NSString *sToken = nil;     // dirección de este teléfono
static NSString *sTocado = nil;    // aviso que abrió la app y la web todavía no recoge
static __weak SimiAvisos *sModulo = nil;
static BOOL sOyentes = NO;

@implementation SimiAvisos

RCT_EXPORT_MODULE();

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

- (instancetype)init
{
  if ((self = [super init])) {
    sModulo = self;
  }
  return self;
}

- (NSArray<NSString *> *)supportedEvents
{
  return @[ @"simiAvisosToken", @"simiAvisosTocado" ];
}

- (void)startObserving
{
  sOyentes = YES;
}

- (void)stopObserving
{
  sOyentes = NO;
}

+ (void)tokenListo:(NSString *)token
{
  sToken = token;
  SimiAvisos *m = sModulo;
  if (m && sOyentes) {
    [m sendEventWithName:@"simiAvisosToken" body:@{@"token" : token, @"entorno" : kEntorno}];
  }
}

+ (void)tocado:(NSString *)url
{
  SimiAvisos *m = sModulo;
  if (m && sOyentes) {
    [m sendEventWithName:@"simiAvisosTocado" body:@{@"url" : url}];
  } else {
    sTocado = url;
  }
}

// estado(): { estado: 'permitido' | 'negado' | 'pendiente', token, entorno }
RCT_EXPORT_METHOD(estado : (RCTPromiseResolveBlock)resolve rejecter : (RCTPromiseRejectBlock)reject)
{
  [[UNUserNotificationCenter currentNotificationCenter] getNotificationSettingsWithCompletionHandler:^(UNNotificationSettings *s) {
    NSString *e = s.authorizationStatus == UNAuthorizationStatusNotDetermined ? @"pendiente"
                  : s.authorizationStatus == UNAuthorizationStatusDenied      ? @"negado"
                                                                              : @"permitido";
    resolve(@{@"estado" : e, @"token" : sToken ?: [NSNull null], @"entorno" : kEntorno});
  }];
}

// pedir(): la pregunta de iOS (sale una sola vez); con el sí, se pide la dirección del teléfono
RCT_EXPORT_METHOD(pedir : (RCTPromiseResolveBlock)resolve rejecter : (RCTPromiseRejectBlock)reject)
{
  UNAuthorizationOptions opciones = UNAuthorizationOptionAlert | UNAuthorizationOptionSound | UNAuthorizationOptionBadge;
  [[UNUserNotificationCenter currentNotificationCenter] requestAuthorizationWithOptions:opciones
                                                                      completionHandler:^(BOOL si, NSError *error) {
                                                                        if (si) {
                                                                          dispatch_async(dispatch_get_main_queue(), ^{
                                                                            [[UIApplication sharedApplication] registerForRemoteNotifications];
                                                                          });
                                                                        }
                                                                        resolve(@(si));
                                                                      }];
}

// tocadoPendiente(): el aviso con el que se abrió la app (una sola vez)
RCT_EXPORT_METHOD(tocadoPendiente : (RCTPromiseResolveBlock)resolve rejecter : (RCTPromiseRejectBlock)reject)
{
  NSString *u = sTocado;
  sTocado = nil;
  resolve(u ?: [NSNull null]);
}

@end

@implementation AppDelegate

- (UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window
{
  return [Orientation getOrientation];
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"SimiJuegos";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  // Avisos: este objeto decide cómo se ven con la app abierta y qué pasa al tocarlos. Si ya dio permiso,
  // se vuelve a pedir la dirección del teléfono (Apple puede cambiarla).
  UNUserNotificationCenter *centro = [UNUserNotificationCenter currentNotificationCenter];
  centro.delegate = self;
  [centro getNotificationSettingsWithCompletionHandler:^(UNNotificationSettings *s) {
    if (s.authorizationStatus == UNAuthorizationStatusAuthorized || s.authorizationStatus == UNAuthorizationStatusProvisional) {
      dispatch_async(dispatch_get_main_queue(), ^{
        [[UIApplication sharedApplication] registerForRemoteNotifications];
      });
    }
  }];

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  const unsigned char *b = (const unsigned char *)deviceToken.bytes;
  NSMutableString *hex = [NSMutableString stringWithCapacity:deviceToken.length * 2];
  for (NSUInteger i = 0; i < deviceToken.length; i++) {
    [hex appendFormat:@"%02x", b[i]];
  }
  [SimiAvisos tokenListo:hex];
}

- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
  NSLog(@"[SimiAvisos] sin dirección para avisos: %@", error);
}

// Con la app abierta el aviso también se ve (arriba, con sonido)
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
       willPresentNotification:(UNNotification *)notification
         withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler
{
  completionHandler(UNNotificationPresentationOptionBanner | UNNotificationPresentationOptionList | UNNotificationPresentationOptionSound);
}

// Al tocar el aviso: se abre el duelo
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
    didReceiveNotificationResponse:(UNNotificationResponse *)response
             withCompletionHandler:(void (^)(void))completionHandler
{
  id url = response.notification.request.content.userInfo[@"url"];
  if ([url isKindOfClass:[NSString class]] && [url length] > 0) {
    [SimiAvisos tocado:url];
  }
  completionHandler();
}

// Enlace con el esquema propio (simijuegos://reto?c=...): se le pasa a React Native (WebShell.tsx)
- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey, id> *)options
{
  return [RCTLinkingManager application:application openURL:url options:options];
}

// Enlace web del sitio (https://<sitio>/reto?c=...) que iOS entrega a la app (Associated Domains)
- (BOOL)application:(UIApplication *)application
    continueUserActivity:(nonnull NSUserActivity *)userActivity
      restorationHandler:(nonnull void (^)(NSArray<id<UIUserActivityRestoring>> *_Nullable))restorationHandler
{
  return [RCTLinkingManager application:application
                   continueUserActivity:userActivity
                     restorationHandler:restorationHandler];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
